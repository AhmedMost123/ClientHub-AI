/**
 * Prompt builders for quick actions.
 * All prompt construction lives here — not in routes or components.
 */

export interface ProposalParams {
  title: string;
  description?: string;
  budget?: string;
  tone: string;
}

export function buildProposalPrompt(params: ProposalParams): string {
  const { title, description, budget, tone } = params;

  let prompt = `Write a ${tone.toLowerCase()} freelance proposal for the following project:\n\n`;
  prompt += `**Project Title:** ${title}\n`;

  if (description) {
    prompt += `**Project Description:** ${description}\n`;
  }

  if (budget) {
    prompt += `**Client's Budget:** ${budget}\n`;
  }

  prompt += `\nTone: ${tone}. Make it professional, persuasive, and specific to this project.`;

  return prompt;
}

export function buildTitlePrompt(firstMessage: string): string {
  return `Generate a very short conversation title (3-5 words max) for this user message. Return ONLY the title, no quotes, no punctuation at the end:\n\n"${firstMessage.slice(0, 200)}"`;
}

export function buildReplyPrompt(clientMessage: string): string {
  return `Help me write a professional, friendly reply to this client message:\n\n"${clientMessage}"`;
}

export function buildEstimatePrompt(requirements: string): string {
  return `Estimate the effort and pricing for a project with these requirements:\n\n"${requirements}"\n\nBreak it down by phase, tasks, estimated hours, and total price range.`;
}

export function buildContractPrompt(projectDetails: string): string {
  return `Draft a professional freelance contract for:\n\n"${projectDetails}"\n\nInclude: scope, deliverables, timeline, payment terms, revisions policy, and termination clause.`;
}

export function buildTranslatePrompt(text: string): string {
  return `Translate the following message into professional English (maintain the original tone and formality):\n\n"${text}"`;
}

export function buildRewritePrompt(text: string): string {
  return `Rewrite the following text to sound more professional, confident, and polished. Keep the same meaning:\n\n"${text}"`;
}

export function buildTaskBreakdownPrompt(projectDescription: string): string {
  return `Break down the following project into a detailed work breakdown structure:\n\n"${projectDescription}"\n\nFor each task, provide: Phase, Task name, Estimated hours, Dependencies, and Priority (High/Medium/Low). Format as a clear table or structured list.`;
}
