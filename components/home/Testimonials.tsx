"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    company: "Independent",
    content:
      "ClientHub AI transformed how I manage my business. The AI assistant alone saves me 10+ hours every week on proposals and emails.",
  },
  {
    name: "Marcus Johnson",
    role: "Agency Founder",
    company: "Studio M",
    content:
      "Finally, a tool that understands agency workflows. Project tracking, invoicing, and AI automation in one beautiful interface.",
  },
  {
    name: "Emily Rodriguez",
    role: "Consultant",
    company: "Strategic Advisors",
    content:
      "The AI features are incredible. It's like having a virtual assistant that knows my business inside and out. Highly recommend.",
  },
];

export function Testimonials() {
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
            Loved by Freelancers & Agencies
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Join thousands who have transformed their workflow
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-premium rounded-2xl bg-card p-8"
            >
              {/* Quote */}
              <blockquote className="mb-6 text-base leading-relaxed text-foreground/90">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
