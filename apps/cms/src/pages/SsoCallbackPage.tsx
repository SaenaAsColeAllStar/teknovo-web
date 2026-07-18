import { AuthenticateWithRedirectCallback } from "@clerk/react";
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
          // Invite-only: OAuth must not open a public sign-up transfer.
          signUpFallbackRedirectUrl="/sign-in?message=invite-only"
          signInUrl="/sign-in"
          signUpUrl="/sign-in"
          continueSignUpUrl="/sign-in"
        />
      </div>
    </main>
  );
}
