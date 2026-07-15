"use client";

import { Progress } from "@/components/ui/progress";

interface Props {
  completed: number;
  total: number;
}

export default function TaskProgress({ completed, total }: Props) {
  const value = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex justify-between">
        <h3 className="font-semibold">Progress</h3>

        <span className="text-sm text-muted-foreground">
          {completed}/{total}
        </span>
      </div>

      <Progress value={value} />

      <p className="mt-3 text-sm text-muted-foreground">{value}% completed</p>
    </div>
  );
}
