import Link from "next/link";
import type { ReactElement } from "react";

import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  getAkademikFeaturedFeed,
  type AkademikFeedAccent,
  type AkademikFeedKey,
  type AkademikFeaturedFeedData,
} from "@/lib/akademik-landing-content";
import { cn } from "@/lib/utils";

const accentChipClass: Record<AkademikFeedAccent, string> = {
  brand: "border-brand/25 bg-brand/10 text-brand",
  emerald: "border-emerald-600/25 bg-emerald-50 text-emerald-800",
  amber: "border-amber-500/30 bg-amber-50 text-amber-900",
  violet: "border-violet-500/25 bg-violet-50 text-violet-800",
};

function IcoCategoryDot({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 8 8" fill="currentColor" className={cn("size-1.5 shrink-0", className)} aria-hidden>
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

function IcoReadArrow({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-3.5 shrink-0", className)} aria-hidden>
      <path d="M3 8h9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryChip({
  label,
  accent,
}: {
  label: string;
  accent: AkademikFeedAccent;
}): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        accentChipClass[accent],
      )}
    >
      <IcoCategoryDot />
      {label}
    </span>
  );
}

function ReadMoreLabel(): ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
      Baca selengkapnya
      <IcoReadArrow />
    </span>
  );
}

export type AkademikFeaturedFeedProps = {
  /** Tab key — defaults to ringkasan (pengajar featured). */
  feedKey?: AkademikFeedKey;
  /** Optional override of resolved feed data. */
  feed?: AkademikFeaturedFeedData;
};

/**
 * Featured article + three compact blocks — top of `#akademik`.
 * Editorial feed layout (not blueprint framed hero).
 */
export function AkademikFeaturedFeed({
  feedKey = "ringkasan",
  feed,
}: AkademikFeaturedFeedProps = {}): ReactElement {
  const { featured, sideItems } = feed ?? getAkademikFeaturedFeed(feedKey);

  return (
    <div data-akademik-featured-feed={feedKey}>
    <MotionInView
      as="div"
      className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16"
      delay={0.03}
    >
      <article className="flex flex-col gap-5">
        <Link
          href={featured.href}
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            publicOptimizedImageContainerClassName,
          )}
        >
          <PublicOptimizedImage
            src={featured.imageSrc}
            alt={featured.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            quality={72}
            priority
          />
        </Link>

        <CategoryChip label={featured.category} accent={featured.accent} />

        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-[2rem] lg:leading-tight">
          <Link href={featured.href} className="transition hover:text-brand">
            {featured.title}
          </Link>
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-neutral-soft">
            <PublicOptimizedImage
              src={featured.authorAvatarSrc}
              alt={`Foto ${featured.authorName}`}
              fill
              sizes="40px"
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">{featured.authorName}</p>
            <p className="text-xs text-body-subtle">
              {featured.authorRole} · {featured.publishedLabel}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-body sm:text-base">{featured.excerpt}</p>

        <Link
          href={featured.href}
          className="w-fit transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <ReadMoreLabel />
        </Link>
      </article>

      <ul className="flex flex-col justify-between gap-8 lg:gap-0 lg:divide-y lg:divide-border-default">
        {sideItems.map((item) => (
          <li key={item.href} className="flex flex-col gap-3 lg:py-5 lg:first:pt-0 lg:last:pb-0">
            <CategoryChip label={item.category} accent={item.accent} />
            <h2 className="text-lg font-semibold tracking-tight text-heading sm:text-xl">
              <Link href={item.href} className="transition hover:text-brand">
                {item.title}
              </Link>
            </h2>
            <p className="text-sm leading-relaxed text-body">{item.excerpt}</p>
            <Link
              href={item.href}
              className="w-fit transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <ReadMoreLabel />
            </Link>
          </li>
        ))}
      </ul>
    </MotionInView>
    </div>
  );
}
