import type { ReactElement, ReactNode } from "react";

import { PublicOptimizedImage } from "@/components/shared/PublicOptimizedImage";

import { ArtikelKontenHtml } from "@/components/features/landing/berita/ArtikelKontenHtml";
import { BeritaArticleJsonLd } from "@/components/features/landing/berita/BeritaArticleJsonLd";
import { BeritaBreadcrumb } from "@/components/features/landing/berita/BeritaBreadcrumb";
import { BeritaBreadcrumbJsonLd } from "@/components/features/landing/berita/BeritaBreadcrumbJsonLd";
import { BeritaCategoryBadge } from "@/components/features/landing/berita/BeritaCategoryBadge";
import { BeritaReadingProgress } from "@/components/features/landing/berita/BeritaReadingProgress";
import { BeritaRelatedArticles } from "@/components/features/landing/berita/BeritaRelatedArticles";
import { BeritaShareButtons } from "@/components/features/landing/berita/BeritaShareButtons";
import { BeritaSubNav } from "@/components/features/landing/berita/BeritaSubNav";
import { estimateReadTimeMinutes, formatReadTimeId } from "@/lib/berita-read-time";
import { buildLandingAbsoluteUrl, type BeritaArticleSeoInput, type BeritaRelatedItem } from "@/lib/berita-seo";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { formatDateId } from "@/lib/utils";

export type BeritaArticleDetailShellProps = {
  seo: BeritaArticleSeoInput;
  backHref: string;
  backLabel: string;
  sectionPath: string;
  publishedAt: Date;
  authorLabel: string;
  cover?: { src: string; alt: string };
  children?: ReactNode;
  kontenHtml: string;
  ringkasan: string;
  judul: string;
  related?: BeritaRelatedItem[];
};

/**
 * Layout detail berita — lebar penuh `public-site-container` (selaras navbar),
 * kolom baca + rail terkait di layar besar.
 */
export function BeritaArticleDetailShell({
  seo,
  backHref,
  backLabel,
  sectionPath,
  publishedAt,
  authorLabel,
  cover,
  children,
  kontenHtml,
  ringkasan,
  judul,
  related = [],
}: BeritaArticleDetailShellProps): ReactElement {
  const publishedIso = publishedAt.toISOString();
  const readMinutes = estimateReadTimeMinutes(`${ringkasan} ${kontenHtml}`);
  const readLabel = formatReadTimeId(readMinutes);
  const canonicalUrl = buildLandingAbsoluteUrl(seo.path);
  const sectionHref = seo.kind === "siswa" ? "/berita/berita-terbaru" : "/berita/kegiatan-sekolah";
  const sectionCtaLabel =
    seo.kind === "siswa" ? "Semua berita terbaru" : "Semua berita kegiatan";

  return (
    <section className={publicPageSectionWhiteClassName}>
      <BeritaArticleJsonLd seo={seo} />
      <BeritaBreadcrumbJsonLd
        input={{
          judul,
          path: seo.path,
          sectionLabel: backLabel,
          sectionPath: backHref,
        }}
      />
      <BeritaReadingProgress />
      <div className="public-site-container pt-6 sm:pt-8">
        <BeritaSubNav />
      </div>
      <div className="public-site-container py-10 sm:py-14">
        <BeritaBreadcrumb
          className="mb-8"
          segments={[
            { label: "Beranda", href: "/" },
            { label: "Berita", href: "/berita/berita-terbaru" },
            { label: backLabel, href: sectionPath },
            { label: judul },
          ]}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16.5rem,20rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(17.5rem,22rem)] xl:gap-14">
          <article
            data-berita-article
            itemScope
            itemType="https://schema.org/NewsArticle"
            className="min-w-0"
          >
            <header className="border-b border-border-default pb-8">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <BeritaCategoryBadge kind={seo.kind} />
                <time
                  dateTime={publishedIso}
                  itemProp="datePublished"
                  className="text-sm text-body"
                >
                  {formatDateId(publishedAt)}
                </time>
                <span className="text-sm text-body-subtle" aria-hidden>
                  ·
                </span>
                <span className="text-sm text-body">{readLabel}</span>
              </div>

              <h1
                itemProp="headline"
                className="mt-4 text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl sm:leading-[1.15] lg:text-[2.5rem]"
              >
                {judul}
              </h1>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-sm text-body">
                  <span className="text-body-subtle">Oleh </span>
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name" className="font-medium text-heading">
                      {authorLabel}
                    </span>
                  </span>
                </p>
                <BeritaShareButtons url={canonicalUrl} title={judul} className="lg:hidden" />
              </div>
            </header>

            {cover ? (
              <figure className="relative -mx-4 mt-8 aspect-[16/9] overflow-hidden border border-border-default bg-neutral-soft sm:mx-0">
                <PublicOptimizedImage
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 70vw, 880px"
                  priority
                  itemProp="image"
                />
              </figure>
            ) : null}

            <p
              itemProp="description"
              className="mt-8 border-l-2 border-brand pl-4 text-lg font-medium leading-relaxed text-body sm:text-xl sm:leading-relaxed"
            >
              {ringkasan}
            </p>

            {children}

            <div className="mt-10 border-t border-border-default pt-10">
              <ArtikelKontenHtml html={kontenHtml} />
            </div>
          </article>

          <aside
            className="min-w-0 space-y-6 lg:sticky lg:top-[calc(var(--public-nav-bottom,10.5rem)+1rem)]"
            aria-label="Panel berita"
          >
            <div className="hidden border border-border-default bg-surface p-5 lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Bagikan artikel
              </p>
              <BeritaShareButtons
                url={canonicalUrl}
                title={judul}
                className="mt-3"
                layout="stack"
                hideLabel
              />
            </div>

            <BeritaRelatedArticles items={related} variant="rail" className="hidden lg:block" />

            <div className="border border-border-default bg-neutral-soft p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Arsip berita
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Jelajahi pengumuman dan liputan kegiatan SMK TEKNOVO.
              </p>
              <a
                href={sectionHref}
                className="mt-4 inline-flex items-center text-sm font-semibold text-brand underline-offset-4 transition hover:text-brand-strong hover:underline"
              >
                {sectionCtaLabel}
                <span aria-hidden className="ms-1">
                  →
                </span>
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-12 lg:hidden">
          <BeritaRelatedArticles items={related} variant="stack" />
        </div>
      </div>
    </section>
  );
}
