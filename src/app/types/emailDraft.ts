export interface EmailDraft {
    recipientId: string;
    to: string;
    subject: string;
    body: string;
    isReady: boolean;
    validationMessages: string[];
}