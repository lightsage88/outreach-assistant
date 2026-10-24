import type { Recipient } from "@/app/types/recipient";

export const sampleRecipients: Recipient[] = [
    {
        id: "recipient-001",
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        organization: "Example Opera",
        greeting: "Dear Ms. Smith,",
    },
    {
        id: "recipient-002",
        email: "benjamin.britten@example.com",
        firstName: "Benjamin",
        lastName: "Britten",
        organization: "Example Theatre",
    },
    {
        id: "recipient-003",
        email: "info@examplearts.org",
        firstName: "Morgan",
        lastName: "Lee",
        customFields: {
            role: "Artistic Director",
            city: "Portland",
        }
    },
] satisfies Recipient[];