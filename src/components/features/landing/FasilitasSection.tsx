import type { ReactElement } from "react";
import Link from "next/link";

import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { PublicFeatureGridCard } from "@/components/features/landing/PublicFeatureGridCard";
import { MotionInView } from "@/components/motion/MotionInView";
import { FASILITAS_ITEMS, getFasilitasDetailPath } from "@/lib/fasilitas-landing-content";
import { LMS_BERITA_KEGIATAN_PATH } from "@/lib/lms-dashboard-seo";
import { PUBLIC_SITE_PORTAL_LOGIN_HREF } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

export type FasilitasSectionProps = Readonly<{
  /** Gaya ringan di beranda (border atas); lebar konten tetap `public-site-container`. */
  embedded?: boolean;
}>;

export function FasilitasSection({ embedded = false }: FasilitasSectionProps = {}): ReactElement {
  const body = (
    <>
      <MotionInView as="header" className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fasilitas</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Teknologi dan sarana unggulan yang mendukung pembelajaran abad digital — dari absensi pintar,{" "}
          <Link
            href={getFasilitasDetailPath("lms-sekolah")}
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            LMS online SMK TEKNOVO
          </Link>
          , laboratorium, hingga perpustakaan digital.
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Pengguna terdaftar masuk lewat{" "}
          <Link
            href={PUBLIC_SITE_PORTAL_LOGIN_HREF}
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            portal pembelajaran online
          </Link>
          ; baca juga{" "}
          <Link
            href={LMS_BERITA_KEGIATAN_PATH}
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            berita platform LMS
          </Link>
          .
        </p>
      </MotionInView>

      <ul className={cn("grid gap-5 sm:grid-cols-2", embedded ? "mt-8 sm:mt-10" : "mt-12")}>
        {FASILITAS_ITEMS.map((item, idx) => (
          <MotionInView as="li" key={item.slug} id={item.slug} delay={0.06 * idx}>
            <PublicFeatureGridCard
              title={item.title}
              description={item.description}
              coverSrc={item.coverSrc}
              coverAlt={item.title}
              href={getFasilitasDetailPath(item.slug)}
              icon={<FasilitasIconGlyph iconKey={item.slug} className="size-5" />}
              tags={item.highlights.slice(0, 3).map((label) => ({ label }))}
              priority={idx === 0 && !embedded}
            />
          </MotionInView>
        ))}
      </ul>
    </>
  );

  return (
    <MotionInView
      as="section"
      id="fasilitas"
      className={cn(
        "scroll-mt-20",
        embedded
          ? "col-span-full w-full border-t border-slate-200/70 pt-10 dark:border-slate-700/60 sm:pt-14"
          : "border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 sm:py-20",
      )}
    >
      <div className="public-site-container">{body}</div>
    </MotionInView>
  );
}
