import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import type { ReactElement } from "react";

/**
 * Intermediate OAuth callback for `signIn.sso({ redirectCallbackUrl })`.
 * Used when Google returns and Clerk still needs MFA / missing fields / transfer.
 * Successful OAuth with no extra steps goes straight to `redirectUrl` (`/`).
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
          continueSignUpUrl="/sign-up"
        />
        {/* Required when OAuth transfers into a sign-up (bot protection). */}
        <div id="clerk-captcha" className="mt-4" />
      </div>
    </main>
  );
}
