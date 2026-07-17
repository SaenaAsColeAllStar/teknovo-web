import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import { teknovoShellClasses } from "../tokens";
import { cn } from "../utils/cn";

export type AppShellVariant = "public" | "dashboard";

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AppShellVariant;
  children: ReactNode;
};

/** Root shell — layout konsisten landing (publik) dan console (dashboard). */
export function AppShell({
  variant = "dashboard",
  className,
  children,
  ...props
}: AppShellProps): ReactElement {
  const rootClass =
    variant === "public" ? teknovoShellClasses.publicRoot : teknovoShellClasses.dashboardRoot;
  return (
    <div className={cn(rootClass, className)} {...props}>
      {children}
    </div>
  );
}

export type AppShellBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Baris konten utama (sidebar slot + area kanan). */
export function AppShellBody({ className, children, ...props }: AppShellBodyProps): ReactElement {
  return (
    <div className={cn(teknovoShellClasses.bodyRow, className)} {...props}>
      {children}
    </div>
  );
}

export type AppShellMainProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  padded?: boolean;
};

/** Area konten halaman. */
export function AppShellMain({
  className,
  children,
  padded = false,
  ...props
}: AppShellMainProps): ReactElement {
  return (
    <main
      className={cn(
        padded ? teknovoShellClasses.dashboardMain : teknovoShellClasses.main,
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

export type AppShellContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Pembungkus lebar konten terbatas (dashboard container). */
export function AppShellContent({
  className,
  children,
  ...props
}: AppShellContentProps): ReactElement {
  return (
    <div className={cn(teknovoShellClasses.contentContainer, className)} {...props}>
      {children}
    </div>
  );
}
