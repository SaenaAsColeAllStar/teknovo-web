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

export type SuccessItemsConfirmItem =
  | string
  | {
      id?: string;
      label: string;
    };

export type SuccessItemsConfirmModalProps = {
  /** Label for the trigger that opens the modal. */
  triggerLabel?: string;
  /** Short medium-weight heading above the list. */
  title?: string;
  /** Muted supporting copy above the result rows. */
  description?: string;
  /** Result rows shown with a success checkmark + label. */
  items?: SuccessItemsConfirmItem[];
  /** Label for the primary confirm action. */
  confirmLabel?: string;
  /** Label for the secondary dismiss action. */
  cancelLabel?: string;
  /** Accessible label for the icon-only close (X) button. */
  closeLabel?: string;
  /** Called when confirm is activated; dialog dismisses after. */
  onConfirm?: () => void;
  /** Called when cancel / dismiss is activated. */
  onCancel?: () => void;
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

function itemKey(item: SuccessItemsConfirmItem, index: number): string {
  if (typeof item === "string") return `${index}:${item}`;
  return item.id ?? `${index}:${item.label}`;
}

function itemLabel(item: SuccessItemsConfirmItem): string {
  return typeof item === "string" ? item : item.label;
}

/**
 * Self-contained bulk/items success confirmation: primary trigger + centered
 * overlay with a start-aligned title, description, result list, and dual actions.
 * Sibling to {@link SuccessConfirmModal} (single-message). Drop-in only — no page chrome.
 */
export function SuccessItemsConfirmModal({
  triggerLabel = "Hapus item",
  title = "Item berhasil dihapus",
  description = "Item berikut telah dihapus dari daftar Anda:",
  items = [],
  confirmLabel = "Lanjutkan",
  cancelLabel = "Tidak, batal",
  closeLabel = "Tutup",
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  className,
  triggerClassName,
  hideTrigger = false,
}: SuccessItemsConfirmModalProps) {
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

  const handleCancel = () => {
    onCancel?.();
    handleOpenChange(false);
  };

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
        {hideTrigger ? null : (
          <DialogTrigger asChild>
            <Button
              type="button"
              className={cn("h-auto px-4 py-2.5", triggerClassName)}
            >
              {triggerLabel}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent
          closeLabel={closeLabel}
          className="flex max-w-md flex-col gap-4 px-5 py-6 text-left sm:px-6"
        >
          <div className="flex flex-col gap-1.5 pr-8 text-left">
            <DialogTitle className="text-base font-medium leading-snug">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-[color:var(--color-body-subtle)]">
              {description}
            </DialogDescription>
          </div>

          {items.length > 0 ? (
            <ul className="flex max-h-60 flex-col gap-2.5 overflow-y-auto text-left">
              {items.map((item, index) => (
                <li
                  key={itemKey(item, index)}
                  className="flex items-start gap-2.5 text-sm text-[color:var(--color-heading)]"
                >
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-success)_14%,white)] text-[color:var(--color-success)]"
                    aria-hidden
                  >
                    <Check className="size-3 stroke-[2.5]" />
                  </span>
                  <span className="min-w-0 leading-snug">{itemLabel(item)}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
            <Button
              type="button"
              className="h-auto px-3 py-2"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto px-3 py-2"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
