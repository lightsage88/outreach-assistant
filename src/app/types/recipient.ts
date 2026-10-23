/**
 * A person or organization receiving an outreach email.
 */
export interface Recipient {
    /** 
     * Internal identifier used by the application.
     */
    id: string;

    /**
     * Destination email address
     */
    email: string;

    /**
     * Recipient's first name, if known
     */
    firstName?: string;

    /**
     * Recipient's last name, if known
     */
    lastName?: string;

    /**
     * Organization associated with the recipient, if known
     */
    organization?: string;

    /**
     * Full greeting to use for this recipient when explicitly known.
     * 
     * Examples:
     * "Dear Mr. Doyle,"
     * "Dear Dr. Smith,"
     * "Dear Example Opera Team,"
     * 
     * Future research/enrichment features may suggest this value,
     * but should not silently overwrite it.
     */
    greeting?: string;

    /**
     * Additional spreadsheet fields we don't explicitly model.
     * 
     * Example:
     * 
     * {
     *  role: "Artistic Director",
     *  city: "Portland"
     * }
     */
    customFields?: Record<string, string>;
}