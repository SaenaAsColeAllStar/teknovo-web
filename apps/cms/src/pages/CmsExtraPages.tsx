import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  kategoriFormSchema,
  slugifyJudul,
  type ArtikelSiswaListItem,
  type Kategori,
  type PengaturanSitusPublikData,
  zPengaturanSitusPublikPatch,
} from "@teknovo/shared";
import { toast } from "sonner";
import { apiList, apiRequest } from "../lib/api";

export function ModerasiPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ArtikelSiswaListItem[]>([]);

  async function load() {
    const token = await getToken();
    const res = await apiList<ArtikelSiswaListItem>(
      "/api/v1/artikel-siswa?status=REVIEW&limit=50",
      token,
    );
    setItems(res.data);
  }

  useEffect(() => {
    load().catch((err) => toast.error(err.message));
  }, [getToken]);

  async function act(id: string, action: "approve" | "reject") {
    const token = await getToken();
    await apiRequest(`/api/v1/artikel-siswa/${id}/${action}`, {
      method: "POST",
      token,
      body: action === "reject" ? { reason: "Ditolak" } : {},
    });
    toast.success(action === "approve" ? "Disetujui" : "Ditolak");
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Moderasi</h1>
      <ul className="divide-y border border-[var(--border)]">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{item.judul}</p>
              <p className="text-xs text-[var(--muted)]">
                {item.penulis?.nama}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-[var(--brand)] px-3 py-1 text-sm text-white"
                onClick={() => act(item.id, "approve")}
              >
                Approve
              </button>
              <button
                type="button"
                className="border border-[var(--border)] px-3 py-1 text-sm"
                onClick={() => act(item.id, "reject")}
              >
                Tolak
              </button>
            </div>
          </li>
        ))}
        {!items.length && (
          <li className="p-4 text-sm text-[var(--muted)]">Antrian kosong.</li>
        )}
      </ul>
    </div>
  );
}

export function KategoriPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<Kategori[]>([]);
  const [nama, setNama] = useState("");

  async function load() {
    const token = await getToken();
    const data = await apiRequest<Kategori[]>("/api/v1/kategori", { token });
    setItems(data);
  }

  useEffect(() => {
    load().catch((err) => toast.error(err.message));
  }, [getToken]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      nama,
      slug: slugifyJudul(nama),
    };
    const parsed = kategoriFormSchema.safeParse(body);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    const token = await getToken();
    await apiRequest("/api/v1/kategori", {
      method: "POST",
      token,
      body: parsed.data,
    });
    setNama("");
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kategori</h1>
      <form onSubmit={create} className="flex gap-2">
        <input
          className="flex-1 border border-[var(--border)] px-3 py-2"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama kategori"
        />
        <button type="submit" className="bg-[var(--brand)] px-4 text-white">
          Tambah
        </button>
      </form>
      <ul className="divide-y border border-[var(--border)]">
        {items.map((k) => (
          <li key={k.id} className="p-3 text-sm">
            {k.nama}{" "}
            <span className="text-[var(--muted)]">({k.slug})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MediaList = {
  objects: { key: string; url: string; size: number }[];
};

export function MediaPage() {
  const { getToken } = useAuth();
  const [objects, setObjects] = useState<MediaList["objects"]>([]);

  async function load() {
    const token = await getToken();
    const data = await apiRequest<MediaList>("/api/cms/media", { token });
    setObjects(data.objects);
  }

  useEffect(() => {
    load().catch((err) => toast.error(err.message));
  }, [getToken]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = await getToken();
    const fd = new FormData();
    fd.append("file", file);
    await apiRequest("/api/cms/media", { method: "POST", token, formData: fd });
    toast.success("Terunggah");
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Media</h1>
      <input type="file" onChange={onUpload} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((obj) => (
          <li key={obj.key} className="border border-[var(--border)] p-2 text-xs">
            {obj.url.match(/\.(png|jpe?g|webp|gif)$/i) ? (
              <img src={obj.url} alt="" className="mb-2 h-32 w-full object-cover" />
            ) : null}
            <a href={obj.url} target="_blank" rel="noreferrer" className="break-all">
              {obj.key}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PengaturanPage() {
  const { getToken } = useAuth();
  const [form, setForm] = useState<PengaturanSitusPublikData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const data = await apiRequest<PengaturanSitusPublikData>(
        "/api/v1/pengaturan",
        { token },
      );
      setForm(data);
    })().catch((err) => toast.error(err.message));
  }, [getToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const parsed = zPengaturanSitusPublikPatch.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const data = await apiRequest<PengaturanSitusPublikData>(
        "/api/v1/pengaturan",
        { method: "PATCH", token, body: parsed.data },
      );
      setForm(data);
      toast.success("Pengaturan disimpan — rebuild site dipicu");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <p>Memuat…</p>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-2xl font-bold">Pengaturan</h1>
      {(
        [
          ["siteTitle", "Judul situs"],
          ["siteDescription", "Deskripsi"],
          ["kontakEmail", "Email"],
          ["whatsappPpdb", "WhatsApp PPDB"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1">
          <span className="text-sm font-medium">{label}</span>
          <input
            className="w-full border border-[var(--border)] px-3 py-2"
            value={String(form[key] ?? "")}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        </label>
      ))}
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
