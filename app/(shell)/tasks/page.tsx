import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { PageContainer } from "@/components/shared/PageContainer";
import { getAllTasks } from "@/lib/actions/task/get-all-tasks";
import { getProjects } from "@/lib/actions/project/get-projects";
import TasksPageClient from "@/components/tasks/TasksPageClient";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Freelancer-only page
  if (session.user.role === "CLIENT") {
    redirect("/client");
  }

  // Fetch tasks + projects in parallel
  const [tasksResult, projectsResult] = await Promise.all([
    getAllTasks(),
    getProjects({ includeArchived: false }),
  ]);

  const tasks = tasksResult.success ? (tasksResult.data ?? []) : [];
  const projects = projectsResult.success
    ? (projectsResult.data ?? []).map((p: any) => ({
        id: p.id,
        title: p.title,
        status: p.status,
      }))
    : [];

  return (
    <PageContainer className="space-y-6 pb-16">
      <TasksPageClient
        initialTasks={tasks}
        projects={projects}
      />
    </PageContainer>
  );
}
