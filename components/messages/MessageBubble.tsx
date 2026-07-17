import { cn } from "@/lib/utils";
import MessageFile from "./MessageFile";
import MessageImage from "./MessageImage";
import { isImage } from "@/lib/get-file-type";

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
}

export default function MessageBubble({
  own,
  sender,
  content,
  createdAt,
  files,
}: Props) {
  return (
    <div className={cn("mb-2 flex w-full", own ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-1.5 rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
          own ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-card border text-foreground",
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
                <MessageImage
                  key={file.id}
                  url={file.fileUrl}
                  name={file.originalName}
                />
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

        <p
          className={cn(
            "mt-1 text-right text-[10px] font-medium",
            own ? "text-primary-foreground/70" : "text-muted-foreground/70",
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
