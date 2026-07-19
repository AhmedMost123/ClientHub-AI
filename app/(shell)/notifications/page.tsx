import { auth } from "@/auth";
import { PageContainer } from "@/components/shared/PageContainer";
import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const invitations = await projectInvitationRepository.findPendingInvitationsForClient(session.user.id);

  return (
    <PageContainer className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <Bell className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your projects and invitations.</p>
        </div>
      </div>

      <div className="space-y-6">

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <NotificationsList />
        </div>
      </div>
    </PageContainer>
  );
}
