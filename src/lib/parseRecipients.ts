import Papa from "papaparse"
import type { Recipient } from "@/app/types/recipient";

const knownFields = new Set([
    "email",
    "firstName",
    "lastName",
    "organization",
    "greeting",
]);

export function parseRecipients(input: string): Recipient[] {
    const result = Papa.parse<string[]>(input,
        {
            delimiter: "\t",
            skipEmptyLines: "greedy",
    });

    if (result.errors.length > 0) {
        throw new Error(
            `Unable to parse recipient data: ${result.errors[0].message}`
        );
    }

    const [headerRow, ...dataRows] = result.data;

    if (!headerRow || dataRows.length === 0) {
        return [];
    }

    const headers = headerRow.map(header => header.trim());

    if (!headers.includes("email")) {
        throw new Error(
            "Recipient data must include an 'email' column."
        );
    }

    return dataRows.map((values, index) => {
        const rowData = Object.fromEntries(
            headers.map((header, columnIndex) => [
                header,
                values[columnIndex]?.trim() ?? "",
            ]),
        );

        const {email, firstName, lastName, organization, greeting } = rowData;

        const customFields = Object.fromEntries(
            headers
                .filter(
                    header => !knownFields.has(header) && rowData[header],
                )
                .map(header => [header, rowData[header]]),
        );

        return {
            id: `recipient-${String(index + 1).padStart(3, "0")}`,
            email,
            // These spread operator checks ensure we don't create empty strings for falsy values
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(organization && { organization }),
            ...(greeting && { greeting }),
            // This ensures that unexpected spreadsheet column values are captured and represented somehow
            ...(Object.keys(customFields).length > 0 && {
                customFields
            }),
        };
    });
}