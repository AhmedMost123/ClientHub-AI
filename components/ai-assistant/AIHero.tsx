import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function AIHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 md:py-12">
      <Badge variant="secondary" className="px-3 py-1 text-xs font-medium gap-1.5 rounded-full">
        <Sparkles className="w-3.5 h-3.5" />
        Powered by AI
      </Badge>
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
        AI Assistant
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-[600px] mx-auto leading-relaxed">
        Your freelancer copilot for proposals, client communication, pricing, planning and productivity.
      </p>
    </div>
  );
}
