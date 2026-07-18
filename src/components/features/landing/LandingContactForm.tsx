"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  KONTAK_FORM_FIELDS,
  KONTAK_FORM_HEADLINE,
  KONTAK_FORM_LEDE,
  KONTAK_FORM_SUBMIT_LABEL,
} from "@/lib/kontak-landing-content";
import { PUBLIK_CONTACT_EMAIL } from "@/lib/kontak-publik";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 8, "Nomor terlalu pendek"),
  subject: z.string().min(3, "Subjek minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type FormValues = z.infer<typeof schema>;

const fieldClassName = cn(
  "mt-1.5 w-full rounded-none border border-border-default bg-surface px-3 py-2.5 text-sm text-heading",
  "placeholder:text-body-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
);

function RequiredMark(): ReactElement {
  return (
    <span className="text-brand" aria-hidden>
      *
    </span>
  );
}

export function LandingContactForm(): ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormValues): void {
    const subject = encodeURIComponent(data.subject);
    const phoneLine = data.phone?.trim() ? `Telepon: ${data.phone.trim()}\n` : "";
    const body = encodeURIComponent(
      `${data.message}\n\n---\nNama: ${data.name}\nEmail: ${data.email}\n${phoneLine}`,
    );
    const mailtoUrl = `mailto:${PUBLIK_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_self");
    reset();
  }

  return (
    <div className="flex h-full flex-col">
      <h2
        id="kontak-form-heading"
        className="text-2xl font-bold tracking-tight text-heading sm:text-3xl"
      >
        {KONTAK_FORM_HEADLINE}
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-body">{KONTAK_FORM_LEDE}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-1 flex-col gap-5"
        noValidate
      >
        <div>
          <label htmlFor="landing-contact-name" className="text-sm font-medium text-heading">
            {KONTAK_FORM_FIELDS.name.label} {KONTAK_FORM_FIELDS.name.required ? <RequiredMark /> : null}
          </label>
          <input
            id="landing-contact-name"
            type="text"
            autoComplete="name"
            placeholder={KONTAK_FORM_FIELDS.name.placeholder}
            aria-required={KONTAK_FORM_FIELDS.name.required}
            className={fieldClassName}
            {...register("name")}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="landing-contact-email" className="text-sm font-medium text-heading">
            {KONTAK_FORM_FIELDS.email.label}{" "}
            {KONTAK_FORM_FIELDS.email.required ? <RequiredMark /> : null}
          </label>
          <input
            id="landing-contact-email"
            type="email"
            autoComplete="email"
            placeholder={KONTAK_FORM_FIELDS.email.placeholder}
            aria-required={KONTAK_FORM_FIELDS.email.required}
            className={fieldClassName}
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="landing-contact-phone" className="text-sm font-medium text-heading">
            {KONTAK_FORM_FIELDS.phone.label}
          </label>
          <input
            id="landing-contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder={KONTAK_FORM_FIELDS.phone.placeholder}
            className={fieldClassName}
            {...register("phone")}
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p> : null}
        </div>

        <div>
          <label htmlFor="landing-contact-subject" className="text-sm font-medium text-heading">
            {KONTAK_FORM_FIELDS.subject.label}{" "}
            {KONTAK_FORM_FIELDS.subject.required ? <RequiredMark /> : null}
          </label>
          <input
            id="landing-contact-subject"
            type="text"
            autoComplete="off"
            placeholder={KONTAK_FORM_FIELDS.subject.placeholder}
            aria-required={KONTAK_FORM_FIELDS.subject.required}
            className={fieldClassName}
            {...register("subject")}
          />
          {errors.subject ? (
            <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="landing-contact-message" className="text-sm font-medium text-heading">
            {KONTAK_FORM_FIELDS.message.label}{" "}
            {KONTAK_FORM_FIELDS.message.required ? <RequiredMark /> : null}
          </label>
          <textarea
            id="landing-contact-message"
            rows={5}
            placeholder={KONTAK_FORM_FIELDS.message.placeholder}
            aria-required={KONTAK_FORM_FIELDS.message.required}
            className={cn(fieldClassName, "min-h-[8rem] resize-y")}
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="mt-1 w-full">
          {KONTAK_FORM_SUBMIT_LABEL}
        </Button>

        {isSubmitSuccessful ? (
          <p className="text-center text-xs text-emerald-600">
            Form siap — aplikasi email akan terbuka. Jika tidak, periksa pengaturan perangkat Anda.
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-body-subtle">
          Pesan dikirim melalui aplikasi email di perangkat Anda. Untuk pertanyaan mendesak seputar
          PPDB, gunakan WhatsApp resmi sekolah.
        </p>
      </form>
    </div>
  );
}
