"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import { signIn, getSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { getRedirectPathForRole } from "@/lib/auth/redirects";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam, email]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return; // Only numeric digits

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      setError("Please paste a valid 6-digit verification code.");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otp.join("");

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid verification code.");
        setIsVerifying(false);
        return;
      }

      setSuccessMsg("Email verified successfully! Logging you in...");

      // Automatically sign in with NextAuth using the one-time token
      if (data.verificationToken) {
        const signInResult = await signIn("credentials", {
          email,
          verificationToken: data.verificationToken,
          redirect: false,
        });

        if (signInResult?.error) {
          setError("Email verified, but automatic sign in failed. Please log in manually.");
          setIsVerifying(false);
          return;
        }

        const session = await getSession();
        const userRole = session?.user?.role || data.user?.role;
        const redirectPath = getRedirectPathForRole(userRole as any);

        router.push(redirectPath);
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to resend verification code.");
      } else {
        setSuccessMsg("A new 6-digit code has been sent to your email.");
        setResendCooldown(60);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = otp.every((digit) => digit !== "");

  return (
    <div className="space-y-6">
      {/* Target Email Info */}
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-3.5 text-sm">
        <div className="flex items-center gap-3 truncate">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-4" />
          </div>
          <div className="truncate">
            <p className="text-xs text-muted-foreground">Verification email sent to</p>
            <p className="truncate font-semibold text-foreground">{email || "your email"}</p>
          </div>
        </div>
      </div>

      {/* 6-Digit OTP Inputs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Enter 6-digit verification code
        </label>
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying}
              className={`h-12 w-full max-w-12 rounded-xl border text-center text-lg font-bold transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 ${
                digit
                  ? "border-primary bg-primary/5 text-foreground shadow-sm"
                  : "border-border/60 bg-background hover:border-border"
              }`}
              aria-label={`Digit ${index + 1} of verification code`}
            />
          ))}
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Action Button */}
      <Button
        type="button"
        onClick={() => handleVerify()}
        disabled={isVerifying || !isCodeComplete}
        className="h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg disabled:opacity-50"
        style={{ background: "var(--gradient-brand)" }}
      >
        {isVerifying ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify & Continue"
        )}
      </Button>

      {/* Resend Cooldown Section */}
      <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending || isVerifying}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {isResending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Resending code...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RefreshCw className="size-3.5 opacity-50" />
              Resend code in {resendCooldown}s
            </>
          ) : (
            <>
              <RefreshCw className="size-3.5" />
              Resend verification code
            </>
          )}
        </button>

        <a
          href="/login"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </a>
      </div>
    </div>
  );
}
