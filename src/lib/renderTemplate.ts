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
    };

    return Object.entries(values).reduce(
        // renderedTemplate doesn't exist before hand, 'reduce()' supplies it just as
        // React supplied currentRecipients in our setRecipients() callback in page.tsx.
        // For each value, the template is updated with the new value and then renderedTemplate
        // gets that value and it keeps going until all values have been processed. 
        // The final renderedTemplate is returned.
        (renderedTemplate, [key, value]) =>
            renderedTemplate.replaceAll(`{{${key}}}`, value
            ), 
        template
    )
}
