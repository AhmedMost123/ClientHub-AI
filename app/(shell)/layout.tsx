import { auth } from "@/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session on the server side
  const session = await auth();

  // Successfully passes the session object into the Client Layout wrapper
  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
