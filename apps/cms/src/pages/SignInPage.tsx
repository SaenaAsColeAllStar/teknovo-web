import type { ReactElement } from "react";

import { AuthSplitLayout } from "../components/auth/AuthSplitLayout";
import { SignInForm } from "../components/auth/SignInForm";
import { SignInMarketingPanel } from "../components/auth/SignInMarketingPanel";

export function SignInPage(): ReactElement {
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
