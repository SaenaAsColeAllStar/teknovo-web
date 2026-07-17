"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AKADEMIK_LEGACY_HASH_TO_PATH } from "@/lib/akademik-landing-content";

/** Mengalihkan hash lama `/akademik#slug` ke route dedicated pada mount. */
export function AkademikHashRedirect(): null {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }
    const target = AKADEMIK_LEGACY_HASH_TO_PATH[hash];
    if (target) {
      router.replace(target);
    }
  }, [router]);

  return null;
}
