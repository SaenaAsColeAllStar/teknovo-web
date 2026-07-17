import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { FasilitasPageShell } from "@/components/features/landing/FasilitasPageShell";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  FASILITAS_FOOTER_CTA_BODY,
  FASILITAS_FOOTER_CTA_KONTAK_HREF,
  FASILITAS_FOOTER_CTA_PPDB_HREF,
  FASILITAS_FOOTER_CTA_TITLE,
  type FasilitasLandingItem,
  type FasilitasSlug,
  type FasilitasStatChip,
  getFasilitasDetailPath,
  getFasilitasItem,
  getRelatedFasilitasItems,
  getRelatedFasilitasItemsForLms,
} from "@/lib/fasilitas-landing-content";
import { LMS_BERITA_KEGIATAN_PATH } from "@/lib/lms-dashboard-seo";
import { PUBLIC_SITE_PORTAL_LOGIN_HREF } from "@/lib/public-site-nav";
import {
  publicFormalBodyClassName,
  publicSectionIntroClassName,
  publicSectionTitleClassName,
} from "@/lib/public-section-styles";
import type { LmsPublikStats } from "@/services/lms-publik-stats";
import { cn } from "@/lib/utils";

const cardShellClass = publicSplitCardShellClassName;

const pillarCardClass =
  "flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-blue-50 p-6 shadow-sm dark:border-slate-800 dark:bg-blue-950/35 sm:p-7";

const relatedTileClass =
  "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800/60";

function FormalParagraph({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

function resolveDisplayStats(
  item: FasilitasLandingItem,
  liveStats: LmsPublikStats | null | undefined,
): readonly FasilitasStatChip[] {
  const base = item.stats ?? [];
  if (!liveStats) {
    return base;
  }
  const dynamic: FasilitasStatChip[] = [];
  if (liveStats.kontenCount > 0) {
    dynamic.push({
      label: "Materi digital",
      value: `${liveStats.kontenCount.toLocaleString("id-ID")}+ konten`,
    });
  }
  if (liveStats.tugasAktifCount > 0) {
    dynamic.push({
      label: "Tugas berjalan",
      value: `${liveStats.tugasAktifCount.toLocaleString("id-ID")} penugasan aktif`,
    });
  }
  return dynamic.length > 0 ? [...base, ...dynamic] : base;
}

export type FasilitasDetailPageProps = {
  slug: FasilitasSlug;
  liveStats?: LmsPublikStats | null;
};

export function FasilitasDetailPage({ slug, liveStats }: FasilitasDetailPageProps): ReactElement {
  const item = getFasilitasItem(slug);
  if (!item) {
    notFound();
  }

  const isLms = slug === "lms-sekolah";
  const isLibrary = slug === "perpustakaan-digital";
  const related = isLms ? getRelatedFasilitasItemsForLms() : getRelatedFasilitasItems(slug);
  const features = item.features ?? [];
  const displayStats = isLms ? resolveDisplayStats(item, liveStats) : [];

  return (
    <FasilitasPageShell
      eyebrow={isLms ? "Pembelajaran digital" : "Fasilitas TEKNOVO"}
      title={item.title}
      lede={item.description}
    >
        <MotionInView as="article" className={cn(cardShellClass, "mt-10 min-h-[18rem] sm:min-h-[20rem]")} delay={0.04}>
          <PublicSplitContentCard
            tone="accent"
            image={{
              src: item.coverSrc,
              alt: item.title,
              quality: 70,
              priority: true,
            }}
          >
            <FasilitasIconGlyph iconKey={slug} className="size-8 text-blue-600 dark:text-blue-400" />
            <ul className="flex flex-wrap gap-2">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-blue-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-blue-900 dark:border-blue-500/30 dark:bg-slate-950/50 dark:text-blue-100"
                >
                  {highlight}
                </li>
              ))}
            </ul>
            <FormalParagraph>{item.paragraphs[0] ?? item.description}</FormalParagraph>
            <AkademikLearnMoreLink href="/fasilitas">Kembali ke ringkasan</AkademikLearnMoreLink>
          </PublicSplitContentCard>
        </MotionInView>

        {isLms && displayStats.length > 0 ? (
          <MotionInView as="ul" className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5" delay={0.05}>
            {displayStats.map((stat) => (
              <li
                key={`${stat.label}-${stat.value}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center dark:border-slate-800 dark:bg-slate-900/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              </li>
            ))}
          </MotionInView>
        ) : null}

        <MotionInView as="div" className="mt-14 space-y-6" delay={0.06}>
          {item.paragraphs.slice(1).map((paragraph) => (
            <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
          ))}
        </MotionInView>

        {isLms && item.pathwaySteps && item.pathwaySteps.length > 0 ? (
          <MotionInView
            as="section"
            className="mt-14 space-y-8"
            delay={0.07}
            aria-labelledby="fasilitas-lms-alur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <span
                aria-hidden
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              >
                <FasilitasIconGlyph iconKey={slug} className="size-6" />
              </span>
              <div className="min-w-0">
                <h2 id="fasilitas-lms-alur" className={publicSectionTitleClassName}>
                  Alur pembelajaran digital
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Dari persiapan guru hingga transparansi orang tua — satu alur yang selaras portal internal sekolah.
                </p>
              </div>
            </div>
            <ol className="grid gap-4 lg:grid-cols-2">
              {item.pathwaySteps.map((step, idx) => (
                <MotionInView
                  as="li"
                  key={step.step}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
                  delay={0.08 + idx * 0.02}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                    Langkah {step.step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
                </MotionInView>
              ))}
            </ol>
          </MotionInView>
        ) : null}

        {isLms && item.quote ? (
          <MotionInView as="article" className={cn(cardShellClass, "mt-14")} delay={0.09}>
            <blockquote className="relative space-y-5 border-l-4 border-blue-600 bg-blue-50/60 p-6 dark:border-blue-500 dark:bg-blue-950/25 sm:p-8 lg:p-10">
              <FasilitasIconGlyph
                iconKey={slug}
                className="pointer-events-none absolute right-6 top-6 size-14 text-blue-200 dark:text-blue-900/80 sm:size-16"
              />
              <p
                className={cn(
                  "relative max-w-3xl text-lg italic leading-relaxed text-slate-800 dark:text-slate-100 sm:text-xl",
                  publicFormalBodyClassName,
                )}
              >
                &ldquo;{item.quote.text}&rdquo;
              </p>
              <footer className="relative text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {item.quote.attribution}
              </footer>
            </blockquote>
          </MotionInView>
        ) : null}

        {features.length > 0 ? (
          <MotionInView as="section" className="mt-14 space-y-8" delay={0.08} aria-labelledby="fasilitas-fitur">
            <div>
              <h2 id="fasilitas-fitur" className={publicSectionTitleClassName}>
                {isLibrary ? "Layanan & koleksi" : isLms ? "Pilar platform LMS" : "Keunggulan utama"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {isLibrary
                  ? "Perpustakaan digital menggabungkan koleksi, ruang baca, dan literasi media untuk siswa serta guru."
                  : isLms
                    ? "Materi, tugas, evaluasi, dan notifikasi orang tua dalam satu ekosistem yang selaras rapor digital."
                    : "Fasilitas ini dirancang selaras dengan ekosistem digital sekolah dan kebutuhan pembelajaran kejuruan."}
              </p>
            </div>
            <ul
              className={cn(
                "grid gap-4 sm:grid-cols-2",
                isLms ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4",
              )}
            >
              {features.map((feature, idx) => (
                <MotionInView as="li" key={feature.id} className={pillarCardClass} delay={0.1 + idx * 0.02}>
                  <FasilitasIconGlyph iconKey={slug} className="size-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
                </MotionInView>
              ))}
            </ul>
          </MotionInView>
        ) : null}

        {isLms && item.splitNarrative ? (
          <MotionInView as="article" className={cn(cardShellClass, "mt-14 min-h-[16rem] sm:min-h-[18rem]")} delay={0.11}>
            <PublicSplitContentCard
              tone="plain"
              image={{
                src: item.coverSrc,
                alt: item.title,
                quality: 65,
              }}
            >
              <FasilitasIconGlyph iconKey={slug} className="size-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {item.splitNarrative.title}
              </h3>
              <div className="space-y-4">
                {item.splitNarrative.paragraphs.map((paragraph) => (
                  <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
                ))}
              </div>
            </PublicSplitContentCard>
          </MotionInView>
        ) : null}

        {item.hours && item.hours.length > 0 ? (
          <MotionInView as="section" className="mt-14" delay={0.1} aria-labelledby="fasilitas-jam">
            <div className={cn(cardShellClass, "p-6 sm:p-8")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <FasilitasIconGlyph iconKey="hours" className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id="fasilitas-jam" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {isLms ? "Jam akses platform" : "Jam operasional"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {isLms
                      ? "Akses daring diperpanjang di luar jam tatap muka; pemeliharaan diumumkan melalui portal sebelum libur."
                      : "Jadwal dapat disesuaikan saat ujian, kegiatan khusus, atau libur sekolah — konfirmasi ke pustakawan."}
                  </p>
                  <dl className={cn("mt-6 grid gap-3", isLms ? "sm:grid-cols-3" : "sm:grid-cols-3")}>
                    {item.hours.map((row) => (
                      <div
                        key={row.label}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </MotionInView>
        ) : null}

        {item.services && item.services.length > 0 ? (
          <MotionInView as="section" className="mt-14 space-y-6" delay={0.12} aria-labelledby="fasilitas-layanan">
            <h2 id="fasilitas-layanan" className={publicSectionTitleClassName}>
              {isLms ? "Portal untuk setiap peran" : "Layanan pengguna"}
            </h2>
            <ul className={cn("grid gap-5", isLms ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
              {item.services.map((band) => (
                <li key={band.audience} className={pillarCardClass}>
                  <div className="flex items-center gap-3">
                    <FasilitasIconGlyph iconKey="service" className="size-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{band.audience}</h3>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {band.items.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </MotionInView>
        ) : null}

        <MotionInView as="section" className="mt-16 space-y-6" delay={0.14} aria-labelledby="fasilitas-lainnya">
          <h2 id="fasilitas-lainnya" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isLms ? "Fasilitas pendukung pembelajaran" : "Fasilitas lainnya"}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {related.map((relatedItem) => (
              <li key={relatedItem.slug}>
                <Link href={getFasilitasDetailPath(relatedItem.slug)} className={relatedTileClass}>
                  <div className={cn("relative min-h-[8rem]", publicOptimizedImageContainerClassName)}>
                    <PublicOptimizedImage
                      src={relatedItem.coverSrc}
                      alt={relatedItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/25" aria-hidden />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{relatedItem.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                      {relatedItem.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </MotionInView>

        <MotionInView
          as="section"
          className="mt-16 rounded-2xl border border-blue-200/80 bg-blue-50 px-6 py-8 text-center dark:border-blue-800/50 dark:bg-blue-950/35 sm:px-10"
          delay={0.16}
        >
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{FASILITAS_FOOTER_CTA_TITLE}</h2>
          <p className={cn("mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300", publicSectionIntroClassName)}>
            {FASILITAS_FOOTER_CTA_BODY}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isLms ? (
              <Link
                href={PUBLIC_SITE_PORTAL_LOGIN_HREF}
                className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Masuk portal LMS online
              </Link>
            ) : null}
            <Link
              href={FASILITAS_FOOTER_CTA_KONTAK_HREF}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Hubungi sekolah
            </Link>
            <PpdbCtaLink href={FASILITAS_FOOTER_CTA_PPDB_HREF} label="Daftar PPDB" className="px-5 py-2.5 text-sm" />
            {isLms ? (
              <Link
                href={LMS_BERITA_KEGIATAN_PATH}
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-950 dark:text-blue-200 dark:hover:bg-blue-950/40"
              >
                Berita platform LMS
              </Link>
            ) : null}
          </div>
        </MotionInView>
    </FasilitasPageShell>
  );
}
