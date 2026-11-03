import { groupBy, uniq } from "lodash";

import type { EmailDraft } from "@/app/types/emailDraft";
import type { Recipient } from "@/app/types/recipient";
import type { RecipientValidationIssue } from "./validateRecipients";

import { renderTemplate } from "./renderTemplate";
import { validateTemplate } from "./validateTemplate";

export function buildEmailDrafts(
    recipients: Recipient[],
    subjectTemplate: string,
    bodyTemplate: string,
    validationIssues: RecipientValidationIssue[]
): EmailDraft[] {
    const validationIssuesByRecipient = groupBy(
        validationIssues,
        issue => issue.recipientId
    )
    return recipients.map(recipient => {
        const recipientMessages = (validationIssuesByRecipient[recipient.id] ?? [])
        .map(issue => issue.message);

        const subjectMessages = validateTemplate(subjectTemplate, recipient);
        const bodyMessages = validateTemplate(bodyTemplate, recipient);
        const renderedSubject = renderTemplate(subjectTemplate, recipient);
        const renderedBody = renderTemplate(bodyTemplate, recipient);
        const contentMessages: string[] = [];

        if (!renderedSubject.trim()) {
            contentMessages.push('Email subject cannot be empty');
        }

        if (!renderedBody.trim()) {
            contentMessages.push('Email body cannot be empty');
        }

        const validationMessages = uniq([
            ...recipientMessages,
            ...subjectMessages,
            ...bodyMessages,
            ...contentMessages,
        ]);

        return {
            recipientId: recipient.id,
            to: recipient.email,
            subject: renderedSubject,
            body: renderedBody,
            isReady: validationMessages.length === 0,
            validationMessages
        };
    });
}