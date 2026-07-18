import type { ReactElement } from "react";

import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { FourBandPageSlice } from "@/components/features/landing/FourBandPageSlice";
import {
  FASILITAS_FOOTER_CTA_KONTAK_HREF,
  FASILITAS_HUB_HERO_IMAGE_SRC,
  FASILITAS_PAGE_LEDE,
  FASILITAS_PAGE_TITLE,
  getFasilitasDetailPath,
} from "@/lib/fasilitas-landing-content";

const BAND_NAV = [
  { href: getFasilitasDetailPath("absensi-digital"), label: "Absensi" },
  { href: getFasilitasDetailPath("lms-sekolah"), label: "LMS" },
  { href: getFasilitasDetailPath("laboratorium-komputer"), label: "Lab" },
  { href: getFasilitasDetailPath("perpustakaan-digital"), label: "Perpus" },
] as const;

/** Short feature blurbs — same voice as home `#fasilitas` feature cards. */
const BAND_FEATURES = [
  {
    iconKey: "absensi-digital" as const,
    title: "Absensi Digital",
    body: "Tap masuk real-time, absensi per pertemuan, dan portal orang tua — kedisiplinan yang terhubung ke LMS.",
  },
  {
    iconKey: "lms-sekolah" as const,
    title: "LMS Sekolah",
    body: "Materi, tugas ber-deadline, dan evaluasi formatif — satu portal untuk guru, siswa, dan orang tua.",
  },
] as const;

/**
 * Four-band page slice for hub `#fasilitas` — top bar, intro split,
 * showcase photo, and two feature columns (absensi + LMS).
 */
export function FasilitasHubBands(): ReactElement {
  return (
    <FourBandPageSlice
      navLinks={BAND_NAV}
      cta={{ href: FASILITAS_FOOTER_CTA_KONTAK_HREF, label: "Jadwalkan tur" }}
      headline={"Sarana digital\nsiap dipakai"}
      support={FASILITAS_PAGE_LEDE}
      image={{
        src: FASILITAS_HUB_HERO_IMAGE_SRC,
        alt: `Ilustrasi ${FASILITAS_PAGE_TITLE} SMK TEKNOVO — laboratorium komputer`,
        priority: true,
      }}
      features={[
        {
          icon: <FasilitasIconGlyph iconKey={BAND_FEATURES[0].iconKey} className="size-5" />,
          title: BAND_FEATURES[0].title,
          body: BAND_FEATURES[0].body,
        },
        {
          icon: <FasilitasIconGlyph iconKey={BAND_FEATURES[1].iconKey} className="size-5" />,
          title: BAND_FEATURES[1].title,
          body: BAND_FEATURES[1].body,
        },
      ]}
    />
  );
}
