import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Menyelesaikan masuk",
  robots: { index: false, follow: false },
};

/**
 * OAuth / SSO callback for custom `signIn.sso()` flows.
 * Must stay public (not under /dashboard).
 */
export default function SsoCallbackPage(): ReactElement {
  return (
    <main className="flex min-h-screen min-h-dvh items-center justify-center bg-gradient-to-br from-[#F5F5FC] via-white to-[#EEF0FA] px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-[color:var(--color-body)]">Menyelesaikan masuk…</p>
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/sign-in?message=invite-only"
          signInUrl="/sign-in"
          signUpUrl="/sign-in"
        />
      </div>
    </main>
  );
}
