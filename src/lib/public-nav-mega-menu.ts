import type { PublicSiteNavGroup } from "@/lib/public-site-nav";

const NAVBAR_MEDIA_BASE = "/media/landing/navbar" as const;

export type PublicSiteNavMegaPanelConfig = {
  imageSrc: string;
  imageAlt: string;
  headline: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export const PUBLIC_SITE_NAV_MEGA_PANELS: Record<PublicSiteNavGroup["id"], PublicSiteNavMegaPanelConfig> = {
  profil: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-profil.webp`,
    imageAlt: "Lingkungan belajar SMK TEKNOVO",
    headline: "Kenali identitas, visi, dan program keahlian sekolah.",
    secondaryLabel: "Jelajahi sejarah sekolah",
    secondaryHref: "/profil/sejarah",
  },
  akademik: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-akademik.webp`,
    imageAlt: "Kegiatan pembelajaran di SMK TEKNOVO",
    headline: "Kurikulum, jurusan, dan pengajar yang mendukung kompetensi siswa.",
    secondaryLabel: "Lihat program jurusan",
    secondaryHref: "/akademik/jurusan",
  },
  kesiswaan: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-kesiswaan.webp`,
    imageAlt: "Kegiatan kesiswaan SMK TEKNOVO",
    headline: "Ekskul, prestasi, dan pengembangan karakter siswa.",
    secondaryLabel: "Lihat ringkasan kesiswaan",
    secondaryHref: "/kesiswaan",
  },
  fasilitas: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-fasilitas.webp`,
    imageAlt: "Fasilitas pembelajaran di SMK TEKNOVO",
    headline: "Sarana belajar modern dari laboratorium hingga perpustakaan digital.",
    secondaryLabel: "Jelajahi perpustakaan digital",
    secondaryHref: "/fasilitas/perpustakaan-digital",
  },
  berita: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-berita.webp`,
    imageAlt: "Berita dan kegiatan sekolah SMK TEKNOVO",
    headline: "Pengumuman, artikel siswa, dan sorotan kegiatan sekolah.",
    secondaryLabel: "Baca berita terbaru",
    secondaryHref: "/berita/berita-terbaru",
  },
  kontak: {
    imageSrc: `${NAVBAR_MEDIA_BASE}/nav-kontak.webp`,
    imageAlt: "Lokasi dan layanan hubungi SMK TEKNOVO",
    headline: "Kunjungi sekolah atau hubungi Tata Usaha untuk pertanyaan.",
    secondaryLabel: "Buka halaman kontak",
    secondaryHref: "/kontak",
  },
};
