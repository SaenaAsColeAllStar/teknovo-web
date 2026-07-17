import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ForgotPasswordBleedLayoutProps = {
  children: ReactNode;
  /** Right (large) / below (narrow) branded marketing column. */
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
        "grid min-h-screen min-h-dvh w-full grid-cols-1 bg-[color:var(--color-background)] lg:grid-cols-2",
        className,
      )}
    >
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-[424px]">{children}</div>
      </section>

      <aside className="flex items-center justify-center bg-brand px-6 py-14 text-white sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-md">{brandPanel}</div>
      </aside>
    </main>
  );
}
