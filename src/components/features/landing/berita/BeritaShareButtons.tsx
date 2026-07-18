"use client";

import { Check, Link2, MessageCircle } from "lucide-react";
import { useCallback, useState } from "react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type BeritaShareButtonsProps = {
  url: string;
  title: string;
  className?: string;
  /** `row` = inline meta; `stack` = sidebar vertikal. */
  layout?: "row" | "stack";
  /** Sembunyikan label “Bagikan” (mis. sudah ada heading di parent). */
  hideLabel?: boolean;
};

export function BeritaShareButtons({
  url,
  title,
  className,
  layout = "row",
  hideLabel = false,
}: BeritaShareButtonsProps): ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard tidak tersedia — abaikan. */
    }
  }, [url]);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const isStack = layout === "stack";

  const buttonClass =
    "inline-flex items-center justify-center gap-1.5 border border-border-default bg-surface px-3 py-2 text-xs font-medium text-heading transition hover:bg-neutral-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

  return (
    <div
      className={cn(
        isStack ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {!hideLabel ? (
        <span className="text-xs font-medium uppercase tracking-wide text-body-subtle">
          Bagikan
        </span>
      ) : null}
      <button type="button" onClick={() => void handleCopy()} className={cn(buttonClass, isStack && "w-full")}>
        {copied ? <Check className="size-3.5 text-emerald-600" aria-hidden /> : <Link2 className="size-3.5" aria-hidden />}
        {copied ? "Tersalin" : "Salin tautan"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonClass,
          "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
          isStack && "w-full",
        )}
      >
        <MessageCircle className="size-3.5" aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}
