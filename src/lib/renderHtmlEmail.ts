
import { marked } from "marked";
import xss from 'xss';

export function renderEmailHtml(body: string): string {
    // Converts Markdown syntax into HTML
  const html = marked.parse(body, {
    async: false,
    // Preserves ordinary line-breaks in the rendered email
    breaks: true,
    gfm: true,
  });
  // Removes dangerous or unsupported HTML elements and attributes
  return xss(html, {
    whiteList: {
      p: [],
      br: [],
      strong: [],
      em: [],
      a: ["href", "title"],
      ul: [],
      ol: [],
      li: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });
}
