import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AuthBleedSplitLayoutProps = {
  children: ReactNode;
  /** Left (xl) / first (narrow) social-proof column. */
  brandPanel: ReactNode;
  className?: string;
};

/**
 * Centered two-column auth shell (forgot / reset password).
 * xl (≥1280px): social proof | thin full-height divider | form.
 * Narrow: social proof stacked above the form, comfortable side padding.
 */
export function AuthBleedSplitLayout({
  children,
  brandPanel,
  className,
}: AuthBleedSplitLayoutProps): ReactElement {
  return (
    <main
      className={cn(
        "relative min-h-screen min-h-dvh overflow-hidden bg-[color:var(--color-neutral-soft)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, color-mix(in srgb, var(--color-brand) 8%, transparent), transparent 42%), radial-gradient(circle at 82% 78%, color-mix(in srgb, var(--color-brand) 6%, transparent), transparent 40%)",
        }}
      />

      <div className="public-site-container relative flex min-h-screen min-h-dvh w-full items-stretch py-10 sm:py-12">
        <div className="grid w-full grid-cols-1 items-stretch xl:grid-cols-2">
          <aside className="order-1 flex items-center border-[color:var(--color-border)] px-2 py-8 sm:px-4 xl:border-r xl:px-8 xl:py-12 2xl:px-10">
            <div className="w-full max-w-lg xl:pr-2">{brandPanel}</div>
          </aside>

          <section className="order-2 flex items-center px-2 py-8 sm:px-4 xl:px-8 xl:py-12 2xl:px-10">
            <div className="w-full max-w-[424px] xl:pl-2">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
