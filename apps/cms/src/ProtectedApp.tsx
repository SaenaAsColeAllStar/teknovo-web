import { useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayoutClient } from "./components/DashboardLayoutClient";
import { ArtikelFormPage, ArtikelListPage } from "./pages/ArtikelPages";
import { BeritaFormPage } from "./pages/BeritaFormPage";
import { BeritaListPage } from "./pages/BeritaListPage";
import { KategoriPage } from "./pages/KategoriPage";
import { MediaPage } from "./pages/MediaPage";
import { ModerasiPage } from "./pages/ModerasiPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PengaturanPage } from "./pages/PengaturanPage";
import { PenggunaPage } from "./pages/PenggunaPage";

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
        <Route path="media" element={<MediaPage />} />
        <Route path="pengguna" element={<PenggunaPage />} />
        <Route path="pengaturan" element={<PengaturanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
