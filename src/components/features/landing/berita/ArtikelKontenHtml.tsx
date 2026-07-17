import type { ReactElement } from "react";

import { ArticleProse } from "@/components/features/landing/berita/ArticleProse";
import { BERITA_ARTIKEL_KONTEN_FALLBACK } from "@/lib/berita-landing-content";
import { sanitizeArtikelHtml } from "@/lib/sanitize-artikel-html";
import { cn } from "@/lib/utils";

type ArtikelKontenHtmlProps = {
  html: string;
  className?: string;
};

/**
 * Render HTML artikel yang sudah disanitasi (pertahanan ganda di server).
 * Artikel lama berupa teks polos (tanpa tag) tetap ditampilkan dengan mempertahankan baris baru.
 */
export function ArtikelKontenHtml({ html, className }: ArtikelKontenHtmlProps): ReactElement {
  const trimmed = html.trim();
  if (trimmed.length === 0) {
    return (
      <p className={cn("text-sm italic leading-relaxed text-slate-500 dark:text-slate-400", className)}>
        {BERITA_ARTIKEL_KONTEN_FALLBACK}
      </p>
    );
  }
  if (!trimmed.includes("<")) {
    return (
      <ArticleProse className={className}>
        <p className="whitespace-pre-wrap">{trimmed}</p>
      </ArticleProse>
    );
  }

  const safe = sanitizeArtikelHtml(html);
  return <ArticleProse className={className} html={safe} />;
}
