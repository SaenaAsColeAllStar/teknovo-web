import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AuthSplitLayoutProps = {
  children: ReactNode;
  /** Secondary column (illustration or marketing panel). */
  illustration: ReactNode;
  /**
   * Narrow-viewport secondary column. Defaults to `illustration`.
   * Shown below the form on viewports below `lg`.
   */
  mobileIllustration?: ReactNode;
  /**
   * On `lg+`, place the secondary column on the left (marketing-left layouts).
   * Narrow viewports always keep the form first.
   */
  illustrationFirst?: boolean;
  className?: string;
  /** Extra classes for the outer content shell (max-width container). */
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
        "relative min-h-screen min-h-dvh overflow-hidden bg-neutral-soft",
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
          "relative mx-auto flex min-h-screen min-h-dvh w-full max-w-[1280px] items-center px-4 py-10 sm:px-6 lg:px-10 xl:px-12",
          contentClassName,
        )}
      >
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div
            className={cn(
              illustrationFirst
                ? "order-1 w-full lg:order-2"
                : "flex justify-center lg:justify-end",
            )}
          >
            {children}
          </div>

          <div
            className={cn(
              "hidden lg:block",
              illustrationFirst ? "order-2 w-full lg:order-1" : "lg:flex lg:justify-start",
            )}
          >
            {illustration}
          </div>

          <div
            className={cn(
              "w-full lg:hidden",
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
