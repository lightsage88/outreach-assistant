import type {EmailDraft} from "@/app/types/emailDraft";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEMPLATE_PLACEHOLDER_PATTERN = /{{\s*[^{}]+?\s*}}/;

export function validateEmailDraft(draft: EmailDraft): string[] {
    const messages: string[] = [];

    const email = draft.to.trim();
    const subject = draft.subject.trim();
    const body = draft.body.trim();

    if (!email) {
        messages.push("Draft is missing a recipient email address.");
    } else if (!EMAIL_PATTERN.test(email)) {
        messages.push(
            `"${draft.to}" is not a valid email address.`
        );
    }

    if (!subject) {
        messages.push(
            "Draft subject cannot be empty"
        );
    }

    if (!body) {
        messages.push("Draft body cannot be empty");
    }

    if (TEMPLATE_PLACEHOLDER_PATTERN.test(
        draft.subject
    )) {
        messages.push("Draft subject contains an unresolved template variable.")
    }

    if( TEMPLATE_PLACEHOLDER_PATTERN.test(
        draft.body
    )) {
        messages.push("Draft body contains an unresolved template variable.")
    }

    return messages;
}