"use client";

import type { FormEvent, ReactElement } from "react";

import { IcoSend } from "@/components/icons/inline-glyphs";
import {
  KONTAK_NEWSLETTER_EMAIL_PLACEHOLDER,
  KONTAK_NEWSLETTER_MAIL_SUBJECT,
} from "@/lib/kontak-landing-content";
import { PUBLIK_CONTACT_EMAIL } from "@/lib/kontak-publik";
import { cn } from "@/lib/utils";

export function KontakNewsletterForm(): ReactElement {
  function onSubscribe(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    const body = `Mohon daftarkan alamat berikut ke buletin sekolah:\n${email}`;
    window.location.href = `mailto:${PUBLIK_CONTACT_EMAIL}?subject=${encodeURIComponent(KONTAK_NEWSLETTER_MAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      className="mx-auto mt-8 flex w-full max-w-md items-stretch"
      onSubmit={onSubscribe}
      noValidate
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">{KONTAK_NEWSLETTER_EMAIL_PLACEHOLDER}</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={KONTAK_NEWSLETTER_EMAIL_PLACEHOLDER}
          className={cn(
            "h-11 w-full rounded-none border border-r-0 border-border-default bg-surface px-4 text-sm text-heading",
            "placeholder:text-body-subtle focus:relative focus:z-10 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
          )}
        />
      </label>
      <button
        type="submit"
        aria-label="Daftar buletin"
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-none bg-brand text-white",
          "transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
        )}
      >
        <IcoSend className="size-4" />
      </button>
    </form>
  );
}
