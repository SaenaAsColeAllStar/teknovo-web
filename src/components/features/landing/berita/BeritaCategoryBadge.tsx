import type { ReactElement } from "react";

import type { BeritaArticleKind } from "@/lib/berita-seo";
import { cn } from "@/lib/utils";

const LABELS: Record<BeritaArticleKind, string> = {
  siswa: "Artikel siswa",
  kegiatan: "Berita kegiatan",
};

const STYLES: Record<BeritaArticleKind, string> = {
  siswa: "border-border-default bg-neutral-soft text-heading",
  kegiatan: "border-brand/25 bg-brand/5 text-brand",
};

type BeritaCategoryBadgeProps = {
  kind: BeritaArticleKind;
  className?: string;
};

export function BeritaCategoryBadge({ kind, className }: BeritaCategoryBadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        STYLES[kind],
        className,
      )}
    >
      {LABELS[kind]}
    </span>
  );
}
