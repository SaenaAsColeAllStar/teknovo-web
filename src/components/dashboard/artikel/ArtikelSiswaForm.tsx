"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { BeritaRichTextEditor } from "@/components/dashboard/berita/BeritaRichTextEditor";
import { MediaLibrary } from "@/components/dashboard/media/MediaLibrary";
import { ArticleSeoFields } from "@/components/dashboard/seo/ArticleSeoFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  artikelSiswaFormSchema,
  createArtikelSiswa,
  deleteArtikelSiswa,
  isApiConfigured,
  slugifyJudul,
  updateArtikelSiswa,
  type ArtikelSiswaFormValues,
} from "@/lib/api-client";
import { revalidateArtikelSiswaCache } from "@/lib/cms-revalidate";
import type { ArtikelSiswa } from "@/types/artikel-siswa";
import type { Kategori } from "@/types/kategori";

type Props = {
  mode: "create" | "edit";
  initial?: ArtikelSiswa;
  kategori: Kategori[];
};

const selectClassName =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:cursor-not-allowed disabled:opacity-50";

export function ArtikelSiswaForm({ mode, initial, kategori }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { role, canWriteArtikel } = useCmsRole();
  const isSiswa = role === "siswa";
  const [busy, setBusy] = useState<"draft" | "submit" | "delete" | null>(null);
  const [slugLocked, setSlugLocked] = useState(
    Boolean(initial?.slug) || mode === "edit",
  );
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const apiReady = isApiConfigured();
  const readOnly = !canWriteArtikel;

  const form = useForm<ArtikelSiswaFormValues>({
    resolver: zodResolver(artikelSiswaFormSchema),
    defaultValues: {
      judul: initial?.judul ?? "",
      slug: initial?.slug ?? "",
      ringkasan: initial?.ringkasan ?? "",
      konten: initial?.konten ?? "",
      kategoriId: initial?.kategori?.id ?? "",
      status: initial?.status ?? "DRAFT",
      coverUrl: initial?.coverUrl ?? "",
      penulisKelas: initial?.penulis?.kelas ?? "",
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
      metaKeywords: initial?.metaKeywords ?? "",
      ogImageUrl: initial?.ogImageUrl ?? "",
      canonicalUrl: initial?.canonicalUrl ?? "",
    },
  });

  const watchedKategoriId = form.watch("kategoriId");
  const kategoriNama =
    kategori.find((k) => k.id === watchedKategoriId)?.nama ?? null;

  async function withToken() {
    const token = await getToken();
    if (!token) {
      throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    }
    return token;
  }

  async function save(
    values: ArtikelSiswaFormValues,
    intent: "draft" | "submit",
  ) {
    if (readOnly) {
      toast.error("Anda tidak dapat menyimpan artikel.");
      return;
    }
    if (!apiReady) {
      toast.error("API belum dikonfigurasi", {
        description:
          "Set API_URL / NEXT_PUBLIC_API_URL ke base URL api-web (lihat .env.example).",
      });
      return;
    }

    let nextStatus: ArtikelSiswaFormValues["status"];
    if (intent === "submit") {
      nextStatus = "REVIEW";
    } else if (mode === "create") {
      nextStatus = "DRAFT";
    } else if (isSiswa && values.status === "PUBLISHED") {
      /* siswa cannot keep published when editing — back to draft */
      nextStatus = "DRAFT";
    } else {
      nextStatus = values.status;
    }

    const payload: ArtikelSiswaFormValues = {
      ...values,
      status: nextStatus,
    };

    setBusy(intent === "submit" ? "submit" : "draft");
    try {
      const token = await withToken();
      const saved =
        mode === "create"
          ? await createArtikelSiswa(payload, token)
          : await updateArtikelSiswa(initial!.id, payload, token);

      if (saved.status === "PUBLISHED") {
        try {
          await revalidateArtikelSiswaCache(saved.slug);
        } catch {
          /* best-effort */
        }
      }

      toast.success(
        saved.status === "REVIEW"
          ? "Artikel dikirim ke moderasi"
          : saved.status === "PUBLISHED"
            ? "Artikel dipublikasikan"
            : "Draft disimpan",
      );
      router.push(`/dashboard/artikel/${saved.id}/edit`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal menyimpan artikel.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    if (!initial || !apiReady || readOnly) return;
    if (!window.confirm(`Hapus artikel "${initial.judul}"?`)) return;

    setBusy("delete");
    try {
      const token = await withToken();
      await deleteArtikelSiswa(initial.id, token);
      try {
        await revalidateArtikelSiswaCache(initial.slug);
      } catch {
        /* ignore */
      }
      toast.success("Artikel dihapus");
      router.push("/dashboard/artikel");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal menghapus artikel.",
      );
    } finally {
      setBusy(null);
    }
  }

  const statusLockedForSiswa = isSiswa;

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((values) => save(values, "draft"))}
    >
      {!apiReady ? (
        <div
          role="alert"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
        >
          <p className="font-medium text-[color:var(--color-heading)]">
            API_URL belum diset
          </p>
          <p className="mt-1">
            Tambahkan <code>API_URL</code> dan <code>NEXT_PUBLIC_API_URL</code>{" "}
            mengarah ke api-web. Endpoint:{" "}
            <code>POST /v1/artikel-siswa</code>.
          </p>
        </div>
      ) : null}

      {initial?.rejectedReason ? (
        <div
          role="status"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
        >
          <p className="font-medium text-[color:var(--color-heading)]">
            Ditolak moderasi
          </p>
          <p className="mt-1">{initial.rejectedReason}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="judul">Judul</Label>
        <Input
          id="judul"
          disabled={!!busy || readOnly}
          {...form.register("judul", {
            onChange: (event) => {
              if (slugLocked || readOnly) return;
              const next = slugifyJudul(event.target.value);
              if (next) form.setValue("slug", next, { shouldValidate: true });
            },
          })}
        />
        {form.formState.errors.judul ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.judul.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          disabled={!!busy || readOnly}
          {...form.register("slug", {
            onChange: () => setSlugLocked(true),
          })}
          placeholder="judul-artikel-siswa"
        />
        {form.formState.errors.slug ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.slug.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ringkasan">Ringkasan</Label>
        <Input
          id="ringkasan"
          disabled={!!busy || readOnly}
          {...form.register("ringkasan")}
        />
      </div>

      {isSiswa ? (
        <div className="space-y-2">
          <Label htmlFor="penulisKelas">Kelas</Label>
          <Input
            id="penulisKelas"
            disabled={!!busy || readOnly}
            placeholder="XI TM 1"
            {...form.register("penulisKelas")}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="coverUrl">Cover URL</Label>
          {canWriteArtikel ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!!busy}
              onClick={() => setShowMediaPicker((v) => !v)}
            >
              {showMediaPicker ? "Tutup library" : "Pilih dari media"}
            </Button>
          ) : null}
        </div>
        <Input
          id="coverUrl"
          disabled={!!busy || readOnly}
          placeholder="https://..."
          {...form.register("coverUrl")}
        />
        {showMediaPicker ? (
          <div className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-3">
            <p className="mb-3 text-xs text-[color:var(--color-body)]">
              Klik thumbnail untuk mengisi cover URL.
            </p>
            <MediaLibrary
              compact
              fetchOnMount
              onPick={(url) => {
                form.setValue("coverUrl", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                setShowMediaPicker(false);
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kategoriId">Kategori</Label>
          <select
            id="kategoriId"
            className={selectClassName}
            disabled={!!busy || readOnly}
            {...form.register("kategoriId")}
          >
            <option value="">— Tanpa kategori —</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          {statusLockedForSiswa ? (
            <>
              <input type="hidden" {...form.register("status")} />
              <p className="flex h-10 items-center border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-3 text-sm text-[color:var(--color-body)]">
                {form.watch("status") === "REVIEW"
                  ? "Menunggu moderasi (REVIEW)"
                  : form.watch("status") === "PUBLISHED"
                    ? "Published"
                    : form.watch("status") === "ARCHIVED"
                      ? "Archived / ditolak"
                      : "Draft"}
              </p>
              <p className="text-xs text-[color:var(--color-body-subtle)]">
                Siswa mengirim ke REVIEW; admin yang menyetujui publikasi.
              </p>
            </>
          ) : (
            <select
              id="status"
              className={selectClassName}
              disabled={!!busy || readOnly}
              {...form.register("status")}
            >
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Konten</Label>
        <Controller
          control={form.control}
          name="konten"
          render={({ field }) => (
            <BeritaRichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={!!busy || readOnly}
            />
          )}
        />
        {form.formState.errors.konten ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.konten.message}
          </p>
        ) : null}
      </div>

      <ArticleSeoFields
        kind="artikel"
        disabled={!!busy || readOnly}
        register={form.register}
        watch={form.watch}
        setValue={form.setValue}
        errors={form.formState.errors}
        kategoriNama={kategoriNama}
      />

      {canWriteArtikel ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)] pt-4">
          <Button type="submit" size="sm" variant="secondary" disabled={!!busy}>
            {busy === "draft" ? "Menyimpan…" : "Simpan draft"}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!!busy}
            onClick={form.handleSubmit((values) => save(values, "submit"))}
          >
            {busy === "submit"
              ? "Mengirim…"
              : isSiswa
                ? "Kirim ke moderasi"
                : "Simpan & REVIEW"}
          </Button>
          {mode === "edit" ? (
            <Button
              type="button"
              size="sm"
              variant="danger"
              className="ml-auto"
              disabled={!!busy}
              onClick={onDelete}
            >
              {busy === "delete" ? "Menghapus…" : "Hapus"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
