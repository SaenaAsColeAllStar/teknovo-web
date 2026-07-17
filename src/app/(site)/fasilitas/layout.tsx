import type { ReactElement, ReactNode } from "react";

import { FasilitasHashRedirect } from "@/components/features/landing/FasilitasHashRedirect";

export default function FasilitasLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <FasilitasHashRedirect />
      {children}
    </>
  );
}
