import { useAuth } from "@clerk/clerk-react";
import { useSignInSignal } from "@clerk/clerk-react/experimental";
import { Mail } from "lucide-react";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { AUTH_TERMS_HREF } from "./auth-terms";

const AFTER_RESET = "/";

type ResetLocationState = {
  email?: string;
};

type ResetFieldKey = "identifier" | "password" | "code";

function firstFieldMessage(
  fields:
    | {
        identifier: { message?: string } | null;
        password: { message?: string } | null;
        code: { message?: string } | null;
      }
    | null
    | undefined,
  ...keys: ResetFieldKey[]
): string | undefined {
  if (!fields) return undefined;
  for (const key of keys) {
    const msg = fields[key]?.message;
    if (msg) return msg;
  }
  return undefined;
}

function globalError(
  errors:
    | {
        global?: Array<{ message?: string }> | null;
      }
    | null
    | undefined,
): string | undefined {
  return errors?.global?.[0]?.message;
}

function clerkErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;
  const record = error as {
    message?: string;
    errors?: Array<{ longMessage?: string; message?: string }>;
  };
  const nested = record.errors?.[0];
  return nested?.longMessage || nested?.message || record.message || fallback;
}

function readSignInEmail(signIn: {
  identifier?: string | null;
  userData?: unknown;
}): string {
  if (typeof signIn.identifier === "string" && signIn.identifier.trim()) {
    return signIn.identifier.trim();
  }
  const userData = signIn.userData as { emailAddress?: string | null } | null | undefined;
  return userData?.emailAddress?.trim() || "";
}

/**
 * Create-new-password step after reset email code verification (Clerk resetPasswordEmailCode).
 */
export function ResetPasswordForm({ className }: { className?: string }): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignInSignal();

  const locationEmail = (location.state as ResetLocationState | null)?.email?.trim() ?? "";
  const [email, setEmail] = useState(() => locationEmail || readSignInEmail(signIn));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  useEffect(() => {
    if (isSignedIn) {
      navigate(AFTER_RESET, { replace: true });
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    const fromClerk = readSignInEmail(signIn);
    if (!email && (locationEmail || fromClerk)) {
      setEmail(locationEmail || fromClerk);
    }
  }, [email, locationEmail, signIn]);

  useEffect(() => {
    // Must complete code verification on /forgot-password before setting a password.
    if (isSignedIn) return;
    if (fetchStatus === "fetching") return;
    if (signIn.status === "needs_new_password") return;
    if (signIn.status === "complete") return;

    navigate("/forgot-password", { replace: true });
  }, [fetchStatus, isSignedIn, navigate, signIn.status]);

  async function finalizeReset(): Promise<void> {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) return;
        navigate(AFTER_RESET);
      },
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    if (!acceptedTerms) {
      setLocalError("Centang persetujuan sebelum menyimpan kata sandi baru.");
      return;
    }

    if (!password) {
      setLocalError("Masukkan kata sandi baru.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (error) {
        setLocalError(error.message || "Gagal menyimpan kata sandi baru.");
        return;
      }

      if (signIn.status === "complete") {
        await finalizeReset();
        return;
      }

      if (signIn.status === "needs_second_factor") {
        setLocalError("Akun ini memerlukan verifikasi tambahan. Hubungi admin sekolah.");
        return;
      }

      setLocalError("Reset kata sandi belum selesai. Coba lagi.");
    } catch (err) {
      const message = clerkErrorMessage(err, "Gagal menyimpan kata sandi baru.");
      setLocalError(message);
      toast.error(message);
    }
  }

  const displayError =
    localError ||
    firstFieldMessage(errors?.fields, "password", "identifier") ||
    globalError(errors);

  return (
    <div className={cn("w-full text-left", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-heading)] sm:text-[2rem]">
        Buat kata sandi baru
      </h1>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit} noValidate>
        <Field id="reset-email" label="Email" required>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-body-subtle)]"
              aria-hidden
            />
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              className="pl-10"
              readOnly={Boolean(locationEmail || readSignInEmail(signIn))}
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          <Field
            id="reset-password"
            label="Kata sandi baru"
            required
            error={firstFieldMessage(errors?.fields, "password")}
          >
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Field>

          <Field id="reset-password-confirm" label="Konfirmasi kata sandi" required>
            <Input
              id="reset-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-[color:var(--color-body)]">
          <Checkbox
            className="mt-0.5 rounded-none"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            aria-required
          />
          <span>
            Saya memahami bahwa tautan/kode reset hanya untuk pemilik akun, dan saya setuju
            mengikuti{" "}
            <a
              href={AUTH_TERMS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
            >
              ketentuan layanan sekolah
            </a>{" "}
            (hubungi kami bila butuh bantuan).
          </span>
        </label>

        {displayError ? <ErrorText>{displayError}</ErrorText> : null}

        <Button type="submit" className="w-full" size="lg" disabled={busy || !acceptedTerms}>
          {busy ? "Menyimpan…" : "Reset kata sandi"}
        </Button>

        <p className="text-sm text-[color:var(--color-body)]">
          Belum punya kode?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Minta kode reset
          </Link>
        </p>
      </form>
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
