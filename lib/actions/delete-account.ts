"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "./action-result";
import { signOut } from "@/auth";

export async function deleteAccount() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    // Soft delete: mark user as disabled
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isDisabled: true,
      },
    });

    // Sign out the user
    await signOut({ redirectTo: "/login" });

    return success({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return failure("Failed to delete account");
  }
}
