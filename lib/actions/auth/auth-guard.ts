import { auth } from "@/auth";
import { failure } from "./action-result";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
  };
}
