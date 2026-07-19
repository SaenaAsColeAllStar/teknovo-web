import { CircleHelp, ExternalLink, Mail, MessageCircle, Scale } from "lucide-react";
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

const HELP_MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  `Bantuan CMS ${BRAND_SHORT}`,
)}`;

/**
 * Static in-app help + terms — no live CMS data.
 * Route: `/bantuan` (footer “Bantuan & ketentuan”).
 */
export function BantuanPage() {
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
          <CircleHelp className="size-3.5" aria-hidden />
          Dukungan
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[color:var(--color-heading)]">
          Bantuan & ketentuan
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Cara memakai CMS {BRAND_SHORT}, alur publikasi, dan ketentuan penggunaan
          akun. Panduan teknis lebih lengkap di{" "}
          <Link
            to="/dokumentasi"
            className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
          >
            Dokumentasi
          </Link>
          .
        </p>
      </div>

      <nav
        aria-label="Daftar isi"
        className="flex flex-wrap gap-x-4 gap-y-1 border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm"
      >
        <a
          href="#bantuan"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Bantuan
        </a>
        <a
          href="#peran"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Peran
        </a>
        <a
          href="#publikasi"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Publikasi
        </a>
        <a
          href="#ketentuan"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Ketentuan
        </a>
        <a
          href="#kontak"
          className="text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Kontak
        </a>
      </nav>

      <section id="bantuan" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Cara mendapat bantuan
        </h2>
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm text-[color:var(--color-body)]">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Baca tip di sidebar dan halaman{" "}
                <Link
                  to="/dokumentasi"
                  className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
                >
                  Dokumentasi
                </Link>{" "}
                (publikasi, peran, media, API).
              </li>
              <li>
                Cek pertanyaan umum di bawah — sebagian besar masalah akses
                berkaitan dengan peran akun.
              </li>
              <li>
                Jika akun terkunci, undangan belum masuk, atau role salah, hubungi
                Super Admin sekolah atau email {CONTACT.email}.
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section id="peran" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Peran di CMS
        </h2>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm text-[color:var(--color-body)]">
            <p>
              <strong>Super Admin</strong> — kelola berita, setujui/tolak artikel
              di Moderasi, pengaturan situs, undang tim (termasuk Super Admin lain).
            </p>
            <p>
              <strong>Admin</strong> (editor) — tulis/publish berita dan artikel,
              lihat antrian REVIEW, undang Siswa. Tidak mengubah pengaturan situs
              atau approve artikel.
            </p>
            <p>
              <strong>Siswa</strong> — tulis artikel milik sendiri (DRAFT → REVIEW),
              upload media. Tidak mengakses berita sekolah atau moderasi.
            </p>
            <p>
              <strong>Viewer</strong> — hanya baca. Tombol Buat konten tidak
              tersedia.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="publikasi" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Publikasi: berita vs artikel siswa
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Berita sekolah</CardTitle>
            <CardDescription>Staff redaksi (Super Admin / Admin)</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-[color:var(--color-body)]">
            Buat dari <strong>Buat konten → Berita</strong> atau Konten → Berita
            baru. Simpan <code>DRAFT</code> atau langsung <code>PUBLISHED</code>.
            Setelah terbit, situs publik di-rebuild otomatis.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Artikel siswa</CardTitle>
            <CardDescription>Alur DRAFT → REVIEW → PUBLISHED</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-[color:var(--color-body)]">
            Siswa (atau staff) menulis artikel, mengirim ke <code>REVIEW</code>,
            lalu Super Admin menyetujui di <strong>Moderasi</strong>. Penolakan
            mengarsipkan artikel. Hanya konten yang disetujui yang tampil di
            smkteknovo.sch.id.
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Pertanyaan umum
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Berita sudah dipublish tapi belum muncul di situs?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
            <p>
              Tunggu beberapa menit untuk rebuild Astro, lalu hard refresh. Pastikan
              status benar-benar <code>PUBLISHED</code>.
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/dokumentasi#publikasi">Lihat panduan publikasi</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tidak bisa mengakses Berita / Moderasi / Pengaturan?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[color:var(--color-body)]">
            Menu mengikuti peran Clerk. Minta Super Admin menyesuaikan role di{" "}
            <strong>Pengguna</strong> jika akses kurang.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lupa kata sandi / tidak bisa masuk?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[color:var(--color-body)]">
            Gunakan lupa kata sandi di halaman masuk. CMS undangan saja — akun baru
            hanya lewat <strong>Undang tim</strong>, bukan daftar mandiri.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Email undangan belum masuk / lambat?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
            <p>
              Email dikirim oleh <strong>Clerk</strong> (bukan SMTP sekolah).
              Setelah undang, tunggu 1–2 menit dan cek folder spam/promosi. Anda
              juga bisa <strong>salin tautan</strong> atau{" "}
              <strong>Kirim via WhatsApp</strong> dari modal / tab Undangan.
            </p>
            <p className="font-medium text-[color:var(--color-heading)]">
              Checklist Clerk Dashboard (Super Admin teknis):
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Emails</strong> / Customization → pastikan template{" "}
                <code>Invitation</code> aktif dan pengiriman email tidak
                dinonaktifkan.
              </li>
              <li>
                Instance <strong>Production</strong> (development sering menunda
                atau hanya menampilkan email di Dashboard).
              </li>
              <li>
                <strong>Domains / Paths</strong> — izinkan redirect{" "}
                <code>https://cms.smkteknovo.sch.id/sign-in</code> (dan origin
                CMS).
              </li>
              <li>
                <strong>User &amp; authentication → Email address</strong>{" "}
                enabled; Restrictions = invite-only / sign-up tertutup.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="ketentuan" className="scroll-mt-28 space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-heading)]">
          <Scale className="size-5 shrink-0" aria-hidden />
          Ketentuan penggunaan CMS
        </h2>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm text-[color:var(--color-body)]">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Undangan saja.</strong> Akses CMS hanya untuk pihak yang
                diundang sekolah. Jangan meminta atau membuat akun di luar jalur
                Undang tim.
              </li>
              <li>
                <strong>Jaga kredensial.</strong> Jangan membagikan kata sandi,
                tautan reset, atau sesi login kepada orang lain.
              </li>
              <li>
                <strong>Konten bertanggung jawab.</strong> Tulisan, gambar, dan
                media yang dipublikasikan mewakili {BRAND_SHORT}. Patuhi kebijakan
                sekolah, etika jurnalistik, dan hukum yang berlaku (termasuk hak
                cipta dan privasi siswa).
              </li>
              <li>
                <strong>Moderasi redaksi.</strong> Super Admin dapat mengarsipkan,
                menolak, atau mengubah status konten yang tidak sesuai.
              </li>
              <li>
                <strong>Masalah akun.</strong> Untuk reset role, nonaktifkan
                akun, atau undangan gagal, hubungi Super Admin atau kontak sekolah
                di bawah — bukan kanal publik umum.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="kontak" className="scroll-mt-28 space-y-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Hubungi sekolah
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="size-4" aria-hidden />
              Kontak redaksi & IT
            </CardTitle>
            <CardDescription>{CONTACT.address}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={HELP_MAILTO}>
                <Mail className="size-3.5" aria-hidden />
                Email {CONTACT.email}
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/dokumentasi">Dokumentasi CMS</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href="https://smkteknovo.sch.id/kontak"
                target="_blank"
                rel="noopener noreferrer"
              >
                Halaman kontak publik
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
