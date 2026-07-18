"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CLOSE_DELAY_MS = 140;

function prefersFineHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Desktop hover-open for nav dropdowns, with a short leave grace delay
 * so the pointer can cross the trigger→panel gap without flicker.
 * Touch / coarse pointers stay click-to-toggle.
 */
export function useHoverIntentOpen(closeDelayMs = DEFAULT_CLOSE_DELAY_MS) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fineHoverRef = useRef(false);

  useEffect(() => {
    fineHoverRef.current = prefersFineHover();
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      fineHoverRef.current = mq.matches;
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, closeDelayMs);
  }, [clearCloseTimer, closeDelayMs]);

  const onRootPointerEnter = useCallback(() => {
    if (fineHoverRef.current) openMenu();
  }, [openMenu]);

  const onRootPointerLeave = useCallback(() => {
    if (fineHoverRef.current) scheduleClose();
  }, [scheduleClose]);

  const toggleFromClick = useCallback(() => {
    clearCloseTimer();
    setOpen((value) => !value);
  }, [clearCloseTimer]);

  return {
    open,
    setOpen,
    openMenu,
    closeMenu,
    scheduleClose,
    onRootPointerEnter,
    onRootPointerLeave,
    toggleFromClick,
    clearCloseTimer,
  };
}
