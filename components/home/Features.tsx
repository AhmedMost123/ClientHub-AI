"use client";

import {
  Bot,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Receipt,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Client Management",
    description:
      "Organize contacts, track communication history, and manage relationships all in one place.",
    gradient: "var(--gradient-card-violet)",
  },
  {
    icon: FolderKanban,
    title: "Project Tracking",
    description:
      "Monitor project progress, set milestones, and deliver work on time with visual dashboards.",
    gradient: "var(--gradient-card-blue)",
  },
  {
    icon: LayoutDashboard,
    title: "Tasks",
    description:
      "Break down work into manageable tasks, assign priorities, and never miss a deadline.",
    gradient: "var(--gradient-card-emerald)",
  },
  {
    icon: Receipt,
    title: "Invoices",
    description:
      "Create professional invoices, track payments, and manage your cash flow effortlessly.",
    gradient: "var(--gradient-card-amber)",
  },
  {
    icon: FileText,
    title: "Files",
    description:
      "Store and organize project assets, share files with clients, and keep everything accessible.",
    gradient: "var(--gradient-card-violet)",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Let AI handle proposals, emails, summaries, and repetitive tasks to save hours every week.",
    gradient: "var(--gradient-card-blue)",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Everything You Need To Run Your Freelance Business
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Powerful tools designed for modern freelancers and agencies
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="card-interactive group relative overflow-hidden rounded-2xl bg-card p-6 animate-in-slide-up"
              style={{
                background: feature.gradient,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                <feature.icon
                  className="size-6 text-foreground/80"
                  aria-hidden
                />
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
