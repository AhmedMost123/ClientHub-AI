import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => void;
}

export function ProposalDialog({ open, onOpenChange, onGenerate }: ProposalDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("Professional");

  const handleGenerate = () => {
    if (!title) return;

    let prompt = `Write a ${tone.toLowerCase()} proposal for a project titled "${title}".\n`;
    if (description) {
      prompt += `\nProject Description: ${description}\n`;
    }
    if (budget) {
      prompt += `\nBudget: ${budget}\n`;
    }
    prompt += `\nPlease structure the proposal clearly with a warm introduction, scope of work, timeline/milestones, and a call to action.`;

    onGenerate(prompt);
    onOpenChange(false);
    
    // Reset state
    setTitle("");
    setDescription("");
    setBudget("");
    setTone("Professional");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Write Proposal</DialogTitle>
          <DialogDescription>
            Provide some basic details about the project to generate a tailored proposal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g., E-commerce Website Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what the client needs..."
              className="resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                placeholder="e.g., $5,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!title}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
