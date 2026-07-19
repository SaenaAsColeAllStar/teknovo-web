"use client";

import type { ReactElement } from "react";

import { AkademikHashRedirect } from "@/components/features/landing/AkademikHashRedirect";
import { AkademikOverviewContent } from "@/components/features/landing/AkademikOverviewContent";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";

export function AkademikPageContent(): ReactElement {
  return (
    <PublicMotionProvider>
      <AkademikHashRedirect />
      <AkademikOverviewContent />
    </PublicMotionProvider>
  );
}
