"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-[460px]"
    >
      {/* Background glow */}
      <div
        className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand-subtle)" }}
        aria-hidden
      />

      {/* Card */}
      <div
        className={cn(
          "glass-panel-strong relative rounded-3xl border border-border/50 bg-card/80 p-8 shadow-lg backdrop-blur-xl",
          "md:p-10"
        )}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div
            className="flex size-10 items-center justify-center rounded-lg text-white shadow-md"
            style={{ background: "var(--gradient-brand)" }}
          >
            <span className="text-sm font-bold">CH</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            ClientHub AI
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form Content */}
        {children}
      </div>
    </motion.div>
  );
}
