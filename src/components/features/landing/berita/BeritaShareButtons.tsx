"use client";

import { Check, Link2, MessageCircle } from "lucide-react";
import { useCallback, useState } from "react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type BeritaShareButtonsProps = {
  url: string;
  title: string;
  className?: string;
};

export function BeritaShareButtons({ url, title, className }: BeritaShareButtonsProps): ReactElement {
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

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Bagikan
      </span>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {copied ? <Check className="size-3.5 text-emerald-600" aria-hidden /> : <Link2 className="size-3.5" aria-hidden />}
        {copied ? "Tersalin" : "Salin tautan"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
      >
        <MessageCircle className="size-3.5" aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}
