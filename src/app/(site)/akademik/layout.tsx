import type { ReactElement, ReactNode } from "react";

import { AkademikHashRedirect } from "@/components/features/landing/AkademikHashRedirect";

export default function AkademikLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <AkademikHashRedirect />
      {children}
    </>
  );
}
