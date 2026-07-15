import { cn } from "@/lib/utils";

interface Props {
  own: boolean;

  sender: string;

  content: string;

  createdAt: Date;
}

export default function MessageBubble({
  own,
  sender,
  content,
  createdAt,
}: Props) {
  return (
    <div className={cn("flex", own ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
          own ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {!own && <p className="mb-1 text-xs font-semibold">{sender}</p>}

        <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>

        <p
          className={cn(
            "mt-2 text-[11px]",
            own ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
