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
  Bell,
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

// Freelancer Navigation
export const freelancerMainNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban, badge: 8 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, badge: 12 },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export const freelancerBottomNavigation: NavItem[] = [
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

// Client Navigation
export const clientMainNavigation: NavItem[] = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Projects", href: "/client/projects", icon: FolderKanban },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export const clientBottomNavigation: NavItem[] = [
  { name: "Support", href: "/client/support", icon: HelpCircle },
  { name: "AI Assistant", href: "/client/ai-assistant", icon: Sparkles },
];

// Legacy navigation (for backward compatibility)
export const mainNavigation: NavItem[] = freelancerMainNavigation;
export const bottomNavigation: NavItem[] = freelancerBottomNavigation;

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
