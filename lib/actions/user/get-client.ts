"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "./action-result";

export async function getClient(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  const client = await prisma.user.findUnique({
    where: {
      id,
      role: "CLIENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  if (!client) {
    return failure("Client not found");
  }

  return success(client);
}
