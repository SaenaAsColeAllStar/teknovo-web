import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BeritaCardGrid } from "@/components/berita/BeritaCardGrid";
import { Button } from "@/components/ui/button";
import { fetchBeritaList } from "@/lib/api-client";
import {
  BRAND_HERO_IMAGE_SRC,
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
  BRAND_TAGLINE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beranda",
  description: `Portal resmi ${BRAND_SHORT} — ${BRAND_SCHOOL_FULL}. SMK vokasi akreditasi A di Pamanukan, Subang.`,
};

export default async function HomePage() {
  const berita = await fetchBeritaList({ limit: 6 });

  return (
    <>
      <section className="relative min-h-[min(92vh,820px)] overflow-hidden bg-[color:var(--color-brand)] text-white">
        <Image
          src={BRAND_HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          className="animate-soft-zoom object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-brand)] via-[color:var(--color-brand)]/85 to-transparent" />
        <div className="relative mx-auto flex min-h-[min(92vh,820px)] max-w-[1280px] flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-24">
          <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.2em] text-white/80">
            {BRAND_TAGLINE}
          </p>
          <h1
            className="animate-fade-up mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {BRAND_SHORT}
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-base text-white/85 md:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            {BRAND_SCHOOL_FULL} — sekolah vokasi yang menyiapkan talenta digital dan
            industri untuk Jawa Barat.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <Button asChild size="lg" variant="secondary">
              <Link href="/berita">Lihat berita</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/tentang">Tentang sekolah</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-[color:var(--color-heading)]">
              Sambutan Kepala Sekolah
            </h2>
            <p className="mt-4 text-[color:var(--color-body)]">
              Selamat datang di portal resmi {BRAND_SHORT}. Kami berkomitmen
              memberikan pendidikan vokasi yang relevan dengan dunia kerja,
              berlandaskan karakter, dan berorientasi pada kompetensi.
            </p>
            <p className="mt-6 font-semibold text-[color:var(--color-heading)]">
              {BRAND_KEPALA_NAMA}
            </p>
            <p className="text-sm text-[color:var(--color-body-subtle)]">
              {BRAND_KEPALA_JABATAN}
            </p>
          </div>
          <div className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-6">
            <ul className="space-y-3 text-sm text-[color:var(--color-body)]">
              <li>Akreditasi A · fokus vokasi & digital</li>
              <li>PPDB online & LMS hybrid</li>
              <li>Lokasi: Pamanukan, Subang, Jawa Barat</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] py-16">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-[color:var(--color-heading)]">
                Berita terbaru
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-body)]">
                Kegiatan, prestasi, dan pengumuman sekolah.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/berita">Semua berita</Link>
            </Button>
          </div>
          <BeritaCardGrid items={berita} />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 border border-[color:var(--color-border)] bg-white p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--color-heading)]">
              Siap bergabung dengan {BRAND_SHORT}?
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-body)]">
              Informasi PPDB dan kontak panitia tersedia di portal penerimaan.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="https://smkteknovo.sch.id/ppdb" target="_blank" rel="noreferrer">
              Buka PPDB
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
