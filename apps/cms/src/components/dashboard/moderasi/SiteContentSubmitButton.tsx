"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  submitSiteContentForReview,
  type SiteContentEntityPath,
} from "@/lib/api-client";

import { useCmsGetToken } from "../../../lib/use-cms-get-token";

type Props = {
  entity: SiteContentEntityPath;
  id: string;
  status: string;
  disabled?: boolean;
  onDone?: () => void;
  size?: "sm" | "default";
};

/** Editors: Ajukan review for DRAFT / REJECTED site-content rows. */
export function SiteContentSubmitButton({
  entity,
  id,
  status,
  disabled,
  onDone,
  size = "sm",
}: Props) {
  const { getToken } = useCmsGetToken();
  const [busy, setBusy] = useState(false);
  const canSubmit = status === "DRAFT" || status === "REJECTED";

  if (!canSubmit) return null;

  async function onClick() {
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await submitSiteContentForReview(entity, id, token);
      toast.success("Diajukan ke antrian review");
      onDone?.();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal mengajukan review.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant="secondary"
      disabled={disabled || busy}
      onClick={() => void onClick()}
    >
      {busy ? "…" : "Ajukan review"}
    </Button>
  );
}

export function SiteContentReviewNoteBanner({
  status,
  reviewNote,
}: {
  status: string;
  reviewNote: string | null | undefined;
}) {
  if (status !== "REJECTED" || !reviewNote) return null;
  return (
    <div
      role="status"
      className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
    >
      <p className="font-medium text-[color:var(--color-heading)]">
        Ditolak — catatan Super Admin
      </p>
      <p className="mt-1 whitespace-pre-wrap">{reviewNote}</p>
    </div>
  );
}
