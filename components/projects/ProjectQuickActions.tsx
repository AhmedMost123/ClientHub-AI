"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Edit, Files, MessageSquare, Trash2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { archiveProject } from "@/lib/actions/project/archive-project";
import { deleteProject } from "@/lib/actions/project/delete-project";
import { restoreProject } from "@/lib/actions/project/restore-project";

interface Props {
  role: "CLIENT" | "FREELANCER";
  project: {
    id: string;
    isArchived: boolean;
  };
}

export default function ProjectQuickActions({ role, project }: Props) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveProject(project.id);
      if (result.success) {
        toast.success("Project archived successfully");
      } else {
        toast.error(result.error || "Failed to archive project");
      }
    } finally {
      setIsArchiving(false);
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(project.id);
      if (result.success) {
        toast.success("Project deleted successfully");
        router.push("/projects"); // Redirect back to projects list
      } else {
        toast.error(result.error || "Failed to delete project");
        setIsDeleting(false);
      }
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold tracking-tight">Quick Actions</h2>

      <div className="flex flex-wrap gap-3">
        {role === "FREELANCER" && (
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit Project
            </Link>
          </Button>
        )}

        <Button variant="outline" onClick={() => {
          document.getElementById('conversation-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <MessageSquare className="mr-2 size-4" />
          Chat
        </Button>

        <Button variant="outline" disabled>
          <Files className="mr-2 size-4" />
          Files
        </Button>

        {role === "FREELANCER" && (
          project.isArchived ? (
            <Button 
              variant="outline" 
              onClick={handleRestore} 
              disabled={isRestoring}
            >
              <RotateCcw className="mr-2 size-4" />
              {isRestoring ? "Restoring..." : "Restore Project"}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleArchive} 
              disabled={isArchiving}
            >
              <Archive className="mr-2 size-4" />
              {isArchiving ? "Archiving..." : "Archive Project"}
            </Button>
          )
        )}

        {role === "FREELANCER" && (
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)} 
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project, all tasks, invoices, and messages associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
