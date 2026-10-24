import type { Recipient } from "@/app/types/recipient";

const knownFields = new Set([
    "email",
    "firstName",
    "lastName",
    "organization",
    "greeting",
]);

export function parseRecipients(input: string): Recipient[] {
    const lines = input.split(/\r?\n/).filter(line => line.trim().length > 0);

    //Why are we doing this?
    if (lines.length < 2) {
        return [];
    }
    // 'lines' is an array of strings, where each string represents a line from the input. 
    // (i.e. first line is expected to be the header row, and the subsequent lines are the data rows.)
    const [headerRow, ...dataRows] = lines;

    const headers = headerRow.split("\t").map(header => header.trim());

    if (!headers.includes("email")) {
        throw new Error("Recipient data must include an 'email' column.");
    }

    return dataRows.map((row, index) => {
        // This line Windows and Unix-style line endings, enabling us to copy rows
        // directly from a spreadsheet (spreadsheet cells copied to the clipboard
        // are commonly separated by tabs).
        const values = row.split("\t");

        const rowData = Object.fromEntries(
            headers.map((header, columnIndex) => [
                header,
                values[columnIndex]?.trim() ?? "",
            ]),
        );

        const customFields = Object.fromEntries(
            headers
                .filter(
                    header => !knownFields.has(header) && rowData[header],
                )
                .map(header => [header, rowData[header]]),
        );

        return {
            id: `recipient-${String(index + 1).padStart(3, "0")}`,
            email: rowData.email,
            // These spread operator checks ensure we don't create empty strings for falsy values
            ...(rowData.firstName && {
                firstName: rowData.firstName,
            }),

            ...(rowData.lastName && {
                lastName: rowData.lastName,
            }),

            ...(rowData.organization && {
                organization: rowData.organization,
            }),

            ...(rowData.greeting && {
                greeting: rowData.greeting,
            }),
            // This ensures that unexpected spreadsheet column values are captured and represented somehow
            ...(Object.keys(customFields).length > 0 && {
                customFields
            }),
        };
    });
}