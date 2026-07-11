"use client";

import {
  FileText,
  Mail,
  Sparkles,
  SplitSquareHorizontal,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";

const aiFeatures = [
  {
    icon: Wand2,
    title: "Generate Proposal",
    description:
      "Create professional proposals in seconds with AI-powered templates tailored to your clients.",
    gradient: "var(--gradient-card-violet)",
  },
  {
    icon: FileText,
    title: "Summarize Conversations",
    description:
      "Automatically generate summaries from client meetings and email threads.",
    gradient: "var(--gradient-card-blue)",
  },
  {
    icon: Mail,
    title: "Write Client Emails",
    description:
      "Draft professional responses and follow-ups with context-aware AI assistance.",
    gradient: "var(--gradient-card-emerald)",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Generate Project Plans",
    description:
      "Break down complex projects into actionable tasks and timelines automatically.",
    gradient: "var(--gradient-card-amber)",
  },
  {
    icon: Sparkles,
    title: "Invoice Assistant",
    description:
      "Generate detailed invoices and payment reminders based on project progress.",
    gradient: "var(--gradient-card-violet)",
  },
  {
    icon: Wand2,
    title: "Task Breakdown",
    description:
      "Transform large deliverables into manageable subtasks with AI suggestions.",
    gradient: "var(--gradient-card-blue)",
  },
];

export function AISection() {
  return (
    <section id="ai" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="size-4" />
            AI-Powered
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Intelligent Automation
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Let AI handle the repetitive work so you can focus on creativity
          </p>
        </motion.div>

        {/* AI Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {aiFeatures.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="card-interactive group relative overflow-hidden rounded-2xl bg-card p-6"
              style={{
                background: feature.gradient,
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
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
