"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/format-file-size";

interface Props {
  name: string;
  url: string;
  size: number;
  own?: boolean;
}

export default function MessageFile({ name, url, size, own }: Props) {
  return (
    <Link
      href={url}
      target="_blank"
      className={cn(
        "group flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5",
        own
          ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
          : "border-border bg-card text-foreground hover:bg-accent"
      )}
    >
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", own ? "bg-primary-foreground/20" : "bg-primary/10")}>
        <FileText className={cn("size-5", own ? "text-primary-foreground" : "text-primary")} />
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className={cn("text-xs", own ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatFileSize(size)}</p>
      </div>

      <Download className={cn("size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100", own ? "text-primary-foreground" : "text-muted-foreground")} />
    </Link>
  );
}
