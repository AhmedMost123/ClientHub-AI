import { Sparkles } from "lucide-react";

export function AIEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4 animate-in fade-in duration-700">
      <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-50" />
        <Sparkles className="w-8 h-8 text-primary relative z-10" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          How can I help your freelance business today?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Choose one of the quick actions above or ask your own freelancing question.
        </p>
      </div>
    </div>
  );
}
