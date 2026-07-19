import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import { AcceptInvitationForm } from "../components/auth/AcceptInvitationForm";
import { SignInForm } from "../components/auth/SignInForm";

export function SignInPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const hasTicket = Boolean(searchParams.get("__clerk_ticket"));

  if (hasTicket) {
    return <AcceptInvitationForm />;
  }

  return <SignInForm />;
}
