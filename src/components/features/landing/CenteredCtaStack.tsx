import type { ReactElement, ReactNode } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { MotionInView } from "@/components/motion/MotionInView";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

const primaryBtnClass =
  "relative isolate inline-flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:px-6";

const secondaryBtnClass =
  "inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border-default bg-surface px-5 text-sm font-semibold text-heading transition hover:bg-neutral-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:px-6";

export type CenteredCtaStackAction = {
  href: string;
  label: string;
};

export type CenteredCtaStackProps = {
  eyebrow?: string;
  /** Multi-line via `\n`, or pass a custom ReactNode. */
  title: ReactNode;
  body: string;
  primary: CenteredCtaStackAction;
  secondary: CenteredCtaStackAction;
  className?: string;
  delay?: number;
};

function TitleLines({ title }: { title: ReactNode }): ReactElement {
  if (typeof title === "string") {
    const lines = title.split("\n");
    return (
      <>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </>
    );
  }
  return <>{title}</>;
}

/**
 * Borderless centered CTA: eyebrow → large multi-line heading →
 * restrained body → pill button pair (`flex-nowrap`, `gap-4`).
 */
export function CenteredCtaStack({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  className,
  delay = 0.2,
}: CenteredCtaStackProps): ReactElement {
  return (
    <MotionInView
      as="div"
      className={cn("py-12 text-center sm:py-16", className)}
      delay={delay}
    >
      <div className="mx-auto flex flex-col items-center gap-6">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-heading sm:text-4xl sm:leading-[1.15]">
          <TitleLines title={title} />
        </h2>

        <p
          className={cn(
            "mx-auto max-w-xl text-sm leading-relaxed text-body sm:max-w-2xl",
            publicFormalBodyClassName,
          )}
        >
          {body}
        </p>

        <div className="flex flex-nowrap items-center justify-center gap-4">
          <PublicSiteLink href={primary.href} className={primaryBtnClass}>
            <WhiteLightSweep roundedClassName="rounded-full" />
            <span className="relative z-10">{primary.label}</span>
          </PublicSiteLink>
          <PublicSiteLink href={secondary.href} className={secondaryBtnClass}>
            {secondary.label}
          </PublicSiteLink>
        </div>
      </div>
    </MotionInView>
  );
}
