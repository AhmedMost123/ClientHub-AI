"use client";

import { Bot, FolderKanban, Users } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Users,
    title: "Add Clients",
    description:
      "Import contacts, organize by project, and keep all communication in one place.",
  },
  {
    icon: FolderKanban,
    title: "Manage Projects",
    description:
      "Track progress, set milestones, and collaborate seamlessly with your team.",
  },
  {
    icon: Bot,
    title: "Let AI Handle The Busy Work",
    description:
      "Automate proposals, emails, summaries, and focus on what matters most.",
  },
];

export function Workflow() {
  return (
    <section className="px-6 py-24 md:py-32">
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
            Simple Workflow, Powerful Results
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Three steps to transform your freelance business
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Step Card */}
                  <div className="card-premium rounded-2xl bg-card p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-background shadow-sm">
                      <Icon className="size-8 text-foreground" />
                    </div>

                    {/* Step Number */}
                    <div className="mb-4 inline-flex items-center justify-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium">
                      Step {index + 1}
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
