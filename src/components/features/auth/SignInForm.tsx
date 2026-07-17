"use client";

import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type OAuthStrategy,
  resolveOAuthProviders,
} from "@/components/features/auth/oauth-providers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEKNOVO_FORGOT_PASSWORD_PATH } from "@/lib/auth-forgot-password-path";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "teknovo-remember-me";
const AFTER_SIGN_IN = "/dashboard";

type FormMode = "sign-in" | "verify-trust";

type ClerkEnv = {
  __unstable__environment?: {
    userSettings?: {
      authenticatableSocialStrategies?: OAuthStrategy[];
    };
  };
};

type SignInFieldKey = "identifier" | "password" | "code";

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

function providerButtonLabel(label: string): string {
  return label.replace(/^Lanjutkan dengan\s+/i, "");
}

export function SignInForm({ className }: { className?: string }): ReactElement {
  const router = useRouter();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [mode, setMode] = useState<FormMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [oauthStrategies, setOauthStrategies] = useState<OAuthStrategy[]>([]);

  const busy = fetchStatus === "fetching";
  const providers = useMemo(() => resolveOAuthProviders(oauthStrategies), [oauthStrategies]);

  useEffect(() => {
    try {
      setRememberMe(window.localStorage.getItem(REMEMBER_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!clerk.loaded) return;
    const env = (clerk as unknown as ClerkEnv).__unstable__environment;
    setOauthStrategies(env?.userSettings?.authenticatableSocialStrategies ?? []);
  }, [clerk, clerk.loaded]);

  useEffect(() => {
    if (isSignedIn) {
      router.replace(AFTER_SIGN_IN);
    }
  }, [isSignedIn, router]);

  async function finalizeSignIn(): Promise<void> {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl(AFTER_SIGN_IN);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    try {
      window.localStorage.setItem(REMEMBER_KEY, rememberMe ? "1" : "0");
    } catch {
      /* ignore */
    }

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setLocalError(error.message || "Gagal masuk. Periksa email dan kata sandi.");
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
        setMode("verify-trust");
        setCode("");
        return;
      }
    }

    if (signIn.status === "needs_second_factor") {
      setLocalError("Akun ini memerlukan verifikasi tambahan. Hubungi admin sekolah.");
      return;
    }

    setLocalError("Proses masuk belum selesai. Coba lagi atau gunakan lupa kata sandi.");
  }

  async function handleTrustVerify(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
    if (error) {
      setLocalError(error.message || "Kode verifikasi tidak valid.");
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    setLocalError("Verifikasi belum selesai. Minta kode baru atau coba lagi.");
  }

  async function handleOAuth(strategy: OAuthStrategy): Promise<void> {
    setLocalError(null);
    const { error } = await signIn.sso({
      // Clerk's OAuthStrategy is a closed union; runtime strategies come from the instance.
      strategy: strategy as "oauth_google",
      redirectUrl: AFTER_SIGN_IN,
      redirectCallbackUrl: "/sso-callback",
    });
    if (error) {
      setLocalError(error.message || "Gagal memulai masuk dengan penyedia.");
    }
  }

  const displayError =
    localError ||
    firstFieldMessage(errors?.fields, "identifier", "password", "code") ||
    errors?.global?.[0]?.message ||
    undefined;

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
              void signIn.mfa.sendEmailCode();
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
              void signIn.reset();
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
    <FormShell className={className} title="Masuk">
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
                  <span className="truncate">{providerButtonLabel(provider.label)}</span>
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
              aria-label="Ingat saya"
            />
            Ingat saya
          </label>
          <Link
            href={TEKNOVO_FORGOT_PASSWORD_PATH}
            className="text-sm font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {displayError ? <ErrorText>{displayError}</ErrorText> : null}

        <Button type="submit" className="w-full" size="lg" disabled={busy || !clerk.loaded}>
          {busy ? "Memproses…" : "Masuk"}
        </Button>

        <p className="text-center text-sm text-[color:var(--color-body)]">
          Belum punya akun?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Daftar
          </Link>
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
    <p className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]">
      {children}
    </p>
  );
}
