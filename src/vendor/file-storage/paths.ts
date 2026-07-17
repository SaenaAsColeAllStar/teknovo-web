import { publicAssetUrl } from "@/lib/r2";

/**
 * URL aset statis situs publik (CDN R2: `R2_PUBLIC_URL`).
 * Object key di bucket = path tanpa leading slash, mis. `media/landing/hero/bg-01.webp`.
 */
const asset = (path: `/${string}`) => publicAssetUrl(path);

export type LandingHeroSlide = {
  id: string;
  label: string;
  bg: string;
  thumb: string;
  videoMp4: string;
};

export const LANDING_MEDIA = {
  hero: {
    /** Full-bleed beranda — slide pertama (preload / OG). */
    bg01Webp: asset("/media/landing/hero/bg-01.webp"),
    bg02Webp: asset("/media/landing/hero/bg-02.webp"),
    bg03Webp: asset("/media/landing/hero/bg-03.webp"),
    greetingWebp: asset("/media/landing/hero/greeting.webp"),
    slides: [
      {
        id: "kampus",
        label: "Kampus",
        bg: asset("/media/landing/hero/bg-01.webp"),
        thumb: asset("/media/landing/hero/slide-thumb-01.webp"),
        videoMp4: asset("/media/landing/hero/slide-01.mp4"),
      },
      {
        id: "praktik",
        label: "Praktik",
        bg: asset("/media/landing/hero/bg-02.webp"),
        thumb: asset("/media/landing/hero/slide-thumb-02.webp"),
        videoMp4: asset("/media/landing/hero/slide-02.mp4"),
      },
      {
        id: "kegiatan",
        label: "Kegiatan",
        bg: asset("/media/landing/hero/bg-03.webp"),
        thumb: asset("/media/landing/hero/slide-thumb-03.webp"),
        videoMp4: asset("/media/landing/hero/slide-03.mp4"),
      },
    ] as const satisfies readonly LandingHeroSlide[],
  },
  fasilitas: {
    absensiDigitalWebp: asset("/media/landing/fasilitas/absensi-digital.webp"),
    laboratoriumWebp: asset("/media/landing/fasilitas/laboratorium.webp"),
    perpustakaanWebp: asset("/media/landing/fasilitas/perpustakaan.webp"),
    lmsWebp: asset("/media/landing/fasilitas/lms.webp"),
  },
  kegiatan: {
    ekstraOsisWebp: asset("/media/landing/kegiatan/ekstra-osis.webp"),
    ekstraPramukaWebp: asset("/media/landing/kegiatan/ekstra-pramuka.webp"),
    ekstraPaskibrakaWebp: asset("/media/landing/kegiatan/ekstra-paskibraka.webp"),
    ekstraFutsalWebp: asset("/media/landing/kegiatan/ekstra-futsal.webp"),
    ekstraPencakSilatWebp: asset("/media/landing/kegiatan/ekstra-pencak-silat.webp"),
    ekstraBloggerClubWebp: asset("/media/landing/kegiatan/ekstra-blogger-club.webp"),
    ekstraCodingClubWebp: asset("/media/landing/kegiatan/ekstra-coding-club.webp"),
  },
  profil: {
    sejarahSekolahWebp: asset("/media/landing/profil/sejarah-sekolah.webp"),
  },
  ppdb: {
    heroWebp: asset("/media/landing/ppdb/hero.webp"),
  },
  misc: {
    aktivitasUmumWebp: asset("/media/landing/misc/aktivitas-umum.webp"),
  },
  berita: {
    ppdb2026Webp: asset("/media/landing/berita/cover-ppdb-2026.webp"),
    labKomputerWebp: asset("/media/landing/berita/cover-lab-komputer.webp"),
    lmsOnlineWebp: asset("/media/landing/berita/cover-lms-online.webp"),
    cbtOnlineWebp: asset("/media/landing/berita/cover-cbt-online.webp"),
    akreditasiAWebp: asset("/media/landing/berita/cover-akreditasi-a.webp"),
    jurusanTmWebp: asset("/media/landing/berita/cover-jurusan-tm.webp"),
    jurusanUlwWebp: asset("/media/landing/berita/cover-jurusan-ulw.webp"),
    profilSmkWebp: asset("/media/landing/berita/cover-profil-smk-teknovo.webp"),
    memilihSmkVokasiWebp: asset("/media/landing/berita/cover-memilih-smk-vokasi.webp"),
    tmProspekKerjaWebp: asset("/media/landing/berita/cover-tm-prospek-kerja.webp"),
    ulwPariwisataWebp: asset("/media/landing/berita/cover-ulw-pariwisata.webp"),
    pklIndustriWebp: asset("/media/landing/berita/cover-pkl-industri.webp"),
    lmsHybridWebp: asset("/media/landing/berita/cover-lms-hybrid.webp"),
    cbtTerintegrasiWebp: asset("/media/landing/berita/cover-cbt-terintegrasi.webp"),
    labBengkelWebp: asset("/media/landing/berita/cover-lab-bengkel.webp"),
    ekstrakurikulerWebp: asset("/media/landing/berita/cover-ekstrakurikuler.webp"),
    ppdbPanduanWebp: asset("/media/landing/berita/cover-ppdb-panduan.webp"),
    akreditasiCalonSiswaWebp: asset("/media/landing/berita/cover-akreditasi-calon-siswa.webp"),
    visiTeknovoWebp: asset("/media/landing/berita/cover-visi-teknovo.webp"),
  },
  notFoundHeroWebp: asset("/media/landing/404-hero.webp"),
  akademik: {
    jurusanTeknikMesinWebp: asset("/media/landing/akademik/jurusan-teknik-mesin.webp"),
    jurusanUlwWebp: asset("/media/landing/akademik/jurusan-ulw.webp"),
    pklKompetensiIndustriWebp: asset("/media/landing/akademik/pkl-kompetensi-industri.webp"),
  },
  navbar: {
    base: asset("/media/landing/navbar"),
    profilWebp: asset("/media/landing/navbar/profil.webp"),
    akademikWebp: asset("/media/landing/navbar/akademik.webp"),
    kesiswaanWebp: asset("/media/landing/navbar/kesiswaan.webp"),
    fasilitasWebp: asset("/media/landing/navbar/fasilitas.webp"),
    beritaWebp: asset("/media/landing/navbar/berita.webp"),
    kontakWebp: asset("/media/landing/navbar/kontak.webp"),
  },
} as const;

export const BRAND_MEDIA = {
  logoWebp: asset("/brand/logo.webp"),
  kepalaSekolahWebp: asset("/brand/kepala-sekolah.webp"),
  notFoundWebp: asset("/brand/404-teknovo.webp"),
} as const;

/** @deprecated Gunakan `BRAND_MEDIA.notFoundWebp` atau `SHARED_MEDIA.notFoundWebp`. */
export const SHARED_MEDIA = {
  notFoundWebp: asset("/media/shared/404-teknovo.webp"),
} as const;
