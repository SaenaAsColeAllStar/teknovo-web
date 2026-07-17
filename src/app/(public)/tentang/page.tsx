import type { Metadata } from "next";

import {
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tentang",
  description: `Profil ${BRAND_SCHOOL_FULL} — ${BRAND_SHORT}.`,
};

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-6">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--color-body-subtle)]">
          Profil sekolah
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[color:var(--color-heading)]">
          Tentang {BRAND_SHORT}
        </h1>
        <p className="mt-4 text-lg text-[color:var(--color-body)]">
          {BRAND_SCHOOL_FULL} adalah SMK vokasi di Pamanukan, Subang, Jawa Barat,
          dengan fokusatan pada kompetensi digital, karakter, dan kesiapan kerja.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="border border-[color:var(--color-border)] bg-white p-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-heading)]">
            Visi
          </h2>
          <p className="mt-3 text-[color:var(--color-body)]">
            Menjadi sekolah vokasi unggulan yang menghasilkan lulusan kompeten,
            berkarakter, dan siap menghadapi tantangan industri 4.0.
          </p>
        </section>
        <section className="border border-[color:var(--color-border)] bg-white p-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-heading)]">
            Misi
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[color:var(--color-body)]">
            <li>Menyelenggarakan pendidikan vokasi berbasis kompetensi</li>
            <li>Mengintegrasikan teknologi digital dalam pembelajaran</li>
            <li>Membangun kemitraan industri dan dunia kerja</li>
            <li>Menumbuhkan karakter dan budaya kerja profesional</li>
          </ul>
        </section>
      </div>

      <section className="mt-8 border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-8">
        <h2 className="text-xl font-semibold text-[color:var(--color-heading)]">
          Pimpinan
        </h2>
        <p className="mt-3 font-medium text-[color:var(--color-heading)]">
          {BRAND_KEPALA_NAMA}
        </p>
        <p className="text-sm text-[color:var(--color-body-subtle)]">
          {BRAND_KEPALA_JABATAN}
        </p>
      </section>
    </div>
  );
}
