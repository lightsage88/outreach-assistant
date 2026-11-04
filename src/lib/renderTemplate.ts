import type { Recipient } from "@/app/types/recipient";

export function renderTemplate(
    template: string,
    recipient: Recipient
): string {
    const values = {
        email: recipient.email,
        firstName: recipient.firstName ?? "",
        lastName: recipient.lastName ?? "",
        organization: recipient.organization ?? "",
        greeting: recipient.greeting ?? "",
        ...recipient.customFields,
    };

    return template.replace(
        /{{\s*([^{}]+?)\s*}}/g,
        (placeholder, field: string) => {
            const key = field.trim();

            return Object.prototype.hasOwnProperty.call(values, key)
            ? values[key as keyof typeof values]
            : placeholder;
        }
    )
}
