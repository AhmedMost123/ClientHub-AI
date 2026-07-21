"use server";

import { auth } from "@/auth";
import { searchClients } from "@/lib/repositories/user.repository";
import { success, failure } from "@/lib/utils/action-result";

export async function searchProjectClients(query: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  if (session.user.role !== "FREELANCER") {
    return failure("Forbidden");
  }

  try {
    const clients = await searchClients(query);

    return success(clients);
  } catch (error) {
    console.error(error);

    return failure("Failed to search clients.");
  }
}
