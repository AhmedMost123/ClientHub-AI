"use client";

import { useState, useTransition } from "react";
import { ProjectStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProjectStatus } from "@/lib/actions/update-project-status";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  PENDING: "Pending",
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  REVIEW: "In Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

interface Props {
  projectId: string;
  currentStatus: ProjectStatus;
  canEdit: boolean;
}

export default function ProjectStatusControl({ projectId, currentStatus, canEdit }: Props) {
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  if (!canEdit) {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground">
        {STATUS_LABELS[status]}
      </span>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    if (!value) return;
    const newStatus = value as ProjectStatus;
    const prev = status;
    setStatus(newStatus);

    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.success) {
        toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
      } else {
        setStatus(prev);
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <Select value={status} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-[160px] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
