"use client";

import { useState } from "react";
import { AIHero } from "@/components/ai-assistant/AIHero";
import { QuickActionsGrid, QuickAction } from "@/components/ai-assistant/QuickActionsGrid";
import { AIChat } from "@/components/ai-assistant/AIChat";
import { ProposalDialog } from "@/components/ai-assistant/ProposalDialog";
import { Message } from "@/components/ai-assistant/AIMessage";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI response (for demonstration purposes)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm a freelancer copilot placeholder. Once connected to a real backend, I will generate responses based on your context, projects, and clients.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleActionSelect = (action: QuickAction) => {
    if (action.id === "proposal") {
      setIsProposalDialogOpen(true);
    } else {
      setInput(action.prompt);
    }
  };

  const handleGenerateProposal = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full max-w-5xl mx-auto px-4 md:px-6 pb-6">
      <div className="flex-shrink-0">
        <AIHero />
        <div className="mb-2">
          <QuickActionsGrid onActionSelect={handleActionSelect} />
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <AIChat
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleSend}
        />
      </div>

      <ProposalDialog
        open={isProposalDialogOpen}
        onOpenChange={setIsProposalDialogOpen}
        onGenerate={handleGenerateProposal}
      />
    </div>
  );
}
