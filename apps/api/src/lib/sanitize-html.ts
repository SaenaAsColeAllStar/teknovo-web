/**
 * Allowlist HTML sanitizer for TipTap konten (Workers-safe via isomorphic-dompurify).
 * Requires wrangler `nodejs_compat` (already enabled).
 */

import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "code",
  "pre",
  "hr",
  "div",
  "span",
];

const ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "loading",
  "class",
];

/**
 * Strip disallowed tags/attrs; remove scripts and event handlers.
 */
export function sanitizeArtikelHtml(html: string): string {
  const input = html.trim();
  if (!input) return "";

  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  // Force safe link targets (defense in depth after allowlist).
  return cleaned.replace(/<a\b([^>]*)>/gi, (_full, attrs: string) => {
    const next = attrs
      .replace(/\srel\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\starget\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<a${next} rel="noopener noreferrer" target="_blank">`;
  });
}
