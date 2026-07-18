import { SignedIn, SignedOut, SignIn, ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "./components/AppShell";
import { OverviewPage } from "./pages/OverviewPage";
import { BeritaListPage } from "./pages/BeritaListPage";
import { BeritaFormPage } from "./pages/BeritaFormPage";
import { ArtikelFormPage, ArtikelListPage } from "./pages/ArtikelPages";
import {
  KategoriPage,
  MediaPage,
  ModerasiPage,
  PengaturanPage,
} from "./pages/CmsExtraPages";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export function App() {
  if (!pk || pk.startsWith("GANTI_")) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">CMS belum dikonfigurasi</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> dan{" "}
          <code>VITE_API_URL</code> (default https://cf.smkteknovo.sch.id).
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={pk}>
      <BrowserRouter>
        <SignedOut>
          <div className="flex min-h-screen items-center justify-center bg-[var(--soft)] p-4">
            <SignIn routing="hash" />
          </div>
        </SignedOut>
        <SignedIn>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<OverviewPage />} />
              <Route path="berita" element={<BeritaListPage />} />
              <Route
                path="berita/baru"
                element={<BeritaFormPage mode="create" />}
              />
              <Route
                path="berita/:id/edit"
                element={<BeritaFormPage mode="edit" />}
              />
              <Route path="artikel" element={<ArtikelListPage />} />
              <Route
                path="artikel/baru"
                element={<ArtikelFormPage mode="create" />}
              />
              <Route
                path="artikel/:id/edit"
                element={<ArtikelFormPage mode="edit" />}
              />
              <Route path="moderasi" element={<ModerasiPage />} />
              <Route path="kategori" element={<KategoriPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="pengaturan" element={<PengaturanPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </SignedIn>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ClerkProvider>
  );
}
