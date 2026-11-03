import { buildGmailRawMessage } from "@/lib/buildGmailRawMessage";
import { validateEmailDraft } from "@/lib/validateEmailDraft";
import { prepareGmailDraftsRequestSchema } from "@/lib/schemas/emailDraftSchema";

export async function POST (
    request: Request
) {
    // TODO: Remove eventually, this is just for debugging purposes
    console.log('POST running with request:', request);
    try {
        const body: unknown =
            await request.json()

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

        const { drafts } = parsedRequest.data;

        const validatedDrafts = drafts.map(draft => ({
            draft, 
            validationMessages: validateEmailDraft(draft)
        }));

        const rejectedDrafts = validatedDrafts.filter(
            ({ validationMessages }) => validationMessages.length > 0
        );

        const preparedDrafts = validatedDrafts.filter(
            ({ validationMessages }) => validationMessages.length === 0
        )
        .map(({draft}) => ({
            recipientId: draft.recipientId,
            to: draft.to,
            raw: buildGmailRawMessage(draft),
        }));

        return Response.json({
            count: preparedDrafts.length,
            rejectedCount: rejectedDrafts.length,
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