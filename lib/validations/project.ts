import { z } from "zod";
import { ProjectStatus, Prisma } from "@prisma/client";

export const CreateProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Project name must be at least 3 characters.")
    .max(100),

  customerName: z.string().min(2, "Customer name is required.").max(100),

  description: z.string().max(2000).optional().or(z.literal("")),

  budget: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    return Number(val);
  }, z.number().min(0, "Budget cannot be negative").optional()),

  status: z.nativeEnum(ProjectStatus).default("PLANNING"),

  dueDate: z.date().nullable().optional(),

  linkedClientId: z.string().nullable().optional(),
});

export const CreateClientProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Project name must be at least 3 characters.")
    .max(100),

  description: z.string().max(2000).optional().or(z.literal("")),

  budget: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    return Number(val);
  }, z.number().min(0, "Budget cannot be negative").optional()),

  dueDate: z.date().nullable().optional(),

  freelancerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const UpdateProjectSchema = CreateProjectSchema;

export const ArchiveProjectSchema = z.object({
  projectId: z.cuid2(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export type CreateClientProjectInput = z.infer<typeof CreateClientProjectSchema>;

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export type ProjectCardData = Prisma.ProjectGetPayload<{
  include: {
    linkedClient: {
      select: {
        id: true;
        name: true;
        avatar: true;
      };
    };
    _count: {
      select: {
        tasks: true;
      };
    };
  };
}>;
