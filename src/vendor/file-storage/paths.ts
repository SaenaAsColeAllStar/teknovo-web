/**
 * URL path aset statis situs publik (tanpa domain).
 *
 * **Disk:** `public/media/...` di root monorepo.
 * App Next.js: setiap app punya folder public symlink ke public monorepo.
 */
export const LANDING_MEDIA = {
  hero: {
    welcomeJpg: "/media/landing/hero/welcome.jpg",
    greetingPng: "/media/landing/hero/greeting.png",
  },
  video: {
    heroSlides: [
      "/media/landing/video/hero-slide-1.mp4",
      "/media/landing/video/hero-slide-2.mp4",
      "/media/landing/video/hero-slide-3.mp4",
    ] as const,
  },
  fasilitas: {
    absensiDigitalJpg: "/media/landing/fasilitas/absensi-digital.jpg",
    laboratoriumJpg: "/media/landing/fasilitas/laboratorium.jpg",
    perpustakaanJpg: "/media/landing/fasilitas/perpustakaan.jpg",
    lmsJpg: "/media/landing/fasilitas/lms.jpg",
  },
  kegiatan: {
    ekstraOsisJpg: "/media/landing/kegiatan/ekstra-osis.jpg",
    ekstraPramukaJpg: "/media/landing/kegiatan/ekstra-pramuka.jpg",
    ekstraPaskibrakaJpg: "/media/landing/kegiatan/ekstra-paskibraka.jpg",
    ekstraFutsalJpg: "/media/landing/kegiatan/ekstra-futsal.jpg",
    ekstraPencakSilatJpg: "/media/landing/kegiatan/ekstra-pencak-silat.jpg",
    ekstraBloggerClubJpg: "/media/landing/kegiatan/ekstra-blogger-club.jpg",
    ekstraCodingClubJpg: "/media/landing/kegiatan/ekstra-coding-club.jpg",
  },
  profil: {
    sejarahSekolahJpg: "/media/landing/profil/sejarah-sekolah.jpg",
  },
  ppdb: {
    heroJpg: "/media/landing/ppdb/hero.jpg",
  },
  misc: {
    aktivitasUmumJpg: "/media/landing/misc/aktivitas-umum.jpg",
  },
  berita: {
    ppdb2026Webp: "/media/landing/berita/cover-ppdb-2026.webp",
    labKomputerWebp: "/media/landing/berita/cover-lab-komputer.webp",
    lmsOnlineWebp: "/media/landing/berita/cover-lms-online.webp",
    cbtOnlineWebp: "/media/landing/berita/cover-cbt-online.webp",
    akreditasiAWebp: "/media/landing/berita/cover-akreditasi-a.webp",
    jurusanTmWebp: "/media/landing/berita/cover-jurusan-tm.webp",
    jurusanUlwWebp: "/media/landing/berita/cover-jurusan-ulw.webp",
    profilSmkWebp: "/media/landing/berita/cover-profil-smk-teknovo.webp",
    memilihSmkVokasiWebp: "/media/landing/berita/cover-memilih-smk-vokasi.webp",
    tmProspekKerjaWebp: "/media/landing/berita/cover-tm-prospek-kerja.webp",
    ulwPariwisataWebp: "/media/landing/berita/cover-ulw-pariwisata.webp",
    pklIndustriWebp: "/media/landing/berita/cover-pkl-industri.webp",
    lmsHybridWebp: "/media/landing/berita/cover-lms-hybrid.webp",
    cbtTerintegrasiWebp: "/media/landing/berita/cover-cbt-terintegrasi.webp",
    labBengkelWebp: "/media/landing/berita/cover-lab-bengkel.webp",
    ekstrakurikulerWebp: "/media/landing/berita/cover-ekstrakurikuler.webp",
    ppdbPanduanWebp: "/media/landing/berita/cover-ppdb-panduan.webp",
    akreditasiCalonSiswaWebp: "/media/landing/berita/cover-akreditasi-calon-siswa.webp",
    visiTeknovoWebp: "/media/landing/berita/cover-visi-teknovo.webp",
  },
  notFoundHeroPng: "/media/landing/404-hero.png",
  akademik: {
    jurusanTeknikMesinWebp: "/media/landing/akademik/jurusan-teknik-mesin.webp",
    jurusanUlwWebp: "/media/landing/akademik/jurusan-ulw.webp",
    pklKompetensiIndustriWebp: "/media/landing/akademik/pkl-kompetensi-industri.webp",
  },
} as const;

export const BRAND_MEDIA = {
  notFoundPng: "/brand/404-teknovo.png",
} as const;

/** @deprecated Gunakan `BRAND_MEDIA.notFoundPng`. */
export const SHARED_MEDIA = {
  notFoundJpg: "/media/shared/404-teknovo.jpg",
} as const;
