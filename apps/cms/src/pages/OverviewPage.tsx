import { useUser } from "@clerk/react";
import {
  FilePlus2,
  Image as ImageIcon,
  Newspaper,
  PenLine,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";

import { AnalyticsBigWidget } from "@/components/dashboard/AnalyticsBigWidget";
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { TrafficHeatmapWidget } from "@/components/dashboard/TrafficHeatmapWidget";
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
            ? "Tulis artikel ekstrakurikuler, lalu kirim ke redaksi untuk ditinjau."
            : "Kelola berita sekolah, artikel siswa, kategori, dan media situs SMK Teknovo."}{" "}
          Peran Anda: <strong>{CMS_ROLE_LABEL[role]}</strong>.
        </p>
      </div>

      {!isSiswa ? (
        <DashboardAnalytics
          canAccessBerita={canAccessBeritaSekolah}
          canViewModerasi={canViewModerasi}
        />
      ) : null}

      {/* Preview widgets — sample data; wire to analytics API later. */}
      <section className="space-y-3" aria-labelledby="traffic-analytics-heading">
        <div>
          <h2
            id="traffic-analytics-heading"
            className="text-lg font-semibold text-[color:var(--color-heading)]"
          >
            Ringkasan lalu lintas
          </h2>
          <p className="mt-1 text-xs text-[color:var(--color-body-subtle)]">
            Pratinjau widget analitik (data contoh — belum tersambung ke API).
          </p>
        </div>
        <div className="overflow-x-auto pb-1">
          <AnalyticsBigWidget />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="traffic-heatmap-heading">
        <div>
          <h2
            id="traffic-heatmap-heading"
            className="text-lg font-semibold text-[color:var(--color-heading)]"
          >
            Heatmap sesi
          </h2>
          <p className="mt-1 text-xs text-[color:var(--color-body-subtle)]">
            Kepadatan lalu lintas per setengah jam (data contoh).
          </p>
        </div>
        <div className="overflow-x-auto pb-1">
          <TrafficHeatmapWidget />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {canAccessBeritaSekolah ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Newspaper className="size-4" /> Berita
              </CardTitle>
              <CardDescription>Pengumuman & kegiatan resmi</CardDescription>
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
              {isSiswa
                ? "Draf → kirim ke moderasi"
                : "Tulisan ekstrakurikuler siswa"}
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
                  ? "Buat artikel untuk dimoderasi"
                  : canWrite
                    ? "Berita sekolah atau artikel siswa"
                    : "Artikel siswa"
                : "Akses hanya baca"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canWriteArtikel ? (
              canWrite && canAccessBeritaSekolah ? (
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/berita/baru">Buat berita</Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/artikel/baru">Buat artikel</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link to="/artikel/baru">
                    {isSiswa || !canWrite ? "Buat artikel" : "Buat berita"}
                  </Link>
                </Button>
              )
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
              <CardDescription>Antrian menunggu persetujuan</CardDescription>
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
            <CardDescription>Label untuk berita & artikel</CardDescription>
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
            <CardDescription>Unggah cover & gambar</CardDescription>
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
          <CardTitle>Panduan singkat</CardTitle>
          <CardDescription>
            CMS undangan saja — akses mengikuti peran akun. Detail alur publikasi
            dan peran ada di{" "}
            <Link
              to="/dokumentasi"
              className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
            >
              Dokumentasi
            </Link>
            {" "}atau{" "}
            <Link
              to="/bantuan"
              className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
            >
              Bantuan
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
          <p>
            Berita sekolah dapat langsung diterbitkan oleh staf redaksi. Artikel
            siswa melewati antrian Moderasi sebelum tampil di situs publik.
          </p>
          <p>
            Setelah konten terbit, situs smkteknovo.sch.id di-rebuild otomatis
            (biasanya beberapa menit). Jika belum muncul, hard refresh browser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
