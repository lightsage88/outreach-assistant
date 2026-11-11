import { renderEmailHtml } from "../lib/renderHtmlEmail";

describe("renderEmailHtml", () => {
  it("renders clickable Markdown links", () => {
    const html = renderEmailHtml(
      "[Watch my performance](https://example.com/video)"
    );

    expect(html).toContain(
      '<a href="https://example.com/video">'
    );
    expect(html).toContain("Watch my performance</a>");
  });

  it("renders bold text", () => {
    const html = renderEmailHtml("This is **important**.");

    expect(html).toContain("<strong>important</strong>");
  });

  it("removes dangerous scripts", () => {
    const html = renderEmailHtml(
      '<script>alert("bad")</script>Hello'
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain("Hello");
  });

  it("removes script elements and their contents", () => {
  const html = renderEmailHtml(
    "Hello <script>alert('XSS')</script> world"
  );

  expect(html).not.toContain("<script>");
  expect(html).not.toContain("alert");
});

  it("removes unsafe link protocols", () => {
    const html = renderEmailHtml(
      "[Click](javascript:alert(1))"
    );

    expect(html).not.toContain('href="javascript:');
  });

  it("preserves safe links", () => {
    const html = renderEmailHtml(
        "[My performance](https://youtube.com/watch?v=123)"
    );

    expect(html).toContain(
        'href="https://youtube.com/watch?v=123"'
    );
  });

  it("removes dangerous link protocols", () => {
    const html = renderEmailHtml(
        "[Click](javascript:alert(1))"
    );
    
    expect(html).not.toMatch(/href=["']javascript:/i);
  })
});
