"use client";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { HeroPreview } from "@/components/home/HeroPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Subtle radial lighting */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand-subtle)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full oklch(0.55 0.2 280) opacity-75" />
                <span className="relative inline-flex size-2 rounded-full oklch(0.55 0.2 280)" />
              </span>
              AI Powered Freelancer Workspace
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              Manage Clients,
              <br />
              Projects & <span className="gradient-text">AI Workflows</span>
              <br />
              In One Beautiful Workspace.
            </h1>

            {/* Subtitle */}
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg leading-relaxed">
              ClientHub AI helps freelancers and agencies manage clients,
              projects, invoices, files, tasks and AI conversations from one
              modern workspace.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="gap-2 text-base">
                Start Free
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <Play className="size-4" />
                View Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>No credit card required</p>
              <p className="flex items-center gap-1.5">
                Built with{" "}
                <span className="font-medium text-foreground">Next.js</span> +{" "}
                <span className="font-medium text-foreground">AI</span>
              </p>
            </div>
          </motion.div>

          {/* Right Side - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <HeroPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
