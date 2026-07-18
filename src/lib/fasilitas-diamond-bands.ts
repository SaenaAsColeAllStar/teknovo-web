import {
  ABSENSI_INTEGRATION_ITEMS,
  ABSENSI_INTEGRATION_SECTION_INTRO,
  ABSENSI_INTEGRATION_SECTION_TITLE,
  ABSENSI_LANDING_ITEM,
} from "@/lib/fasilitas-absensi-content";
import {
  getFasilitasItem,
  type FasilitasSlug,
} from "@/lib/fasilitas-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type DiamondSplitBand = {
  id: string;
  title: string;
  body: string;
  checklist: readonly string[];
  closing?: string;
  imageSrc: string;
  imageAlt: string;
};

export type DiamondSplitBandPair = readonly [DiamondSplitBand, DiamondSplitBand];

const ABSENSI_DIAMOND_BANDS: DiamondSplitBandPair = [
  {
    id: "kehadiran-terpadu",
    title: "Dari tap masuk hingga portal orang tua",
    body:
      ABSENSI_LANDING_ITEM.paragraphs[0] ??
      "Tap masuk real-time, absensi per pertemuan, dan portal orang tua — kedisiplinan yang terhubung ke LMS.",
    checklist: ABSENSI_LANDING_ITEM.highlights,
    closing:
      "Kehadiran terpadu menggantikan lembar manual dengan cap waktu konsisten di seluruh ekosistem sekolah.",
    imageSrc: LANDING_MEDIA.fasilitas.absensiDigitalWebp,
    imageAlt: "Sistem absensi digital SMK TEKNOVO",
  },
  {
    id: "integrasi-ekosistem",
    title: ABSENSI_INTEGRATION_SECTION_TITLE,
    body: ABSENSI_INTEGRATION_SECTION_INTRO,
    checklist: ABSENSI_INTEGRATION_ITEMS.map((line) => {
      const head = line.split(" — ")[0]?.trim();
      return head && head.length > 0 && head.length <= 64 ? head : line.slice(0, 64);
    }),
    closing:
      ABSENSI_LANDING_ITEM.paragraphs[3] ??
      "Terhubung ke LMS, rapor digital, dan program kedisiplinan dalam satu ekosistem TEKNOVO.",
    imageSrc: LANDING_MEDIA.fasilitas.lmsWebp,
    imageAlt: "Integrasi absensi digital dengan LMS sekolah",
  },
];

function labDiamondBands(): DiamondSplitBandPair {
  const item = getFasilitasItem("laboratorium-komputer")!;
  return [
    {
      id: "lab-praktik",
      title: "Ruang praktik siap produksi",
      body: item.paragraphs[0] ?? item.description,
      checklist: item.highlights,
      closing: item.paragraphs[2],
      imageSrc: LANDING_MEDIA.fasilitas.laboratoriumWebp,
      imageAlt: "Laboratorium komputer SMK TEKNOVO",
    },
    {
      id: "lab-proyek",
      title: "Proyek kejuruan & jembatan industri",
      body: item.paragraphs[1] ?? item.description,
      checklist: (item.features ?? []).map((f) => f.title),
      closing:
        "Capaian praktik terhubung rubrik kompetensi, portofolio UKK, dan workshop mitra di ruang lab yang sama.",
      imageSrc: LANDING_MEDIA.berita.labKomputerWebp,
      imageAlt: "Praktik dan proyek di laboratorium komputer",
    },
  ];
}

function perpusDiamondBands(): DiamondSplitBandPair {
  const item = getFasilitasItem("perpustakaan-digital")!;
  return [
    {
      id: "perpus-katalog",
      title: "Katalog daring & ruang baca",
      body: item.paragraphs[0] ?? item.description,
      checklist: item.highlights,
      closing: item.paragraphs[2],
      imageSrc: LANDING_MEDIA.fasilitas.perpustakaanWebp,
      imageAlt: "Perpustakaan digital SMK TEKNOVO",
    },
    {
      id: "perpus-literasi",
      title: "Literasi digital terhubung LMS",
      body: item.paragraphs[1] ?? item.description,
      checklist: (item.features ?? []).map((f) => f.title),
      closing:
        "Koleksi, ruang baca, dan literasi media mendukung tugas sekolah serta materi yang sama di LMS.",
      imageSrc: LANDING_MEDIA.fasilitas.lmsWebp,
      imageAlt: "Literasi digital dan materi LMS sekolah",
    },
  ];
}

function lmsDiamondBands(): DiamondSplitBandPair {
  const item = getFasilitasItem("lms-sekolah")!;
  const narrative = item.splitNarrative;
  return [
    {
      id: "lms-platform",
      title: "Materi, tugas, dan evaluasi dalam satu portal",
      body: item.paragraphs[0] ?? item.description,
      checklist: item.highlights,
      closing: item.paragraphs[2],
      imageSrc: LANDING_MEDIA.fasilitas.lmsWebp,
      imageAlt: "Platform LMS sekolah SMK TEKNOVO",
    },
    {
      id: "lms-tiga-pengguna",
      title: narrative?.title ?? "Satu platform, tiga pengguna",
      body: narrative?.paragraphs[0] ?? item.paragraphs[1] ?? item.description,
      checklist: (item.services ?? []).map((s) => s.audience),
      closing: narrative?.paragraphs[1],
      imageSrc: LANDING_MEDIA.fasilitas.absensiDigitalWebp,
      imageAlt: "Portal guru, siswa, dan orang tua di ekosistem TEKNOVO",
    },
  ];
}

const BY_SLUG_BUILDERS: Record<FasilitasSlug, () => DiamondSplitBandPair> = {
  "absensi-digital": () => ABSENSI_DIAMOND_BANDS,
  "laboratorium-komputer": labDiamondBands,
  "perpustakaan-digital": perpusDiamondBands,
  "lms-sekolah": lmsDiamondBands,
};

export function getFasilitasDiamondBands(slug: FasilitasSlug): DiamondSplitBandPair {
  return BY_SLUG_BUILDERS[slug]();
}
