import { ArrowRight, CalendarDays } from "lucide-react";
import type { ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BERITA_BLOG_AUTHOR_FALLBACK,
  BERITA_BLOG_SECTION_TITLE,
  BERITA_EMPTY_KEGIATAN,
  BERITA_HOME_READ_MORE_LABEL,
} from "@/lib/berita-landing-content";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn, formatDateId } from "@/lib/utils";

import type { BeritaItem } from "./berita-data";
import { BeritaCoverMedia } from "./BeritaCoverMedia";

const FEATURED_PLUS_CARDS = 4;

export type BeritaKegiatanBlogSectionProps = {
  items: BeritaItem[];
  emptyMessage?: string;
  title?: string;
};

function authorLabel(item: BeritaItem): string {
  if (item.creditLine?.trim()) {
    const cleaned = item.creditLine
      .replace(/^Ditulis oleh\s+/i, "")
      .replace(/^Humas sekolah\s*[·•]\s*/i, "")
      .trim();
    if (cleaned.length > 0) return cleaned;
  }
  return BERITA_BLOG_AUTHOR_FALLBACK;
}

function authorInitials(label: string): string {
  const parts = label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "HS";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function BacaSelengkapnyaLink({ href }: { href: string }): ReactElement {
  return (
    <PublicSiteLink
      href={href}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#1313BA] transition-colors hover:text-[#0f0f9a]"
    >
      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
      {BERITA_HOME_READ_MORE_LABEL}
    </PublicSiteLink>
  );
}

function AuthorRow({ item }: { item: BeritaItem }): ReactElement {
  const author = authorLabel(item);
  const published = new Date(item.tanggal);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1313BA]/10 text-xs font-bold text-[#1313BA]"
        aria-hidden
      >
        {authorInitials(author)}
      </span>
      <span className="text-sm font-semibold text-heading">{author}</span>
      <span className="inline-flex items-center gap-1.5 text-sm text-body-subtle">
        <CalendarDays className="size-3.5 shrink-0" aria-hidden />
        <time dateTime={item.tanggal}>{formatDateId(published)}</time>
      </span>
    </div>
  );
}

function FeaturedArticle({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita/kegiatan-sekolah";

  return (
    <article className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 lg:items-center">
      <BeritaCoverMedia
        src={item.coverSrc}
        alt=""
        className="rounded-2xl lg:aspect-[5/4]"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="min-w-0">
        <h3 className="text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl">
          <PublicSiteLink
            href={href}
            className="transition-colors hover:text-[#1313BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1313BA]/30"
          >
            {item.judul}
          </PublicSiteLink>
        </h3>
        <AuthorRow item={item} />
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-body sm:text-[15px]",
            publicFormalBodyClassName,
          )}
        >
          {item.ringkasan}
        </p>
        <div className="mt-6">
          <BacaSelengkapnyaLink href={href} />
        </div>
      </div>
    </article>
  );
}

function BlogCard({ item }: { item: BeritaItem }): ReactElement {
  const href = item.detailHref ?? "/berita/kegiatan-sekolah";

  return (
    <article className="flex h-full min-w-0 flex-col">
      <BeritaCoverMedia
        src={item.coverSrc}
        alt=""
        className="rounded-2xl aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-heading sm:text-lg">
        <PublicSiteLink
          href={href}
          className="transition-colors hover:text-[#1313BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1313BA]/30"
        >
          {item.judul}
        </PublicSiteLink>
      </h3>
      <p className={cn("mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
        {item.ringkasan}
      </p>
      <div className="mt-4">
        <BacaSelengkapnyaLink href={href} />
      </div>
    </article>
  );
}

/**
 * Blok blog berita kegiatan: judul tengah, divider, featured + 3 kartu.
 */
export function BeritaKegiatanBlogSection({
  items,
  emptyMessage = BERITA_EMPTY_KEGIATAN,
  title = BERITA_BLOG_SECTION_TITLE,
}: BeritaKegiatanBlogSectionProps): ReactElement {
  const slice = items.slice(0, FEATURED_PLUS_CARDS);
  const featured = slice[0];
  const cards = slice.slice(1, 4);

  return (
    <MotionInView as="div" className="mt-10 scroll-mt-24 w-full min-w-0 px-1 sm:px-2" delay={0.06}>
      <section id="berita-kegiatan" aria-labelledby="berita-kegiatan-heading" className="w-full min-w-0">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="berita-kegiatan-heading"
            className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
          >
            {title}
          </h2>
        </header>

        <div className="mt-8 border-t border-[#E8E8F8] sm:mt-10" role="presentation" />

        {featured ? (
          <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
            <FeaturedArticle item={featured} />
            {cards.length > 0 ? (
              <ul className="grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-3">
                {cards.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <BlogCard item={item} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E8E8F8] px-6 py-12 text-center text-sm text-body">
            {emptyMessage}
          </div>
        )}
      </section>
    </MotionInView>
  );
}
