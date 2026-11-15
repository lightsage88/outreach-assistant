
import { renderEmailHtml } from "../lib/renderHtmlEmail";
import { renderEmailText } from "../lib/renderEmailText";

describe("renderEmailText", () => {
  const render = (markdown: string) =>
    renderEmailText(renderEmailHtml(markdown));

  it("preserves link labels and URLs", () => {
    const text = render(
      "[Watch my performance](https://example.com/video)"
    );

    expect(text).toContain(
      "Watch my performance [https://example.com/video]"
    );

    expect(text).not.toContain("[Watch my performance](");
  });

  it("removes Markdown bold formatting", () => {
    const text = render("This is **important**.");

    expect(text).toContain("This is important.");
    expect(text).not.toContain("**");
  });

  it("preserves paragraph breaks", () => {
    const text = render("Hello,\n\nGoodbye.");

    expect(text).toMatch(/Hello,\s*\n\s*\nGoodbye\./);
  });

  it("preserves Unicode characters", () => {
    const text = render("Thanks, Ivor.");

    expect(text).toContain("Thanks, Ivor.");
  });

  it("does not restore removed script content", () => {
    const text = render(
      'Hello <script>alert("bad")</script> world'
    );

    expect(text).not.toContain("alert");
    expect(text).not.toContain("<script>");
    expect(text).toContain("Hello");
  });
});
