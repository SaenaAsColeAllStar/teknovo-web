/**
 * Clerk Future / Signal helpers for custom sign-in flows.
 * Bridges MFA email APIs across clerk-js versions and safely finalizes sessions.
 */

export type ClerkErrorResult = { error: { message?: string } | null };

export type SignInMfaEmailExtras = {
  sendEmailCode?: () => Promise<ClerkErrorResult>;
  verifyEmailCode?: (params: { code: string }) => Promise<ClerkErrorResult>;
};

/** Runtime status values beyond older SignInStatus unions. */
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
  sendCode?: (params?: { emailAddress?: string }) => Promise<ClerkErrorResult>;
  verifyCode?: (params: { code: string }) => Promise<ClerkErrorResult>;
};

type FinalizeNavigateArgs = {
  session?: { currentTask?: unknown } | null;
  decorateUrl?: (url: string) => string;
};

type FinalizableSignIn = {
  finalize: (params?: {
    navigate?: (args: FinalizeNavigateArgs) => void | Promise<unknown>;
  }) => Promise<ClerkErrorResult>;
};

export async function sendMfaEmailCode(
  mfa: SignInMfaEmailExtras,
  emailCode: object | null | undefined,
  emailAddress?: string,
): Promise<ClerkErrorResult> {
  if (typeof mfa.sendEmailCode === "function") {
    return mfa.sendEmailCode();
  }
  const channel = emailCode as EmailCodeChannel | null | undefined;
  if (typeof channel?.sendCode === "function") {
    return channel.sendCode(emailAddress ? { emailAddress } : undefined);
  }
  return { error: { message: "Metode pengiriman kode email tidak tersedia." } };
}

export async function verifyMfaEmailCode(
  mfa: SignInMfaEmailExtras,
  emailCode: object | null | undefined,
  code: string,
): Promise<ClerkErrorResult> {
  if (typeof mfa.verifyEmailCode === "function") {
    return mfa.verifyEmailCode({ code });
  }
  const channel = emailCode as EmailCodeChannel | null | undefined;
  if (typeof channel?.verifyCode === "function") {
    return channel.verifyCode({ code });
  }
  return { error: { message: "Metode verifikasi kode email tidak tersedia." } };
}

/**
 * Activate the completed sign-in session.
 * Uses `decorateUrl` when Clerk provides it (Core 3 / clerk-js v6+); otherwise
 * navigates with the raw path so older runtimes do not throw `_ is not a function`.
 */
export async function finalizeWithNavigate(
  signIn: FinalizableSignIn,
  path: string,
  routerNavigate: (url: string) => void,
): Promise<ClerkErrorResult> {
  if (typeof signIn.finalize !== "function") {
    return { error: { message: "Sesi masuk tidak dapat diselesaikan. Muat ulang halaman." } };
  }

  return signIn.finalize({
    navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) return;

      const url =
        typeof decorateUrl === "function" ? decorateUrl(path) : path;

      if (typeof url === "string" && url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      routerNavigate(url || path);
    },
  });
}

export async function resetSignIn(signIn: object): Promise<void> {
  const resetable = signIn as { reset?: () => Promise<unknown> | void };
  if (typeof resetable.reset === "function") {
    await resetable.reset();
  }
}
