import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand-subtle)" }}
        aria-hidden
      />

      {/* Auth Card */}
      <AuthCard
        title="Create Account"
        subtitle="Start managing your clients and projects."
      >
        <RegisterForm />
      </AuthCard>
    </main>
  );
}
