
import { getGmailSession } from "@/lib/server/gmailSession";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const session = await getGmailSession();
  const tokens = session.gmailTokens;

  const hasRefreshToken = Boolean(tokens?.refreshToken);

  const hasValidAccessToken = Boolean(
    tokens?.accessToken &&
    (!tokens.expiryDate || tokens.expiryDate > Date.now())
  );

  return Response.json(
    {
      connected: hasRefreshToken || hasValidAccessToken,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const session = await getGmailSession();

  // Destroy the local encrypted session cookie.
  session.destroy();

  return Response.json({
    connected: false,
  });
}
