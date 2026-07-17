import type { ReactElement } from "react";

import { LocalSeoFaqSection } from "@/components/features/landing/local-seo/LocalSeoFaqSection";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { LOCAL_SEO_SCHOOL } from "@/lib/local-seo-keywords";

/** Halaman tentang dengan fakta bullet + FAQ — optimasi AI search. */
export function TentangSmkTeknovoShell(): ReactElement {
  return (
    <>
      <LocalSeoPageShell pageId="tentang-smk-teknovo" />
      <section className="public-site-container -mt-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Ringkasan fakta (dapat disitasi)
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <li>Nama resmi: SMK Teknologi dan Vokasional Miftahul Huda (SMK TEKNOVO)</li>
            <li>
              Alamat: {LOCAL_SEO_SCHOOL.streetAddress}, {LOCAL_SEO_SCHOOL.fullLocationLabel}{" "}
              {LOCAL_SEO_SCHOOL.postalCode}
            </li>
            <li>NPSN: {LOCAL_SEO_SCHOOL.npsn}</li>
            <li>Akreditasi: {LOCAL_SEO_SCHOOL.accreditation}</li>
            <li>Jurusan: Teknik Mesin (TM), Unit Layanan Wisata (ULW)</li>
            <li>Layanan: PPDB online, LMS hybrid, CBT ujian online, absensi digital</li>
            <li>
              Wilayah layanan: Pamanukan, Subang, Jawa Barat; informasi & PPDB untuk koridor
              Jakarta–Bekasi–Karawang (terbuka seluruh Indonesia)
            </li>
          </ul>
        </div>
        <LocalSeoFaqSection />
      </section>
    </>
  );
}
