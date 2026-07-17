import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignInForm } from "@/components/features/auth/SignInForm";
import { SignInMarketingPanel } from "@/components/features/auth/SignInMarketingPanel";
import { BRAND_SHORT } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Masuk",
  description: `Masuk ke portal ${BRAND_SHORT}.`,
  robots: { index: false, follow: false },
};

export default function SignInPage(): ReactElement {
  return (
    <AuthSplitLayout
      illustrationFirst
      illustration={<SignInMarketingPanel />}
      mobileIllustration={<SignInMarketingPanel className="mx-auto" />}
    >
      <SignInForm />
    </AuthSplitLayout>
  );
}
