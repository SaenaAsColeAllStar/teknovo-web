"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { BeritaRichTextEditor } from "@/components/dashboard/berita/BeritaRichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  beritaFormSchema,
  createBerita,
  deleteBerita,
  isApiConfigured,
  slugifyJudul,
  updateBerita,
  type BeritaFormValues,
} from "@/lib/api-client";
import { revalidateBeritaCache } from "@/lib/cms-revalidate";
import type { Berita } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

type Props = {
  mode: "create" | "edit";
  initial?: Berita;
  kategori: Kategori[];
};

const selectClassName =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:cursor-not-allowed disabled:opacity-50";

export function BeritaForm({ mode, initial, kategori }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [busy, setBusy] = useState<"draft" | "publish" | "delete" | null>(null);
  const [slugLocked, setSlugLocked] = useState(Boolean(initial?.slug) || mode === "edit");
  const apiReady = isApiConfigured();

  const form = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaFormSchema),
    defaultValues: {
      judul: initial?.judul ?? "",
      slug: initial?.slug ?? "",
      ringkasan: initial?.ringkasan ?? "",
      konten: initial?.konten ?? "",
      kategoriId: initial?.kategori?.id ?? "",
      status: initial?.status ?? "DRAFT",
      coverUrl: initial?.coverUrl ?? "",
    },
  });

  async function withToken() {
    const token = await getToken();
    if (!token) {
      throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    }
    return token;
  }

  async function save(values: BeritaFormValues, intent: "draft" | "publish") {
    if (!apiReady) {
      toast.error("API belum dikonfigurasi", {
        description:
          "Set API_URL / NEXT_PUBLIC_API_URL ke base URL api-web (lihat .env.example).",
      });
      return;
    }

    const payload: BeritaFormValues = {
      ...values,
      status:
        intent === "publish"
          ? "PUBLISHED"
          : mode === "create"
            ? "DRAFT"
            : values.status,
    };

    setBusy(intent);
    try {
      const token = await withToken();
      const saved =
        mode === "create"
          ? await createBerita(payload, token)
          : await updateBerita(initial!.id, payload, token);

      if (saved.status === "PUBLISHED") {
        try {
          await revalidateBeritaCache(saved.slug);
        } catch {
          /* revalidate is best-effort; api-web may also call /api/revalidate */
        }
      }

      toast.success(
        saved.status === "PUBLISHED" ? "Berita dipublikasikan" : "Draft disimpan",
      );
      router.push(`/dashboard/berita/${saved.id}/edit`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Gagal menyimpan berita.";
      toast.error(message);
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    if (!initial || !apiReady) return;
    if (!window.confirm(`Hapus berita "${initial.judul}"?`)) return;

    setBusy("delete");
    try {
      const token = await withToken();
      await deleteBerita(initial.id, token);
      try {
        await revalidateBeritaCache(initial.slug);
      } catch {
        /* ignore */
      }
      toast.success("Berita dihapus");
      router.push("/dashboard/berita");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menghapus berita.",
      );
    } finally {
      setBusy(null);
    }
  }

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
            (tanpa trailing slash) mengarah ke api-web homelab. Opsional:{" "}
            <code>REVALIDATE_SECRET</code> agar api-web bisa memanggil{" "}
            <code>/api/revalidate</code> setelah publish.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="judul">Judul</Label>
        <Input
          id="judul"
          disabled={!!busy}
          {...form.register("judul", {
            onChange: (event) => {
              if (slugLocked) return;
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
          disabled={!!busy}
          {...form.register("slug", {
            onChange: () => {
              setSlugLocked(true);
            },
          })}
          placeholder="contoh-berita"
        />
        {form.formState.errors.slug ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.slug.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ringkasan">Ringkasan</Label>
        <Input id="ringkasan" disabled={!!busy} {...form.register("ringkasan")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverUrl">Cover URL</Label>
        <Input
          id="coverUrl"
          disabled={!!busy}
          placeholder="https://..."
          {...form.register("coverUrl")}
        />
        {form.formState.errors.coverUrl ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.coverUrl.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kategoriId">Kategori</Label>
          <select
            id="kategoriId"
            className={selectClassName}
            disabled={!!busy}
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
          <select
            id="status"
            className={selectClassName}
            disabled={!!busy}
            {...form.register("status")}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
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
              disabled={!!busy}
            />
          )}
        />
        {form.formState.errors.konten ? (
          <p className="text-xs text-[color:var(--color-danger)]">
            {form.formState.errors.konten.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)] pt-4">
        <Button type="submit" size="sm" variant="secondary" disabled={!!busy}>
          {busy === "draft" ? "Menyimpan…" : "Simpan draft"}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!!busy}
          onClick={form.handleSubmit((values) => save(values, "publish"))}
        >
          {busy === "publish" ? "Mempublikasi…" : "Publikasikan"}
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
    </form>
  );
}
