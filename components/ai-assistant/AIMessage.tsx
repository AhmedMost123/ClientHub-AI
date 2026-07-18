import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex w-full gap-4", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <Avatar className="w-8 h-8 shrink-0 bg-primary/10 text-primary border border-primary/20">
          <AvatarFallback className="bg-transparent">
            <Sparkles className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "px-4 py-3 max-w-[85%] md:max-w-[75%] rounded-2xl whitespace-pre-wrap leading-relaxed text-[15px]",
          isAssistant 
            ? "bg-surface border border-border/50 text-foreground rounded-tl-sm shadow-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm shadow-md"
        )}
      >
        {message.content}
      </div>

      {!isAssistant && (
        <Avatar className="w-8 h-8 shrink-0 bg-secondary text-secondary-foreground border border-border/50">
          <AvatarFallback className="bg-transparent">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
