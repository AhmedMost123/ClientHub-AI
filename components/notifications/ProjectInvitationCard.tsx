"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { acceptProjectInvitation } from "@/lib/actions/accept-project-invitation";
import { declineProjectInvitation } from "@/lib/actions/decline-project-invitation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface ProjectInvitationCardProps {
  invitation: {
    id: string;
    project: {
      id: string;
      title: string;
    };
    freelancer: {
      name: string;
      avatar: string | null;
    };
  };
}

export function ProjectInvitationCard({ invitation }: ProjectInvitationCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(null);

  const handleAccept = () => {
    setActionType("accept");
    startTransition(async () => {
      const result = await acceptProjectInvitation(invitation.id);
      if (result.success) {
        toast.success("Project invitation accepted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to accept invitation");
        setActionType(null);
      }
    });
  };

  const handleDecline = () => {
    setActionType("decline");
    startTransition(async () => {
      const result = await declineProjectInvitation(invitation.id);
      if (result.success) {
        toast.success("Project invitation declined");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to decline invitation");
        setActionType(null);
      }
    });
  };

  return (
    <Card className="rounded-2xl border border-white/5 bg-card shadow-sm transition-all hover:border-purple-500/20 hover:shadow-md dark:bg-[#1C1C22]">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src={invitation.freelancer.avatar || ""} />
            <AvatarFallback className="bg-purple-500/10 text-purple-500">
              {invitation.freelancer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold text-primary">{invitation.freelancer.name}</span> invited you
            </p>
            <p className="text-sm text-muted-foreground">
              Project: <span className="font-medium text-foreground">{invitation.project.title}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 w-full rounded-xl sm:w-auto"
            onClick={handleDecline}
            disabled={isPending}
          >
            {isPending && actionType === "decline" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 size-4 text-destructive" />
            )}
            Decline
          </Button>
          <Button
            className="h-9 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 sm:w-auto text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(124,58,237,0.4)] transition-all"
            onClick={handleAccept}
            disabled={isPending}
          >
            {isPending && actionType === "accept" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 size-4" />
            )}
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
