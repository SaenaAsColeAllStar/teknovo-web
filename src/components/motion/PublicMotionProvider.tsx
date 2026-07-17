"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactElement, ReactNode } from "react";

/** Satu provider animasi untuk seluruh chrome situs publik — hindari banyak chunk LazyMotion per halaman. */
export function PublicMotionProvider({ children }: { children: ReactNode }): ReactElement {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
