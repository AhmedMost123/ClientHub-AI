"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getRedirectPathForRole } from "@/lib/auth/redirects";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-panel-strong border-b border-border/50 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-lg text-white shadow-md"
            style={{ background: "var(--gradient-brand)" }}
          >
            <span className="text-sm font-bold">CH</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            ClientHub AI
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </a>
          <a
            href="#ai"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            AI Assistant
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <>
              <Link
                href={getRedirectPathForRole(session.user?.role)}
                className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-muted/80"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{session.user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
