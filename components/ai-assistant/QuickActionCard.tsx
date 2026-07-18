import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  className?: string;
}

export function QuickActionCard({ icon, title, onClick, className }: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-3 p-4 text-left",
        "bg-card/50 hover:bg-card border border-border/50 hover:border-border",
        "rounded-2xl transition-colors duration-200",
        "shadow-sm hover:shadow-md",
        "w-full min-w-[140px] md:min-w-0 flex-shrink-0",
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
