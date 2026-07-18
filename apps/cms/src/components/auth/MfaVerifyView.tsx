import type { FormEvent, ReactElement } from "react";

import { MfaInfrastructureIllustration } from "./MfaInfrastructureIllustration";
import { OtpSixDigitInput } from "./OtpSixDigitInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

export type MfaVerifyViewProps = {
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  busy?: boolean;
  error?: string | null;
  /** e.g. authenticator vs email */
  subtitle?: string;
  heading?: string;
  /** Six-digit OTP (default) or backup-code text field */
  codeMode?: "otp" | "backup";
  onResend?: () => void;
  className?: string;
};

/**
 * Full-viewport MFA screen: illustration | elevated verify card.
 * Mobile: illustration first, card second. xl (≥1280px): two columns.
 */
export function MfaVerifyView({
  code,
  onCodeChange,
  onSubmit,
  onBack,
  busy = false,
  error = null,
  subtitle = "Buka aplikasi autentikator Anda dan masukkan kode 6 digit untuk memverifikasi identitas.",
  heading = "Masukkan kode",
  codeMode = "otp",
  onResend,
  className,
}: MfaVerifyViewProps): ReactElement {
  const canSubmit =
    !busy &&
    (codeMode === "backup"
      ? code.trim().length >= 6
      : code.replace(/\D/g, "").length === 6);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] overflow-y-auto bg-[color:var(--color-neutral-soft)]",
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

      <div className="public-site-container relative flex min-h-full min-h-dvh w-full items-center py-10 sm:py-12">
        <div className="grid w-full items-center gap-10 xl:grid-cols-2 xl:gap-14 2xl:gap-16">
          <div className="order-1 flex w-full items-center justify-center xl:justify-start">
            <MfaInfrastructureIllustration className="w-full" />
          </div>

          <div className="order-2 flex w-full justify-center xl:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-md sm:p-8">
              <div className="inline-flex items-center gap-2">
                <img
                  src={BRAND_LOGO_SRC}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                />
                <span className="text-sm font-bold tracking-tight text-[color:var(--color-heading)]">
                  {BRAND_SHORT} CMS
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-[color:var(--color-heading)] sm:text-[1.75rem]">
                {heading}
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--color-body)]">
                {subtitle}
              </p>

              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                {codeMode === "backup" ? (
                  <Input
                    id="mfa-backup-code"
                    autoComplete="one-time-code"
                    autoFocus
                    value={code}
                    disabled={busy}
                    onChange={(e) => onCodeChange(e.target.value)}
                    placeholder="Kode cadangan"
                    aria-label="Kode cadangan MFA"
                    className="font-mono tracking-wide"
                  />
                ) : (
                  <OtpSixDigitInput
                    value={code}
                    onChange={onCodeChange}
                    disabled={busy}
                  />
                )}

                {error ? (
                  <p
                    role="alert"
                    className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]"
                  >
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!canSubmit}
                >
                  {busy ? "Memverifikasi…" : "Verifikasi"}
                </Button>

                {onResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    disabled={busy}
                    onClick={onResend}
                  >
                    Kirim ulang kode
                  </Button>
                ) : null}

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={busy}
                  onClick={onBack}
                >
                  Kembali ke masuk
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
