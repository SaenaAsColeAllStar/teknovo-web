import { BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type BeritaSubNavItem = {
  id: string;
  label: string;
  href: `/berita/${string}`;
};

export const BERITA_PAGE_TITLE = "Berita" as const;

export const BERITA_PAGE_LEDE =
  `Arsip informasi ${BRAND_SHORT} untuk orang tua dan masyarakat: artikel siswa setelah redaksi, berita kegiatan resmi sekolah, dan sorotan kegiatan—diperbarui otomatis setelah publikasi.` as const;

export const BERITA_HERO_EYEBROW = "Arsip & pengumuman" as const;

export const BERITA_HERO_IMAGE_SRC = LANDING_MEDIA.kegiatan.ekstraBloggerClubWebp;

export const BERITA_TERBARU_PAGE_TITLE = "Berita terbaru" as const;

export const BERITA_TERBARU_PAGE_LEDE =
  "Informasi terkini sekolah: berita kegiatan resmi dan artikel siswa yang telah melalui redaksi—diurutkan dari yang terbaru." as const;

export const BERITA_KEGIATAN_PAGE_TITLE = "Berita kegiatan sekolah" as const;

export const BERITA_KEGIATAN_PAGE_LEDE =
  "Berita resmi kegiatan sekolah dari Humas dan pimpinan—ditampilkan di sini setelah proses persetujuan dan publikasi selesai." as const;

export const BERITA_HOME_ARCHIVE_EYEBROW = "Arsip berita" as const;

export const BERITA_HOME_ARCHIVE_TITLE = "Berita & Artikel" as const;

export const BERITA_HOME_ARCHIVE_LEDE =
  "Sorotan kegiatan sekolah, tulisan siswa setelah redaksi, dan pengumuman resmi—ikuti kabar terbaru dari SMK Teknovo." as const;

export const BERITA_HOME_ARCHIVE_LINK_LABEL = "Lihat semua berita" as const;

export const BERITA_HOME_READ_MORE_LABEL = "Baca selengkapnya" as const;

export const BERITA_BENTO_CTA_BACA = "Baca" as const;

export const BERITA_BENTO_CTA_LIHAT = "Lihat" as const;

export const BERITA_BLOG_SECTION_TITLE = "Berita kegiatan" as const;

export const BERITA_BLOG_SECTION_LEDE =
  "Pembaruan resmi kegiatan sekolah dari Humas dan pimpinan—dipublikasikan untuk orang tua dan masyarakat." as const;

export const BERITA_BLOG_AUTHOR_FALLBACK = "Humas sekolah" as const;

export const BERITA_EMPTY_TERBARU =
  "Belum ada berita yang dipublikasikan. Artikel siswa dan berita kegiatan resmi akan tampil di sini setelah redaksi dan persetujuan publikasi selesai." as const;

export const BERITA_EMPTY_KEGIATAN =
  "Belum ada berita kegiatan yang dipublikasikan. Entri resmi sekolah akan tampil di sini setelah mendapat persetujuan Kepala Sekolah." as const;

export const BERITA_EMPTY_KEGIATAN_CROSS =
  "Belum ada berita kegiatan yang terbit. Entri juga tampil di daftar berita terbaru setelah dipublikasikan." as const;

export const BERITA_ARTIKEL_KONTEN_FALLBACK =
  "Isi lengkap artikel akan ditampilkan setelah redaksi mempublikasikan dokumen ini." as const;

export const BERITA_SUB_NAV_ITEMS: readonly BeritaSubNavItem[] = [
  { id: "terbaru", label: "Terbaru", href: "/berita/berita-terbaru" },
  { id: "kegiatan", label: "Kegiatan", href: "/berita/kegiatan-sekolah" },
] as const;

/** Pemetaan hash lama (halaman tunggal) ke route dedicated. */
export const BERITA_LEGACY_HASH_TO_PATH: Readonly<Record<string, BeritaSubNavItem["href"]>> = {
  "berita-terbaru": "/berita/berita-terbaru",
  "berita-kegiatan": "/berita/kegiatan-sekolah",
};

export function getBeritaSubNavActiveHref(pathname: string): string | null {
  let winner: string | null = null;
  let winnerLen = -1;
  for (const item of BERITA_SUB_NAV_ITEMS) {
    const match = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (match && item.href.length > winnerLen) {
      winner = item.href;
      winnerLen = item.href.length;
    }
  }
  return winner;
}
