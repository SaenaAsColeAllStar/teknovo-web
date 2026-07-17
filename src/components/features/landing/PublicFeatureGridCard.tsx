import type { ReactElement, ReactNode } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { cn } from "@/lib/utils";

export const publicFeatureGridCardShellClassName =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800/60";

export type PublicFeatureGridCardTag = {
  label: string;
  className?: string;
};

export type PublicFeatureGridCardProps = {
  title: string;
  description: string;
  coverSrc: string;
  coverAlt: string;
  href?: string;
  linkLabel?: string;
  icon?: ReactNode;
  imageOverlay?: ReactNode;
  tags?: readonly PublicFeatureGridCardTag[];
  priority?: boolean;
  featured?: boolean;
  className?: string;
};

function CardBody({
  title,
  description,
  tags,
  linkLabel,
  showLink,
}: {
  title: string;
  description: string;
  tags?: readonly PublicFeatureGridCardTag[];
  linkLabel: string;
  showLink: boolean;
}): ReactElement {
  return (
    <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {tags && tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag.label}
              className={cn(
                "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
                tag.className,
              )}
            >
              {tag.label}
            </li>
          ))}
        </ul>
      ) : null}
      {showLink ? (
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300">
          {linkLabel}
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </span>
      ) : null}
    </div>
  );
}

function CardImage({
  coverSrc,
  coverAlt,
  priority,
  icon,
  imageOverlay,
}: {
  coverSrc: string;
  coverAlt: string;
  priority?: boolean;
  icon?: ReactNode;
  imageOverlay?: ReactNode;
}): ReactElement {
  return (
    <div
      className={cn(
        "relative min-h-[11rem] sm:min-h-[12rem]",
        publicOptimizedImageContainerClassName,
      )}
    >
      <PublicOptimizedImage
        src={coverSrc}
        alt={coverAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" aria-hidden />
      {icon ? (
        <span className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-xl bg-white/90 text-blue-700 shadow-sm backdrop-blur-sm dark:bg-slate-950/80 dark:text-blue-300">
          {icon}
        </span>
      ) : null}
      {imageOverlay ? <div className="absolute left-4 top-4">{imageOverlay}</div> : null}
    </div>
  );
}

export function PublicFeatureGridCard({
  title,
  description,
  coverSrc,
  coverAlt,
  href,
  linkLabel = "Pelajari lebih lanjut",
  icon,
  imageOverlay,
  tags,
  priority,
  featured,
  className,
}: PublicFeatureGridCardProps): ReactElement {
  const shellClass = cn(
    publicFeatureGridCardShellClassName,
    featured && "ring-2 ring-blue-600/35 shadow-md shadow-blue-600/10",
    className,
  );

  const inner = (
    <>
      <CardImage
        coverSrc={coverSrc}
        coverAlt={coverAlt}
        priority={priority}
        icon={icon}
        imageOverlay={imageOverlay}
      />
      <CardBody
        title={title}
        description={description}
        tags={tags}
        linkLabel={linkLabel}
        showLink={Boolean(href)}
      />
    </>
  );

  if (href) {
    return (
      <div className={shellClass}>
        <PublicSiteLink href={href} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
          {inner}
        </PublicSiteLink>
      </div>
    );
  }

  return <div className={cn(shellClass, "flex h-full flex-col")}>{inner}</div>;
}
