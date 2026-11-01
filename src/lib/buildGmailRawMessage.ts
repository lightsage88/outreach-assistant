import type { EmailDraft } from "@/app/types/emailDraft";

function sanitizeHeaderValue(value: string): string {
    return value
    // removes line breaks from entering email headers
    .replace(/[\r\n]+/g, " ")
    .trim();
}

function encodeSubject(subject: string): string {
    const sanitizedSubject = sanitizeHeaderValue(subject);

    const encodedSubject = Buffer
    .from(sanitizedSubject, "utf-8")
    .toString("base64");

    return `=?UTF-8?B?${encodedSubject}?=`;
}

export function buildGmailRawMessage(draft: EmailDraft): string {
    const to = sanitizeHeaderValue(draft.to);

    const subject = encodeSubject(draft.subject);
    // This creates an actual email-message
    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: 8bit",
        // The blank string ehre produces the blank line separating email headers from the email body
        "",
        draft.body,
    ].join("\r\n");
    // This returns the entire thing into the form Gmail's API expects for `message.raw`
    return Buffer
    .from(message, "utf8")
    .toString("base64url");
}