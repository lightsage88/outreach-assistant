import { buildGmailRawMessage } from "@/lib/buildGmailRawMessage";
import { validateEmailDraft } from "@/lib/validateEmailDraft";
import { prepareGmailDraftsRequestSchema } from "@/lib/schemas/emailDraftSchema";
import { validateUploadedAttachment } from
  "@/lib/validateUploadedAttachment";

export async function POST (
    request: Request
) {
    if (process.env.NODE_ENV === "production") {
        return Response.json(
            {
                error: "Gmail draft preparation is unavailable in the public demo.",
            },
            {
                status: 403,
            }
        );
    }

    try {
        const formData = await request.formData();
        const draftsField = formData.get("drafts");
        if (typeof draftsField !== "string") {
            return Response.json(
                {
                    error: "Missing drafts field",
                },
                {
                    status: 400,
                }
            );
        }
        const body: unknown =
           JSON.parse(draftsField);

        const parsedRequest = prepareGmailDraftsRequestSchema.safeParse(body);

        if(!parsedRequest.success) {
            return Response.json({
                error: "Request must contain valid email drafts.",
                issues: parsedRequest.error.issues.map(issue => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            }, {
                status: 400,
            });
        }

        let acceptedAttachmentCount = 0;

        for (const kind of ["resume", "headshot"] as const) {
        const entries = formData.getAll(kind);

        if (entries.length > 1) {
            return Response.json(
            { error: `Only one ${kind} is allowed.` },
            { status: 400 }
            );
        }

        const entry = entries[0];

        if (entry === undefined) continue;

        if (!(entry instanceof File)) {
            return Response.json(
            { error: `Invalid ${kind} attachment.` },
            { status: 400 }
            );
        }

        const error = await validateUploadedAttachment(
            entry,
            kind
        );

        if (error) {
            return Response.json(
            { error: `${kind}: ${error}` },
            { status: 400 }
            );
        }

        acceptedAttachmentCount++;
        }

        const { drafts } = parsedRequest.data;

        const validatedDrafts = drafts.map(draft => ({
            draft, 
            validationMessages: validateEmailDraft(draft)
        }));

        const rejectedDrafts = validatedDrafts.filter(
            ({ validationMessages }) => validationMessages.length > 0
        );

        const preparedDrafts = await Promise.all(
            validatedDrafts.filter(
                ({ validationMessages }) => validationMessages.length === 0
            )
            .map(async ({draft}) => ({
                recipientId: draft.recipientId,
                to: draft.to,
                raw: await buildGmailRawMessage(draft),
            }))
        );

        return Response.json({
            count: preparedDrafts.length,
            rejectedCount: rejectedDrafts.length,
            acceptedAttachmentCount,
            drafts: preparedDrafts,
            rejectedDrafts: rejectedDrafts.map(({ draft, validationMessages }) => ({
                recipientId: draft.recipientId,
                to: draft.to,
                validationMessages,
            })),
        });
    } catch {
        return Response.json(
            {
                error: "Unable to prepare Gmail drafts.",
            },
            {
                status: 500,
            }
        );
    }
}