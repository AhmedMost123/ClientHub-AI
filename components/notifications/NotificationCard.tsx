import { Card, CardContent } from "@/components/ui/card";
import { NotificationType } from "@prisma/client";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    link: string | null;
    type: NotificationType;
    createdAt: Date;
    isRead: boolean;
  };
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const Icon = {
    INFO: Info,
    SUCCESS: CheckCircle,
    WARNING: AlertTriangle,
    ERROR: XCircle,
  }[notification.type] || Bell;

  const colorClass = {
    INFO: "text-blue-500 bg-blue-500/10",
    SUCCESS: "text-green-500 bg-green-500/10",
    WARNING: "text-yellow-500 bg-yellow-500/10",
    ERROR: "text-red-500 bg-red-500/10",
  }[notification.type];

  const content = (
    <Card className={cn("rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md dark:bg-[#1C1C22]", notification.isRead ? "border-white/5 opacity-80" : "border-purple-500/20")}>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", colorClass)}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{notification.title}</h4>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
