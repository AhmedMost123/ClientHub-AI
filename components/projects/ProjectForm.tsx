"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

import { ProjectStatusSelect } from "./ProjectStatusSelect";
import { ProjectDatePicker } from "./ProjectDatePicker";
import { ProjectClientCombobox } from "./ProjectClientCombobox";

import { CreateProjectInput, CreateProjectSchema } from "@/lib/validations/project";
import { createProject } from "@/lib/actions/project/create-project";
import { updateProject } from "@/lib/actions/project/update-project";

export interface ProjectFormProps {
  mode: "create" | "edit";
  role: "FREELANCER" | "CLIENT";
  initialValues?: Partial<CreateProjectInput>;
  id?: string;
  clientName?: string; // Pre-filled for CLIENT role
}

export function ProjectForm({ mode, role, initialValues, id, clientName }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: initialValues?.title || "",
      customerName: role === "CLIENT" ? clientName || "Me" : initialValues?.customerName || "",
      linkedClientId: initialValues?.linkedClientId || null,
      description: initialValues?.description || "",
      budget: initialValues?.budget || undefined,
      status: initialValues?.status || "PLANNING",
      dueDate: initialValues?.dueDate || undefined,
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = async (data: CreateProjectInput) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createProject(data);
      } else {
        await updateProject(id!, data);
      }

      toast.success(mode === "create" ? "Project created successfully" : "Project updated successfully");
      
      if (mode === "create") {
        router.push("/projects");
      } else {
        router.push(`/projects/${id}`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} project. Please try again.`);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      router.back();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.back();
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8" noValidate>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Project Title */}
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Project Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Redesign Landing Page"
                        className="h-11 rounded-xl bg-background border border-input px-3 focus-visible:ring-primary/30"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Customer Name - Only for Freelancer */}
              {role === "FREELANCER" && (
                <FormField
                  control={form.control as any}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Customer Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Microsoft / Sarah Johnson"
                          className="h-11 rounded-xl bg-background border border-input px-3 focus-visible:ring-primary/30"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Linked Client - Only for Freelancer */}
            {role === "FREELANCER" && <ProjectClientCombobox />}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Outline the goals, deliverables, and scope of this project..."
                      className="min-h-[140px] rounded-xl border border-input bg-background px-3 py-2 focus-visible:ring-primary/30"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-3">
              {/* Budget */}
              <FormField
                control={form.control as any}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      {role === "CLIENT" ? "Budget (Optional Request) $" : "Budget ($)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 2500"
                        className="h-11 rounded-xl bg-background border border-input px-3 focus-visible:ring-primary/30"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Status - Only for Freelancer */}
              {role === "FREELANCER" && <ProjectStatusSelect />}

              {/* Due Date */}
              <ProjectDatePicker />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl text-sm font-medium px-6"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancel
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
                    {mode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  mode === "create" ? "Create Project" : "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Stay</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
