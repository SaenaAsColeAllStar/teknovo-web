/**
 * Clerk Future / Signal APIs that exist in docs & newer clerk-js runtimes,
 * but are incomplete in `@clerk/shared` typings bundled with clerk-react v5.
 */

export type ClerkErrorResult = { error: { message?: string } | null };

export type SignInMfaEmailExtras = {
  sendEmailCode?: () => Promise<ClerkErrorResult>;
  verifyEmailCode?: (params: { code: string }) => Promise<ClerkErrorResult>;
};

/** Runtime status values beyond the published SignInStatus union. */
export type SignInStatusExtended =
  | "needs_identifier"
  | "needs_first_factor"
  | "needs_second_factor"
  | "needs_new_password"
  | "needs_client_trust"
  | "complete";

export function asSignInStatus(status: string | null | undefined): SignInStatusExtended | string {
  return status ?? "";
}

type EmailCodeChannel = {
  sendCode: (params?: { emailAddress?: string }) => Promise<ClerkErrorResult>;
  verifyCode: (params: { code: string }) => Promise<ClerkErrorResult>;
};

function asEmailChannel(emailCode: object): EmailCodeChannel {
  return emailCode as EmailCodeChannel;
}

export async function sendMfaEmailCode(
  mfa: SignInMfaEmailExtras,
  emailCode: object | null | undefined,
  emailAddress?: string,
): Promise<ClerkErrorResult> {
  if (typeof mfa.sendEmailCode === "function") {
    return mfa.sendEmailCode();
  }
  if (emailCode) {
    return asEmailChannel(emailCode).sendCode(
      emailAddress ? { emailAddress } : undefined,
    );
  }
  return { error: { message: "Metode pengiriman kode email tidak tersedia." } };
}

export async function verifyMfaEmailCode(
  mfa: SignInMfaEmailExtras,
  emailCode: object,
  code: string,
): Promise<ClerkErrorResult> {
  if (typeof mfa.verifyEmailCode === "function") {
    return mfa.verifyEmailCode({ code });
  }
  return asEmailChannel(emailCode).verifyCode({ code });
}

export async function resetSignIn(signIn: object): Promise<void> {
  const resetable = signIn as { reset?: () => Promise<unknown> | void };
  if (typeof resetable.reset === "function") {
    await resetable.reset();
  }
}
