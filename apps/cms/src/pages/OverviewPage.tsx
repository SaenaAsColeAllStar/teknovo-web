import { useUser } from "@clerk/clerk-react";
import {
  FilePlus2,
  Image as ImageIcon,
  Newspaper,
  PenLine,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CMS_ROLE_LABEL } from "@teknovo/shared";

/** Mirrors `src/app/(dashboard)/dashboard/page.tsx`, resolved client-side for the SPA. */
export function OverviewPage() {
  const { user } = useUser();
  const { role, canWrite, canWriteArtikel, canViewModerasi, canAccessBeritaSekolah } =
    useCmsRole();
  const nama = user?.fullName || user?.primaryEmailAddress?.emailAddress || "Editor";
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

      {!isSiswa ? (
        <DashboardAnalytics
          canAccessBerita={canAccessBeritaSekolah}
          canViewModerasi={canViewModerasi}
        />
      ) : null}

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
                <Link to="/berita">Kelola</Link>
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
              <Link to="/artikel">Kelola</Link>
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
                <Link to={isSiswa || !canWrite ? "/artikel/baru" : "/berita/baru"}>
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
                <Link to="/moderasi">Buka antrian</Link>
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
              <Link to="/kategori">Kelola</Link>
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
              <Link to="/media">Kelola</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status integrasi</CardTitle>
          <CardDescription>
            CMS memakai Cloudflare D1 (`teknovo-article`) via `/api/v1`, media di R2
            (`CMS_BUCKET`). Lihat docs/API.md.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
          <p>
            Backend konten:{" "}
            <code className="bg-[color:var(--color-neutral-soft)] px-1">
              D1 teknovo-article (/api/v1)
            </code>
          </p>
          <p>
            Clerk roles: <code>publicMetadata.role</code> ∈{" "}
            <code>admin|editor|viewer|siswa</code>. Artikel siswa:{" "}
            <code>/v1/artikel-siswa</code> · moderasi approve hanya <code>admin</code>.
            Pengaturan: <code>/v1/pengaturan</code> (admin).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
