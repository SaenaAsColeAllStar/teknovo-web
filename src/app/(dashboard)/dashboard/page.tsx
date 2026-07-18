import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  FilePlus2,
  Image as ImageIcon,
  Newspaper,
  PenLine,
  ShieldCheck,
  Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCmsSession } from "@/lib/cms-auth";
import { CMS_ROLE_LABEL } from "@/lib/clerk";

export default async function DashboardHomePage() {
  const user = await currentUser();
  const cms = await getCmsSession();
  const nama =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Editor";
  const role = cms?.role ?? "viewer";
  const canWrite = cms?.canWrite ?? false;
  const canWriteArtikel = cms?.canWriteArtikel ?? false;
  const canViewModerasi = cms?.canViewModerasi ?? false;
  const canAccessBeritaSekolah = cms?.canAccessBeritaSekolah ?? true;
  const isSiswa = role === "siswa";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Halo, {nama}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          {isSiswa
            ? "Kirim artikel ekstrakurikuler untuk dimoderasi redaksi sekolah."
            : "Kelola berita, artikel siswa, kategori, dan media portal SMK Teknovo."}{" "}
          Peran Anda: <strong>{CMS_ROLE_LABEL[role]}</strong>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {canAccessBeritaSekolah ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Newspaper className="size-4" /> Berita
              </CardTitle>
              <CardDescription>Berita sekolah (staff)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/berita">Kelola</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PenLine className="size-4" /> Artikel siswa
            </CardTitle>
            <CardDescription>
              {isSiswa ? "Milik sendiri · DRAFT → REVIEW" : "Channel ekskul"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/artikel">Kelola</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FilePlus2 className="size-4" /> Tulis baru
            </CardTitle>
            <CardDescription>
              {canWriteArtikel
                ? isSiswa
                  ? "Buat artikel untuk moderasi"
                  : canWrite
                    ? "Berita atau artikel siswa"
                    : "Artikel siswa"
                : "Hanya baca"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canWriteArtikel ? (
              <Button asChild size="sm">
                <Link
                  href={
                    isSiswa || !canWrite
                      ? "/dashboard/artikel/baru"
                      : "/dashboard/berita/baru"
                  }
                >
                  {isSiswa || !canWrite ? "Buat artikel" : "Buat berita"}
                </Link>
              </Button>
            ) : (
              <Button size="sm" disabled>
                Buat konten
              </Button>
            )}
          </CardContent>
        </Card>

        {canViewModerasi ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" /> Moderasi
              </CardTitle>
              <CardDescription>Antrian REVIEW</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/moderasi">Buka antrian</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tags className="size-4" /> Kategori
            </CardTitle>
            <CardDescription>Taksonomi konten</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/kategori">Kelola</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4" /> Media
            </CardTitle>
            <CardDescription>Upload R2 CMS</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/media">Kelola</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status integrasi</CardTitle>
          <CardDescription>
            CMS memanggil API homelab (`API_URL`) dan R2 (`CMS_BUCKET`). Lihat
            docs/API.md.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
          <p>
            API_URL:{" "}
            <code className="bg-[color:var(--color-neutral-soft)] px-1">
              {process.env.NEXT_PUBLIC_API_URL ||
                process.env.API_URL ||
                "(belum diset)"}
            </code>
          </p>
          <p>
            R2_PUBLIC_URL:{" "}
            <code className="bg-[color:var(--color-neutral-soft)] px-1">
              {process.env.R2_PUBLIC_URL || "(default r2.ctos.web.id)"}
            </code>
          </p>
          <p>
            Clerk roles: <code>publicMetadata.role</code> ∈{" "}
            <code>admin|editor|viewer|siswa</code>. Artikel siswa:{" "}
            <code>/v1/artikel-siswa</code> · moderasi approve hanya{" "}
            <code>admin</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
