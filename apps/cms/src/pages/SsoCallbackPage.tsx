import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import type { ReactElement } from "react";

/**
 * OAuth / SSO callback for custom `signIn.sso()` flows.
 */
export function SsoCallbackPage(): ReactElement {
  return (
    <main className="flex min-h-screen min-h-dvh items-center justify-center bg-[color:var(--color-neutral-soft)] px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-[color:var(--color-body)]">Menyelesaikan masuk…</p>
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        />
        <div id="clerk-captcha" className="mt-4" />
      </div>
    </main>
  );
}
