import type { UserRole } from "@prisma/client";

export function getRedirectPathForRole(role: UserRole | undefined): string {
  switch (role) {
    case "FREELANCER":
      return "/dashboard";
    case "CLIENT":
      return "/client";
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
}
