import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

/**
 * Public self sign-up is disabled — CMS is invite-only.
 * Keeps `/sign-up` as a redirect so old Clerk links / bookmarks still resolve.
 */
export function SignUpPage(): ReactElement {
  return <Navigate to="/sign-in?message=invite-only" replace />;
}
