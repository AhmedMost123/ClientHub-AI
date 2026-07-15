import { ProjectStatus } from "@prisma/client";

export function formatBudget(budget: number | null | undefined) {
  if (!budget) return "--";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(budget);
}

export function formatProjectDate(date: Date | null | undefined) {
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getStatusColor(status: ProjectStatus) {
  switch (status) {
    case ProjectStatus.PLANNING:
      return "bg-gray-500";

    case ProjectStatus.IN_PROGRESS:
      return "bg-blue-500";

    case ProjectStatus.REVIEW:
      return "bg-orange-500";

    case ProjectStatus.COMPLETED:
      return "bg-green-500";

    case ProjectStatus.CANCELLED:
      return "bg-red-500";

    default:
      return "bg-gray-400";
  }
}
