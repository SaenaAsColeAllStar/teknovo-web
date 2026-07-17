import type { Metadata } from "next";
import type { ReactElement } from "react";

import { ForgotPasswordBleedLayout } from "@/components/auth/ForgotPasswordBleedLayout";
import { ForgotPasswordBrandPanel } from "@/components/auth/ForgotPasswordBrandPanel";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { BRAND_SHORT } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Lupa kata sandi",
  description: `Reset kata sandi akun portal ${BRAND_SHORT}.`,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage(): ReactElement {
  return (
    <ForgotPasswordBleedLayout brandPanel={<ForgotPasswordBrandPanel />}>
      <ForgotPasswordForm />
    </ForgotPasswordBleedLayout>
  );
}
