"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  MessageSquarePlus,
  History,
  Trash2,
  Pencil,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export interface ChatSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

interface ConversationSidebarProps {
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onChatDeleted: (chatId: string) => void;
  onChatRenamed: (chatId: string, title: string) => void;
  chats: ChatSummary[];
  isLoadingHistory: boolean;
}

export function ConversationSidebar({
  activeChatId,
  onSelectChat,
  onNewChat,
  onChatDeleted,
  onChatRenamed,
  chats,
  isLoadingHistory,
}: ConversationSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = useCallback(
    async (chatId: string) => {
      try {
        const res = await fetch(`/api/ai/history/${chatId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        onChatDeleted(chatId);
        toast.success("Conversation deleted");
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [onChatDeleted],
  );

  const handleRenameStart = (chat: ChatSummary) => {
    setRenamingId(chat.id);
    setRenameValue(chat.title);
  };

  const handleRenameSubmit = useCallback(
    async (chatId: string) => {
      if (!renameValue.trim()) {
        setRenamingId(null);
        return;
      }
      try {
        const res = await fetch(`/api/ai/history/${chatId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: renameValue.trim() }),
        });
        if (!res.ok) throw new Error("Rename failed");
        onChatRenamed(chatId, renameValue.trim());
        toast.success("Conversation renamed");
      } catch {
        toast.error("Failed to rename conversation");
      } finally {
        setRenamingId(null);
      }
    },
    [renameValue, onChatRenamed],
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 w-12 py-4 border-r border-border/50 bg-background/30 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-xl"
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-xl"
          onClick={onNewChat}
          title="New conversation"
        >
          <MessageSquarePlus className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 shrink-0 border-r border-border/50 bg-background/30">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="w-4 h-4 text-primary" />
          History
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-lg"
            onClick={onNewChat}
            title="New conversation"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-lg"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="h-8 pl-8 pr-7 text-xs rounded-lg bg-muted/30 border-border/40"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border/30">
        {isLoadingHistory ? (
          <div className="space-y-1 px-2 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 px-1.5 py-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group relative rounded-lg px-2 py-2 cursor-pointer transition-colors",
                  activeChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60 text-foreground",
                )}
                onClick={() => renamingId !== chat.id && onSelectChat(chat.id)}
              >
                {renamingId === chat.id ? (
                  <Input
                    ref={renameRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(chat.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="h-6 text-xs px-1 py-0 bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-tight">{chat.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:bg-muted transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-lg leading-none">⋯</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameStart(chat);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chat.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
