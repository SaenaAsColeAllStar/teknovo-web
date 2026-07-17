import type { ReactElement } from "react";

import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";

/** Atlas / blueprint plate: square corners, flat border, no shadow. */
export const akademikFrameShellClass = "relative border border-border-default bg-surface";

/** Soft fill plate (pillars / accent tiles) — flat, no shadow. */
export const akademikSoftPlateClass =
  "flex h-full flex-col gap-3 border border-border-default bg-neutral-soft p-6 sm:p-7";

/** Secondary outline button — square, token borders. */
export const akademikSecondaryBtnClass =
  "inline-flex items-center justify-center border border-border-default bg-surface px-6 py-3 text-sm font-semibold text-heading transition hover:bg-neutral-soft";

export function AkademikFramePlusMarks(): ReactElement {
  return (
    <>
      <BlueprintPlusMark className="left-0 top-0" />
      <BlueprintPlusMark className="left-full top-0" />
      <BlueprintPlusMark className="bottom-0 left-0 translate-y-1/2" />
      <BlueprintPlusMark className="bottom-0 left-full translate-y-1/2" />
    </>
  );
}
