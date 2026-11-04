import type { Recipient } from "@/app/types/recipient";

export interface Campaign {
    version: 1,
    recipients: Recipient[];
    subjectTemplate: string;
    bodyTemplate: string;
}