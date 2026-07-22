import { z } from "zod";
import { TaskStatus, Priority } from "@prisma/client";

export const CreateTaskSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  estimatedHours: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(0).optional()),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(Priority).default("MEDIUM"),
  dueDate: z.preprocess((val) => {
    if (!val || val === "" || val === null) return null;
    const d = new Date(val as any);
    return isNaN(d.getTime()) ? null : d;
  }, z.date().nullable().optional()),
});

export const UpdateTaskSchema = CreateTaskSchema.extend({
  id: z.string().min(1, "Task ID is required"),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
