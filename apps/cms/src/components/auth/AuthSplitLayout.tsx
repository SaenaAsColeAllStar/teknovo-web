import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AuthSplitLayoutProps = {
  children: ReactNode;
  illustration: ReactNode;
  mobileIllustration?: ReactNode;
  illustrationFirst?: boolean;
  className?: string;
  contentClassName?: string;
};

/**
 * Two-column auth chrome: form + aside, vertically centered in a ~1280px shell.
 * Narrow: form first, aside second. Large: optional `illustrationFirst` flips columns.
 */
export function AuthSplitLayout({
  children,
  illustration,
  mobileIllustration,
  illustrationFirst = false,
  className,
  contentClassName,
}: AuthSplitLayoutProps): ReactElement {
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

      <div
        className={cn(
          "public-site-container relative flex min-h-screen min-h-dvh w-full items-center py-10 sm:py-12",
          contentClassName,
        )}
      >
        <div className="grid w-full items-center gap-10 xl:grid-cols-2 xl:gap-14 2xl:gap-16">
          <div
            className={cn(
              illustrationFirst
                ? "order-1 w-full xl:order-2"
                : "flex justify-center xl:justify-end",
            )}
          >
            {children}
          </div>

          <div
            className={cn(
              "hidden xl:block",
              illustrationFirst ? "order-2 w-full xl:order-1" : "xl:flex xl:justify-start",
            )}
          >
            {illustration}
          </div>

          <div
            className={cn(
              "w-full xl:hidden",
              illustrationFirst ? "order-2" : "flex justify-center",
            )}
          >
            {mobileIllustration ?? illustration}
          </div>
        </div>
      </div>
    </main>
  );
}
