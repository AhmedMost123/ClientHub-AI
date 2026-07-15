"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProjectPage() {
  const router = useRouter();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [linkedClient, setLinkedClient] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Planning");
  const [dueDate, setDueDate] = useState("");

  // Tasks state
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);

  // Validation / Loading states
  const [errors, setErrors] = useState<{
    projectName?: string;
    customerName?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = () => {
    setTasks((prev) => [...prev, { id: Math.random().toString(), title: "" }]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleTaskTitleChange = (id: string, value: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: value } : task)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: typeof errors = {};
    if (!projectName.trim()) {
      newErrors.projectName = "Project Name is required";
    }
    if (!customerName.trim()) {
      newErrors.customerName = "Customer Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Project created successfully!");
      console.log("Form Data:", {
        projectName,
        customerName,
        linkedClient,
        description,
        budget,
        status,
        dueDate,
        tasks
      });
      router.push("/dashboard/projects");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 pt-4">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Projects
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Create New Project
        </h1>
        <p className="text-muted-foreground">
          Create a new project and organize everything in one workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Name */}
            <div className="space-y-2">
              <label
                htmlFor="projectName"
                className="text-sm font-medium text-foreground"
              >
                Project Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="projectName"
                placeholder="e.g. Redesign Landing Page"
                className="h-11 rounded-xl bg-background border border-input px-3"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (errors.projectName)
                    setErrors((prev) => ({ ...prev, projectName: undefined }));
                }}
                disabled={isSubmitting}
                aria-invalid={!!errors.projectName}
              />
              {errors.projectName && (
                <p className="text-xs text-destructive">
                  {errors.projectName}
                </p>
              )}
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <label
                htmlFor="customerName"
                className="text-sm font-medium text-foreground"
              >
                Customer Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="customerName"
                placeholder="e.g. Microsoft / Sarah Johnson"
                className="h-11 rounded-xl bg-background border border-input px-3"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName)
                    setErrors((prev) => ({ ...prev, customerName: undefined }));
                }}
                disabled={isSubmitting}
                aria-invalid={!!errors.customerName}
              />
              {errors.customerName && (
                <p className="text-xs text-destructive">
                  {errors.customerName}
                </p>
              )}
            </div>
          </div>

          {/* Linked Client (Optional) */}
          <div className="space-y-2">
            <label
              htmlFor="linkedClient"
              className="text-sm font-medium text-foreground"
            >
              Linked Client (Optional)
            </label>
            <Input
              id="linkedClient"
              placeholder="Search by email or Client ID"
              className="h-11 rounded-xl bg-background border border-input px-3"
              value={linkedClient}
              onChange={(e) => setLinkedClient(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground/80">
              Leave empty to keep this project as an offline project.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Outline the goals, deliverables, and scope of this project..."
              rows={4}
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Budget */}
            <div className="space-y-2">
              <label
                htmlFor="budget"
                className="text-sm font-medium text-foreground"
              >
                Budget ($)
              </label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g. 2500"
                className="h-11 rounded-xl bg-background border border-input px-3"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-foreground"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  className="flex h-11 w-full appearance-none items-center justify-between rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-50"
                  >
                    <path
                      d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-foreground"
              >
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                className="h-11 flex w-full rounded-xl bg-background border border-input px-3"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground font-heading">
                Tasks
              </h3>
              <span className="text-xs text-muted-foreground">
                {tasks.length} tasks
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 py-8 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No tasks yet.
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  Add your first task.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={task.id} className="flex gap-2 items-start">
                    <Input
                      placeholder={`e.g. Task ${index + 1}`}
                      className="h-10 rounded-xl bg-background border border-input px-3"
                      value={task.title}
                      onChange={(e) =>
                        handleTaskTitleChange(task.id, e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-10 rounded-xl shrink-0"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-xl gap-2 border-dashed border-2 hover:bg-muted/40"
              disabled={isSubmitting}
              onClick={handleAddTask}
            >
              <Plus className="size-4" />
              Add Task
            </Button>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl text-sm font-medium px-6"
              disabled={isSubmitting}
              asChild
            >
              <Link href="/dashboard/projects">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl text-sm font-medium px-8 transition-all hover:scale-[1.01]"
              style={{ background: "var(--gradient-brand)" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
