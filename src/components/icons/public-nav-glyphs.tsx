import type { SVGProps } from "react";

export type PublicNavGlyphProps = SVGProps<SVGSVGElement>;

function cx(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

/** Beranda — lengkungan atap & sumbu. */
export function GlyphDockBeranda({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 11.5 12 5l7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 11.5V18h9v-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Fasilitas — kolom & busur ruang. */
export function GlyphDockFasilitas({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 18V9.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M9 12.5h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Akademik — kompas meridian. */
export function GlyphDockAkademik({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5.5v13M5.5 12h13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/** Kesiswaan — orbit & simpul. */
export function GlyphDockKesiswaan({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6.5 16.5a7 7 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 11.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}

/** Prestasi — puncak & busur pencapaian. */
export function GlyphDockPrestasi({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 17V11.5l3.5-4 3.5 4V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** PPDB — portal lengkung. */
export function GlyphDockPpdb({ className, ...p }: PublicNavGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cx("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 18V9a6 6 0 0 1 12 0v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 18v-4.5a2.5 2.5 0 0 1 5 0V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 9.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
