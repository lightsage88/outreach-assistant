import type { Recipient } from "@/app/types/recipient";

export type RecipientValidationIssueType =
  | "missing-email"
  | "invalid-email"
  | "duplicate-email";

export interface RecipientValidationIssue {
  recipientId: string;
  type: RecipientValidationIssueType;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRecipients(
  recipients: Recipient[],
): RecipientValidationIssue[] {
  const issues: RecipientValidationIssue[] = [];
  const seenEmails = new Set<string>();

  for (const recipient of recipients) {
    const normalizedEmail = recipient.email.trim().toLowerCase();

    if (!normalizedEmail) {
      issues.push({
        recipientId: recipient.id,
        type: "missing-email",
        message: "Recipient is missing an email address.",
      });

      continue;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      issues.push({
        recipientId: recipient.id,
        type: "invalid-email",
        message: `"${recipient.email}" is not a valid email address.`,
      });
    }

    if (seenEmails.has(normalizedEmail)) {
      issues.push({
        recipientId: recipient.id,
        type: "duplicate-email",
        message: `"${recipient.email}" appears more than once.`,
      });
    }

    seenEmails.add(normalizedEmail);
  }

  return issues;
}