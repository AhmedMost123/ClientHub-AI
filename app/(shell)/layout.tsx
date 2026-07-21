import { auth } from "@/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { prisma } from "@/lib/prisma";

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session on the server side
  const session = await auth();

  let activeProjectsCount = 0;
  let activeTasksCount = 0;

  if (session?.user?.id && session.user.role === "FREELANCER") {
    const [projectsCount, tasksCount] = await Promise.all([
      prisma.project.count({
        where: {
          ownerId: session.user.id,
          isArchived: false,
        },
      }),
      prisma.task.count({
        where: {
          project: {
            ownerId: session.user.id,
            isArchived: false,
          },
          status: { not: "DONE" },
          deletedAt: null,
        },
      }),
    ]);
    activeProjectsCount = projectsCount;
    activeTasksCount = tasksCount;
  }

  // Successfully passes the session object into the Client Layout wrapper
  return (
    <DashboardLayout 
      session={session}
      activeProjectsCount={activeProjectsCount}
      activeTasksCount={activeTasksCount}
    >
      {children}
    </DashboardLayout>
  );
}
