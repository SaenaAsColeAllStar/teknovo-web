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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

const AFTER_RESET = "/";
/** Public school site contact — terms placeholder until a dedicated privacy page exists. */
const TERMS_HREF = "https://smkteknovo.sch.id/kontak" as const;

type Step = "request" | "code" | "password";

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

export function ForgotPasswordForm({ className }: { className?: string }): ReactElement {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignInSignal();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  useEffect(() => {
    if (isSignedIn) {
      navigate(AFTER_RESET, { replace: true });
    }
  }, [isSignedIn, navigate]);

  async function finalizeReset(): Promise<void> {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) return;
        navigate(AFTER_RESET);
      },
    });
  }

  async function handleRequest(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    if (!acceptedTerms) {
      setLocalError("Centang persetujuan sebelum mengirim tautan reset.");
      return;
    }

    const identifier = email.trim();
    if (!identifier) {
      setLocalError("Masukkan alamat email akun Anda.");
      return;
    }

    try {
      const { error: createError } = await signIn.create({ identifier });
      if (createError) {
        setLocalError(createError.message || "Email tidak ditemukan atau tidak dapat diproses.");
        return;
      }

      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        setLocalError(error.message || "Gagal mengirim kode reset ke email.");
        return;
      }

      setStep("code");
      setCode("");
    } catch (err) {
      const message = clerkErrorMessage(err, "Gagal mengirim kode reset ke email.");
      setLocalError(message);
      toast.error(message);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (error) {
        setLocalError(error.message || "Kode tidak valid atau sudah kedaluwarsa.");
        return;
      }

      setStep("password");
      setPassword("");
    } catch (err) {
      const message = clerkErrorMessage(err, "Kode tidak valid atau sudah kedaluwarsa.");
      setLocalError(message);
      toast.error(message);
    }
  }

  async function handleNewPassword(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLocalError(null);

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
    firstFieldMessage(errors?.fields, "identifier", "password", "code") ||
    globalError(errors);

  const title =
    step === "request"
      ? "Lupa kata sandi?"
      : step === "code"
        ? "Periksa email Anda"
        : "Buat kata sandi baru";

  const subtitle =
    step === "request"
      ? `Tenang — kami akan mengirim kode reset ke email akun CMS ${BRAND_SHORT} Anda. Masukkan alamat yang terdaftar, lalu ikuti petunjuk di kotak masuk.`
      : step === "code"
        ? `Kode reset telah dikirim ke ${email.trim() || "email Anda"}. Masukkan kode tersebut untuk melanjutkan.`
        : "Pilih kata sandi baru yang kuat. Setelah disimpan, Anda akan masuk otomatis ke CMS.";

  return (
    <div className={cn("w-full text-left", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-heading)] sm:text-[2rem]">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-body)] sm:text-[0.9375rem]">
        {subtitle}
      </p>

      <div className="mt-10">
        {step === "request" ? (
          <form className="space-y-5" onSubmit={handleRequest} noValidate>
            <Field
              id="forgot-email"
              label="Email"
              required
              error={firstFieldMessage(errors?.fields, "identifier")}
            >
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-body-subtle)]"
                  aria-hidden
                />
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className="pl-10"
                />
              </div>
            </Field>

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
                  href={TERMS_HREF}
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
              {busy ? "Mengirim…" : "Kirim tautan reset"}
            </Button>

            <p className="text-sm text-[color:var(--color-body)]">
              Ingat kata sandi?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
              >
                Kembali masuk
              </Link>
            </p>
          </form>
        ) : null}

        {step === "code" ? (
          <form className="space-y-5" onSubmit={handleVerifyCode}>
            <Field id="forgot-code" label="Kode reset" required error={firstFieldMessage(errors?.fields, "code")}>
              <Input
                id="forgot-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Masukkan kode dari email"
              />
            </Field>

            {displayError ? <ErrorText>{displayError}</ErrorText> : null}

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Memverifikasi…" : "Verifikasi kode"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={busy}
              onClick={() => {
                void signIn.resetPasswordEmailCode.sendCode();
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
                setStep("request");
                setLocalError(null);
              }}
            >
              Ganti email
            </Button>
          </form>
        ) : null}

        {step === "password" ? (
          <form className="space-y-5" onSubmit={handleNewPassword}>
            <Field
              id="new-password"
              label="Kata sandi baru"
              required
              error={firstFieldMessage(errors?.fields, "password")}
            >
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal sesuai kebijakan akun"
              />
            </Field>

            {displayError ? <ErrorText>{displayError}</ErrorText> : null}

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan & masuk"}
            </Button>
          </form>
        ) : null}
      </div>
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
