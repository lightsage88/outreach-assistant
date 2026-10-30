import type { EmailDraft } from "@/app/types/emailDraft";
import type { Recipient } from "@/app/types/recipient";
import type { RecipientValidationIssue } from "./validateRecipients";

import { renderTemplate } from "./renderTemplate";

export function buildEmailDrafts(
    recipients: Recipient[],
    subjectTemplate: string,
    bodyTemplate: string,
    validationIssues: RecipientValidationIssue[]
): EmailDraft[] {
    return recipients.map(recipient => {
        const validationMessages = validationIssues.filter(issue => issue.recipientId === recipient.id)
        .map(issue => issue.message);

        return {
            recipientId: recipient.id,
            to: recipient.email,
            subject: renderTemplate(subjectTemplate, recipient),
            body: renderTemplate(bodyTemplate, recipient),
            isReady: validationMessages.length === 0,
            validationMessages
        };
    });
}