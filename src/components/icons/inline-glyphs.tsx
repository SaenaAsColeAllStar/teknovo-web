import type { SVGProps } from "react";

export type GlyphProps = SVGProps<SVGSVGElement>;

function cx(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

/** Spinner — lingkaran putus-putus, pakai `animate-spin` pada elemen svg. */
export function IcoLoader({ className, ...p }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cx("shrink-0", className)}
      aria-hidden
      {...p}
    >
      <path d="M12 3a9 9 0 1 0 9 9" opacity={0.35} />
      <path d="M12 3a9 9 0 0 1 8.49 5.97" />
    </svg>
  );
}

export function IcoPlus({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IcoMinus({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Panah naik-kanan — tautan eksternal / sorotan. */
export function IcoArrowUpRight({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Pena singkat — kredit penulis artikel. */
export function IcoPenLine({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m13.5 6.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Simpan — bidang arsip & sumbu vertikal. */
export function IcoSave({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 4h11l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 4v5h8V4M8 17h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function IcoSend({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M3.5 12 21 4 13 20l-2.5-6L3.5 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="m13 14 3-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IcoRefresh({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M20 12a8 8 0 0 1-14.32 4.906M4 12a8 8 0 0 1 14.32-4.906"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 4v4h4M20 20v-4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IcoMessage({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5l-5 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IcoUsers({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17 11a3 3 0 1 0 0-6M21 20v-1a4 4 0 0 0-2.5-3.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IcoHash({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M10 4 7 20M17 4l-3 16M4 9h16M3 15h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IcoReceipt({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M7 4h10l1 2v14l-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1V6l1-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 9h6M9 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IcoAlert({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M12 3 2 19h20L12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IcoX({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IcoChevronRight({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcoChevronLeft({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcoTrash({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 7h16M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M6 7l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IcoQr({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M14 14h3v3M17 14v3h-3M14 21h7v-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IcoWifiOn({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M5 9c4.5-4 9.5-4 14 0M8.5 12.5a7 7 0 0 1 7 0M12 21l1-1.2a2 2 0 0 0-2 0L12 21Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IcoWifiOff({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M2 2l20 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M8.5 12.5a7 7 0 0 1 3-1.7M12 21l1-1.2M16.7 11a8 8 0 0 0-2.1-1.3M5 9a12 12 0 0 1 3.5-2.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IcoLogOut({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M14 8l4 4-4 4M10 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Ornamen abstrak pendidikan — nodes + busur (dekorasi halaman login). */
export function WasenderHeroGlyph({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 400 320" fill="none" className={cx("w-full max-w-md", className)} aria-hidden {...p}>
      <defs>
        <linearGradient id="ws-h1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(56 189 248 / 0.35)" />
          <stop offset="100%" stopColor="rgb(16 185 129 / 0.25)" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" rx="24" fill="url(#ws-h1)" opacity={0.5} />
      <circle cx="80" cy="70" r="36" stroke="rgb(148 163 184 / 0.5)" strokeWidth="1.5" />
      <circle cx="200" cy="120" r="52" stroke="rgb(148 163 184 / 0.35)" strokeWidth="1.25" />
      <circle cx="310" cy="90" r="28" stroke="rgb(148 163 184 / 0.45)" strokeWidth="1.5" />
      <path
        d="M120 200c40-48 120-48 160 0M160 240c24-28 72-28 96 0"
        stroke="rgb(100 116 139 / 0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="170" y="48" width="60" height="8" rx="4" fill="rgb(148 163 184 / 0.35)" />
      <rect x="150" y="200" width="100" height="6" rx="3" fill="rgb(148 163 184 / 0.25)" />
    </svg>
  );
}

/** Pencarian — busur kompas & sumbu (bukan kaca pembesar harfiah). */
export function IcoSearchArc({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 11h5M11 8.5v5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

/** Kotak kosong — lekukan arsitektur & horizon (empty state). */
export function IcoEmptyHorizon({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M4 8h16l-2 12H6L4 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 8c4-3 12-3 16 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M8 14h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

/** Mode pantau — mata abstrak (busur kelopak, tanpa pupil bulat). */
export function IcoReadOnlyLens({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 5l2 2M19 19l-2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.55} />
    </svg>
  );
}

/** Fasilitas — busur produksi & titik keseimbangan (praktik kejuruan). */
export function IcoFasilitasBengkelFlux({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 17a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11c2.5-4 5.5-4 8 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

/** Chevron — busur lipat (progressive disclosure). */
export function IcoChevronDown({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Peringatan — segitiga cahaya & titik fokus. */
export function IcoAlertFocus({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M12 5l7 12H5L12 5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="0.75" fill="currentColor" />
    </svg>
  );
}

/** Siswa aktif — busur komunitas & sumbu vertikal (kesiswaan). */
export function IcoKsStudentsArc({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/** PPDB — gerbang penerimaan (busur & bidang). */
export function IcoKsEnrollmentGate({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 20V8l7-4 7 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

/** Kedisiplinan — sumbu keseimbangan & titik fokus. */
export function IcoKsDisciplineAxis({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="16" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/** Prestasi — segmen mahkota geometris (bukan piala harfiah). */
export function IcoKsLaurelFacet({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 6l2 4 4 .5-3 3 .8 4.5L12 16l-3.8 2.5.8-4.5-3-3 4-.5 2-4z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M8 19c1.5-1 3.5-1 4 0 0.5 1 2.5 1 4 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.55} />
    </svg>
  );
}

/** Arus kas / ledger — lipatan lembar & sumbu (TU keuangan). */
export function IcoTuLedgerFold({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 8h12v10H6V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6h8l2 2H6l2-2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.55} />
    </svg>
  );
}

/** Inventaris — tumpukan bidang & sumbu vertikal. */
export function IcoTuInventarisStack({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 14h6v6H5v-6zM13 10h6v10h-6V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 4h6v4H9V4z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" opacity={0.7} />
    </svg>
  );
}

/** Agenda surat — garis alur horizontal. */
export function IcoTuAgendaLine({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 7h14M5 12h10M5 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="12" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Penerimaan hari ini — denyut radial. */
export function IcoTuCashPulse({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9v6M10 11h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M4 12a8 8 0 0116 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.35} />
    </svg>
  );
}

/** Fasilitas — kisi orbit & sumbu (sarana digital). */
export function IcoFasilitasOrbitLattice({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Unduh — panah ke bidang dasar. */
export function IcoDownloadArc({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Server / koneksi — nodus & rel. */
export function IcoServerNode({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <rect x="4" y="5" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="14" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5h.01M8 16.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Basis data — silinder abstrak. */
export function IcoDatabaseVault({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <ellipse cx="12" cy="7" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7v10c0 1.66 3.13 3 7 3s7-1.34 7-3V7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" stroke="currentColor" strokeWidth="1.25" opacity={0.5} />
    </svg>
  );
}

/** Migrasi — grid & sumbu. */
export function IcoSchemaGrid({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 5h6v6H5V5zM13 5h6v6h-6V5zM5 13h6v6H5v-6zM13 13h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

/** Cadangan — arsip melengkung. */
export function IcoArchiveVault({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 5h8l2 3H6l2-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Visi — cakrawala & sumbu arah (profil sekolah). */
export function IcoProfileVisiHorizon({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 17a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.25" fill="currentColor" />
      <path d="M8 9l4-2 4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

/** Integritas — dua busur selaras (nilai karakter). */
export function IcoProfileIntegritasBond({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 12c2-4 10-4 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16c2 4 10 4 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/** Sejarah — sumbu waktu & nodus tonggak (profil sekolah). */
export function IcoProfileSejarahSpine({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="17" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7h2M14 12h2M8 17h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/** Sejarah — bidang & titik lokasi abstrak (fakta kampus). */
export function IcoProfileSejarahLocale({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 18 12 6l7 12H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="1.25" fill="currentColor" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.35} />
    </svg>
  );
}

/** Sejarah — heliks narasi (perjalanan institusi). */
export function IcoProfileSejarahNarrative({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M7 8c3-2 7-2 10 0s3 6 0 8-7 2-10 0-3-6 0-8Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M9 16c2 2 4 2 6 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

/** Backup — panah naik ke vault. */
export function IcoBackupPulse({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 16V6M8.5 9.5 12 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

/** Menu overflow — tiga titik pada lengkungan horizontal (bukan ikon generik). */
export function IcoMenuOverflowArc({ className, ...p }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity={0.35}
      />
      <circle cx="7" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="17" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}
