import type { ReactElement, ReactNode } from "react";

import { BeritaHashRedirect } from "@/components/features/landing/BeritaHashRedirect";

export default function BeritaLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <BeritaHashRedirect />
      {children}
    </>
  );
}
