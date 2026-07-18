import type { ReactElement } from "react";

import { ForgotPasswordBleedLayout } from "../components/auth/ForgotPasswordBleedLayout";
import { ForgotPasswordBrandPanel } from "../components/auth/ForgotPasswordBrandPanel";
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm";

export function ForgotPasswordPage(): ReactElement {
  return (
    <ForgotPasswordBleedLayout brandPanel={<ForgotPasswordBrandPanel />}>
      <ForgotPasswordForm />
    </ForgotPasswordBleedLayout>
  );
}
