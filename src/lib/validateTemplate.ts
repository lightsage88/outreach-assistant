import type { Recipient } from "@/app/types/recipient";

const SUPPORTED_TEMPLATE_FIELDS = [
    "email", 
    "firstName", 
    "lastName", 
    "organization", 
    "greeting"
] as const;


type TemplateField = 
( typeof SUPPORTED_TEMPLATE_FIELDS)[number];

export function validateTemplate(
    template: string,
    recipient: Recipient
): string[] {
    const { email, firstName, lastName, organization, greeting } = recipient;
    const messages: string[] = [];
    const values: Record<string, string> = {
        email,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        organization: organization ?? "",
        greeting: greeting ?? "",
        ...recipient.customFields
    };
    const placeholders = template.matchAll(
        /{{\s*([^{}]+?)\s*}}/g
    );

    for (const match of placeholders) {
        // Why match[1]?] --> because the data comes back as an iterator of match objects (not an array)
        const field = match[1].trim();

        if (!Object.prototype.hasOwnProperty.call(values, field)) {
            messages.push(
                `Unknown template variable: {{${field}}}`
            );
            continue;
        }

        if (!values[field].trim()) {
            messages.push(
                `Missing value for {{${field}}}`
            );
        }
    }

    return [...new Set(messages)];
}