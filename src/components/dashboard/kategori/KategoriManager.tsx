"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiClientError,
  createKategori,
  deleteKategori,
  isApiConfigured,
  kategoriFormSchema,
  slugifyJudul,
  updateKategori,
  type KategoriFormValues,
} from "@/lib/api-client";
import { revalidateKategoriCache } from "@/lib/cms-revalidate";
import type { Kategori } from "@/types/kategori";

type Props = {
  initial: Kategori[];
  listError: string | null;
};

export function KategoriManager({ initial, listError }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { canWrite, canWriteKategori } = useCmsRole();
  const apiReady = isApiConfigured();
  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);

  const form = useForm<KategoriFormValues>({
    resolver: zodResolver(kategoriFormSchema),
    defaultValues: { nama: "", slug: "", deskripsi: "" },
  });

  const [slugLocked, setSlugLocked] = useState(false);

  function resetForm() {
    setEditingId(null);
    setSlugLocked(false);
    form.reset({ nama: "", slug: "", deskripsi: "" });
  }

  function startEdit(row: Kategori) {
    if (!canWrite) return;
    setEditingId(row.id);
    setSlugLocked(true);
    form.reset({
      nama: row.nama,
      slug: row.slug,
      deskripsi: row.deskripsi ?? "",
    });
  }

  async function withToken() {
    const token = await getToken();
    if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    return token;
  }

  async function onSubmit(values: KategoriFormValues) {
    if (editingId ? !canWrite : !canWriteKategori) {
      toast.error("Peran Anda tidak dapat mengubah kategori.");
      return;
    }
    if (!apiReady) {
      toast.error("API belum dikonfigurasi", {
        description: "Set VITE_API_URL (CMS) atau API_URL lokal (lihat .env.example).",
      });
      return;
    }

    setBusy("save");
    try {
      const token = await withToken();
      const saved = editingId
        ? await updateKategori(editingId, values, token)
        : await createKategori(values, token);

      setItems((prev) => {
        if (editingId) {
          return prev.map((row) => (row.id === editingId ? saved : row));
        }
        return [saved, ...prev];
      });

      try {
        await revalidateKategoriCache();
      } catch {
        /* best-effort */
      }

      toast.success(editingId ? "Kategori diperbarui" : "Kategori dibuat");
      resetForm();
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyimpan kategori.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function onDelete(row: Kategori) {
    if (!canWrite || !apiReady) return;
    if (!window.confirm(`Hapus kategori "${row.nama}"?`)) return;

    setBusy("delete");
    try {
      const token = await withToken();
      await deleteKategori(row.id, token);
      setItems((prev) => prev.filter((item) => item.id !== row.id));
      if (editingId === row.id) resetForm();
      try {
        await revalidateKategoriCache();
      } catch {
        /* ignore */
      }
      toast.success("Kategori dihapus");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menghapus kategori.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
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
            mengarah ke api-web. Kontrak: <code>GET/POST/PATCH/DELETE /v1/kategori</code>.
          </p>
        </div>
      ) : null}

      {listError ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak dapat memuat kategori</CardTitle>
            <CardDescription>{listError}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {canWriteKategori ? (
        <form
          className="space-y-4 border border-[color:var(--color-border)] bg-white p-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
              {editingId && canWrite ? "Edit kategori" : "Kategori baru"}
            </h2>
            {editingId && canWrite ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={!!busy}
                onClick={resetForm}
              >
                Batal edit
              </Button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                disabled={!!busy}
                {...form.register("nama", {
                  onChange: (event) => {
                    if (slugLocked) return;
                    const next = slugifyJudul(event.target.value);
                    if (next) form.setValue("slug", next, { shouldValidate: true });
                  },
                })}
              />
              {form.formState.errors.nama ? (
                <p className="text-xs text-[color:var(--color-danger)]">
                  {form.formState.errors.nama.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                disabled={!!busy}
                {...form.register("slug", {
                  onChange: () => setSlugLocked(true),
                })}
              />
              {form.formState.errors.slug ? (
                <p className="text-xs text-[color:var(--color-danger)]">
                  {form.formState.errors.slug.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
            <Input
              id="deskripsi"
              disabled={!!busy}
              {...form.register("deskripsi")}
            />
          </div>

          <Button type="submit" size="sm" disabled={!!busy || !apiReady}>
            {busy === "save"
              ? "Menyimpan…"
              : editingId
                ? "Simpan perubahan"
                : "Tambah kategori"}
          </Button>
        </form>
      ) : null}

      {!listError && items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Belum ada kategori</CardTitle>
            <CardDescription>
              Buat kategori pertama, atau pastikan api-web melayani{" "}
              <code>GET /v1/kategori</code>.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {items.length > 0 ? (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-body)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Berita</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[color:var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[color:var(--color-heading)]">
                      {row.nama}
                    </p>
                    {row.deskripsi ? (
                      <p className="text-xs text-[color:var(--color-body-subtle)]">
                        {row.deskripsi}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-body)]">
                    /{row.slug}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-body)]">
                    {row.beritaCount ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canWrite ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={!!busy}
                          onClick={() => startEdit(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          disabled={!!busy}
                          onClick={() => void onDelete(row)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-[color:var(--color-body-subtle)]">
                        Baca saja
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
