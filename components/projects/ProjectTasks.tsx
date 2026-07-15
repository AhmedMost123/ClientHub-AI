"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProjectTasks() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground font-heading">
          Tasks
        </h3>
        <span className="text-xs text-muted-foreground">
          {fields.length} Task{fields.length !== 1 && "s"}
        </span>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 py-8 text-center">
          <Clipboard className="mb-2 size-6 text-muted-foreground/60" />
          <p className="text-sm font-medium text-muted-foreground">
            No tasks yet.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1">
            Add your first task.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              {/* Optional: We could use a shadcn Checkbox here, but a native or customized one also works. 
                  Given the requirements, checkbox wasn't fully specified, but we installed shadcn checkbox. */}
              <div className="flex-1">
                <Input
                  placeholder={`e.g. Task ${index + 1}`}
                  className="h-10 rounded-xl bg-background border border-input px-3"
                  {...register(`tasks.${index}.title`)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
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
        onClick={() => append({ title: "", completed: false })}
      >
        <Plus className="size-4" />
        Add Task
      </Button>
    </div>
  );
}
