"use client";

import { m, type Transition } from "framer-motion";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MotionTag = "div" | "section" | "article" | "header" | "ul" | "li";

const MOTION_TAGS = {
  div: m.div,
  section: m.section,
  article: m.article,
  header: m.header,
  ul: m.ul,
  li: m.li,
} as const satisfies Record<MotionTag, unknown>;

export type MotionInViewProps = {
  as?: MotionTag;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  once?: boolean;
};

export function MotionInView({
  as = "div",
  children,
  className,
  id,
  delay = 0,
  once = true,
}: MotionInViewProps): ReactElement {
  // Tipe framer-motion sedikit berbeda per elemen (div/ul/li),
  // tapi kita hanya mengirim props umum (id/className/animasi).
  const Component = MOTION_TAGS[as] as typeof m.div;

  const transition: Transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay,
  };

  return (
    <Component
      id={id}
      className={cn(className)}
      /* Jangan sembunyikan dengan opacity:0 — tanpa JS/hydration konten tetap terbaca & SEO aman. */
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once, margin: "-64px 0px -64px 0px" }}
      transition={transition}
    >
      {children}
    </Component>
  );
}

