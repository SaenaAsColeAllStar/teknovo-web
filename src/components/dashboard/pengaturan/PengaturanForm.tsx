"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  isApiConfigured,
  updatePengaturanCms,
} from "@/lib/api-client";
import type { PengaturanSitusPublikData } from "@/lib/pengaturan-situs-publik-defaults";
import {
  zPengaturanSitusPublikPatch,
  type PengaturanSitusPublikPatchInput,
} from "@/lib/validations/pengaturan-situs-publik";

type Props = {
  initial: PengaturanSitusPublikData;
};

function toFormValues(
  data: PengaturanSitusPublikData,
): PengaturanSitusPublikPatchInput {
  return {
    landingMarquee: data.landingMarquee.map((item) => ({
      label: item.label,
      href: item.href ?? "",
    })),
    landingMarqueeLabel: data.landingMarqueeLabel,
    ppdbTahunAjaran: data.ppdbTahunAjaran,
    ppdbGelombang1Label: data.ppdbGelombang1Label,
    ppdbGelombang2Label: data.ppdbGelombang2Label,
    ppdbJamLayanan: data.ppdbJamLayanan,
    ppdbBiayaKeterangan: data.ppdbBiayaKeterangan,
    kontakTelepon: data.kontakTelepon,
    kontakEmail: data.kontakEmail,
    kontakAlamat: data.kontakAlamat,
    whatsappPpdb: data.whatsappPpdb,
    sambutanNamaKepala: data.sambutanNamaKepala,
    sambutanJabatan: data.sambutanJabatan,
    siteTitle: data.siteTitle,
    siteDescription: data.siteDescription,
    defaultOgImageUrl: data.defaultOgImageUrl ?? "",
    googleAnalyticsId: data.googleAnalyticsId ?? "",
    sosialInstagramUrl: data.sosialInstagramUrl ?? "",
    sosialYoutubeUrl: data.sosialYoutubeUrl ?? "",
    sosialFacebookUrl: data.sosialFacebookUrl ?? "",
    sosialTiktokUrl: data.sosialTiktokUrl ?? "",
  };
}

const fieldClass =
  "flex min-h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:opacity-50";

export function PengaturanForm({ initial }: Props) {
  const { getToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const apiReady = isApiConfigured();

  const form = useForm<PengaturanSitusPublikPatchInput>({
    resolver: zodResolver(zPengaturanSitusPublikPatch),
    defaultValues: toFormValues(initial),
  });

  async function onSubmit(values: PengaturanSitusPublikPatchInput) {
    if (!apiReady) {
      toast.error("API belum dikonfigurasi", {
        description: "Set VITE_API_URL (CMS) ke base API.",
      });
      return;
    }

    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const saved = await updatePengaturanCms(values, token);
      form.reset(toFormValues(saved));
      toast.success("Pengaturan disimpan");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal menyimpan pengaturan.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      {!apiReady ? (
        <div
          role="alert"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm"
        >
          <p className="font-medium text-[color:var(--color-heading)]">
            API_URL belum diset
          </p>
          <p className="mt-1 text-[color:var(--color-body)]">
            Form menampilkan nilai default lokal. Simpan membutuhkan{" "}
            <code>PATCH /v1/pengaturan</code> di api-web.
          </p>
        </div>
      ) : null}

      <section className="space-y-4 border border-[color:var(--color-border)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-brand)]">
          SEO situs
        </h2>
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Judul situs</Label>
          <Input id="siteTitle" disabled={busy} {...form.register("siteTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Deskripsi situs</Label>
          <textarea
            id="siteDescription"
            rows={3}
            className={fieldClass}
            disabled={busy}
            {...form.register("siteDescription")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultOgImageUrl">Default OG image URL</Label>
            <Input
              id="defaultOgImageUrl"
              disabled={busy}
              placeholder="https://..."
              {...form.register("defaultOgImageUrl")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              disabled={busy}
              placeholder="G-XXXXXXXX"
              {...form.register("googleAnalyticsId")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-[color:var(--color-border)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-brand)]">
          Kontak & PPDB
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kontakEmail">Email</Label>
            <Input
              id="kontakEmail"
              disabled={busy}
              {...form.register("kontakEmail")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappPpdb">WhatsApp PPDB</Label>
            <Input
              id="whatsappPpdb"
              disabled={busy}
              {...form.register("whatsappPpdb")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kontakTelepon">Telepon</Label>
            <Input
              id="kontakTelepon"
              disabled={busy}
              {...form.register("kontakTelepon")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppdbTahunAjaran">Tahun ajaran PPDB</Label>
            <Input
              id="ppdbTahunAjaran"
              disabled={busy}
              {...form.register("ppdbTahunAjaran")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="kontakAlamat">Alamat</Label>
          <Input
            id="kontakAlamat"
            disabled={busy}
            {...form.register("kontakAlamat")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ppdbGelombang1Label">Gelombang 1</Label>
          <Input
            id="ppdbGelombang1Label"
            disabled={busy}
            {...form.register("ppdbGelombang1Label")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ppdbGelombang2Label">Gelombang 2</Label>
          <Input
            id="ppdbGelombang2Label"
            disabled={busy}
            {...form.register("ppdbGelombang2Label")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ppdbJamLayanan">Jam layanan</Label>
            <Input
              id="ppdbJamLayanan"
              disabled={busy}
              {...form.register("ppdbJamLayanan")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppdbBiayaKeterangan">Keterangan biaya</Label>
            <Input
              id="ppdbBiayaKeterangan"
              disabled={busy}
              {...form.register("ppdbBiayaKeterangan")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-[color:var(--color-border)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-brand)]">
          Sambutan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sambutanNamaKepala">Nama kepala sekolah</Label>
            <Input
              id="sambutanNamaKepala"
              disabled={busy}
              {...form.register("sambutanNamaKepala")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sambutanJabatan">Jabatan</Label>
            <Input
              id="sambutanJabatan"
              disabled={busy}
              {...form.register("sambutanJabatan")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-[color:var(--color-border)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-brand)]">
          Media sosial
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["sosialInstagramUrl", "Instagram"],
              ["sosialYoutubeUrl", "YouTube"],
              ["sosialFacebookUrl", "Facebook"],
              ["sosialTiktokUrl", "TikTok"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                disabled={busy}
                placeholder="https://..."
                {...form.register(name)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-[color:var(--color-border)] pt-4">
        <Button type="submit" size="sm" disabled={busy || !apiReady}>
          {busy ? "Menyimpan…" : "Simpan pengaturan"}
        </Button>
        {initial.updatedAt ? (
          <p className="text-xs text-[color:var(--color-body-subtle)]">
            Terakhir diubah:{" "}
            {new Date(initial.updatedAt).toLocaleString("id-ID")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
