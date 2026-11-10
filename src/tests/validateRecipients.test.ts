
import { validateRecipients } from "../lib/validateRecipients";
import type { Recipient } from "../app/types/recipient";

describe("validateRecipients", () => {
  it("accepts valid email addresses", () => {
    const recipients: Recipient[] = [
      { id: "1", email: "alex@example.com" },
      { id: "2", email: "jordan@opera.org" },
    ];

    expect(validateRecipients(recipients)).toEqual([]);
  });

  it("reports missing email addresses", () => {
    const recipients: Recipient[] = [
      { id: "1", email: "" },
      { id: "2", email: "   " },
    ];

    const issues = validateRecipients(recipients);

    expect(issues).toHaveLength(2);
    expect(issues.map(issue => issue.type)).toEqual([
      "missing-email",
      "missing-email",
    ]);
  });

  it("reports invalid email addresses", () => {
    const recipients: Recipient[] = [
      { id: "1", email: "not-an-email" },
      { id: "2", email: "alex@" },
      { id: "3", email: "alex@example" },
    ];

    const issues = validateRecipients(recipients);

    expect(issues).toHaveLength(3);
    expect(issues.every(issue => issue.type === "invalid-email"))
      .toBe(true);
  });

  it("detects duplicate email addresses", () => {
    const recipients: Recipient[] = [
      { id: "1", email: "alex@example.com" },
      { id: "2", email: "alex@example.com" },
    ];

    const issues = validateRecipients(recipients);

    expect(issues).toEqual([
      expect.objectContaining({
        recipientId: "2",
        type: "duplicate-email",
      }),
    ]);
  });

  it("detects duplicates regardless of capitalization or whitespace", () => {
    const recipients: Recipient[] = [
      { id: "1", email: "Alex@Example.com" },
      { id: "2", email: " alex@example.com " },
    ];

    const issues = validateRecipients(recipients);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      recipientId: "2",
      type: "duplicate-email",
    });
  });

  it("does not modify the original recipient data", () => {
    const recipients: Recipient[] = [
      { id: "1", email: " Alex@Example.com " },
    ];

    validateRecipients(recipients);

    expect(recipients[0].email).toBe(" Alex@Example.com ");
  });

  it("handles an empty recipient list", () => {
    expect(validateRecipients([])).toEqual([]);
  });
});
