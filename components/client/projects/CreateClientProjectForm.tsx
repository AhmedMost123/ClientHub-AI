"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ProjectDatePicker } from "@/components/projects/ProjectDatePicker";
import { ProjectFreelancerCombobox } from "@/components/projects/ProjectFreelancerCombobox";

import { CreateClientProjectInput, CreateClientProjectSchema } from "@/lib/validations/project";
import { createClientProject } from "@/lib/actions/client/create-project";

export function CreateClientProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(CreateClientProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      notes: "",
      budget: undefined,
      dueDate: undefined,
      freelancerEmail: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createClientProject(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Project created successfully!");
      router.push("/client/projects");
    } catch (error: any) {
      toast.error(error.message || "Failed to create project. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8" noValidate>
            
            <div className="grid gap-6 md:grid-cols-2">
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
                        placeholder="e.g. Mobile App Development"
                        className="h-11 rounded-xl bg-background border border-input px-3 focus-visible:ring-primary/30"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <ProjectFreelancerCombobox />
            </div>

            <FormField
              control={form.control as any}
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

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Proposed Budget ($)
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

              <ProjectDatePicker />
            </div>

            <FormField
              control={form.control as any}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Optional Notes (Only visible to freelancer)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional requirements or notes..."
                      className="min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 focus-visible:ring-primary/30"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl text-sm font-medium px-6"
                disabled={isSubmitting}
                onClick={() => router.back()}
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
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
