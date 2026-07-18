import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  beritaFormSchema,
  slugifyJudul,
  type Berita,
  type BeritaFormValues,
  type BeritaStatus,
} from "@teknovo/shared";
import { toast } from "sonner";
import { RichTextEditor } from "../components/RichTextEditor";
import { apiRequest } from "../lib/api";

const empty: BeritaFormValues = {
  judul: "",
  slug: "",
  ringkasan: "",
  konten: "",
  kategoriId: "",
  status: "DRAFT",
  coverUrl: "",
  metaTitle: "",
  metaDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
};

export function BeritaFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [form, setForm] = useState<BeritaFormValues>(empty);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const item = await apiRequest<Berita>(`/api/v1/berita/id/${id}`, {
          token,
        });
        if (cancelled) return;
        setForm({
          judul: item.judul,
          slug: item.slug,
          ringkasan: item.ringkasan ?? "",
          konten: item.konten,
          kategoriId: item.kategori?.id ?? "",
          status: item.status,
          coverUrl: item.coverUrl ?? "",
          metaTitle: item.metaTitle ?? "",
          metaDescription: item.metaDescription ?? "",
          ogImageUrl: item.ogImageUrl ?? "",
          canonicalUrl: item.canonicalUrl ?? "",
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal memuat");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = beritaFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Validasi gagal");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (mode === "create") {
        const created = await apiRequest<Berita>("/api/v1/berita", {
          method: "POST",
          token,
          body: parsed.data,
        });
        toast.success("Berita dibuat");
        navigate(`/berita/${created.id}/edit`);
      } else if (id) {
        await apiRequest<Berita>(`/api/v1/berita/${id}`, {
          method: "PATCH",
          token,
          body: parsed.data,
        });
        toast.success("Berita disimpan");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-[var(--muted)]">Memuat…</p>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">
        {mode === "create" ? "Berita baru" : "Edit berita"}
      </h1>
      <Field label="Judul">
        <input
          className="w-full border border-[var(--border)] px-3 py-2"
          value={form.judul}
          onChange={(e) => {
            const judul = e.target.value;
            setForm((f) => ({
              ...f,
              judul,
              slug: mode === "create" ? slugifyJudul(judul) : f.slug,
            }));
          }}
        />
      </Field>
      <Field label="Slug">
        <input
          className="w-full border border-[var(--border)] px-3 py-2"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
      </Field>
      <Field label="Ringkasan">
        <textarea
          className="w-full border border-[var(--border)] px-3 py-2"
          rows={3}
          value={form.ringkasan ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, ringkasan: e.target.value }))
          }
        />
      </Field>
      <Field label="Konten (TipTap)">
        <RichTextEditor
          value={form.konten}
          onChange={(konten) => setForm((f) => ({ ...f, konten }))}
        />
      </Field>
      <Field label="Status">
        <select
          className="border border-[var(--border)] px-3 py-2"
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              status: e.target.value as BeritaStatus,
            }))
          }
        >
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </Field>
      <Field label="Cover URL">
        <input
          className="w-full border border-[var(--border)] px-3 py-2"
          value={form.coverUrl ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, coverUrl: e.target.value }))
          }
        />
      </Field>
      <button
        type="submit"
        disabled={saving}
        className="border border-[var(--brand)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
