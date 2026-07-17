"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";

import type { BeritaItem } from "./berita-data";
import { BeritaArticleCard } from "./BeritaArticleCard";

type BeritaLoadMoreListProps = {
  items: BeritaItem[];
  initialCount?: number;
  step?: number;
  showThumbnail?: boolean;
  emptyMessage: string;
};

export function BeritaLoadMoreList({
  items,
  initialCount = 8,
  step = 8,
  showThumbnail = true,
  emptyMessage,
}: BeritaLoadMoreListProps): ReactElement {
  const [visible, setVisible] = useState(initialCount);
  const shown = useMemo(() => items.slice(0, visible), [items, visible]);
  const hasMore = visible < items.length;

  if (items.length === 0) {
    return (
      <div className="mt-10 scroll-mt-24 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="mt-10 scroll-mt-24">
      <ul className="space-y-6">
        {shown.map((item) => (
          <li key={item.id}>
            <BeritaArticleCard item={item} showThumbnail={showThumbnail} />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((n) => Math.min(n + step, items.length))}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Muat lebih banyak ({items.length - visible} tersisa)
          </button>
        </div>
      ) : null}
    </div>
  );
}
