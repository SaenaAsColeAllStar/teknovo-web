import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ForgotPasswordBleedLayoutProps = {
  children: ReactNode;
  brandPanel: ReactNode;
  className?: string;
};

/**
 * Full-bleed auth split for forgot-password.
 * Edge-to-edge columns — no outer max-width shell. Large (~1280+): form | brand.
 * Narrow: form first, brand below.
 */
export function ForgotPasswordBleedLayout({
  children,
  brandPanel,
  className,
}: ForgotPasswordBleedLayoutProps): ReactElement {
  return (
    <main
      className={cn(
        "grid min-h-screen min-h-dvh w-full grid-cols-1 bg-[color:var(--color-surface)] xl:grid-cols-2",
        className,
      )}
    >
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 xl:px-12 2xl:px-16">
        <div className="w-full max-w-[424px]">{children}</div>
      </section>

      <aside className="flex items-center justify-center bg-[color:var(--color-brand)] px-6 py-14 text-white sm:px-10 xl:px-12 2xl:px-16">
        <div className="w-full max-w-md">{brandPanel}</div>
      </aside>
    </main>
  );
}
