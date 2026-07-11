import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quickActions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  className?: string;
};

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={cn("rounded-2xl border-border/80 shadow-[var(--shadow-card)]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto justify-start rounded-xl px-4 py-3 text-sm font-medium"
            nativeButton={false}
            render={<Link href={action.href} />}
          >
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
