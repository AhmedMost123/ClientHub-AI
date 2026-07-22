"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRedirectPathForRole } from "@/lib/auth/redirects";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = isSubmitting || isNavigating;

  const onSubmit = async (data: LoginInput) => {
    if (isLoading) return;

    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password.");
        setIsNavigating(false);
        return;
      }

      setIsNavigating(true);

      const session = await getSession();
      const redirectPath = getRedirectPathForRole(session?.user?.role as any);

      router.replace(redirectPath);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsNavigating(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="h-12 rounded-xl"
          aria-required
          aria-invalid={!!errors.email}
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 rounded-xl pr-10"
            aria-required
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={isLoading}
          />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {serverError && (
        <div className="rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive border border-destructive/20">
          <p>{serverError}</p>
        </div>
      )}

      {/* Sign In Button */}
      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
        style={{ background: "var(--gradient-brand)" }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card/80 px-2 text-muted-foreground backdrop-blur-sm">
            Or
          </span>
        </div>
      </div>

      {/* Continue with Google */}
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-px"
        disabled={isLoading}
      >
        Continue with Google
      </Button>

      {/* Create Account Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create account
        </a>
      </p>
    </form>
  );
}
