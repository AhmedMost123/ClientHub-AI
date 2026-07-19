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
        "flex flex-col items-center justify-start gap-2.5 pt-4 pb-3 px-3 text-center",
        "bg-card/50 hover:bg-card border border-border/50 hover:border-border",
        "rounded-2xl transition-all duration-200",
        "shadow-sm hover:shadow-md",
        "w-[120px] md:w-full h-[116px] flex-shrink-0",
        disabled && "opacity-50 cursor-not-allowed hover:bg-card/50 hover:border-border/50 hover:shadow-sm hover:-translate-y-0",
        className
      )}
    >
      <div className="flex-shrink-0 p-2.5 rounded-xl bg-surface/50 text-muted-foreground flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-foreground leading-[1.15] text-balance w-full break-words">
        {title}
      </span>
    </motion.button>
  );
}
