import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CheckSquare,
  Clock,
  CreditCard,
  FileSignature,
  FolderKanban,
  HelpCircle,
  MessageSquare,
  Mic,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Wand2,
} from "lucide-react";

export type AppPageConfig = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  eyebrow?: string;
};

export const appPages: AppPageConfig[] = [
  {
    slug: "projects",
    title: "Projects",
    description: "Manage client projects, milestones, and deliverables.",
    icon: FolderKanban,
    eyebrow: "Workspace",
  },
  {
    slug: "tasks",
    title: "Tasks",
    description: "Organize and prioritize work across all engagements.",
    icon: CheckSquare,
    eyebrow: "Workspace",
  },
  {
    slug: "clients",
    title: "Clients",
    description: "Your client directory, contacts, and relationship history.",
    icon: Users,
    eyebrow: "Workspace",
  },
  {
    slug: "messages",
    title: "Messages",
    description: "Unified inbox for client communication.",
    icon: MessageSquare,
    eyebrow: "Workspace",
  },
  {
    slug: "settings",
    title: "Settings",
    description: "Configure your workspace, billing, and preferences.",
    icon: Settings,
    eyebrow: "Account",
  },
  {
    slug: "support",
    title: "Support",
    description: "Get help from the ClientHub AI team.",
    icon: HelpCircle,
    eyebrow: "Help",
  },
  {
    slug: "ai-assistant",
    title: "AI Assistant",
    description: "Your intelligent copilot for freelance operations.",
    icon: Sparkles,
    eyebrow: "AI",
  },
  {
    slug: "invoices",
    title: "Invoices",
    description: "Create, send, and track invoices effortlessly.",
    icon: Receipt,
    eyebrow: "Business",
  },
  {
    slug: "contracts",
    title: "Contracts",
    description: "Manage agreements and e-signatures with clients.",
    icon: FileSignature,
    eyebrow: "Business",
  },
  {
    slug: "payments",
    title: "Payments",
    description: "Track incoming payments and payout history.",
    icon: CreditCard,
    eyebrow: "Business",
  },
  {
    slug: "time-tracking",
    title: "Time Tracking",
    description: "Log billable hours and generate timesheets.",
    icon: Clock,
    eyebrow: "Business",
  },
  {
    slug: "calendar",
    title: "Calendar",
    description: "Schedule meetings, deadlines, and reminders.",
    icon: Calendar,
    eyebrow: "Workspace",
  },
  {
    slug: "files",
    title: "Files",
    description: "Centralized document and asset management.",
    icon: FolderKanban,
    eyebrow: "Workspace",
  },
  {
    slug: "notifications",
    title: "Notifications",
    description: "Stay on top of activity across your business.",
    icon: MessageSquare,
    eyebrow: "Workspace",
  },
  {
    slug: "proposal-generator",
    title: "Proposal Generator",
    description: "Draft winning proposals with AI assistance.",
    icon: Wand2,
    eyebrow: "AI",
  },
  {
    slug: "meeting-notes",
    title: "Meeting Notes",
    description: "Capture, summarize, and action client meetings.",
    icon: Mic,
    eyebrow: "AI",
  },
  {
    slug: "profile",
    title: "Profile",
    description: "Manage your personal account and public presence.",
    icon: User,
    eyebrow: "Account",
  },
  {
    slug: "admin",
    title: "Admin",
    description: "Workspace administration and team management.",
    icon: Shield,
    eyebrow: "Account",
  },
];

export function getPageConfig(slug: string): AppPageConfig | undefined {
  return appPages.find((page) => page.slug === slug);
}
