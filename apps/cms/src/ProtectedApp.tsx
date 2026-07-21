import { useAuth } from "@clerk/react";
import {
  Navigate,
  Route,
  Routes,
  UNSAFE_RouteContext,
} from "react-router-dom";

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
import { PlatformPage } from "./pages/PlatformPage";
import {
  KurikulumFormPage,
  KurikulumListPage,
  ProgramJurusanFormPage,
  ProgramJurusanListPage,
  ProgramSekolahFormPage,
  ProgramSekolahListPage,
  TenagaPengajarFormPage,
  TenagaPengajarListPage,
} from "./pages/AkademikSiteContentPages";
import {
  KontakFormPage,
  KontakListPage,
} from "./pages/KontakSiteContentPages";
import {
  PengumumanFormPage,
  PengumumanListPage,
} from "./pages/PengumumanSiteContentPages";
import {
  EkstrakurikulerFormPage,
  EkstrakurikulerListPage,
  FasilitasFormPage,
  FasilitasListPage,
  PrestasiFormPage,
  PrestasiListPage,
} from "./pages/SiteContentPages";

/**
 * Reset parent splat context so nested `<Routes>` match the full location
 * (`/berita/baru`, `/fasilitas/baru`, …) instead of an empty remainder.
 */
const ROOT_ROUTE_CONTEXT = {
  outlet: null,
  matches: [],
  isDataRoute: false,
} as const;

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
    <UNSAFE_RouteContext.Provider value={ROOT_ROUTE_CONTEXT}>
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
          <Route path="kurikulum" element={<KurikulumListPage />} />
          <Route
            path="kurikulum/baru"
            element={<KurikulumFormPage mode="create" />}
          />
          <Route
            path="kurikulum/:id/edit"
            element={<KurikulumFormPage mode="edit" />}
          />
          <Route path="program-sekolah" element={<ProgramSekolahListPage />} />
          <Route
            path="program-sekolah/baru"
            element={<ProgramSekolahFormPage mode="create" />}
          />
          <Route
            path="program-sekolah/:id/edit"
            element={<ProgramSekolahFormPage mode="edit" />}
          />
          <Route path="program-jurusan" element={<ProgramJurusanListPage />} />
          <Route
            path="program-jurusan/baru"
            element={<ProgramJurusanFormPage mode="create" />}
          />
          <Route
            path="program-jurusan/:id/edit"
            element={<ProgramJurusanFormPage mode="edit" />}
          />
          <Route path="tenaga-pengajar" element={<TenagaPengajarListPage />} />
          <Route
            path="tenaga-pengajar/baru"
            element={<TenagaPengajarFormPage mode="create" />}
          />
          <Route
            path="tenaga-pengajar/:id/edit"
            element={<TenagaPengajarFormPage mode="edit" />}
          />
          <Route path="kontak" element={<KontakListPage />} />
          <Route path="kontak/baru" element={<KontakFormPage mode="create" />} />
          <Route
            path="kontak/:id/edit"
            element={<KontakFormPage mode="edit" />}
          />
          <Route path="pengumuman" element={<PengumumanListPage />} />
          <Route
            path="pengumuman/baru"
            element={<PengumumanFormPage mode="create" />}
          />
          <Route
            path="pengumuman/:id/edit"
            element={<PengumumanFormPage mode="edit" />}
          />
          <Route path="media" element={<MediaPage />} />
          <Route path="pengguna" element={<PenggunaPage />} />
          <Route path="platform" element={<PlatformPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
          <Route path="dokumentasi" element={<DokumentasiPage />} />
          <Route path="bantuan" element={<BantuanPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </UNSAFE_RouteContext.Provider>
  );
}
