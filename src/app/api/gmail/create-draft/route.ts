import { z } from "zod";

import {
  createGmailDraft,
  GmailNotConnectedError,
} from "@/lib/server/createGmailDraft";

const MAX_RAW_LENGTH = 20 * 1024 * 1024;

const createDraftSchema = z.strictObject({
  raw: z
    .string()
    .min(1)
    .max(MAX_RAW_LENGTH)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  // Protect this cookie-authenticated action
  // against cross-origin form submissions.
  const requestOrigin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (requestOrigin !== expectedOrigin) {
    return Response.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  if (
    !request.headers
      .get("content-type")
      ?.startsWith("application/json")
  ) {
    return Response.json(
      { error: "Expected JSON." },
      { status: 415 }
    );
  }

  const declaredSize = Number(
    request.headers.get("content-length") ?? 0
  );

  if (declaredSize > MAX_RAW_LENGTH + 1024) {
    return Response.json(
      { error: "Draft is too large." },
      { status: 413 }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = createDraftSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid MIME message." },
        { status: 400 }
      );
    }

    const id = await createGmailDraft(parsed.data.raw);

    return Response.json(
      { id, created: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof GmailNotConnectedError) {
      return Response.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return Response.json(
      {
        error:
          "Unable to save Gmail draft. Check your connection.",
      },
      { status: 502 }
    );
  }
}
