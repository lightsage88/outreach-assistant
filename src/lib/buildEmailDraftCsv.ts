import Papa from "papaparse";
import type { EmailDraft } from "@/app/types/emailDraft";

export function buildEmailDraftCsv(
    drafts: EmailDraft[]

): string {
    const readyDrafts = drafts
    .filter(draft => draft.isReady)
    .map(draft => {
        const { to, subject, body } = draft;
        return {
        to, subject, body
    }});

    return Papa.unparse(
        {
            fields: ["to", "subject", "body"],
            data: readyDrafts.map(draft => { 
                const { to, subject, body } = draft;
                return [
                to, subject, body
            ]})
        }, 
        {
            quotes: true,
            newline: "\n",
            escapeFormulae: true,
        }
    )
}