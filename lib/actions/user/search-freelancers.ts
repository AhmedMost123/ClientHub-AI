"use server";

import { auth } from "@/auth";
import { success, failure } from "@/lib/utils/action-result";
import { userRepository } from "@/lib/repositories/user.repository";

export async function searchProjectFreelancers(query: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  const freelancers = await userRepository.searchFreelancers(query);
  return success(freelancers);
}
