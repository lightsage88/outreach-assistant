import type { EmailDraft } from "@/app/types/emailDraft";
import { buildGmailRawMessage } from "@/lib/buildGmailRawMessage";
import { validateEmailDraft } from "@/lib/validateEmailDraft";

// Clients can send anything as a value, we use type predicate to decalre value's
// type within blocks this function is called within
function isEmailDraft(value: unknown): value is EmailDraft {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        return false;
    }

    const draft = value as Partial<EmailDraft>;

    return (
        typeof draft.recipientId === 'string' &&
        typeof draft.to === 'string' &&
        typeof draft.subject === 'string' &&
        typeof draft.body === 'string' &&
        typeof draft.isReady === 'boolean' &&
        Array.isArray(draft.validationMessages)
    );
}

export async function POST (
    request: Request
) {
    // TODO: Remove eventually, this is just for debugging purposes
    console.log('POST running with request:', request);
    try {
        const body: unknown =
            await request.json()

        if (
            typeof body !== "object" ||
            body === null ||
            !("drafts" in body)
        ) {
            return Response.json(
                {
                    error: "Request must contain drafts.",
                },
                {
                    status: 400,
                }
            );
        }

        const drafts = (body as { drafts: unknown }).drafts;

        if (
            !Array.isArray(drafts) ||
            !drafts.every(isEmailDraft)
        ) {
            return Response.json(
                {
                    error: "Drafts must be valid email drafts,"
                },
                { 
                    status: 400,
                }
            );
        }



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
                validationMessages: 
                    validationMessages.length > 0 ? validationMessages : ["Draft was marked as not ready."],
            })
        ),
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