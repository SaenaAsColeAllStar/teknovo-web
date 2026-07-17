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
 * Layout detail berita: breadcrumb, hero gambar, meta artikel, konten prose, bagikan & terkait.
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

        <article
          data-berita-article
          itemScope
          itemType="https://schema.org/NewsArticle"
          className="mx-auto max-w-3xl"
        >
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <BeritaCategoryBadge kind={seo.kind} />
              <time
                dateTime={publishedIso}
                itemProp="datePublished"
                className="text-sm text-slate-600 dark:text-slate-400"
              >
                {formatDateId(publishedAt)}
              </time>
              <span className="text-sm text-slate-400 dark:text-slate-500" aria-hidden>
                ·
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{readLabel}</span>
            </div>

            <h1
              itemProp="headline"
              className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl sm:leading-tight"
            >
              {judul}
            </h1>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{authorLabel}</span>
              </span>
            </p>

            <BeritaShareButtons url={canonicalUrl} title={judul} className="mt-5" />
          </header>

          {cover ? (
            <figure className="relative -mx-4 mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200/90 sm:mx-0 dark:border-slate-800 dark:bg-slate-800/90">
              <PublicOptimizedImage
                src={cover.src}
                alt={cover.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                itemProp="image"
              />
            </figure>
          ) : null}

          <p
            itemProp="description"
            className="mt-8 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {ringkasan}
          </p>

          {children}

          <div className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
            <ArtikelKontenHtml html={kontenHtml} />
          </div>
        </article>

        <BeritaRelatedArticles items={related} />
      </div>
    </section>
  );
}
