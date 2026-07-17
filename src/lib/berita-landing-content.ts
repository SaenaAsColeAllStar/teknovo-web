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
  "Gabungan tulisan siswa yang disetujui redaksi dan berita kegiatan resmi sekolah—diurutkan dari yang terbaru." as const;

export const BERITA_KEGIATAN_PAGE_TITLE = "Berita kegiatan sekolah" as const;

export const BERITA_KEGIATAN_PAGE_LEDE =
  "Berita resmi kegiatan sekolah dari Humas dan pimpinan—ditampilkan di sini setelah proses persetujuan dan publikasi selesai." as const;

export const BERITA_HOME_ARCHIVE_EYEBROW = "Arsip berita" as const;

export const BERITA_HOME_ARCHIVE_TITLE = "Artikel siswa & berita sekolah" as const;

export const BERITA_HOME_ARCHIVE_LEDE =
  "Tulisan siswa yang telah disetujui redaksi dan berita kegiatan resmi—satu arsip untuk mengikuti kehidupan sekolah." as const;

export const BERITA_HOME_ARCHIVE_LINK_LABEL = "Lihat semua berita" as const;

export const BERITA_EMPTY_TERBARU =
  "Belum ada berita yang dipublikasikan. Artikel siswa dan berita kegiatan akan tampil di sini setelah proses redaksi dan persetujuan selesai." as const;

export const BERITA_EMPTY_KEGIATAN =
  "Belum ada berita kegiatan yang terbit. Entri resmi sekolah akan muncul di sini setelah disetujui Kepala Sekolah." as const;

export const BERITA_EMPTY_KEGIATAN_CROSS =
  "Belum ada berita kegiatan yang terbit. Entri juga tampil di daftar berita terbaru setelah dipublikasikan." as const;

export const BERITA_ARTIKEL_KONTEN_FALLBACK =
  "Isi lengkap artikel akan ditampilkan setelah redaksi mempublikasikan dokumen ini." as const;

export const BERITA_SUB_NAV_ITEMS: readonly BeritaSubNavItem[] = [
  { id: "terbaru", label: "Berita terbaru", href: "/berita/berita-terbaru" },
  { id: "kegiatan", label: "Berita kegiatan sekolah", href: "/berita/kegiatan-sekolah" },
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
