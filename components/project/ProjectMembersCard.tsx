import { User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
  name: string;
  avatar: string | null;
  role: string;
  online: boolean;
}

interface ProjectMembersCardProps {
  freelancer: Member;
  client: Member;
}

export function ProjectMembersCard({ freelancer, client }: ProjectMembersCardProps) {
  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Members</h2>
      
      <div className="space-y-4">
        {/* Freelancer */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="flex size-10 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-brand-subtle)" }}
            >
              {freelancer.avatar ? (
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <User className="size-5" style={{ color: "var(--color-primary)" }} />
              )}
            </div>
            {freelancer.online && (
              <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{freelancer.name}</p>
              <Crown className="size-3 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground">Freelancer</p>
          </div>
          <span
            className={cn(
              "flex size-2 rounded-full",
              freelancer.online ? "bg-emerald-500" : "bg-muted"
            )}
          />
        </div>

        {/* Client */}
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-full"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <User className="size-5" style={{ color: "var(--color-primary)" }} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{client.name}</p>
            <p className="text-xs text-muted-foreground">Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}
