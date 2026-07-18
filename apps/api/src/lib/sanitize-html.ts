/**
 * Allowlist HTML sanitizer for TipTap konten (Workers-safe, no jsdom).
 * Mirrors `src/lib/sanitize-artikel-html.ts` tag/attr policy.
 */

const ALLOWED_TAGS = new Set([
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
]);

const VOID_TAGS = new Set(["br", "hr", "img"]);

const GLOBAL_ATTR = new Set(["class"]);

const TAG_ATTR: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "class"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading", "class"]),
};

const SAFE_HREF = /^(https?:|mailto:|tel:)/i;
const SAFE_SRC = /^https?:/i;

function decodeAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function encodeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function allowedAttrNames(tag: string): Set<string> {
  const specific = TAG_ATTR[tag];
  if (!specific) return GLOBAL_ATTR;
  return specific;
}

function parseAttrs(tag: string, rawAttrs: string): string {
  const allowed = allowedAttrNames(tag);
  const out: string[] = [];
  const re = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rawAttrs)) !== null) {
    const name = m[1].toLowerCase();
    if (!allowed.has(name)) continue;
    if (/^on/i.test(name) || name === "style" || name === "srcdoc") continue;

    const raw = m[2] ?? m[3] ?? m[4] ?? "";
    const decoded = decodeAttr(raw).trim();

    if (name === "href") {
      if (!SAFE_HREF.test(decoded)) continue;
      out.push(`href="${encodeAttr(decoded)}"`);
      continue;
    }
    if (name === "src") {
      if (!SAFE_SRC.test(decoded)) continue;
      out.push(`src="${encodeAttr(decoded)}"`);
      continue;
    }
    out.push(`${name}="${encodeAttr(decoded)}"`);
  }

  if (tag === "a") {
    out.push('rel="noopener noreferrer"', 'target="_blank"');
  }

  return out.length ? ` ${out.join(" ")}` : "";
}

/**
 * Strip disallowed tags/attrs; remove scripts and event handlers.
 */
export function sanitizeArtikelHtml(html: string): string {
  const input = html.trim();
  if (!input) return "";

  let cleaned = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  cleaned = cleaned.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)\/?>/g,
    (full, tagName: string, attrs: string) => {
      const tag = tagName.toLowerCase();
      const isClose = full.startsWith("</");
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (isClose) return VOID_TAGS.has(tag) ? "" : `</${tag}>`;
      const selfClosing = VOID_TAGS.has(tag) || /\/>\s*$/.test(full);
      const safeAttrs = parseAttrs(tag, attrs);
      if (selfClosing) return `<${tag}${safeAttrs} />`;
      return `<${tag}${safeAttrs}>`;
    },
  );

  return cleaned;
}
