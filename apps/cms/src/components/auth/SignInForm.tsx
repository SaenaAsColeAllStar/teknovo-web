import { useAuth, useClerk } from "@clerk/clerk-react";
import { useSignInSignal } from "@clerk/clerk-react/experimental";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import {
  asSignInStatus,
  resetSignIn,
  sendMfaEmailCode,
  verifyMfaEmailCode,
  type SignInMfaEmailExtras,
} from "./clerk-signin-future";
import { MfaVerifyView } from "./MfaVerifyView";
import {
  type OAuthStrategy,
  resolveOAuthProviders,
} from "./oauth-providers";
import { TurnstileField } from "@/components/turnstile/TurnstileField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyTurnstileToken } from "@/lib/turnstile-public";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "teknovo-cms-remember-me";
const AFTER_SIGN_IN = "/";
const SSO_CALLBACK = "/sso-callback";

type FormMode = "sign-in" | "verify-trust" | "verify-mfa";
type MfaStrategy = "totp" | "email_code" | "phone_code" | "backup_code";

type ClerkEnv = {
  __unstable__environment?: {
    userSettings?: {
      authenticatableSocialStrategies?: OAuthStrategy[];
    };
  };
};

type SignInFieldKey = "identifier" | "password" | "code";

type SecondFactorLike = {
  strategy?: string;
};

function absoluteAppUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, window.location.origin).href;
}

function clerkErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;
  const record = error as {
    message?: string;
    errors?: Array<{ longMessage?: string; message?: string }>;
  };
  const nested = record.errors?.[0];
  return (
    nested?.longMessage ||
    nested?.message ||
    record.message ||
    fallback
  );
}

function fieldMessage(
  fields:
    | {
        identifier: { message?: string } | null;
        password: { message?: string } | null;
        code: { message?: string } | null;
      }
    | null
    | undefined,
  key: SignInFieldKey,
): string | undefined {
  return fields?.[key]?.message ?? undefined;
}

function firstFieldMessage(
  fields:
    | {
        identifier: { message?: string } | null;
        password: { message?: string } | null;
        code: { message?: string } | null;
      }
    | null
    | undefined,
  ...keys: SignInFieldKey[]
): string | undefined {
  if (!fields) return undefined;
  for (const key of keys) {
    const msg = fields[key]?.message;
    if (msg) return msg;
  }
  return undefined;
}

export function SignInForm({ className }: { className?: string }): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  // clerk-react v5: Future custom-flow APIs (`sso`, `password`, `finalize`) live on
  // useSignInSignal — not on legacy useSignIn() (that only has authenticateWithRedirect).
  const { signIn, errors, fetchStatus } = useSignInSignal();

  const [mode, setMode] = useState<FormMode>("sign-in");
  const [mfaStrategy, setMfaStrategy] = useState<MfaStrategy>("totp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [oauthStrategies, setOauthStrategies] = useState<OAuthStrategy[]>([]);
  const [oauthBusy, setOauthBusy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const inviteOnlyBanner = searchParams.get("message") === "invite-only";

  const busy = fetchStatus === "fetching" || oauthBusy;
  const providers = useMemo(() => resolveOAuthProviders(oauthStrategies), [oauthStrategies]);

  function pickSecondFactor(factors: SecondFactorLike[] | null | undefined): MfaStrategy | null {
    if (!factors?.length) return null;
    const strategies = factors.map((f) => f.strategy).filter(Boolean) as string[];
    if (strategies.includes("totp")) return "totp";
    if (strategies.includes("email_code")) return "email_code";
    if (strategies.includes("phone_code")) return "phone_code";
    if (strategies.includes("backup_code")) return "backup_code";
    return null;
  }

  async function beginSecondFactor(): Promise<boolean> {
    const factors = (signIn.supportedSecondFactors ?? []) as SecondFactorLike[];
    const strategy = pickSecondFactor(factors);
    if (!strategy) return false;

    setMfaStrategy(strategy);
    setCode("");
    setLocalError(null);

    if (strategy === "phone_code") {
      const { error } = await signIn.mfa.sendPhoneCode();
      if (error) {
        setLocalError(error.message || "Gagal mengirim kode ke nomor telepon.");
        return false;
      }
    }

    if (strategy === "email_code") {
      const { error } = await sendMfaEmailCode(
        signIn.mfa as SignInMfaEmailExtras,
        signIn.emailCode,
        email.trim() || undefined,
      );
      if (error) {
        setLocalError(error.message || "Gagal mengirim kode ke email.");
        return false;
      }
    }

    setMode("verify-mfa");
    return true;
  }

  useEffect(() => {
    try {
      setRememberMe(window.localStorage.getItem(REMEMBER_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (inviteOnlyBanner) {
      toast.message("Akses hanya via undangan Super Admin");
    }
  }, [inviteOnlyBanner]);

  useEffect(() => {
    if (!clerk.loaded) return;
    const env = (clerk as unknown as ClerkEnv).__unstable__environment;
    setOauthStrategies(env?.userSettings?.authenticatableSocialStrategies ?? []);
  }, [clerk, clerk.loaded]);

  useEffect(() => {
    if (isSignedIn) {
      navigate(AFTER_SIGN_IN, { replace: true });
    }
  }, [isSignedIn, navigate]);

  async function finalizeSignIn(): Promise<void> {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) return;
        navigate(AFTER_SIGN_IN);
      },
    });
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    if (!turnstileToken) {
      setLocalError("Selesaikan verifikasi keamanan sebelum masuk.");
      return;
    }

    const verified = await verifyTurnstileToken(turnstileToken);
    if (!verified.success) {
      setLocalError("Verifikasi keamanan gagal. Coba lagi.");
      setTurnstileToken(null);
      setTurnstileReset((n) => n + 1);
      return;
    }

    try {
      window.localStorage.setItem(REMEMBER_KEY, rememberMe ? "1" : "0");
    } catch {
      /* ignore */
    }

    try {
      const { error } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        setLocalError(error.message || "Gagal masuk. Periksa email dan kata sandi.");
        setTurnstileToken(null);
        setTurnstileReset((n) => n + 1);
        return;
      }

      const status = asSignInStatus(signIn.status);

      if (status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (status === "needs_client_trust") {
        const emailFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailFactor) {
          const { error: sendError } = await sendMfaEmailCode(
            signIn.mfa as SignInMfaEmailExtras,
            signIn.emailCode,
            email.trim() || undefined,
          );
          if (sendError) {
            setLocalError(sendError.message || "Gagal mengirim kode verifikasi.");
            return;
          }
          setMode("verify-trust");
          setCode("");
          return;
        }
        const phoneFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "phone_code",
        );
        if (phoneFactor) {
          const { error: sendError } = await signIn.mfa.sendPhoneCode();
          if (sendError) {
            setLocalError(sendError.message || "Gagal mengirim kode ke nomor telepon.");
            return;
          }
          setMfaStrategy("phone_code");
          setMode("verify-mfa");
          setCode("");
          return;
        }
      }

      if (status === "needs_second_factor") {
        const started = await beginSecondFactor();
        if (!started) {
          setLocalError(
            "Akun ini memerlukan verifikasi tambahan, tetapi metode MFA tidak dikenali. Hubungi Super Admin.",
          );
        }
        return;
      }

      setLocalError("Proses masuk belum selesai. Coba lagi atau gunakan lupa kata sandi.");
    } catch (err) {
      const message = clerkErrorMessage(err, "Gagal masuk. Periksa email dan kata sandi.");
      setLocalError(message);
      toast.error(message);
      setTurnstileToken(null);
      setTurnstileReset((n) => n + 1);
    }
  }

  async function handleTrustVerify(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    try {
      const { error } = await verifyMfaEmailCode(
        signIn.mfa as SignInMfaEmailExtras,
        signIn.emailCode,
        code.trim(),
      );
      if (error) {
        setLocalError(error.message || "Kode verifikasi tidak valid.");
        return;
      }

      if (asSignInStatus(signIn.status) === "complete") {
        await finalizeSignIn();
        return;
      }

      setLocalError("Verifikasi belum selesai. Minta kode baru atau coba lagi.");
    } catch (err) {
      const message = clerkErrorMessage(err, "Kode verifikasi tidak valid.");
      setLocalError(message);
      toast.error(message);
    }
  }

  async function handleMfaVerify(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    const trimmed = code.trim();
    const otp = trimmed.replace(/\D/g, "");

    if (mfaStrategy === "backup_code") {
      if (trimmed.length < 6) {
        setLocalError("Masukkan kode cadangan yang valid.");
        return;
      }
    } else if (otp.length < 6) {
      setLocalError("Masukkan keenam digit kode.");
      return;
    }

    try {
      let error: { message?: string } | null = null;

      if (mfaStrategy === "totp") {
        ({ error } = await signIn.mfa.verifyTOTP({ code: otp }));
      } else if (mfaStrategy === "phone_code") {
        ({ error } = await signIn.mfa.verifyPhoneCode({ code: otp }));
      } else if (mfaStrategy === "backup_code") {
        ({ error } = await signIn.mfa.verifyBackupCode({ code: trimmed }));
      } else {
        ({ error } = await verifyMfaEmailCode(
          signIn.mfa as SignInMfaEmailExtras,
          signIn.emailCode,
          otp,
        ));
      }

      if (error) {
        setLocalError(error.message || "Kode verifikasi tidak valid.");
        return;
      }

      if (asSignInStatus(signIn.status) === "complete") {
        await finalizeSignIn();
        return;
      }

      setLocalError("Verifikasi belum selesai. Periksa kode dan coba lagi.");
    } catch (err) {
      const message = clerkErrorMessage(err, "Kode verifikasi tidak valid.");
      setLocalError(message);
      toast.error(message);
    }
  }

  async function handleMfaResend(): Promise<void> {
    setLocalError(null);
    try {
      if (mfaStrategy === "phone_code") {
        const { error } = await signIn.mfa.sendPhoneCode();
        if (error) {
          setLocalError(error.message || "Gagal mengirim ulang kode.");
          return;
        }
        toast.message("Kode baru telah dikirim.");
        return;
      }
      if (mfaStrategy === "email_code") {
        const { error } = await sendMfaEmailCode(
          signIn.mfa as SignInMfaEmailExtras,
          signIn.emailCode,
          email.trim() || undefined,
        );
        if (error) {
          setLocalError(error.message || "Gagal mengirim ulang kode.");
          return;
        }
        toast.message("Kode baru telah dikirim ke email Anda.");
      }
    } catch (err) {
      const message = clerkErrorMessage(err, "Gagal mengirim ulang kode.");
      setLocalError(message);
      toast.error(message);
    }
  }

  const mfaSubtitle =
    mfaStrategy === "totp"
      ? "Buka aplikasi autentikator Anda dan masukkan kode 6 digit untuk memverifikasi identitas."
      : mfaStrategy === "phone_code"
        ? "Masukkan kode 6 digit yang dikirim ke nomor telepon terdaftar pada akun Anda."
        : mfaStrategy === "backup_code"
          ? "Masukkan salah satu kode cadangan yang Anda simpan saat mengaktifkan MFA."
          : "Masukkan kode 6 digit yang dikirim ke email akun Anda.";

  const mfaHeading =
    mfaStrategy === "backup_code" ? "Masukkan kode cadangan" : "Masukkan kode";

  async function handleOAuth(strategy: OAuthStrategy): Promise<void> {
    setLocalError(null);
    setOauthBusy(true);

    try {
      if (!clerk.loaded) {
        throw new Error("Clerk belum siap. Muat ulang halaman dan coba lagi.");
      }

      const { error } = await signIn.sso({
        // Local OAuthStrategy is wider than Clerk's branded oauth provider union.
        strategy: strategy as Parameters<typeof signIn.sso>[0]["strategy"],
        redirectUrl: absoluteAppUrl(AFTER_SIGN_IN),
        redirectCallbackUrl: absoluteAppUrl(SSO_CALLBACK),
      });

      if (error) {
        const message =
          error.message ||
          "Gagal memulai masuk dengan Google. Periksa konfigurasi OAuth di Clerk.";
        setLocalError(message);
        toast.error(message);
      }
      // Successful SSO navigates away; no further UI update needed.
    } catch (err) {
      const message = clerkErrorMessage(
        err,
        "Gagal memulai masuk dengan Google. Periksa konfigurasi OAuth di Clerk Dashboard / Google Cloud.",
      );
      setLocalError(message);
      toast.error(message);
      console.error("[cms] OAuth sign-in failed:", err);
    } finally {
      setOauthBusy(false);
    }
  }

  const displayError =
    localError ||
    firstFieldMessage(errors?.fields, "identifier", "password", "code") ||
    errors?.global?.[0]?.message ||
    undefined;

  if (mode === "verify-mfa") {
    return (
      <MfaVerifyView
        code={code}
        onCodeChange={setCode}
        onSubmit={handleMfaVerify}
        busy={busy}
        error={displayError}
        heading={mfaHeading}
        subtitle={mfaSubtitle}
        codeMode={mfaStrategy === "backup_code" ? "backup" : "otp"}
        onResend={
          mfaStrategy === "phone_code" || mfaStrategy === "email_code"
            ? () => {
                void handleMfaResend();
              }
            : undefined
        }
        onBack={() => {
          void resetSignIn(signIn);
          setMode("sign-in");
          setCode("");
          setLocalError(null);
        }}
      />
    );
  }

  if (mode === "verify-trust") {
    return (
      <FormShell className={className} title="Verifikasi perangkat">
        <form className="space-y-5" onSubmit={handleTrustVerify}>
          <p className="text-sm leading-relaxed text-[color:var(--color-body)]">
            Masukkan kode yang dikirim ke email Anda.
          </p>
          <Field id="trust-code" label="Kode verifikasi" required error={fieldMessage(errors?.fields, "code")}>
            <Input
              id="trust-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Field>
          {displayError ? <ErrorText>{displayError}</ErrorText> : null}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Memverifikasi…" : "Verifikasi"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={busy}
            onClick={() => {
              void sendMfaEmailCode(
                signIn.mfa as SignInMfaEmailExtras,
                signIn.emailCode,
                email.trim() || undefined,
              ).then(({ error: sendError }) => {
                if (sendError) {
                  setLocalError(sendError.message || "Gagal mengirim ulang kode.");
                  return;
                }
                toast.message("Kode baru telah dikirim ke email Anda.");
              });
            }}
          >
            Kirim ulang kode
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={() => {
              void resetSignIn(signIn);
              setMode("sign-in");
              setLocalError(null);
            }}
          >
            Kembali
          </Button>
        </form>
      </FormShell>
    );
  }

  return (
    <FormShell className={className} title="Masuk ke CMS">
      {inviteOnlyBanner ? (
        <p
          role="status"
          className="mb-5 border border-[color:var(--color-brand)]/25 bg-[color:var(--color-brand)]/5 px-3 py-2 text-sm text-[color:var(--color-heading)]"
        >
          Akses hanya via undangan Super Admin
        </p>
      ) : null}
      <form className="space-y-5" onSubmit={handlePasswordSubmit}>
        {providers.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-2.5",
                providers.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {providers.map((provider) => (
                <Button
                  key={provider.strategy}
                  type="button"
                  variant="secondary"
                  className="w-full justify-center gap-2 px-3"
                  size="lg"
                  disabled={busy || !clerk.loaded}
                  onClick={() => {
                    void handleOAuth(provider.strategy);
                  }}
                >
                  {provider.icon}
                  <span className="truncate">
                    {oauthBusy ? "Mengalihkan…" : provider.label}
                  </span>
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3" role="separator" aria-label="atau">
              <span className="h-px flex-1 bg-[color:var(--color-border-default)]" />
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-body-subtle)]">
                atau
              </span>
              <span className="h-px flex-1 bg-[color:var(--color-border-default)]" />
            </div>
          </>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="email" label="Email" required error={fieldMessage(errors?.fields, "identifier")}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
            />
          </Field>
          <Field id="password" label="Kata sandi" required error={fieldMessage(errors?.fields, "password")}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-body)]">
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-none"
              aria-label="Ingat saya"
            />
            Ingat saya
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">
            Verifikasi keamanan
            <span className="ml-0.5 text-[color:var(--color-danger)]" aria-hidden>
              *
            </span>
          </Label>
          <TurnstileField
            onTokenChange={setTurnstileToken}
            resetSignal={turnstileReset}
          />
        </div>

        {displayError ? <ErrorText>{displayError}</ErrorText> : null}

        <Button type="submit" className="w-full" size="lg" disabled={busy || !clerk.loaded}>
          {busy && !oauthBusy ? "Memproses…" : "Masuk"}
        </Button>

        <p className="text-center text-sm text-[color:var(--color-body)]">
          Akses hanya via undangan Super Admin.
        </p>
      </form>
    </FormShell>
  );
}

function FormShell({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className={cn("w-full max-w-md text-left", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-heading)] sm:text-3xl">
        {title}
      </h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
        {required ? (
          <span className="ml-0.5 text-[color:var(--color-danger)]" aria-hidden>
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-[color:var(--color-danger)]">{error}</p> : null}
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }): ReactElement {
  return (
    <p
      role="alert"
      className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]"
    >
      {children}
    </p>
  );
}
