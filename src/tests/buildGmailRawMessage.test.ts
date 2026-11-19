
import { buildGmailRawMessage } from "../lib/buildGmailRawMessage";
import { simpleParser } from "mailparser";
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


it("includes the original attachment bytes in MIME", async () => {
  const draft: EmailDraft = {
    recipientId: "test-002",
    to: "director@example.com",
    subject: "Audition materials",
    body: "Please find my **materials** attached.",
    isReady: true,
    validationMessages: [],
  };

  const pdfBytes = Buffer.from("%PDF-1.7\nTest PDF");

  const imageBytes = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10,
  ]);

  const attachments = [
    {
      filename: "Resume.pdf",
      content: pdfBytes,
      contentType: "application/pdf",
    },
    {
      filename: "Headshot.jpg",
      content: imageBytes,
      contentType: "image/jpeg",
    },
  ];

  const raw = await buildGmailRawMessage(
    draft,
    attachments
  );

  // Decode the Gmail-compatible Base64URL message.
  const decoded = Buffer.from(raw, "base64url");

  // Parse the actual MIME structure.
  const parsed = await simpleParser(decoded);

  expect(parsed.subject).toBe("Audition materials");

  expect(parsed.attachments).toHaveLength(2);

  expect(parsed.attachments[0].filename).toBe(
    "Resume.pdf"
  );

  expect(parsed.attachments[0].contentType).toBe(
    "application/pdf"
  );

  expect(parsed.attachments[0].content.equals(pdfBytes))
    .toBe(true);

  expect(parsed.attachments[1].filename).toBe(
    "Headshot.jpg"
  );

  expect(parsed.attachments[1].contentType).toBe(
    "image/jpeg"
  );

  expect(parsed.attachments[1].content.equals(imageBytes))
    .toBe(true);

  // Ensure the message body is still present.
  expect(parsed.text).toContain(
    "Please find my materials attached."
  );

  expect(parsed.html).toContain(
    "<strong>materials</strong>"
  );
});

});
