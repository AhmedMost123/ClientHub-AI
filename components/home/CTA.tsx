"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";


export function CTA() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="card-premium relative overflow-hidden rounded-3xl bg-card p-12 text-center"
        >
          {/* Background glow */}
          <div
            className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden
          />

          {/* Content */}
          <div className="relative">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Everything Your Freelance Business Needs.
              <br />
              <span className="gradient-text">Powered By AI.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-base text-muted-foreground sm:text-lg">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-medium text-primary-foreground transition-all hover:-translate-y-px hover:opacity-90"
                style={{ background: "var(--gradient-brand)" }}
              >
                Create Free Account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-xl border border-border/50 bg-background px-8 py-3 text-base font-medium transition-all hover:-translate-y-px hover:bg-muted"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
