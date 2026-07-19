import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface AIHeroProps {
  title?: string;
  subtitle?: string;
}

export function AIHero({ 
  title = "AI Assistant", 
  subtitle = "Your freelancer copilot for proposals, client communication, pricing and productivity." 
}: AIHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-4 pb-3 md:pt-5 md:pb-4 gap-2">
      <Badge variant="secondary" className="px-3 py-1 text-xs font-medium gap-1.5 rounded-full mb-0.5">
        <Sparkles className="w-3.5 h-3.5" />
        Powered by AI
      </Badge>

      {/* Title row: gradient icon + heading side by side */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {/* Glow halo */}
          <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md opacity-70" />
          <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-violet-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-none">
          {title}
        </h1>
      </div>

      <p className="text-muted-foreground text-sm md:text-base max-w-[480px] mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
