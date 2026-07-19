import { ArrowLeft } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { AuthSplitLayout } from "./AuthSplitLayout";
import { SignInLoginIllustration } from "./SignInLoginIllustration";
import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

/** Public marketing site — override with `VITE_WEB_ORIGIN` on Pages if needed. */
export const CMS_WEB_ORIGIN = (
  (import.meta.env.VITE_WEB_ORIGIN as string | undefined) ||
  (import.meta.env.PUBLIC_SITE_URL as string | undefined) ||
  "https://smkteknovo.sch.id"
).replace(/\/$/, "");

export type SignInViewProps = {
  heading: string;
  /** Supporting sentence; may include an inline sign-up link. */
  subtitle?: ReactNode;
  inviteOnlyBanner?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Sign-in visual shell: form card (left) + vector illustration (right) at xl ≥1280px.
 * Narrow: form first; illustration below (or hidden below xl via AuthSplitLayout).
 */
export function SignInView({
  heading,
  subtitle,
  inviteOnlyBanner = false,
  children,
  className,
}: SignInViewProps): ReactElement {
  const illustration = <SignInLoginIllustration className="w-full" />;
  const webHost = CMS_WEB_ORIGIN.replace(/^https?:\/\//, "");

  return (
    <AuthSplitLayout
      className={className}
      illustration={illustration}
      mobileIllustration={
        <SignInLoginIllustration className="mx-auto w-full max-w-md opacity-90" />
      }
    >
      <div className="w-full max-w-2xl rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-md sm:p-8">
        <a
          href={CMS_WEB_ORIGIN}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-body)] underline-offset-2 hover:text-[color:var(--color-brand)] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
          Kembali ke situs
          <span className="text-[color:var(--color-body-subtle)]">· {webHost}</span>
        </a>

        <div className="mt-5 inline-flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full",
              "border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]",
            )}
          >
            <img
              src={BRAND_LOGO_SRC}
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </span>
          <span className="text-sm font-bold tracking-tight text-[color:var(--color-heading)]">
            {BRAND_SHORT} CMS
          </span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[color:var(--color-heading)] sm:text-[1.75rem]">
          {heading}
        </h1>

        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-body)]">
            {subtitle}
          </p>
        ) : null}

        {inviteOnlyBanner ? (
          <p
            role="status"
            className="mt-5 border border-[color:var(--color-brand)]/25 bg-[color:var(--color-brand)]/5 px-3 py-2 text-sm text-[color:var(--color-heading)]"
          >
            CMS undangan saja — minta Super Admin atau Admin sekolah mengirim undangan.
          </p>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
    </AuthSplitLayout>
  );
}
