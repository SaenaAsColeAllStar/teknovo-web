import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-neutral-soft)] px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-none border border-[#E8E8F8] shadow-none",
          },
        }}
      />
    </div>
  );
}
