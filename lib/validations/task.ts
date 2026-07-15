import { z } from "zod";
import { TaskStatus, Priority } from "@prisma/client";

export const CreateTaskSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  estimatedHours: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    return Number(val);
  }, z.number().min(0).optional()),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(Priority).default("MEDIUM"),
  dueDate: z.date().nullable().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.extend({
  id: z.string().cuid(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
