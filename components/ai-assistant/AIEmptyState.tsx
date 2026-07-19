import { Sparkles } from "lucide-react";

export function AIEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4 py-8 animate-in fade-in duration-500">
      {/* Icon */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 rounded-2xl bg-primary/25 blur-xl opacity-60" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-violet-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-sm">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
          How can I help your freelance business?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Pick a quick action above or type your own question.
        </p>
      </div>
    </div>
  );
}
