import type { ReactElement, SVGProps } from "react";

type NotFoundLostIllustrationProps = SVGProps<SVGSVGElement>;

/**
 * Ilustrasi 404 — figur mencari/bertanya dengan tanda tanya besar.
 * Inline SVG, tanpa foto; warna Atlas (#1313BA / #E8E8F8).
 */
export function NotFoundLostIllustration({
  className,
  ...props
}: NotFoundLostIllustrationProps): ReactElement {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustrasi halaman tidak ditemukan"
      className={className}
      {...props}
    >
      {/* Soft ground / atmosphere */}
      <ellipse cx="260" cy="372" rx="168" ry="18" fill="#E8E8F8" opacity="0.9" />
      <circle cx="96" cy="88" r="42" fill="#E8E8F8" opacity="0.55" />
      <circle cx="430" cy="120" r="28" fill="#E8E8F8" opacity="0.7" />
      <circle cx="400" cy="300" r="16" fill="#E8E8F8" opacity="0.5" />

      {/* Oversized question marks */}
      <g fill="#1313BA" opacity="0.18">
        <path d="M78 48c0-26 18-44 46-44s46 18 46 44c0 20-10 30-24 40l-8 6v18h-28v-28l10-8c10-8 16-14 16-28 0-12-8-20-22-20s-22 8-22 20H78Zm36 108a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z" />
      </g>
      <g fill="#1313BA" opacity="0.28">
        <path d="M392 28c0-30 22-52 54-52s54 22 54 52c0 24-12 36-28 48l-10 8v22h-32V90l12-10c12-10 18-16 18-32 0-14-10-24-26-24s-26 10-26 24h-16Zm42 128a18 18 0 1 0 0 36 18 18 0 0 0 0-36Z" />
      </g>
      <g fill="#1313BA">
        <path d="M318 86c0-22 16-38 40-38s40 16 40 38c0 18-9 26-21 34l-7 5v16h-24v-24l9-7c9-7 14-12 14-24 0-10-7-16-19-16s-19 6-19 16h-13Zm31 96a14 14 0 1 0 0 28 14 14 0 0 0 0-28Z" />
      </g>

      {/* Character — searching pose (body leans, hand to chin) */}
      {/* Legs */}
      <path
        d="M222 300c4 28 10 52 14 64h22c-2-14-4-36-2-58l-34-6Z"
        fill="#0E0E8C"
      />
      <path
        d="M268 298c-2 30 2 54 8 66h22c-8-16-12-40-8-64l-22-2Z"
        fill="#1313BA"
      />
      {/* Shoes */}
      <ellipse cx="242" cy="368" rx="22" ry="7" fill="#0E0E8C" />
      <ellipse cx="290" cy="368" rx="20" ry="7" fill="#0E0E8C" />

      {/* Torso */}
      <path
        d="M214 198c8-36 36-56 62-52 28 4 48 30 50 64 2 28-6 52-18 68H230c-12-18-20-48-16-80Z"
        fill="#1313BA"
      />
      {/* Collar / shirt detail */}
      <path
        d="M248 210c6 8 14 12 24 12 8 0 16-4 22-10l-8 42h-32l-6-44Z"
        fill="#E8E8F8"
        opacity="0.85"
      />

      {/* Arm — hand to chin (thinking) */}
      <path
        d="M206 220c-18 8-32 28-34 48-2 14 4 26 14 30 6 2 12-2 14-8 4-12 10-24 20-32l-14-38Z"
        fill="#6363C6"
      />
      <ellipse cx="188" cy="298" rx="14" ry="12" fill="#9090CE" />

      {/* Other arm — slightly out, gesturing */}
      <path
        d="M314 230c22 4 40 22 46 42 4 12 0 24-10 28-8 4-16 0-20-8-6-14-14-26-26-34l10-28Z"
        fill="#6363C6"
      />
      <ellipse cx="352" cy="302" rx="13" ry="11" fill="#9090CE" />

      {/* Head */}
      <circle cx="268" cy="148" r="42" fill="#9090CE" />
      <circle cx="268" cy="152" r="36" fill="#E8E8F8" />

      {/* Hair */}
      <path
        d="M232 140c2-28 28-48 56-44 18 2 34 16 38 34-10-8-22-12-36-12-22 0-40 10-48 22h-10Z"
        fill="#0E0E8C"
      />
      <path
        d="M228 148c-4 0-8-4-6-10 4-10 14-14 22-12-8 6-12 14-16 22Z"
        fill="#0E0E8C"
      />

      {/* Face — curious / searching glance */}
      <ellipse cx="254" cy="152" rx="4.5" ry="5" fill="#0E0E8C" />
      <ellipse cx="282" cy="152" rx="4.5" ry="5" fill="#0E0E8C" />
      <path
        d="M258 172c6 6 14 8 22 6"
        stroke="#0E0E8C"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Raised brow */}
      <path
        d="M246 140c6-6 14-8 20-4"
        stroke="#0E0E8C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Small floating “?” near head */}
      <g fill="#1313BA" opacity="0.55">
        <path d="M198 108c0-12 8-20 20-20s20 8 20 20c0 9-4 13-10 17l-4 3v8h-12v-12l5-4c4-3 7-6 7-12 0-5-3-8-9-8s-9 3-9 8h-8Zm10 48a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
      </g>

      {/* Magnifying glass hint — lost / searching */}
      <g stroke="#1313BA" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35">
        <circle cx="148" cy="248" r="28" />
        <path d="M168 268l22 22" />
      </g>
    </svg>
  );
}
