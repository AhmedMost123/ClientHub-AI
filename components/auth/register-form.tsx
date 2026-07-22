"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Check, Eye, EyeOff, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { getSession, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyFlattenedFieldErrors } from "@/lib/auth/form-errors";
import { getRedirectPathForRole } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils";
import {
  RegisterSchema,
  type RegisterInput,
} from "@/lib/validations/auth";

type AccountType = "FREELANCER" | "CLIENT";

const accountTypes = [
  {
    type: "FREELANCER" as AccountType,
    icon: Briefcase,
    title: "Freelancer",
    description:
      "Manage clients, projects, invoices, tasks, AI assistant, and collaborate with your clients.",
  },
  {
    type: "CLIENT" as AccountType,
    icon: User,
    title: "Client",
    description:
      "Track your projects, chat with your freelancer, upload files, and view invoices.",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "FREELANCER",
    },
  });

  const selectedAccountType = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    if (isSubmitting) return;

    setServerError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 400) {
        const validationErrors = await response.json();
        applyFlattenedFieldErrors(validationErrors, setError);
        return;
      }

      if (response.status === 403) {
        setServerError("You cannot create an admin account.");
        return;
      }

      if (response.status === 409) {
        setServerError("Email already exists.");
        return;
      }

      if (response.status === 500) {
        setServerError("Something went wrong. Please try again.");
        return;
      }

      if (response.status !== 201) {
        setServerError("Something went wrong. Please try again.");
        return;
      }

      const resData = await response.json();
      const targetEmail = resData?.email || data.email;
      router.push(`/verify-email?email=${encodeURIComponent(targetEmail)}`);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("role")} />

      {/* Account Type Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose your account type</label>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {accountTypes.map((account) => {
            const Icon = account.icon;
            const isSelected = selectedAccountType === account.type;

            return (
              <motion.button
                key={account.type}
                type="button"
                onClick={() => setValue("role", account.type)}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all duration-200",
                  "hover:border-border/80 hover:bg-muted/30",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/50",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={
                  isSelected
                    ? {
                        background: "var(--gradient-brand)",
                        borderColor: "transparent",
                      }
                    : undefined
                }
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white/20"
                  >
                    <Check className="size-3 text-white" />
                  </motion.div>
                )}

                <div
                  className={cn(
                    "mb-2 flex size-10 items-center justify-center rounded-lg",
                    isSelected ? "bg-white/20" : "bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      isSelected ? "text-white" : "text-foreground",
                    )}
                  />
                </div>

                <h3
                  className={cn(
                    "mb-1 text-sm font-semibold",
                    isSelected ? "text-white" : "text-foreground",
                  )}
                >
                  {account.title}
                </h3>

                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    isSelected ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {account.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          className="h-12 rounded-xl"
          aria-required
          aria-invalid={!!errors.name}
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

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
          disabled={isSubmitting}
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
            disabled={isSubmitting}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting}
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 rounded-xl pr-10"
            aria-required
            aria-invalid={!!errors.confirmPassword}
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            disabled={isSubmitting}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      {/* Create Account Button */}
      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
        style={{ background: "var(--gradient-brand)" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
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
        disabled={isSubmitting}
      >
        Continue with Google
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
