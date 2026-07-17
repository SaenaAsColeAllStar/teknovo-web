"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BERITA_LEGACY_HASH_TO_PATH } from "@/lib/berita-landing-content";

/** Mengalihkan hash lama `/berita#slug` ke route dedicated pada mount. */
export function BeritaHashRedirect(): null {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }
    const target = BERITA_LEGACY_HASH_TO_PATH[hash];
    if (target) {
      router.replace(target);
    }
  }, [router]);

  return null;
}
