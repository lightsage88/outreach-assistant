
import { convert } from "html-to-text";

/**
 * Convert sanitized email HTML to readable plain text.
 */
export function renderEmailText(html: string): string {
  return convert(html, {
    // Don't arbitrarily wrap long URLs.
    wordwrap: false,

    selectors: [
      {
        selector: "a",
        options: {
          // Avoid printing a URL twice when
          // the link text already equals the URL.
          hideLinkHrefIfSameAsText: true,
        },
      },
    ],
  });
}
