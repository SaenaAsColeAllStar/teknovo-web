import Link from "next/link";
import type { ReactElement } from "react";

import { estimateReadTimeMinutes, formatReadTimeId } from "@/lib/berita-read-time";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn, formatDateId } from "@/lib/utils";

import type { BeritaItem } from "./berita-data";
import { BeritaCategoryBadge } from "./BeritaCategoryBadge";
import { BeritaCoverMedia } from "./BeritaCoverMedia";

type BeritaArticleCardProps = {
  item: BeritaItem;
  /** Tampilkan thumbnail — default true untuk daftar berita terbaru. */
  showThumbnail?: boolean;
  className?: string;
};

function categoryKind(item: BeritaItem): "siswa" | "kegiatan" | null {
  if (item.source === "siswa") return "siswa";
  if (item.source === "sekolah") return "kegiatan";
  return null;
}

export function BeritaArticleCard({
  item,
  showThumbnail = true,
  className,
}: BeritaArticleCardProps): ReactElement {
  const kind = categoryKind(item);
  const readMinutes = estimateReadTimeMinutes(`${item.ringkasan} ${item.judul}`);
  const readLabel = formatReadTimeId(readMinutes);

  const body = (
    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {kind ? <BeritaCategoryBadge kind={kind} /> : null}
        <time
          dateTime={item.tanggal}
          className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
        >
          {formatDateId(new Date(item.tanggal))}
        </time>
        <span className="text-xs text-slate-400 dark:text-slate-500" aria-hidden>
          ·
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{readLabel}</span>
      </div>

      {item.detailHref ? (
        <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-white sm:text-xl">
          <Link href={item.detailHref} className="hover:text-blue-700 hover:underline dark:hover:text-blue-400">
            {item.judul}
          </Link>
        </h2>
      ) : (
        <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-white sm:text-xl">
          {item.judul}
        </h2>
      )}

      <p
        className={cn(
          "mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
          publicFormalBodyClassName,
        )}
      >
        {item.ringkasan}
      </p>

      {item.creditLine ? (
        <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{item.creditLine}</p>
      ) : null}
    </div>
  );

  if (!showThumbnail) {
    return (
      <article
        className={cn(
          "overflow-hidden rounded-2xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/60",
          className,
        )}
      >
        {body}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40",
        className,
      )}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
        <BeritaCoverMedia
          src={item.coverSrc}
          alt=""
          className="aspect-[16/10] min-h-[180px] w-full md:aspect-auto md:min-h-[220px]"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        {body}
      </div>
    </article>
  );
}
