"use client";

import type { ReactElement } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";

/** Astro island for the public marketing footer — sibling of page main, never a parent. */
export function PublicFooterIsland(): ReactElement {
  return <PublicFooter />;
}
