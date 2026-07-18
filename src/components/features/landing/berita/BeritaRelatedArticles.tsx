import Link from "next/link";
import type { ReactElement } from "react";

import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { cn, formatDateId } from "@/lib/utils";

import { BeritaCategoryBadge } from "./BeritaCategoryBadge";

type BeritaRelatedArticlesProps = {
  items: BeritaRelatedItem[];
  /** `stack` = daftar penuh di bawah artikel (mobile); `rail` = sidebar desktop. */
  variant?: "stack" | "rail";
  className?: string;
};

export function BeritaRelatedArticles({
  items,
  variant = "stack",
  className,
}: BeritaRelatedArticlesProps): ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  const isRail = variant === "rail";

  return (
    <aside
      className={cn(
        isRail
          ? "border border-border-default bg-surface p-5"
          : "border-t border-border-default pt-10",
        className,
      )}
      aria-labelledby={isRail ? "berita-terkait-rail-heading" : "berita-terkait-heading"}
    >
      <h2
        id={isRail ? "berita-terkait-rail-heading" : "berita-terkait-heading"}
        className={cn(
          "font-semibold",
          isRail
            ? "text-[11px] uppercase tracking-[0.18em] text-brand"
            : "text-lg tracking-tight text-heading",
        )}
      >
        Berita terkait
      </h2>
      <ul className={cn(isRail ? "mt-4 divide-y divide-border-default" : "mt-5 space-y-0")}>
        {items.map((item) => (
          <li
            key={item.href}
            className={cn(
              isRail
                ? "py-3.5 first:pt-0 last:pb-0"
                : "border-b border-border-default py-5 first:pt-0 last:border-b-0 last:pb-0",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <BeritaCategoryBadge kind={item.kind} />
              <time dateTime={item.tanggalIso} className="text-xs text-body-subtle">
                {formatDateId(new Date(item.tanggalIso))}
              </time>
            </div>
            <h3
              className={cn(
                "mt-2 font-semibold leading-snug text-heading",
                isRail ? "text-sm" : "text-base",
              )}
            >
              <Link
                href={item.href}
                className="transition hover:text-brand-strong hover:underline"
              >
                {item.judul}
              </Link>
            </h3>
            {!isRail ? (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-body">{item.ringkasan}</p>
            ) : (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-body">{item.ringkasan}</p>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
