import Link from "next/link";
import type { ReactElement } from "react";

import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { formatDateId } from "@/lib/utils";

import { BeritaCategoryBadge } from "./BeritaCategoryBadge";

type BeritaRelatedArticlesProps = {
  items: BeritaRelatedItem[];
};

export function BeritaRelatedArticles({ items }: BeritaRelatedArticlesProps): ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside
      className="mx-auto mt-14 max-w-3xl border-t border-slate-200 pt-10 dark:border-slate-800"
      aria-labelledby="berita-terkait-heading"
    >
      <h2 id="berita-terkait-heading" className="text-lg font-semibold text-slate-900 dark:text-white">
        Berita terkait
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li
            key={item.href}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <BeritaCategoryBadge kind={item.kind} />
              <time dateTime={item.tanggalIso} className="text-xs text-slate-500 dark:text-slate-400">
                {formatDateId(new Date(item.tanggalIso))}
              </time>
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              <Link href={item.href} className="hover:text-blue-700 hover:underline dark:hover:text-blue-400">
                {item.judul}
              </Link>
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{item.ringkasan}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
