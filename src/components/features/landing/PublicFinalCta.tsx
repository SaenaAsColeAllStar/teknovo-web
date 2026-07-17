import type { ReactElement, ReactNode } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import { cn } from "@/lib/utils";

const shellClassName =
  "relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-600/10 via-slate-50 to-transparent p-10 text-center shadow-sm dark:border-slate-800 dark:from-blue-500/10 dark:via-slate-950";

export type PublicFinalCtaProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  as?: "div" | "article";
};

export function PublicFinalCta({
  eyebrow,
  title,
  description,
  children,
  id,
  className,
  delay = 0.22,
  as = "div",
}: PublicFinalCtaProps): ReactElement {
  return (
    <MotionInView as={as} className={cn(shellClassName, className)} delay={delay} id={id}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.18),transparent)]" />
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>
      </div>
    </MotionInView>
  );
}
