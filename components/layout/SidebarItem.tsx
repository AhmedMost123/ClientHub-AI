import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarItemProps = {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed?: boolean;
  badge?: string | number;
  onNavigate?: () => void;
};

export function SidebarItem({
  name,
  href,
  icon: Icon,
  isActive,
  collapsed = false,
  badge,
  onNavigate,
}: SidebarItemProps) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? name : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5",
        isActive &&
          "bg-sidebar-accent text-foreground shadow-sm before:absolute before:inset-y-1.5 before:-left-px before:w-0.5 before:rounded-full before:bg-[var(--gradient-brand)] before:content-['']",
        collapsed && "justify-center px-2 hover:translate-x-0"
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-all duration-200",
          isActive && "text-[oklch(0.62_0.2_280)]",
          !isActive && "group-hover:scale-110"
        )}
        aria-hidden
      />
      {!collapsed && (
        <>
          <span className="truncate transition-colors duration-200">{name}</span>
          {badge !== undefined && (
            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-secondary px-1.5 py-0 text-[10px] font-semibold tabular-nums text-muted-foreground ring-1 ring-border/50">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger className="w-full">{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {name}
          {badge !== undefined && ` (${badge})`}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
