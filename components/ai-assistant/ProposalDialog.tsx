"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the full proposal text to inject into the chat as a message */
  onProposalGenerated: (proposalText: string) => void;
}

export function ProposalDialog({ open, onOpenChange, onProposalGenerated }: ProposalDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, budget, tone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate proposal");
      }

      // Stream the response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullText = "";

      // Close dialog and start chat before streaming
      onOpenChange(false);
      resetForm();

      // Stream tokens into chat
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);
            if (event.type === "token") {
              fullText += event.content;
              onProposalGenerated(fullText);
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate proposal";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setBudget("");
    setTone("Professional");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isGenerating) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Write Proposal</DialogTitle>
          <DialogDescription>
            Provide project details and ClientHub AI will generate a tailored, professional proposal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="proposal-title">Project Title <span className="text-destructive">*</span></Label>
            <Input
              id="proposal-title"
              placeholder="e.g., E-commerce Website Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proposal-description">Short Description</Label>
            <Textarea
              id="proposal-description"
              placeholder="Briefly describe what the client needs..."
              className="resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="proposal-budget">Budget (Optional)</Label>
              <Input
                id="proposal-budget"
                placeholder="e.g., $5,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proposal-tone">Tone</Label>
              <Select value={tone} onValueChange={(val) => setTone(val || "Professional")} disabled={isGenerating}>
                <SelectTrigger id="proposal-tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Confident">Confident</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!title.trim() || isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Proposal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
