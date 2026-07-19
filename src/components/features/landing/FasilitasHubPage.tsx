import type { ReactElement } from "react";

import { FasilitasPageShell } from "@/components/features/landing/FasilitasPageShell";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  FASILITAS_PAGE_LEDE,
  FASILITAS_PAGE_TITLE,
  type FasilitasLandingItem,
  type FasilitasSlug,
} from "@/lib/fasilitas-landing-content";
import { cn } from "@/lib/utils";

const BENTO_SPANS = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
] as const;

/** Short card blurbs — denser than full hub ledes. */
const BENTO_BLURBS: Record<FasilitasSlug, string> = {
  "absensi-digital":
    "Tap masuk real-time, absensi per pertemuan, dan portal orang tua — kedisiplinan yang terhubung ke LMS.",
  "lms-sekolah":
    "Materi, tugas ber-deadline, dan evaluasi formatif — satu portal untuk guru, siswa, dan orang tua.",
  "laboratorium-komputer":
    "Workstation dual-jurusan: CAD & simulasi mesin (TM), plus software reservasi & layanan wisata (ULW).",
  "perpustakaan-digital":
    "Katalog daring, e-book, dan ruang baca — literasi serta riset mandiri yang terhubung ke materi LMS.",
};

function FasilitasBentoMock({
  coverSrc,
  coverAlt,
  wide,
  priority,
}: {
  coverSrc: string;
  coverAlt: string;
  wide: boolean;
  priority?: boolean;
}): ReactElement {
  return (
    <div
      className={cn(
        "mt-auto flex min-h-[11.5rem] flex-1 flex-col overflow-hidden border-t border-border-default bg-neutral-soft sm:min-h-[13rem]",
        wide ? "lg:min-h-[16rem]" : "lg:min-h-[14rem]",
      )}
      aria-hidden
    >
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border-default bg-surface px-3">
        <span className="size-1.5 rounded-full bg-border-default" />
        <span className="size-1.5 rounded-full bg-border-default" />
        <span className="size-1.5 rounded-full bg-brand/35" />
        <span className="ml-2 truncate text-[10px] font-medium text-body-subtle">{coverAlt}</span>
      </div>
      <div className={cn("relative min-h-0 flex-1", publicOptimizedImageContainerClassName)}>
        <PublicOptimizedImage
          src={coverSrc}
          alt=""
          fill
          sizes={
            wide
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 1024px) 100vw, 33vw"
          }
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}

export function FasilitasHubPage({
  items,
}: {
  items?: readonly FasilitasLandingItem[];
} = {}): ReactElement {
  const cards = items ? [...items] : [];

  return (
    <FasilitasPageShell title={FASILITAS_PAGE_TITLE} lede={FASILITAS_PAGE_LEDE} showHubHero>
      <MotionInView as="header" className="mt-12 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Sarana sekolah yang siap dipakai
          <br className="hidden sm:block" /> untuk belajar terukur
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-body sm:text-base">
          {FASILITAS_PAGE_LEDE}
        </p>
      </MotionInView>

      {cards.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-border-default bg-surface px-4 py-12 text-center text-sm text-body">
          Belum ada fasilitas terbit. Super Admin dapat menambah dan mempublikasikan unit di CMS
          → Fasilitas.
        </p>
      ) : (
        <ul className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-6">
          {cards.map((item, idx) => {
            const wide = idx === 0 || idx === 3;
            const blurb =
              BENTO_BLURBS[item.slug as FasilitasSlug] ?? item.description;
            return (
              <MotionInView
                as="li"
                key={item.slug}
                id={item.slug}
                delay={0.05 * idx}
                className={cn("scroll-mt-24", BENTO_SPANS[idx] ?? "lg:col-span-1")}
              >
                <PublicSiteLink
                  href={`/fasilitas/${item.slug}`}
                  className="group flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-[border-color,box-shadow] duration-300 hover:border-brand/35 hover:shadow-[0_12px_40px_-18px_rgba(19,19,186,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:min-h-[24rem] lg:min-h-[26rem]"
                >
                  <div className="p-5 sm:p-6">
                    <h3 className="text-left text-lg font-bold tracking-tight text-heading sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-left text-sm leading-relaxed text-body">
                      {blurb}
                    </p>
                  </div>
                  <FasilitasBentoMock
                    coverSrc={item.coverSrc}
                    coverAlt={item.title}
                    wide={wide}
                    priority={idx === 0}
                  />
                </PublicSiteLink>
              </MotionInView>
            );
          })}
        </ul>
      )}
    </FasilitasPageShell>
  );
}
