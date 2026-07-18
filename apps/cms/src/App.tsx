import { ClerkProvider } from "@clerk/clerk-react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SsoCallbackPage } from "./pages/SsoCallbackPage";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

const ProtectedApp = lazy(() =>
  import("./ProtectedApp").then((m) => ({ default: m.ProtectedApp })),
);

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-neutral-soft)] text-sm text-[color:var(--color-body)]">
      Memuat sesi…
    </div>
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
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/sign-in"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/sso-callback" element={<SsoCallbackPage />} />
          <Route
            path="/*"
            element={
              <Suspense fallback={<AuthLoading />}>
                <ProtectedApp />
              </Suspense>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ClerkProvider>
  );
}
