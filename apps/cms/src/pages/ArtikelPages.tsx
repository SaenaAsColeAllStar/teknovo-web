import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  artikelSiswaFormSchema,
  slugifyJudul,
  type ArtikelSiswa,
  type ArtikelSiswaFormValues,
  type ArtikelSiswaListItem,
} from "@teknovo/shared";
import { toast } from "sonner";
import { RichTextEditor } from "../components/RichTextEditor";
import { apiList, apiRequest } from "../lib/api";

export function ArtikelListPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ArtikelSiswaListItem[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await apiList<ArtikelSiswaListItem>(
        "/api/v1/artikel-siswa?limit=50",
        token,
      );
      setItems(res.data);
    })().catch((err) => toast.error(err.message));
  }, [getToken]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Artikel siswa</h1>
        <Link
          to="/artikel/baru"
          className="bg-[var(--brand)] px-3 py-2 text-sm text-white"
        >
          Baru
        </Link>
      </div>
      <ul className="divide-y border border-[var(--border)]">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between p-3">
            <div>
              <p className="font-medium">{item.judul}</p>
              <p className="text-xs text-[var(--muted)]">{item.status}</p>
            </div>
            <Link to={`/artikel/${item.id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const emptyArtikel: ArtikelSiswaFormValues = {
  judul: "",
  slug: "",
  ringkasan: "",
  konten: "",
  kategoriId: "",
  status: "DRAFT",
  coverUrl: "",
  penulisKelas: "",
};

export function ArtikelFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [form, setForm] = useState(emptyArtikel);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    (async () => {
      const token = await getToken();
      const item = await apiRequest<ArtikelSiswa>(
        `/api/v1/artikel-siswa/id/${id}`,
        { token },
      );
      setForm({
        judul: item.judul,
        slug: item.slug,
        ringkasan: item.ringkasan ?? "",
        konten: item.konten,
        kategoriId: item.kategori?.id ?? "",
        status: item.status,
        coverUrl: item.coverUrl ?? "",
        penulisKelas: item.penulis?.kelas ?? "",
      });
    })().catch((err) => toast.error(err.message));
  }, [mode, id, getToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = artikelSiswaFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (mode === "create") {
        const created = await apiRequest<ArtikelSiswa>("/api/v1/artikel-siswa", {
          method: "POST",
          token,
          body: parsed.data,
        });
        navigate(`/artikel/${created.id}/edit`);
      } else if (id) {
        await apiRequest(`/api/v1/artikel-siswa/${id}`, {
          method: "PATCH",
          token,
          body: parsed.data,
        });
        toast.success("Disimpan");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">
        {mode === "create" ? "Artikel baru" : "Edit artikel"}
      </h1>
      <input
        className="w-full border border-[var(--border)] px-3 py-2"
        placeholder="Judul"
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
      <input
        className="w-full border border-[var(--border)] px-3 py-2"
        placeholder="Slug"
        value={form.slug}
        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
      />
      <RichTextEditor
        value={form.konten}
        onChange={(konten) => setForm((f) => ({ ...f, konten }))}
      />
      <select
        className="border border-[var(--border)] px-3 py-2"
        value={form.status}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            status: e.target.value as ArtikelSiswaFormValues["status"],
          }))
        }
      >
        <option value="DRAFT">DRAFT</option>
        <option value="REVIEW">REVIEW</option>
        <option value="PUBLISHED">PUBLISHED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
      <button
        type="submit"
        disabled={saving}
        className="bg-[var(--brand)] px-4 py-2 text-white"
      >
        Simpan
      </button>
    </form>
  );
}
