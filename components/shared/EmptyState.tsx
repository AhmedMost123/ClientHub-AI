import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center transition-all duration-200 hover:bg-card/80",
        className
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted transition-transform duration-200 hover:scale-110 hover:shadow-md">
        <Icon className="size-5 text-muted-foreground transition-transform duration-200" aria-hidden />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button 
          className="mt-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105" 
          style={{ background: "var(--gradient-brand)" }}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
