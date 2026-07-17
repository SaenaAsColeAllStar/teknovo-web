import type { ReactElement } from "react";

import type { BeritaArticleKind } from "@/lib/berita-seo";
import { cn } from "@/lib/utils";

const LABELS: Record<BeritaArticleKind, string> = {
  siswa: "Artikel siswa",
  kegiatan: "Berita kegiatan",
};

const STYLES: Record<BeritaArticleKind, string> = {
  siswa: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  kegiatan: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
};

type BeritaCategoryBadgeProps = {
  kind: BeritaArticleKind;
  className?: string;
};

export function BeritaCategoryBadge({ kind, className }: BeritaCategoryBadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        STYLES[kind],
        className,
      )}
    >
      {LABELS[kind]}
    </span>
  );
}
