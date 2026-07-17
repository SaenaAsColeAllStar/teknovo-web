import type { ReactElement } from "react";

import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

type TeknovoServerErrorPageProps = {
  /** Optional App Router `reset()` from `error.tsx` / `global-error.tsx`. */
  reset?: () => void;
  className?: string;
};

/**
 * Halaman 500 bermerek SMK Teknovo — satu stack vertikal di tengah viewport.
 * Atlas: brand, border-default, sudut siku.
 */
export function TeknovoServerErrorPage({
  reset,
  className,
}: TeknovoServerErrorPageProps): ReactElement {
  return (
    <section
      aria-labelledby="teknovo-server-error-heading"
      className={cn(
        "flex min-h-dvh w-full flex-col items-center justify-center bg-neutral-soft px-5 py-12 sm:px-8",
        className,
      )}
    >
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <img
          src={BRAND_LOGO_SRC}
          alt={`Lambang ${BRAND_SHORT}`}
          width={48}
          height={48}
          className="size-12 shrink-0 object-contain"
          decoding="async"
        />

        <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-brand">
          {BRAND_SHORT}
        </p>

        <h1
          id="teknovo-server-error-heading"
          className="mt-8 text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl"
        >
          500 / Server sedang bermasalah
        </h1>

        <p className="mt-3 text-pretty text-sm font-medium leading-relaxed text-body sm:text-base">
          Tenang — ini di pihak kami, bukan kamu.
        </p>

        <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-body-subtle sm:text-[0.9375rem]">
          Situs sedang mengalami gangguan teknis. Kami sedang memperbaikinya dan
          akan kembali dengan layanan yang lebih baik.
        </p>

        {reset ? (
          <button
            type="button"
            onClick={reset}
            className={cn(
              "mt-8 inline-flex min-h-10 items-center justify-center border border-border-default bg-surface px-4 text-sm font-medium text-heading",
              "transition-colors hover:border-brand/35 hover:bg-border-default/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
            )}
          >
            Coba lagi
          </button>
        ) : null}
      </div>
    </section>
  );
}
