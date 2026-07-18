import { SignUp } from "@clerk/clerk-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export function SignUpPage(): ReactElement {
  return (
    <main className="flex min-h-screen min-h-dvh flex-col items-center justify-center bg-[color:var(--color-neutral-soft)] px-4 py-10">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-none border border-[color:var(--color-border)] shadow-none",
          },
        }}
      />
      <p className="mt-6 text-sm text-[color:var(--color-body)]">
        Sudah punya akun?{" "}
        <Link
          to="/sign-in"
          className="font-medium text-[color:var(--color-brand)] underline-offset-2 hover:underline"
        >
          Masuk
        </Link>
      </p>
    </main>
  );
}
