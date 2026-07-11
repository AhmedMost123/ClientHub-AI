"use client";

import {
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section id="dashboard" className="px-6 py-24 md:py-32">
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
            A Workspace That Works For You
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Everything you need, beautifully organized
          </p>
        </motion.div>

        {/* Dashboard Composition */}
        <div className="relative mx-auto max-w-6xl">
          {/* Background glow */}
          <div
            className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden
          />

          {/* Main Dashboard Frame */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative card-premium rounded-2xl bg-card overflow-hidden"
          >
            <div className="grid lg:grid-cols-4 min-h-150">
              {/* Sidebar */}
              <div className="border-r border-border/50 bg-muted/20 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                    <LayoutDashboard className="size-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <FolderKanban className="size-4" />
                    <span className="text-sm">Projects</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <BarChart3 className="size-4" />
                    <span className="text-sm">Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="size-4" />
                    <span className="text-sm">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <Bot className="size-4" />
                    <span className="text-sm">AI Chat</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <Bell className="size-4" />
                    <span className="text-sm">Notifications</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Welcome back, Alex
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <span className="text-xs font-semibold">A</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="card-interactive rounded-xl bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-4 text-success" />
                      <span className="text-xs text-muted-foreground">
                        Revenue
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">$12,500</p>
                    <p className="text-xs text-muted-foreground">+12.4%</p>
                  </div>
                  <div className="card-interactive rounded-xl bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="size-4 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Projects
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">8</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="card-interactive rounded-xl bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="size-4 text-warning" />
                      <span className="text-xs text-muted-foreground">
                        Tasks
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">24</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                {/* Charts and AI */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Chart Preview */}
                  <div className="card-interactive rounded-xl bg-card p-4">
                    <h4 className="text-sm font-semibold mb-3">Analytics</h4>
                    <div className="h-32 flex items-end gap-2">
                      <div className="flex-1 rounded-t bg-primary/20 h-[40%]" />
                      <div className="flex-1 rounded-t bg-primary/30 h-[60%]" />
                      <div className="flex-1 rounded-t bg-primary/40 h-[45%]" />
                      <div className="flex-1 rounded-t bg-primary/50 h-[80%]" />
                      <div className="flex-1 rounded-t bg-primary/60 h-[70%]" />
                      <div className="flex-1 rounded-t bg-primary/70 h-[90%]" />
                      <div className="flex-1 rounded-t bg-primary h-[100%]" />
                    </div>
                  </div>

                  {/* AI Chat Preview */}
                  <div className="card-interactive rounded-xl bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="size-4" />
                      <h4 className="text-sm font-semibold">Hub AI</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-muted/50 p-2 text-xs">
                        <p className="text-muted-foreground">
                          How can I help you today?
                        </p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-xs">
                        <p>Generate a project proposal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card-interactive rounded-xl bg-card p-4">
                  <h4 className="text-sm font-semibold mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-success/10 text-success">
                        <CheckCircle2 className="size-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Invoice paid</p>
                        <p className="text-xs text-muted-foreground">
                          Globex — $2,400
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">2h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MessageSquare className="size-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">New message</p>
                        <p className="text-xs text-muted-foreground">
                          Sarah (Acme Corp)
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">4h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
