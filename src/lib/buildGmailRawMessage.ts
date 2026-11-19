import MailComposer from "nodemailer/lib/mail-composer";
import type { EmailDraft } from "@/app/types/emailDraft";
import { renderEmailHtml } from "@/lib/renderHtmlEmail";
import { renderEmailText } from "./renderEmailText";

export type EmailAttachment = {
    filename: string;
    content: Buffer;
    contentType?: string;
};

export async function buildGmailRawMessage(draft: EmailDraft, attachments: EmailAttachment[] = []): Promise<string> {
    const {to, subject, body} = draft;
    const html = renderEmailHtml(body);
    const composer = new MailComposer({
        to,
        subject,
        text: renderEmailText(html),
        html,
        attachments,
        disableFileAccess: true,
        disableUrlAccess: true
    });

    const message = await composer.compile().build();

    return message.toString("base64url");
}