import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Background gradient */}
      <div
        className="absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand-subtle)" }}
        aria-hidden
      />

      {/* Auth Card */}
      <AuthCard
        title="Verify your email"
        subtitle="We sent a verification code to your email"
      >
        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </AuthCard>
    </main>
  );
}
