import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });
}
