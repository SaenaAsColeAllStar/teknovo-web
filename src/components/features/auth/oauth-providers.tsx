import type { ReactElement, ReactNode } from "react";

/** Clerk OAuth strategy id, e.g. `oauth_google`. */
export type OAuthStrategy = `oauth_${string}`;

export type OAuthProviderMeta = {
  strategy: OAuthStrategy;
  label: string;
  icon: ReactNode;
};

function GoogleGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

function MicrosoftGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#F25022" d="M3 3h8.5v8.5H3V3Z" />
      <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5V3Z" />
      <path fill="#00A4EF" d="M3 12.5h8.5V21H3v-8.5Z" />
      <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5v-8.5Z" />
    </svg>
  );
}

function GitHubGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2Z" />
    </svg>
  );
}

function AppleGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.7ZM14.6 6.5c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.6 2.7-1.4Z" />
    </svg>
  );
}

function FacebookGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="#1877F2" aria-hidden>
      <path d="M14.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6H18V4.1C17.6 4 16.5 4 15.2 4c-2.8 0-4.7 1.7-4.7 4.8v2.7H8v3.2h2.5V22h4Z" />
    </svg>
  );
}

const PROVIDER_META: Partial<Record<OAuthStrategy, Omit<OAuthProviderMeta, "strategy">>> = {
  oauth_google: {
    label: "Lanjutkan dengan Google",
    icon: <GoogleGlyph />,
  },
  oauth_microsoft: {
    label: "Lanjutkan dengan Microsoft",
    icon: <MicrosoftGlyph />,
  },
  oauth_github: {
    label: "Lanjutkan dengan GitHub",
    icon: <GitHubGlyph />,
  },
  oauth_apple: {
    label: "Lanjutkan dengan Apple",
    icon: <AppleGlyph />,
  },
  oauth_facebook: {
    label: "Lanjutkan dengan Facebook",
    icon: <FacebookGlyph />,
  },
};

const PREFERRED_ORDER: OAuthStrategy[] = [
  "oauth_google",
  "oauth_microsoft",
  "oauth_github",
  "oauth_apple",
  "oauth_facebook",
];

function strategyLabel(strategy: OAuthStrategy): string {
  const key = strategy.replace(/^oauth_/, "").replace(/_/g, " ");
  return `Lanjutkan dengan ${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

/**
 * Prefer Google/Microsoft, then other configured strategies — max 2 buttons.
 * Always includes Google so the sign-in UI is never missing it when Clerk
 * returns an empty or incomplete social-strategy list.
 */
export function resolveOAuthProviders(strategies: OAuthStrategy[]): OAuthProviderMeta[] {
  const withGoogle: OAuthStrategy[] =
    strategies.length === 0
      ? ["oauth_google"]
      : strategies.includes("oauth_google")
        ? strategies
        : ["oauth_google", ...strategies];

  const enabled = new Set(withGoogle);
  const ordered = [
    ...PREFERRED_ORDER.filter((s) => enabled.has(s)),
    ...withGoogle.filter((s) => !PREFERRED_ORDER.includes(s)),
  ];

  return ordered.slice(0, 2).map((strategy) => {
    const meta = PROVIDER_META[strategy];
    return {
      strategy,
      label: meta?.label ?? strategyLabel(strategy),
      icon: meta?.icon ?? (
        <span className="flex size-5 items-center justify-center text-xs font-bold text-[color:var(--color-brand)]">
          {strategy.replace("oauth_", "").slice(0, 1).toUpperCase()}
        </span>
      ),
    };
  });
}
