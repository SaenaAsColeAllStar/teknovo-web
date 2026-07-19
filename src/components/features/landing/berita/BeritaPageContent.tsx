import Link from "next/link";
import type { ReactElement } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BERITA_EMPTY_KEGIATAN_CROSS,
  BERITA_EMPTY_TERBARU,
  BERITA_HERO_EYEBROW,
  BERITA_KEGIATAN_PAGE_LEDE,
  BERITA_PAGE_LEDE,
  BERITA_PAGE_TITLE,
} from "@/lib/berita-landing-content";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { cn, formatDateId } from "@/lib/utils";

import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import { artikelSiswaToBeritaItem } from "./artikel-siswa-to-berita-item";
import { beritaKegiatanToBeritaItem } from "./berita-kegiatan-to-berita-item";
import { BERITA_TERBARU } from "./berita-data";
import { BeritaCoverMedia } from "./BeritaCoverMedia";

export type BeritaPageContentProps = {
  /** Artikel siswa yang sudah diterbitkan (moderated) — digabung ke daftar berita. */
  artikelSiswa?: ArtikelSiswaPublikCard[];
  /** Berita kegiatan resmi sekolah (setelah persetujuan KS bila penulis Admin Sekolah). */
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

export function BeritaPageContent({
  artikelSiswa = [],
  beritaKegiatan = [],
}: BeritaPageContentProps): ReactElement {
  const dariSiswa = artikelSiswa.map(artikelSiswaToBeritaItem);
  const dariSekolah = beritaKegiatan.map(beritaKegiatanToBeritaItem);
  const gabungan = [...dariSiswa, ...dariSekolah, ...BERITA_TERBARU].sort(
    (x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime(),
  );
  const sorotanKegiatanSekolah = dariSekolah;

  return (
    <MotionInView as="section" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={BERITA_HERO_EYEBROW} title={BERITA_PAGE_TITLE} lede={BERITA_PAGE_LEDE} />

        {gabungan.length === 0 ? (
          <MotionInView
            as="div"
            id="berita-terbaru"
            className="mt-14 scroll-mt-24 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
            delay={0.05}
          >
            {BERITA_EMPTY_TERBARU}
          </MotionInView>
        ) : (
          <ul id="berita-terbaru" className="mt-14 scroll-mt-24 space-y-8">
            {gabungan.map((item) => (
              <MotionInView
                as="li"
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40"
                delay={0.06}
              >
                <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
                  <BeritaCoverMedia
                    src={item.coverSrc}
                    alt={item.judul}
                    className="aspect-[4/3] min-h-[180px] w-full md:aspect-auto md:min-h-[200px]"
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-400">
                      {formatDateId(new Date(item.tanggal))}
                    </p>
                    {item.detailHref ? (
                      <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        <Link href={item.detailHref} className="hover:underline">
                          {item.judul}
                        </Link>
                      </h2>
                    ) : (
                      <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.judul}</h2>
                    )}
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                        publicFormalBodyClassName,
                      )}
                    >
                      {item.ringkasan}
                    </p>
                    {item.creditLine ? (
                      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{item.creditLine}</p>
                    ) : null}
                  </div>
                </div>
              </MotionInView>
            ))}
          </ul>
        )}

        <MotionInView
          as="section"
          id="berita-kegiatan"
          className="scroll-mt-24 mt-16 rounded-2xl border border-slate-200 bg-slate-50/80 p-8 dark:border-slate-800 dark:bg-slate-900/40"
          aria-labelledby="berita-kegiatan-heading"
          delay={0.08}
        >
          <h2
            id="berita-kegiatan-heading"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            Berita kegiatan
          </h2>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
              publicFormalBodyClassName,
            )}
          >
            {BERITA_KEGIATAN_PAGE_LEDE}
          </p>
          {sorotanKegiatanSekolah.length === 0 ? (
            <p
              className={cn("mt-6 text-sm text-slate-500 dark:text-slate-400", publicFormalBodyClassName)}
            >
              {BERITA_EMPTY_KEGIATAN_CROSS}
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {sorotanKegiatanSekolah.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-950/60"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-400">
                    {formatDateId(new Date(item.tanggal))}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                    <Link href={item.detailHref!} className="hover:underline">
                      {item.judul}
                    </Link>
                  </h3>
                  <p
                    className={cn(
                      "mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400",
                      publicFormalBodyClassName,
                    )}
                  >
                    {item.ringkasan}
                  </p>
                  {item.creditLine ? (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.creditLine}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </MotionInView>
      </div>
    </MotionInView>
  );
}
