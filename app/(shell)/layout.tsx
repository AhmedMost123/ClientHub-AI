import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
