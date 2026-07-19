import { useSignUp, useUser } from "@clerk/react";
import {
  type FormEvent,
  type ReactElement,
  useEffect,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { SignInView } from "./SignInView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AFTER_ACCEPT = "/";

/**
 * Handles `__clerk_ticket` from invitation redirectUrl (`/sign-in?__clerk_ticket=…`).
 * Without this, invite email/WhatsApp links land on sign-in but cannot complete signup.
 */
export function AcceptInvitationForm(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSignedIn } = useUser();
  const { signUp, fetchStatus } = useSignUp();

  const ticket = searchParams.get("__clerk_ticket") ?? "";
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  useEffect(() => {
    if (isSignedIn || signUp.status === "complete") {
      navigate(AFTER_ACCEPT, { replace: true });
    }
  }, [isSignedIn, signUp.status, navigate]);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    if (!ticket) {
      setError("Tiket undangan tidak ditemukan. Minta tautan undangan baru.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      if (typeof signUp.create !== "function") {
        setError("API undangan Clerk belum siap. Muat ulang halaman.");
        return;
      }

      const { error: createError } = await signUp.create({
        strategy: "ticket",
        ticket,
        password,
      });
      if (createError) {
        setError(
          createError.message ||
            "Gagal menerima undangan. Minta Super Admin kirim ulang.",
        );
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl?.(AFTER_ACCEPT) ?? AFTER_ACCEPT;
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              navigate(url);
            }
          },
        });
        if (finalizeError) {
          setError(finalizeError.message || "Gagal menyelesaikan pendaftaran.");
          return;
        }
        toast.success("Undangan diterima. Selamat datang.");
        return;
      }

      setError(
        "Pendaftaran belum selesai. Lengkapi langkah yang diminta Clerk, atau hubungi Super Admin.",
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menerima undangan. Coba lagi.";
      setError(message);
      toast.error(message);
    }
  }

  if (!ticket) {
    return (
      <SignInView
        heading="Undangan tidak valid"
        subtitle="Tautan undangan tidak berisi tiket Clerk. Minta Super Admin mengirim undangan baru atau salin tautan dari tab Undangan."
      >
        <Button type="button" className="w-full" onClick={() => navigate("/sign-in")}>
          Ke halaman masuk
        </Button>
      </SignInView>
    );
  }

  return (
    <SignInView
      heading="Terima undangan CMS"
      subtitle="Buat kata sandi untuk menyelesaikan undangan. Email Anda sudah diverifikasi lewat tautan Clerk."
    >
      <form className="space-y-5" onSubmit={(e) => void onSubmit(e)}>
        <div className="space-y-1.5">
          <Label htmlFor="invite-password" className="text-xs">
            Kata sandi baru
            <span className="ml-0.5 text-[color:var(--color-danger)]" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id="invite-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            placeholder="Minimal 8 karakter"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invite-password-confirm" className="text-xs">
            Konfirmasi kata sandi
            <span className="ml-0.5 text-[color:var(--color-danger)]" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id="invite-password-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={busy}
          />
        </div>

        <div id="clerk-captcha" />

        {error ? (
          <p
            role="alert"
            className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? "Memproses…" : "Terima undangan"}
        </Button>
      </form>
    </SignInView>
  );
}
