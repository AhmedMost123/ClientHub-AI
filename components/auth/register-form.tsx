"use client";

import { useState } from "react";
import { Briefcase, Check, Eye, EyeOff, User } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountType>("FREELANCER");

  return (
    <form className="space-y-5">
      {/* Hidden Role Field */}
      <input type="hidden" name="role" value={selectedAccountType} />

      {/* Account Type Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose your account type</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {accountTypes.map((account) => {
            const Icon = account.icon;
            const isSelected = selectedAccountType === account.type;

            return (
              <motion.button
                key={account.type}
                type="button"
                onClick={() => setSelectedAccountType(account.type)}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all duration-200",
                  "hover:border-border/80 hover:bg-muted/30",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/50"
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
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white/20"
                  >
                    <Check className="size-3 text-white" />
                  </motion.div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "mb-2 flex size-10 items-center justify-center rounded-lg",
                    isSelected ? "bg-white/20" : "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      isSelected ? "text-white" : "text-foreground"
                    )}
                  />
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "mb-1 text-sm font-semibold",
                    isSelected ? "text-white" : "text-foreground"
                  )}
                >
                  {account.title}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    isSelected ? "text-white/80" : "text-muted-foreground"
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
        />
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
        />
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
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
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
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Create Account Button */}
      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
        style={{ background: "var(--gradient-brand)" }}
      >
        Create Account
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
