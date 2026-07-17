"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";

import { TeknovoServerErrorPage } from "@/components/errors/TeknovoServerErrorPage";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Segment error boundary (App Router) — menangkap error di bawah root layout.
 */
export default function Error({ error, reset }: ErrorPageProps): ReactElement {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return <TeknovoServerErrorPage reset={reset} />;
}
