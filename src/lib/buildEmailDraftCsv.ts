import type { EmailDraft } from "@/app/types/emailDraft";

function escapeCsvValue(value: string): string {
    const escapedValue = value.replaceAll('"', '""');

    return `"${escapedValue}"`;
}

export function buildEmailDraftCsv(drafts: EmailDraft[]): string {
    const readyDrafts = drafts.filter(draft => draft.isReady);

    const header = [
        "to",
        "subject",
        "body",
    ]
    .map(escapeCsvValue)
    .join(",");

    const rows = readyDrafts.map(draft => [
        draft.to,
        draft.subject,
        draft.body,
    ]
    .map(escapeCsvValue)
    .join(",")
    ]);

    return [header, ...rows].join("\n");
}