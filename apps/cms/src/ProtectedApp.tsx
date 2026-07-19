import { useAuth } from "@clerk/react";
import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayoutClient } from "./components/DashboardLayoutClient";
import { ArtikelFormPage, ArtikelListPage } from "./pages/ArtikelPages";
import { BantuanPage } from "./pages/BantuanPage";
import { BeritaFormPage } from "./pages/BeritaFormPage";
import { BeritaListPage } from "./pages/BeritaListPage";
import { DokumentasiPage } from "./pages/DokumentasiPage";
import { KategoriPage } from "./pages/KategoriPage";
import { MediaPage } from "./pages/MediaPage";
import { ModerasiPage } from "./pages/ModerasiPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PengaturanPage } from "./pages/PengaturanPage";
import { PenggunaPage } from "./pages/PenggunaPage";
import {
  EkstrakurikulerFormPage,
  EkstrakurikulerListPage,
  FasilitasFormPage,
  FasilitasListPage,
  PrestasiFormPage,
  PrestasiListPage,
} from "./pages/SiteContentPages";

/**
 * Authenticated CMS shell — lazy-loaded from `App` so `/sign-in` does not
 * download TipTap / dashboard chunks before auth.
 */
export function ProtectedApp() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-neutral-soft)] text-sm text-[color:var(--color-body)]">
        Memuat sesi…
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayoutClient />}>
        <Route index element={<OverviewPage />} />
        <Route path="berita" element={<BeritaListPage />} />
        <Route path="berita/baru" element={<BeritaFormPage mode="create" />} />
        <Route path="berita/:id/edit" element={<BeritaFormPage mode="edit" />} />
        <Route path="artikel" element={<ArtikelListPage />} />
        <Route path="artikel/baru" element={<ArtikelFormPage mode="create" />} />
        <Route path="artikel/:id/edit" element={<ArtikelFormPage mode="edit" />} />
        <Route path="moderasi" element={<ModerasiPage />} />
        <Route path="kategori" element={<KategoriPage />} />
        <Route path="fasilitas" element={<FasilitasListPage />} />
        <Route path="fasilitas/baru" element={<FasilitasFormPage mode="create" />} />
        <Route path="fasilitas/:id/edit" element={<FasilitasFormPage mode="edit" />} />
        <Route path="ekstrakurikuler" element={<EkstrakurikulerListPage />} />
        <Route
          path="ekstrakurikuler/baru"
          element={<EkstrakurikulerFormPage mode="create" />}
        />
        <Route
          path="ekstrakurikuler/:id/edit"
          element={<EkstrakurikulerFormPage mode="edit" />}
        />
        <Route path="prestasi" element={<PrestasiListPage />} />
        <Route path="prestasi/baru" element={<PrestasiFormPage mode="create" />} />
        <Route path="prestasi/:id/edit" element={<PrestasiFormPage mode="edit" />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="pengguna" element={<PenggunaPage />} />
        <Route path="pengaturan" element={<PengaturanPage />} />
        <Route path="dokumentasi" element={<DokumentasiPage />} />
        <Route path="bantuan" element={<BantuanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
