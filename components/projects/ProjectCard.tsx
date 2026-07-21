"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, DollarSign, Edit, Trash2, Archive, ListTodo, UserCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { formatBudget, formatProjectDate } from "@/lib/project-utils";
import { archiveProject } from "@/lib/actions/project/archive-project";
import { deleteProject } from "@/lib/actions/project/delete-project";
import { restoreProject } from "@/lib/actions/project/restore-project";

import { ProjectCardData } from "@/types/project";

interface Props {
  project: ProjectCardData;
  role: "CLIENT" | "FREELANCER";
}

export default function ProjectCard({ project, role }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t) => t.status === "DONE").length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(project.id);
      if (result.success) {
        toast.success("Project deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveProject(project.id);
      if (result.success) {
        toast.success("Project archived successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to archive project");
      }
    } finally {
      setIsArchiving(false);
      setArchiveDialogOpen(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await restoreProject(project.id);
      if (result.success) {
        toast.success("Project restored successfully");
      } else {
        toast.error(result.error || "Failed to restore project");
      }
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <Card className={`rounded-2xl p-6 flex flex-col justify-between h-full transition-all ${project.isArchived ? "opacity-70 grayscale-[0.2]" : ""}`}>
        <div>
          <div className="flex items-start justify-between mb-4 gap-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{project.customerName}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {project.status.replace("_", " ")}
              </Badge>
              {project.isArchived && (
                <Badge variant="secondary" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {formatBudget(project.budget)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {formatProjectDate(project.dueDate)}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                <span className="line-clamp-1 max-w-[120px]">{project.linkedClient?.name || "No Client"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ListTodo className="h-4 w-4" />
                <span>{totalTasks} Tasks</span>
              </div>
            </div>

            {totalTasks > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                  <span>Task Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-4 border-t">
          <Button asChild variant="default" className="flex-1">
            <Link href={role === "CLIENT" ? `/client/projects/${project.id}` : `/projects/${project.id}`}>
              Open
            </Link>
          </Button>

          {role === "FREELANCER" && (
            <>
              <Button asChild variant="outline" size="icon">
                <Link href={`/projects/${project.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              {project.isArchived ? (
                <Button variant="outline" size="icon" onClick={handleRestore} disabled={isRestoring} title="Restore Project">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={() => setArchiveDialogOpen(true)} title="Archive Project">
                  <Archive className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteDialogOpen(true)} title={project.isArchived ? "Delete Permanently" : "Delete"}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {role === "FREELANCER" && (
        <>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => { e.preventDefault(); handleDelete(); }}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will archive the project. It will no longer appear in your active projects list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => { e.preventDefault(); handleArchive(); }}
                  disabled={isArchiving}
                >
                  {isArchiving ? "Archiving..." : "Archive"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
