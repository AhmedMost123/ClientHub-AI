import { auth } from "@/auth";
import { redirect } from "next/navigation";

type UserRole = "FREELANCER" | "CLIENT" | "ADMIN";

/**
 * Require user to be authenticated
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Require user to be a Freelancer
 * Redirects to login if not authenticated
 * Redirects to unauthorized page if not a Freelancer
 */
export async function requireFreelancer() {
  const session = await requireAuth();

  if (session.user.role !== "FREELANCER") {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Require user to be a Client
 * Redirects to login if not authenticated
 * Redirects to unauthorized page if not a Client
 */
export async function requireClient() {
  const session = await requireAuth();

  if (session.user.role !== "CLIENT") {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Require user to be an Admin
 * Redirects to login if not authenticated
 * Redirects to unauthorized page if not an Admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}
