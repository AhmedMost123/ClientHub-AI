"use client";

import { Bell, DollarSign, Sparkles } from "lucide-react";

import { AIWidget } from "@/components/dashboard/AIWidget";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import RevenueChart from "@/components/dashboard/RevenueChart";
import StatCard from "@/components/dashboard/StatCard";
import { stats } from "@/lib/mock-data";

export function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Background glow */}
      <div
        className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden
      />

      {/* Dashboard Preview */}
      <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Row */}
        <StatCard {...stats[0]} index={0} className="md:col-span-2" />
        <StatCard {...stats[1]} index={1} />

        {/* Revenue Chart */}
        <div className="card-premium rounded-2xl bg-card p-5 md:col-span-2 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground">
              Monthly earnings this year
            </p>
          </div>
          <div className="h-50 w-full">
            <RevenueChart data={[]} />
          </div>
        </div>

        {/* AI Widget */}
        <div className="card-premium rounded-2xl bg-card p-5">
          <AIWidget pendingInvoicesCount={0} />
        </div>

        {/* Recent Invoices */}
        <div className="card-premium rounded-2xl bg-card p-5 md:col-span-2">
          <RecentInvoices invoices={[]} />
        </div>

        {/* Project Cards */}
        <div className="card-premium rounded-2xl bg-card p-5">
          <div className="mb-4">
            <h3 className="font-semibold">Active Projects</h3>
            <p className="text-sm text-muted-foreground">Current engagements</p>
          </div>
          <div className="space-y-3">
            <ProjectCard
              project={{
                id: "1",
                title: "Acme Corp Redesign",
                customerName: "Acme Corp",
                status: "IN_PROGRESS",
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              }}
            />
          </div>
        </div>

        {/* Floating Micro Cards */}
        <div
          className="absolute -left-8 top-1/4 hidden rounded-xl border border-border/50 bg-card/80 p-4 shadow-lg backdrop-blur-sm lg:block animate-in-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
              <DollarSign className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-semibold">+$2,400</p>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-8 top-1/3 hidden rounded-xl border border-border/50 bg-card/80 p-4 shadow-lg backdrop-blur-sm lg:block animate-in-slide-up"
          style={{ animationDelay: "350ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">New</p>
              <p className="text-sm font-semibold">3 notifications</p>
            </div>
          </div>
        </div>

        <div
          className="absolute -bottom-4 left-1/4 hidden rounded-xl border border-border/50 bg-card/80 p-4 shadow-lg backdrop-blur-sm lg:block animate-in-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center rounded-lg text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Ready</p>
              <p className="text-sm font-semibold">Hub AI active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
