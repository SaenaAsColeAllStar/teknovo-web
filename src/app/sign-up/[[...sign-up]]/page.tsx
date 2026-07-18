import { redirect } from "next/navigation";

/** Public self sign-up disabled — CMS / dashboard is invite-only. */
export default function SignUpPage() {
  redirect("/sign-in?message=invite-only");
}
