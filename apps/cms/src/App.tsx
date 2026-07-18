import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { DashboardLayoutClient } from "./components/DashboardLayoutClient";
import { ArtikelFormPage, ArtikelListPage } from "./pages/ArtikelPages";
import { BeritaFormPage } from "./pages/BeritaFormPage";
import { BeritaListPage } from "./pages/BeritaListPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { KategoriPage } from "./pages/KategoriPage";
import { MediaPage } from "./pages/MediaPage";
import { ModerasiPage } from "./pages/ModerasiPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PengaturanPage } from "./pages/PengaturanPage";
import { PenggunaPage } from "./pages/PenggunaPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SsoCallbackPage } from "./pages/SsoCallbackPage";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

function ProtectedApp() {
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

export function App() {
  if (!pk || pk.startsWith("GANTI_")) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">CMS belum dikonfigurasi</h1>
        <p className="mt-2 text-sm text-[color:var(--color-body)]">
          Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> dan <code>VITE_API_URL</code>{" "}
          (default https://cf.smkteknovo.sch.id/api).
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={pk}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/sso-callback" element={<SsoCallbackPage />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ClerkProvider>
  );
}
