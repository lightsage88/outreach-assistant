
import { buildGmailRawMessage } from "../lib/buildGmailRawMessage";

import type { EmailDraft } from "../app/types/emailDraft";

describe("buildGmailRawMessage", () => {
  it("builds a multipart email with HTML and text", async () => {
    const draft: EmailDraft = {
      recipientId: "test-001",
      to: "director@example.com",
      subject: "Audition inquiry",
      body:
        "Hello,\n\n" +
        "**Performance:** " +
        "[Watch video](https://example.com/video)",
      isReady: true,
      validationMessages: [],
    };

    const raw = await buildGmailRawMessage(draft);

    const message = Buffer.from(
      raw,
      "base64url"
    ).toString("utf8");

    expect(raw).toMatch(/^[A-Za-z0-9_-]+$/);

    expect(message).toMatch(
      /Content-Type: multipart\/alternative/i
    );

    expect(message).toMatch(
      /Content-Type: text\/plain/i
    );

    expect(message).toMatch(
      /Content-Type: text\/html/i
    );

    expect(message).toContain(
      "To: director@example.com"
    );
  });
});
