import { Paperclip, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent, useRef, useEffect } from "react";

interface AIInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export function AIInput({ input, setInput, onSend }: AIInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
      <p className="text-xs text-center text-muted-foreground/70 mb-1">
        ClientHub AI specializes in freelancing and client communication.
      </p>
      <div className="relative flex items-end w-full bg-surface border border-border/60 rounded-[1.5rem] p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full text-muted-foreground hover:text-foreground mb-0.5"
          disabled
          type="button"
          title="Attach file (coming soon)"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="min-h-[44px] max-h-[200px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 text-[15px] leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          rows={1}
        />
        <Button
          onClick={onSend}
          disabled={!input.trim()}
          size="icon"
          className="shrink-0 rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 mb-0.5 shadow-sm transition-transform active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
