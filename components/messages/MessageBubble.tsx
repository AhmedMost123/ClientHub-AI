import { cn } from "@/lib/utils";
import MessageFile from "./MessageFile";
import MessageImage from "./MessageImage";
import { isImage } from "@/lib/get-file-type";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ChatFile {
  id: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface Props {
  own: boolean;
  sender: string;
  content: string | null;
  createdAt: Date;
  files: ChatFile[];
  /** Optimistic-UI status — only present on messages sent by the current user */
  status?: "sending" | "sent" | "failed";
  /** Called when the user taps the retry button on a failed message */
  onRetry?: () => void;
}

export default function MessageBubble({
  own,
  sender,
  content,
  createdAt,
  files,
  status,
  onRetry,
}: Props) {
  const isSending = status === "sending";
  const isFailed = status === "failed";

  return (
    <div className={cn("mb-2 flex w-full", own ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-1.5 rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
          own
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border bg-card text-foreground",
          isSending && "opacity-70",
          isFailed && "opacity-80",
        )}
      >
        {!own && <p className="mb-0.5 text-xs font-medium text-muted-foreground">{sender}</p>}

        {content && (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>
        )}

        {files.length > 0 && (
          <div className="mt-1 flex flex-col gap-2">
            {files.map((file) =>
              isImage(file.mimeType) ? (
                <MessageImage key={file.id} url={file.fileUrl} name={file.originalName} />
              ) : (
                <MessageFile
                  key={file.id}
                  url={file.fileUrl}
                  name={file.originalName}
                  size={file.fileSize}
                  own={own}
                />
              ),
            )}
          </div>
        )}

        {/* Timestamp row */}
        <div className="mt-1 flex items-center justify-end gap-1.5">
          {isFailed && (
            <button
              onClick={onRetry}
              title="Retry sending"
              className={cn(
                "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-100",
                own
                  ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                  : "bg-red-100 text-red-600 hover:bg-red-200",
              )}
            >
              <AlertCircle className="size-2.5" />
              <span>Failed</span>
              <RotateCcw className="size-2.5" />
            </button>
          )}

          <p
            className={cn(
              "text-[10px] font-medium",
              own ? "text-primary-foreground/70" : "text-muted-foreground/70",
            )}
          >
            {createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Sending indicator — pulsing dot */}
          {isSending && (
            <span
              className={cn(
                "inline-block size-1.5 animate-pulse rounded-full",
                own ? "bg-primary-foreground/60" : "bg-muted-foreground/60",
              )}
              title="Sending…"
            />
          )}
        </div>
      </div>
    </div>
  );
}
