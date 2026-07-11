import type { LucideIcon } from "lucide-react";
import {
  Clock,
  DollarSign,
  FolderKanban,
  Receipt,
} from "lucide-react";

export type StatItem = {
  title: string;
  value: string;
  description: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  gradient: string;
};

export const stats: StatItem[] = [
  {
    title: "Revenue",
    value: "$12,500",
    description: "Total this month",
    change: "+12.4%",
    trend: "up",
    icon: DollarSign,
    gradient: "var(--gradient-card-emerald)",
  },
  {
    title: "Projects",
    value: "8",
    description: "Active engagements",
    change: "+2",
    trend: "up",
    icon: FolderKanban,
    gradient: "var(--gradient-card-violet)",
  },
  {
    title: "Pending Invoices",
    value: "3",
    description: "Awaiting payment",
    change: "2 overdue",
    trend: "down",
    icon: Receipt,
    gradient: "var(--gradient-card-amber)",
  },
  {
    title: "Billable Hours",
    value: "34.5h",
    description: "Logged this week",
    change: "+5.2h",
    trend: "up",
    icon: Clock,
    gradient: "var(--gradient-card-blue)",
  },
];

export const revenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 7200 },
  { month: "Mar", revenue: 4100 },
  { month: "Apr", revenue: 8600 },
  { month: "May", revenue: 7300 },
  { month: "Jun", revenue: 10200 },
  { month: "Jul", revenue: 8100 },
  { month: "Aug", revenue: 11700 },
  { month: "Sep", revenue: 9500 },
  { month: "Oct", revenue: 13200 },
  { month: "Nov", revenue: 11800 },
  { month: "Dec", revenue: 14500 },
];

export type Project = {
  id: string;
  title: string;
  client: string;
  progress: number;
  deadline: string;
  status: "in-progress" | "review" | "planning";
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Acme Corp Redesign",
    client: "Acme Corp",
    progress: 75,
    deadline: "3 days",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Mobile App MVP",
    client: "Stark Industries",
    progress: 40,
    deadline: "2 weeks",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Brand Identity System",
    client: "Globex",
    progress: 90,
    deadline: "5 days",
    status: "review",
  },
  {
    id: "4",
    title: "Marketing Website",
    client: "Initech",
    progress: 15,
    deadline: "1 month",
    status: "planning",
  },
];

export type Deadline = {
  id: string;
  title: string;
  company: string;
  date: string;
  urgent?: boolean;
};

export const deadlines: Deadline[] = [
  {
    id: "1",
    title: "Finalize Wireframes",
    company: "Acme Corp",
    date: "Today",
    urgent: true,
  },
  {
    id: "2",
    title: "Submit Invoice #142",
    company: "Globex",
    date: "Tomorrow",
    urgent: true,
  },
  {
    id: "3",
    title: "Client Check-in",
    company: "Stark Industries",
    date: "Oct 15",
  },
  {
    id: "4",
    title: "Deliver Phase 2 Assets",
    company: "Initech",
    date: "Oct 18",
  },
];

export type ActivityItem = {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "invoice" | "project" | "message" | "payment";
};

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    action: "Invoice paid",
    target: "Globex — $2,400",
    time: "2h ago",
    type: "payment",
  },
  {
    id: "2",
    action: "New message from",
    target: "Sarah (Acme Corp)",
    time: "4h ago",
    type: "message",
  },
  {
    id: "3",
    action: "Project updated",
    target: "Mobile App MVP",
    time: "Yesterday",
    type: "project",
  },
  {
    id: "4",
    action: "Invoice sent",
    target: "Stark Industries — $5,200",
    time: "Yesterday",
    type: "invoice",
  },
];

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
};

export const recentInvoices: Invoice[] = [
  {
    id: "INV-142",
    client: "Globex",
    amount: "$2,400",
    status: "paid",
    dueDate: "Oct 1",
  },
  {
    id: "INV-143",
    client: "Acme Corp",
    amount: "$3,800",
    status: "pending",
    dueDate: "Oct 12",
  },
  {
    id: "INV-144",
    client: "Stark Industries",
    amount: "$5,200",
    status: "overdue",
    dueDate: "Oct 5",
  },
];

export type TaskProgressItem = {
  id: string;
  label: string;
  completed: number;
  total: number;
};

export const taskProgress: TaskProgressItem[] = [
  { id: "1", label: "Design tasks", completed: 8, total: 10 },
  { id: "2", label: "Development", completed: 5, total: 12 },
  { id: "3", label: "Client reviews", completed: 2, total: 4 },
];

export type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  type: "meeting" | "deadline" | "call";
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Acme Corp sync",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    id: "2",
    title: "Wireframe deadline",
    time: "2:00 PM",
    type: "deadline",
  },
  {
    id: "3",
    title: "Globex kickoff call",
    time: "4:30 PM",
    type: "call",
  },
];

export const quickActions = [
  { label: "New Invoice", href: "/invoices" },
  { label: "Log Time", href: "/time-tracking" },
  { label: "Add Client", href: "/clients" },
  { label: "Create Proposal", href: "/proposal-generator" },
];
