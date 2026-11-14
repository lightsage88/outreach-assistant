import MailComposer from "nodemailer/lib/mail-composer";
import type { EmailDraft } from "@/app/types/emailDraft";
import { renderEmailHtml } from "@/lib/renderHtmlEmail";

export async function buildGmailRawMessage(draft: EmailDraft): Promise<string> {
    const {to, subject, body} = draft;
    const composer = new MailComposer({
        to,
        subject,
        text: body,
        html: renderEmailHtml(body),
        disableFileAccess: true,
        disableUrlAccess: true
    });

    const message = await composer.compile.build();

    return message.toString("base64url");
}