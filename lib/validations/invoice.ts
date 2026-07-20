import { z } from "zod";

export const CreateInvoiceSchema = z.object({
  projectId: z.string().cuid(),
  amount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive("Amount must be positive")
  ),
  dueDate: z.date().nullable().optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
