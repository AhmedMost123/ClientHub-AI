import { auth } from "@/auth";
import { PageContainer } from "@/components/shared/PageContainer";
import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { ProjectInvitationCard } from "@/components/notifications/ProjectInvitationCard";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const [invitations, notifications] = await Promise.all([
    projectInvitationRepository.findPendingInvitationsForClient(session.user.id),
    notificationRepository.findForUser(session.user.id),
  ]);

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
        {invitations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pending Invitations</h2>
            <div className="grid gap-4">
              {invitations.map((invitation) => (
                <ProjectInvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-card/50 p-8 text-center text-muted-foreground">
              No recent notifications
            </div>
          ) : (
            <div className="grid gap-4">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
