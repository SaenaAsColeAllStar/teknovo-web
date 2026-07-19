import { BookOpen, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BRAND_SHORT, CONTACT } from "@/lib/constants";

const GITHUB_API_MD =
  "https://github.com/SaenaAsColeAllStar/teknovo-web/blob/main/docs/API.md";

/**
 * Static in-app documentation — no live CMS data.
 * Anchors: `#publikasi`, `#peran`, `#media`, `#api`.
 */
export function DokumentasiPage() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--color-body-subtle)]">
          <BookOpen className="size-3.5" aria-hidden />
          Panduan CMS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[color:var(--color-heading)]">
          Dokumentasi
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Ringkasan cara memakai CMS {BRAND_SHORT}: publikasi berita, peran
          pengguna, media, dan kontrak API. Untuk pertanyaan operasional, buka{" "}
          <Link
            to="/bantuan"
            className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Bantuan & ketentuan
          </Link>
          .
        </p>
      </div>

      <nav
        aria-label="Daftar isi"
        className="flex flex-wrap gap-x-4 gap-y-1 border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm"
      >
        <a
          href="#publikasi"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Publikasi
        </a>
        <a
          href="#peran"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Peran
        </a>
        <a
          href="#media"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Media
        </a>
        <a
          href="#api"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          API
        </a>
      </nav>

      <section id="publikasi" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Cara publikasi berita & artikel
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Berita sekolah</CardTitle>
            <CardDescription>
              Untuk Super Admin dan Admin (staff redaksi)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Buka <strong>Konten → Berita baru</strong> atau tombol{" "}
                <strong>Buat konten</strong> di bilah atas, lalu pilih Berita.
              </li>
              <li>
                Isi judul, ringkasan, konten (TipTap), kategori, dan cover bila
                perlu. Simpan sebagai <code>DRAFT</code> atau langsung{" "}
                <code>PUBLISHED</code>.
              </li>
              <li>
                Setelah status <code>PUBLISHED</code>, API memicu rebuild situs
                publik agar konten muncul di smkteknovo.sch.id (biasanya dalam
                beberapa menit).
              </li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Artikel siswa</CardTitle>
            <CardDescription>
              Channel ekstrakurikuler — alur DRAFT → REVIEW → PUBLISHED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Siswa (atau staff) membuat artikel di{" "}
                <strong>Artikel baru</strong>.
              </li>
              <li>
                Siswa mengirim ke antrian dengan status <code>REVIEW</code>.
              </li>
              <li>
                Super Admin menyetujui atau menolak di <strong>Moderasi</strong>.
                Hanya approve yang menerbitkan ke situs publik.
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section id="peran" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Peran & akses
        </h2>
        <Card>
          <CardContent className="overflow-x-auto pt-6">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[color:var(--color-heading)]">
                  <th className="py-2 pr-3 font-semibold">Peran</th>
                  <th className="py-2 pr-3 font-semibold">Berita</th>
                  <th className="py-2 pr-3 font-semibold">Artikel</th>
                  <th className="py-2 font-semibold">Lainnya</th>
                </tr>
              </thead>
              <tbody className="text-[color:var(--color-body)]">
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-2 pr-3 font-medium">Super Admin</td>
                  <td className="py-2 pr-3">CRUD + publish</td>
                  <td className="py-2 pr-3">CRUD + approve</td>
                  <td className="py-2">Pengaturan, undang tim</td>
                </tr>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-2 pr-3 font-medium">Admin</td>
                  <td className="py-2 pr-3">CRUD + publish</td>
                  <td className="py-2 pr-3">CRUD, lihat antrian</td>
                  <td className="py-2">Undang Siswa</td>
                </tr>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-2 pr-3 font-medium">Siswa</td>
                  <td className="py-2 pr-3">Tidak</td>
                  <td className="py-2 pr-3">CRUD milik sendiri</td>
                  <td className="py-2">Upload media</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium">Viewer</td>
                  <td className="py-2 pr-3">Baca</td>
                  <td className="py-2 pr-3">Baca</td>
                  <td className="py-2">Tanpa tulis</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-[color:var(--color-body-subtle)]">
              Role disimpan di Clerk <code>publicMetadata.role</code> (
              <code>admin</code> | <code>editor</code> | <code>siswa</code> |{" "}
              <code>viewer</code>). CMS invite-only — tidak ada daftar publik.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="media" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Media & rebuild
        </h2>
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm text-[color:var(--color-body)]">
            <p>
              Upload gambar lewat halaman <strong>Media</strong>. File disimpan di
              R2 (<code>CMS_BUCKET</code>, prefix <code>cms/uploads/</code>) dan
              dilayani lewat URL publik R2.
            </p>
            <p>
              Setelah berita/artikel terbit atau disetujui, Worker API memicu
              workflow rebuild Astro agar halaman statis di smkteknovo.sch.id
              ikut terbarui. Tidak perlu rebuild manual dari CMS.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="api" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Ringkasan API
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Backend CMS</CardTitle>
            <CardDescription>
              Cloudflare Worker + D1 (<code>teknovo-article</code>) di{" "}
              <code>cf.smkteknovo.sch.id/api</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[color:var(--color-body)]">
            <p>
              Respons sukses berbentuk{" "}
              <code>{`{ "ok": true, "data": … }`}</code>. Auth CMS memakai{" "}
              <code>Authorization: Bearer &lt;Clerk JWT&gt;</code>.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <code>GET/POST/PATCH/DELETE /v1/berita</code> — berita sekolah
              </li>
              <li>
                <code>/v1/artikel-siswa</code> — artikel +{" "}
                <code>approve</code> / <code>reject</code> (Super Admin)
              </li>
              <li>
                <code>/v1/kategori</code>, <code>/v1/pengaturan</code>,{" "}
                <code>/v1/users</code>, <code>/v1/analytics/overview</code>
              </li>
              <li>
                Media: <code>/api/cms/media</code> → R2 (bukan D1)
              </li>
            </ul>
            <p className="text-xs text-[color:var(--color-body-subtle)]">
              Halaman ini merangkum kontrak untuk editor. Spesifikasi lengkap
              (body Zod, query, kode error) ada di repositori.
            </p>
            <Button asChild size="sm" variant="secondary">
              <a
                href={GITHUB_API_MD}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka docs/API.md di GitHub
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <p className="text-xs text-[color:var(--color-body-subtle)]">
        Butuh bantuan? Hubungi {CONTACT.email} atau buka halaman{" "}
        <Link
          to="/bantuan"
          className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Bantuan & ketentuan
        </Link>
        .
      </p>
    </div>
  );
}
