"use client";

import { useEffect } from "react";

import { lockLenisScroll } from "@/lib/lenis-public";

/**
 * Pause root Lenis while `locked` is true (nav dropdown / mobile drawer).
 * Ref-counted via `lockLenisScroll` so nested locks unwind safely.
 */
export function useLenisScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    return lockLenisScroll();
  }, [locked]);
}
