import { renderTemplate } from "../lib/renderTemplate";
import type { Recipient } from "../app/types/recipient";

const recipient: Recipient = {
  id: "test-001",
  email: "alex@example.com",
  firstName: "Alex",
  lastName: "Morgan",
  organization: "Acme Opera",
  greeting: "Dear Alex,",
  customFields: {
    role: "Artistic Director",
  },
};

describe("renderTemplate", () => {
  it("replaces standard recipient fields", () => {
    const result = renderTemplate(
      "Hello {{firstName}} from {{organization}}!",
      recipient
    );

    expect(result).toBe("Hello Alex from Acme Opera!");
  });

  it("replaces custom fields", () => {
    const result = renderTemplate(
      "Your position: {{role}}",
      recipient
    );

    expect(result).toBe("Your position: Artistic Director");
  });

  it("supports whitespace inside placeholders", () => {
    const result = renderTemplate(
      "Hello {{ firstName }}!",
      recipient
    );

    expect(result).toBe("Hello Alex!");
  });

  it("preserves unknown placeholders", () => {
    const result = renderTemplate(
      "Hello {{unknownField}}!",
      recipient
    );

    expect(result).toBe("Hello {{unknownField}}!");
  });

  it("uses empty strings for missing optional fields", () => {
    const incompleteRecipient: Recipient = {
      id: "test-002",
      email: "jordan@example.com",
    };

    const result = renderTemplate(
      "Organization: {{organization}}",
      incompleteRecipient
    );

    expect(result).toBe("Organization: ");
  });

  it("replaces repeated placeholders", () => {
    const result = renderTemplate(
      "{{firstName}} meets {{firstName}}",
      recipient
    );

    expect(result).toBe("Alex meets Alex");
  });
});
