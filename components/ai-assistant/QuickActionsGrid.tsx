import {
  FileText,
  MessageSquareReply,
  Calculator,
  FileSignature,
  Languages,
  PenTool,
  ListChecks,
  Briefcase,
  Wand2,
  ListTodo,
  Crosshair,
  ClipboardList,
  CheckSquare
} from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";

export interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
}

export const FREELANCER_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "proposal",
    title: "Write Proposal",
    icon: <FileText className="w-5 h-5 text-indigo-500" />,
    prompt: "", // Handled specially by the dialog
  },
  {
    id: "reply",
    title: "Reply to Client",
    icon: <MessageSquareReply className="w-5 h-5 text-blue-500" />,
    prompt: "Help me reply professionally to this client message:\n\n",
  },
  {
    id: "estimate",
    title: "Estimate Project Price",
    icon: <Calculator className="w-5 h-5 text-emerald-500" />,
    prompt: "Help me estimate the price for a project with these requirements:\n\n",
  },
  {
    id: "contract",
    title: "Draft Contract",
    icon: <FileSignature className="w-5 h-5 text-amber-500" />,
    prompt: "Draft a standard freelance contract for the following project:\n\n",
  },
  {
    id: "translate",
    title: "Translate Message",
    icon: <Languages className="w-5 h-5 text-violet-500" />,
    prompt: "Please translate the following message into English (or specify language):\n\n",
  },
  {
    id: "rewrite",
    title: "Rewrite Professionally",
    icon: <PenTool className="w-5 h-5 text-pink-500" />,
    prompt: "Please rewrite this text to sound more professional and confident:\n\n",
  },
  {
    id: "tasks",
    title: "Break Project Into Tasks",
    icon: <ListChecks className="w-5 h-5 text-cyan-500" />,
    prompt: "Break down the following project into a detailed list of actionable tasks:\n\n",
  },
];

export const CLIENT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "project_description",
    title: "Write Project Description",
    icon: <Briefcase className="w-5 h-5 text-indigo-500" />,
    prompt: "", // Handled specially by the dialog
  },
  {
    id: "reply_freelancer",
    title: "Message to Freelancer",
    icon: <MessageSquareReply className="w-5 h-5 text-blue-500" />,
    prompt: "Help me write a professional, friendly message to a freelancer regarding the following:\n\n",
  },
  {
    id: "improve_requirements",
    title: "Improve Requirements",
    icon: <Wand2 className="w-5 h-5 text-emerald-500" />,
    prompt: "Please rewrite and improve these project requirements to make them crystal clear for a freelancer:\n\n",
  },
  {
    id: "translate",
    title: "Translate Message",
    icon: <Languages className="w-5 h-5 text-violet-500" />,
    prompt: "Please translate the following message into English (or specify language):\n\n",
  },
  {
    id: "rewrite",
    title: "Rewrite Professionally",
    icon: <PenTool className="w-5 h-5 text-pink-500" />,
    prompt: "Please rewrite this text to sound more professional and confident:\n\n",
  },
  {
    id: "project_scope",
    title: "Create Project Scope",
    icon: <Crosshair className="w-5 h-5 text-amber-500" />,
    prompt: "Help me define a clear project scope based on these initial ideas:\n\n",
  },
  {
    id: "meeting_summary",
    title: "Write Meeting Summary",
    icon: <ClipboardList className="w-5 h-5 text-cyan-500" />,
    prompt: "Summarize these meeting notes into a clear action plan and summary:\n\n",
  },
];

interface QuickActionsGridProps {
  actions: QuickAction[];
  onActionSelect: (action: QuickAction) => void;
  disabled?: boolean;
}

export function QuickActionsGrid({ actions, onActionSelect, disabled = false }: QuickActionsGridProps) {
  return (
    <div className="w-full relative">
      {/* Mobile: Horizontal scroll. Desktop: Single row grid */}
      <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-7 gap-3 md:gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {actions.map((action) => (
          <div key={action.id} className="snap-start flex">
            <QuickActionCard
              icon={action.icon}
              title={action.title}
              onClick={() => onActionSelect(action)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
