import { headers } from "next/headers";

export async function getRequestIdentifier() {
  const headersList = await headers();

  return (
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}
