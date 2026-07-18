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
 * HTML aman untuk disimpan & ditampilkan (konten artikel / berita).
 * DOMPurify allowlist — skrip, event handler, dan skema berbahaya dihilangkan.
 */
export function sanitizeArtikelHtml(html: string): string {
  const cleaned = DOMPurify.sanitize(html.trim(), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });

  // Force safe link targets (defense in depth after allowlist).
  return cleaned.replace(/<a\b([^>]*)>/gi, (_full, attrs: string) => {
    let next = attrs
      .replace(/\srel\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\starget\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<a${next} rel="noopener noreferrer" target="_blank">`;
  });
}
