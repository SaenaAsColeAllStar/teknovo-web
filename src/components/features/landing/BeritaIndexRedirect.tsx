"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactElement } from "react";

import { BERITA_LEGACY_HASH_TO_PATH } from "@/lib/berita-landing-content";

const BERITA_DEFAULT_PATH = "/berita/berita-terbaru" as const;

/** `/berita` — hormati hash lama di klien, lalu arahkan ke route dedicated. */
export function BeritaIndexRedirect(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const target = (hash && BERITA_LEGACY_HASH_TO_PATH[hash]) || BERITA_DEFAULT_PATH;
    router.replace(target);
  }, [router]);

  return (
    <div className="public-site-container py-24 text-center" aria-busy="true" aria-live="polite">
      <p className="text-sm text-slate-500 dark:text-slate-400">Memuat arsip berita…</p>
    </div>
  );
}
