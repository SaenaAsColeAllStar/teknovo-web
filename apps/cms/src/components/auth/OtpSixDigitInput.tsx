import {
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactElement,
  useId,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

const LENGTH = 6;

export type OtpSixDigitInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
};

/**
 * Six square single-digit inputs: auto-advance on entry, backspace to previous.
 */
export function OtpSixDigitInput({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  "aria-label": ariaLabel = "Kode verifikasi 6 digit",
  className,
}: OtpSixDigitInputProps): ReactElement {
  const baseId = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  function commit(next: string[]) {
    onChange(next.join("").slice(0, LENGTH));
  }

  function focusAt(index: number) {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, index))];
    el?.focus();
    el?.select();
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      commit(next);
      return;
    }

    const chars = cleaned.split("");
    const next = [...digits];
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= LENGTH) break;
      next[cursor] = ch;
      cursor += 1;
    }
    commit(next);
    focusAt(cursor >= LENGTH ? LENGTH - 1 : cursor);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        commit(next);
        return;
      }
      if (index > 0) {
        event.preventDefault();
        const next = [...digits];
        next[index - 1] = "";
        commit(next);
        focusAt(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? "");
    commit(next);
    focusAt(Math.min(pasted.length, LENGTH - 1));
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex w-full items-center justify-between gap-2 sm:gap-2.5", className)}
    >
      {digits.map((digit, index) => (
        <input
          key={`${baseId}-${index}`}
          ref={(el) => {
            refs.current[index] = el;
          }}
          id={`${baseId}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} dari ${LENGTH}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "aspect-square w-full min-w-0 max-w-12 flex-1 rounded-md border border-[color:var(--color-border)] bg-white text-center text-lg font-semibold text-[color:var(--color-heading)] shadow-sm",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      ))}
    </div>
  );
}
