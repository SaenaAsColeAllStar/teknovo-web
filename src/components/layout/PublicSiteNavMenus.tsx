"use client";

/**
 * Shared desktop dropdown + mobile accordion for public main nav groups.
 * Appearance tokens keep marketing chrome and hero overlay in sync.
 */
import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { useHoverIntentOpen } from "@/hooks/use-hover-intent-open";
import type { PublicSiteNavGroup } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

export type PublicSiteNavAppearance = "surface" | "overlay";

const triggerClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "inline-flex items-center gap-1 text-sm font-medium text-heading transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
  overlay:
    "inline-flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
};

const triggerActiveClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "text-brand underline decoration-2 underline-offset-4",
  overlay: "text-white underline decoration-2 underline-offset-4",
};

const chevronClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "size-3.5 shrink-0 text-body-subtle transition-transform duration-200",
  overlay: "size-3.5 shrink-0 opacity-80 transition-transform duration-200",
};

const chevronOpenClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "rotate-180 text-brand",
  overlay: "rotate-180",
};

const panelClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "border border-border-default bg-surface py-1 shadow-sm",
  overlay: "border border-white/20 bg-brand-strong/95 py-1 shadow-sm backdrop-blur-md",
};

const menuItemClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "block px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-neutral-soft hover:text-brand",
  overlay:
    "block px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white",
};

const mobileGroupBorderClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "border-t border-border-default first:border-t-0",
  overlay: "border-t border-white/15 first:border-t-0",
};

const mobileTriggerClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-heading",
  overlay:
    "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-white",
};

const mobileChevronClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "size-4 shrink-0 text-body-subtle transition-transform duration-200",
  overlay: "size-4 shrink-0 opacity-80 transition-transform duration-200",
};

const mobileItemClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "block px-3 py-2 pl-5 text-sm text-body hover:text-heading",
  overlay: "block px-3 py-2 pl-5 text-sm text-white/80 hover:text-white",
};

export function PublicDesktopNavDropdown({
  entry,
  active,
  appearance = "surface",
}: {
  entry: PublicSiteNavGroup;
  active: boolean;
  appearance?: PublicSiteNavAppearance;
}): ReactElement {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    open,
    openMenu,
    closeMenu,
    onRootPointerEnter,
    onRootPointerLeave,
    toggleFromClick,
  } = useHoverIntentOpen();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFromClick();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu();
    }
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onRootPointerEnter}
      onPointerLeave={onRootPointerLeave}
    >
      <button
        type="button"
        className={cn(
          triggerClassName[appearance],
          active && triggerActiveClassName[appearance],
        )}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={toggleFromClick}
        onKeyDown={onTriggerKeyDown}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            chevronClassName[appearance],
            open && chevronOpenClassName[appearance],
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          role="menu"
          className="absolute top-full left-0 z-50 min-w-[14rem] pt-2"
        >
          <div className={panelClassName[appearance]}>
            {entry.items.map((item) => (
              <PublicSiteLink
                key={item.href}
                href={item.href}
                role="menuitem"
                className={menuItemClassName[appearance]}
                onClick={closeMenu}
              >
                {item.label}
              </PublicSiteLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PublicMobileNavGroup({
  entry,
  onNavigate,
  appearance = "surface",
}: {
  entry: PublicSiteNavGroup;
  onNavigate: () => void;
  appearance?: PublicSiteNavAppearance;
}): ReactElement {
  const groupId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className={mobileGroupBorderClassName[appearance]}>
      <button
        type="button"
        id={`${groupId}-trigger`}
        className={mobileTriggerClassName[appearance]}
        aria-expanded={open}
        aria-controls={`${groupId}-panel`}
        onClick={() => setOpen((value) => !value)}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            mobileChevronClassName[appearance],
            open && chevronOpenClassName[appearance],
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={`${groupId}-panel`}
          role="region"
          aria-labelledby={`${groupId}-trigger`}
          className="space-y-0.5 pb-2"
        >
          {entry.items.map((item) => (
            <PublicSiteLink
              key={item.href}
              href={item.href}
              className={mobileItemClassName[appearance]}
              onClick={onNavigate}
            >
              {item.label}
            </PublicSiteLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
