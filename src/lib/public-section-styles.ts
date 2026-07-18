/**
 * Lapisan section konten publik — shell full-width; isi di dalam `.public-site-container`
 * (max-w-7xl / 1280px, selaras navbar).
 * Atlas tokens: flat `#E8E8F8` border, surface white — no slate/dark chrome.
 */
export const publicSectionShellBase =
  "w-full min-w-0 scroll-mt-20 border-b border-border-default";

/** Sambutan kepala sekolah */
export const publicSectionShellSambutanClassName =
  "w-full min-w-0 scroll-mt-20 border-b border-border-default";

/** Kesiswaan & soft content bands */
export const publicContentSectionClassName = `${publicSectionShellBase} bg-neutral-soft py-16 sm:py-20`;

/** Berita, Visi & Misi, Program Sekolah, Sejarah, Akademik, dll. */
export const publicPageSectionWhiteClassName = `${publicSectionShellBase} bg-surface py-16 sm:py-20`;

/** Halaman Kontak */
export const publicPageSectionContactClassName = `${publicSectionShellBase} bg-neutral-soft py-14 sm:py-16`;
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
