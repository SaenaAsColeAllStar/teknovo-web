"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { FASILITAS_LEGACY_HASH_TO_PATH } from "@/lib/fasilitas-landing-content";

/** Mengalihkan hash lama `/fasilitas#slug` ke route dedicated pada mount. */
export function FasilitasHashRedirect(): null {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }
    const target = FASILITAS_LEGACY_HASH_TO_PATH[hash];
    if (target) {
      router.replace(target);
    }
  }, [router]);

  return null;
}
