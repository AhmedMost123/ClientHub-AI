import {
  Calendar,
  CheckSquare,
  Clock,
  CreditCard,
  FileSignature,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const mainNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban, badge: 8 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, badge: 12 },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const bottomNavigation: NavItem[] = [
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

export const futureNavigation: NavGroup[] = [
  {
    label: "Business",
    items: [
      { name: "Invoices", href: "/invoices", icon: Receipt },
      { name: "Contracts", href: "/contracts", icon: FileSignature },
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Time Tracking", href: "/time-tracking", icon: Clock },
    ],
  },
  {
    label: "Workspace",
    items: [
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Files", href: "/files", icon: FolderKanban },
      { name: "Notifications", href: "/notifications", icon: MessageSquare },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { name: "Proposal Generator", href: "/proposal-generator", icon: Wand2 },
      { name: "Meeting Notes", href: "/meeting-notes", icon: Mic },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Admin", href: "/admin", icon: Shield },
    ],
  },
];

export const allRoutes = [
  ...mainNavigation,
  ...bottomNavigation,
  ...futureNavigation.flatMap((group) => group.items),
];

export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
