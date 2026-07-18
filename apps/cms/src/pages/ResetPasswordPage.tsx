import type { ReactElement } from "react";

import { AuthBleedSplitLayout } from "../components/auth/AuthBleedSplitLayout";
import { AuthSocialProofPanel } from "../components/auth/AuthSocialProofPanel";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm";

export function ResetPasswordPage(): ReactElement {
  return (
    <AuthBleedSplitLayout brandPanel={<AuthSocialProofPanel />}>
      <ResetPasswordForm />
    </AuthBleedSplitLayout>
  );
}
