import * as z from "zod";

export const emailDraftSchema = z.strictObject({
    recipientId: z.string(),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    isReady: z.boolean(),
    validationMessages: z.array(
        z.string()
    ),
});

export const prepareGmailDraftsRequestSchema = 
z.strictObject({
    drafts: z.array(emailDraftSchema),
});