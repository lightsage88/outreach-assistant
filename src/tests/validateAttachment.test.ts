
import { validateAttachment } from "../lib/validateAttachment";

const MB = 1024 * 1024;

describe("validateAttachment", () => {
  it("accepts a valid PDF résumé", () => {
    const file = {
      name: "Resume.pdf",
      type: "application/pdf",
      size: 2 * MB,
    };

    expect(validateAttachment(file, "resume")).toBeNull();
  });

  it("accepts a JPEG headshot", () => {
    const file = {
      name: "Headshot.jpg",
      type: "image/jpeg",
      size: 3 * MB,
    };

    expect(validateAttachment(file, "headshot")).toBeNull();
  });

  it("rejects unsupported file formats", () => {
    const file = {
      name: "Resume.exe",
      type: "application/octet-stream",
      size: 1000,
    };

    expect(validateAttachment(file, "resume"))
      .toMatch(/unsupported file format/i);
  });

  it("rejects oversized files", () => {
    const file = {
      name: "Headshot.png",
      type: "image/png",
      size: 6 * MB,
    };

    expect(validateAttachment(file, "headshot"))
      .toMatch(/5 MB or smaller/i);
  });

  it("rejects empty files", () => {
    const file = {
      name: "Resume.pdf",
      type: "application/pdf",
      size: 0,
    };

    expect(validateAttachment(file, "resume"))
      .toMatch(/cannot be empty/i);
  });
});
