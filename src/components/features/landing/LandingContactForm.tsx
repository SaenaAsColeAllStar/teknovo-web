"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type FormValues = z.infer<typeof schema>;

export function LandingContactForm(): ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormValues): void {
    const subject = encodeURIComponent(`Pertanyaan dari ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n---\nEmail: ${data.email}`);
    const mailtoUrl = `mailto:info@smateknovo.sch.id?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_self");
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-4 rounded-none border border-border-default bg-surface p-6"
      noValidate
    >
      <p className="text-sm font-semibold text-heading">Kirim pertanyaan</p>
      <div>
        <label htmlFor="landing-contact-name" className="sr-only">
          Nama
        </label>
        <input
          id="landing-contact-name"
          type="text"
          autoComplete="name"
          placeholder="Nama lengkap"
          className={cn(
            "w-full rounded-none border border-border-default bg-surface px-3 py-2 text-sm text-heading",
            "placeholder:text-body-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
          )}
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="landing-contact-email" className="sr-only">
          Email
        </label>
        <input
          id="landing-contact-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          className={cn(
            "w-full rounded-none border border-border-default bg-surface px-3 py-2 text-sm text-heading",
            "placeholder:text-body-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
          )}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="landing-contact-message" className="sr-only">
          Pesan
        </label>
        <textarea
          id="landing-contact-message"
          rows={4}
          placeholder="Pertanyaan atau pesan Anda"
          className={cn(
            "w-full resize-y rounded-none border border-border-default bg-surface px-3 py-2 text-sm text-heading",
            "placeholder:text-body-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
          )}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        className={cn(
          "w-full rounded-none bg-brand px-4 py-2.5 text-sm font-semibold text-white",
          "transition hover:bg-brand-strong",
        )}
      >
        Buka aplikasi email
      </button>
      {isSubmitSuccessful ? (
        <p className="text-center text-xs text-emerald-600">
          Form siap — aplikasi email akan terbuka. Jika tidak, periksa pengaturan perangkat Anda.
        </p>
      ) : null}
      <p className="text-xs text-body-subtle">
        Pesan dikirim melalui aplikasi email di perangkat Anda. Untuk pertanyaan mendesak seputar PPDB,
        gunakan WhatsApp resmi di halaman kontak atau PPDB.
      </p>
    </form>
  );
}
