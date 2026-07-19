import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuickActionCard({ icon, title, onClick, disabled = false, className }: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-start gap-3 p-4 text-left",
        "bg-card/50 hover:bg-card border border-border/50 hover:border-border",
        "rounded-2xl transition-colors duration-200",
        "shadow-sm hover:shadow-md",
        "w-full min-w-[140px] md:min-w-0 flex-shrink-0",
        disabled && "opacity-50 cursor-not-allowed hover:bg-card/50 hover:border-border/50 hover:shadow-sm",
        className
      )}
    >
      <div className="p-2 rounded-xl bg-surface/50 text-muted-foreground">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground leading-tight">
        {title}
      </span>
    </motion.button>
  );
}
