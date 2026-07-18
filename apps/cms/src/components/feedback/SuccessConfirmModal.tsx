import { Check } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type SuccessConfirmModalProps = {
  /** Label for the trigger that opens the modal. */
  triggerLabel?: string;
  /** Single-line confirmation message shown in the dialog body. */
  message?: string;
  /** Label for the primary confirm action in the footer. */
  confirmLabel?: string;
  /** Accessible label for the icon-only close (X) button. */
  closeLabel?: string;
  /** Called when the footer confirm action is activated; dialog dismisses after. */
  onConfirm?: () => void;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  /** Controlled open-change handler (also fires for Escape / outside click). */
  onOpenChange?: (open: boolean) => void;
  /** Optional class for the outer wrapper (trigger + dialog portal sibling). */
  className?: string;
  /** Optional class for the trigger button. */
  triggerClassName?: string;
  /** Hide the trigger and drive the dialog only via `open` / `onOpenChange`. */
  hideTrigger?: boolean;
};

/**
 * Self-contained success confirmation: primary trigger + centered overlay dialog.
 * Drop into any host screen — no page chrome.
 */
export function SuccessConfirmModal({
  triggerLabel = "Hapus item",
  message = "Item berhasil dihapus",
  confirmLabel = "Lanjutkan",
  closeLabel = "Tutup",
  onConfirm,
  open,
  onOpenChange,
  className,
  triggerClassName,
  hideTrigger = false,
}: SuccessConfirmModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleOpenChange(false);
  };

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
        {hideTrigger ? null : (
          <DialogTrigger asChild>
            <Button
              type="button"
              className={cn(
                "h-auto pl-4 pr-4 pt-2.5 pb-2.5",
                triggerClassName,
              )}
            >
              {triggerLabel}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent
          closeLabel={closeLabel}
          className="flex max-w-sm flex-col items-center gap-5 px-5 py-6 sm:px-6"
        >
          {/* Visually primary copy is the body message; title kept for a11y. */}
          <DialogTitle className="sr-only">{message}</DialogTitle>
          <DialogDescription className="sr-only">
            {message}
          </DialogDescription>

          <div className="flex w-full flex-col items-center justify-center gap-4 pt-2 text-center">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-none bg-[color:color-mix(in_srgb,var(--color-success)_14%,white)] text-[color:var(--color-success)]"
              aria-hidden
            >
              <Check className="size-6 stroke-[2.5]" />
            </span>
            <p className="text-sm font-medium text-[color:var(--color-heading)]">
              {message}
            </p>
          </div>

          <div className="flex w-full justify-center pt-1">
            <Button
              type="button"
              className="h-auto px-3 py-2"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
