import type { Campaign } from "@/app/types/campaign";

export const demoCampaign: Campaign = {
    version: 1,
    recipients: [
        {
            id: "demo-001",
            email: "alex@example.com",
            firstName: "Alex",
            lastName: "Morgan",
            organization: "Acme Anvil Company",
            greeting: "Dear Alex,",
            customFields: {
                role: "Head Smelter"
            }
        },
        {
            id: "demo-002",
            email: "jordan@example.com",
            firstName: "Jordan",
            lastName: "Lee",
            organization: "Sample Parking Lots",
            greeting: "Dear Jordan,",
            customFields: {
                role: "CEO"
            },
        }
    ],
    subjectTemplate: "General Inquiry",
    bodyTemplate: 
    "{{greeting}}\n\n" +
    "I'm reaching out to introduce myself and " +
    "express my interest in future performance " +
    "opportunities with {{organization}}.\n\n" +
    "Best regards",
};