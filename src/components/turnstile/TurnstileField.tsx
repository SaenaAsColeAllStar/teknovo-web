"use client";

import {
  type ReactElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { getTurnstileSitekey } from "@/lib/turnstile-public";
import { cn } from "@/lib/utils";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "flexible";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Gagal memuat Turnstile")),
        { once: true },
      );
      if (window.turnstile) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Turnstile"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type TurnstileFieldProps = {
  className?: string;
  onTokenChange?: (token: string | null) => void;
  /** Increment to reset the widget after a failed submit. */
  resetSignal?: number;
};

/**
 * Managed Turnstile widget. Emits token via `onTokenChange` and keeps a
 * hidden `cf-turnstile-response` input in sync.
 */
export function TurnstileField({
  className,
  onTokenChange,
  resetSignal = 0,
}: TurnstileFieldProps): ReactElement {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sitekey = getTurnstileSitekey();

  onTokenChangeRef.current = onTokenChange;

  useEffect(() => {
    let cancelled = false;

    async function mount(): Promise<void> {
      setError(null);
      setToken("");
      onTokenChangeRef.current?.(null);

      try {
        await loadTurnstileScript();
      } catch {
        if (!cancelled) {
          setError("Verifikasi keamanan gagal dimuat. Muat ulang halaman.");
        }
        return;
      }
      if (cancelled || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }

      containerRef.current.innerHTML = "";
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        action: "turnstile-spin-v1",
        theme: "light",
        size: "flexible",
        callback: (next) => {
          setToken(next);
          onTokenChangeRef.current?.(next);
        },
        "error-callback": () => {
          setToken("");
          onTokenChangeRef.current?.(null);
          setError("Verifikasi gagal. Coba lagi.");
        },
        "expired-callback": () => {
          setToken("");
          onTokenChangeRef.current?.(null);
        },
      });
    }

    void mount();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, [sitekey, resetSignal]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        id={`cf-turnstile-${reactId.replace(/:/g, "")}`}
        className="min-h-[65px] w-full overflow-hidden rounded-none border border-[#E8E8F8] bg-white"
        data-action="turnstile-spin-v1"
      />
      <input
        type="hidden"
        name="cf-turnstile-response"
        value={token}
        readOnly
        aria-hidden
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
