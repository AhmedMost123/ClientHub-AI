"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTaskSchema, CreateTaskInput } from "@/lib/validations/task";
import { FolderKanban } from "lucide-react";

export type TaskFormData = CreateTaskInput;

interface Project {
  id: string;
  title: string;
  status: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  defaultValues?: Partial<TaskFormData>;
  projectId?: string;
  projects?: Project[];
  requireProjectSelection?: boolean;
}

export default function GlobalTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  projectId,
  projects = [],
  requireProjectSelection = false,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"project" | "task">(
    requireProjectSelection && !projectId ? "project" : "task"
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || "");

  useEffect(() => {
    if (open) {
      setStep(requireProjectSelection && !projectId ? "project" : "task");
      setSelectedProjectId(projectId || "");
    }
  }, [open, projectId, requireProjectSelection]);

  const form = useForm<any>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      projectId: selectedProjectId || projectId || "",
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      status: defaultValues?.status || "TODO",
      priority: defaultValues?.priority || "MEDIUM",
      estimatedHours: defaultValues?.estimatedHours,
      dueDate: defaultValues?.dueDate || null,
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, projectId: selectedProjectId || data.projectId });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSelect = (pid: string) => {
    setSelectedProjectId(pid);
    form.setValue("projectId", pid);
    setStep("task");
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          form.reset();
          setStep(requireProjectSelection && !projectId ? "project" : "task");
        }
        onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "project" ? (
              <>
                <FolderKanban className="size-5 text-primary" />
                Select Project
              </>
            ) : (
              <>{defaultValues?.title ? "Edit Task" : "New Task"}</>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === "project" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Every task must belong to a project. Choose which project this task is for:
            </p>
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <FolderKanban className="mx-auto size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No active projects found.</p>
                <p className="text-xs text-muted-foreground mt-1">Create a project first to add tasks.</p>
              </div>
            ) : (
              <div className="grid gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleProjectSelect(project.id)}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-accent hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <FolderKanban className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{project.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{project.status.replace("_", " ")}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-4">
              {selectedProject && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                  <FolderKanban className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{selectedProject.title}</span>
                  {requireProjectSelection && (
                    <button
                      type="button"
                      onClick={() => setStep("project")}
                      className="ml-auto text-xs text-primary hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              )}

              {/* hidden projectId field */}
              <input type="hidden" {...form.register("projectId")} value={selectedProjectId} />

              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Build authentication module..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add details about this task..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="estimatedHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val ? new Date(val) : null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: "var(--gradient-brand)" }}
                  className="text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? "Saving..." : "Save Task"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
