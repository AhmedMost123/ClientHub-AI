import { z } from "zod";

// Register Schema with role validation
export const RegisterSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string(),
    role: z.enum(["FREELANCER", "CLIENT"], {
      message: "Invalid role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export type UserCreateInput = Omit<RegisterInput, "confirmPassword">;

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
