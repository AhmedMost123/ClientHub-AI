"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/dashboard/ChartCard";
import type { RevenueChartPoint } from "@/lib/actions/get-dashboard-data";
import { TrendingUp } from "lucide-react";

type RevenueChartProps = {
  data: RevenueChartPoint[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const hasData = data.some((d) => d.revenue > 0);

  return (
    <ChartCard
      title="Revenue Overview"
      description="Monthly earnings this year"
    >
      {hasData ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="oklch(0.62 0.2 280)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
          <TrendingUp className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No revenue data yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Paid invoices will appear here as a monthly chart.
            </p>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Perfection is the enemy of done. Go LAND your first gig. 💥
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
