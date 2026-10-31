import type { Recipient } from "@/app/types/recipient";

const SUPPORTED_TEMPLATE_FIELDS = [
    "email", 
    "firstName", 
    "lastName", 
    "organization", 
    "greeting"
    // why do this?
] as const;


type TemplateField = 
( typeof SUPPORTED_TEMPLATE_FIELDS)[number];

export function validateTemplate(
    template: string,
    recipient: Recipient
): string[] {
    const messages: string[] = [];
    // .matchAll returns an array of matching strings
    const placeholders = template.matchAll(
        /{{\s*([^{}]+?)\s*}}/g
    );
    console.log('placeholders', placeholders);

    for (const match of placeholders) {
        // Why match[1]?]
        const field = match[1].trim();

        if (
            !SUPPORTED_TEMPLATE_FIELDS.includes(field as TemplateField)
        ) {
            messages.push(
                `Unknown template variable: {{${field}}}`
            );

            continue;
        }

        const value = 
           recipient[field as TemplateField];

        if (!value || !value.trim()) {
            messages.push(
                `Missing value for {{${field}}}`
            );
        }
    }

    return [...new Set(messages)];
}