import type { PublicSiteNavGroup } from "@/lib/public-site-nav";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type PublicSiteNavMegaPanelConfig = {
  imageSrc: string;
  imageAlt: string;
  headline: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export const PUBLIC_SITE_NAV_MEGA_PANELS: Record<PublicSiteNavGroup["id"], PublicSiteNavMegaPanelConfig> = {
  profil: {
    imageSrc: LANDING_MEDIA.navbar.profilWebp,
    imageAlt: "Lingkungan belajar SMK TEKNOVO",
    headline: "Kenali identitas, visi, dan program keahlian sekolah.",
    secondaryLabel: "Jelajahi sejarah sekolah",
    secondaryHref: "/profil/sejarah",
  },
  akademik: {
    imageSrc: LANDING_MEDIA.navbar.akademikWebp,
    imageAlt: "Kegiatan pembelajaran di SMK TEKNOVO",
    headline: "Kurikulum, jurusan, dan pengajar yang mendukung kompetensi siswa.",
    secondaryLabel: "Lihat program jurusan",
    secondaryHref: "/akademik/jurusan",
  },
  kesiswaan: {
    imageSrc: LANDING_MEDIA.navbar.kesiswaanWebp,
    imageAlt: "Kegiatan kesiswaan SMK TEKNOVO",
    headline: "Ekskul, prestasi, dan pengembangan karakter siswa.",
    secondaryLabel: "Lihat ringkasan kesiswaan",
    secondaryHref: "/kesiswaan",
  },
  fasilitas: {
    imageSrc: LANDING_MEDIA.navbar.fasilitasWebp,
    imageAlt: "Fasilitas pembelajaran di SMK TEKNOVO",
    headline: "Sarana belajar modern dari laboratorium hingga perpustakaan digital.",
    secondaryLabel: "Jelajahi perpustakaan digital",
    secondaryHref: "/fasilitas/perpustakaan-digital",
  },
  berita: {
    imageSrc: LANDING_MEDIA.navbar.beritaWebp,
    imageAlt: "Berita dan kegiatan sekolah SMK TEKNOVO",
    headline: "Pengumuman, artikel siswa, dan sorotan kegiatan sekolah.",
    secondaryLabel: "Baca berita terbaru",
    secondaryHref: "/berita/berita-terbaru",
  },
  kontak: {
    imageSrc: LANDING_MEDIA.navbar.kontakWebp,
    imageAlt: "Lokasi dan layanan hubungi SMK TEKNOVO",
    headline: "Kunjungi sekolah atau hubungi Tata Usaha untuk pertanyaan.",
    secondaryLabel: "Buka halaman kontak",
    secondaryHref: "/kontak",
  },
};
