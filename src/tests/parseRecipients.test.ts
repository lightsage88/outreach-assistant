
import { parseRecipients } from "../lib/parseRecipients";

describe("parseRecipients", () => {
  it("parses tab-separated spreadsheet data", () => {
    const input = [
      "email\tfirstName\tlastName\torganization",
      "alex@example.com\tAlex\tMorgan\tExample Opera",
      "jordan@example.com\tJordan\tLee\tSample Symphony",
    ].join("\n");

    expect(parseRecipients(input)).toEqual([
      {
        id: "recipient-001",
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Morgan",
        organization: "Example Opera",
      },
      {
        id: "recipient-002",
        email: "jordan@example.com",
        firstName: "Jordan",
        lastName: "Lee",
        organization: "Sample Symphony",
      },
    ]);
  });

  it("preserves additional spreadsheet columns as custom fields", () => {
    const input = [
      "email\tfirstName\trole\tcity",
      "alex@example.com\tAlex\tArtistic Director\tPortland",
    ].join("\n");

    const recipients = parseRecipients(input);

    expect(recipients[0].customFields).toEqual({
      role: "Artistic Director",
      city: "Portland",
    });
  });

  it("trims whitespace from headers and field values", () => {
    const input = [
      " email \t firstName \t organization ",
      " alex@example.com \t Alex \t Example Opera ",
    ].join("\n");

    expect(parseRecipients(input)[0]).toMatchObject({
      email: "alex@example.com",
      firstName: "Alex",
      organization: "Example Opera",
    });
  });

  it("omits empty optional fields", () => {
    const input = [
      "email\tfirstName\torganization",
      "alex@example.com\t\t",
    ].join("\n");

    expect(parseRecipients(input)).toEqual([
      {
        id: "recipient-001",
        email: "alex@example.com",
      },
    ]);
  });

  it("ignores empty rows", () => {
    const input = [
      "email\tfirstName",
      "alex@example.com\tAlex",
      "",
      "jordan@example.com\tJordan",
      "",
    ].join("\n");

    expect(parseRecipients(input)).toHaveLength(2);
  });

  it("rejects data without an email column", () => {
    const input = [
      "firstName\torganization",
      "Alex\tExample Opera",
    ].join("\n");

    expect(() => parseRecipients(input)).toThrow(
      "Recipient data must include an 'email' column."
    );
  });

  it("returns an empty array for input without recipient rows", () => {
    expect(parseRecipients("")).toEqual([]);
    expect(parseRecipients("email\tfirstName")).toEqual([]);
  });
});
