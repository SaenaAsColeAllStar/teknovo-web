/**
 * Lapisan lebar penuh untuk section konten publik — `main` + `.public-site-container` (full-bleed di landing).
 */
export const publicSectionShellBase =
  "w-full min-w-0 scroll-mt-20 border-b border-slate-200 dark:border-slate-800";

/** Sambutan kepala sekolah — border sedikit lebih halus */
export const publicSectionShellSambutanClassName =
  "w-full min-w-0 scroll-mt-20 border-b border-slate-200/90 dark:border-slate-800";

/** Kesiswaan, Akademik (latar slate lembut) */
export const publicContentSectionClassName = `${publicSectionShellBase} bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-20`;

/** Berita, Visi & Misi, Program Sekolah, Sejarah, dll. */
export const publicPageSectionWhiteClassName = `${publicSectionShellBase} bg-white py-16 dark:bg-slate-950 sm:py-20`;

/** Halaman Kontak */
export const publicPageSectionContactClassName = `${publicSectionShellBase} bg-slate-100 py-14 dark:bg-slate-950 sm:py-16`;

/** Paragraf isi publik formal: rata kiri–kanan (justifikasi). Jangan dipakai pada blok `text-center`. */
export const publicFormalBodyClassName = "text-justify text-pretty";

/** Intro paragraf di header section terpusat — selaras dengan `text-center` pada parent. */
export const publicSectionIntroClassName = "text-center text-pretty";

/** Eyebrow halaman hero (h1) — selaras `PublicPageHero`. */
export const publicPageHeroEyebrowClassName =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300";

/** Judul halaman hero (h1). */
export const publicPageHeroTitleClassName =
  "mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl";

/** Lede halaman hero — gabungkan dengan `publicSectionIntroClassName` bila perlu. */
export const publicPageHeroLedeClassName =
  "mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300";

/** Eyebrow sub-section dalam halaman (h2). */
export const publicSectionEyebrowClassName =
  "text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400";

/** Judul sub-section dalam halaman (h2). */
export const publicSectionTitleClassName =
  "text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl";
