/**
 * Prompt builders for quick actions.
 * All prompt construction lives here — not in routes or components.
 */

export interface AIActionParams {
  title: string;
  description?: string;
  budget?: string;
  tone: string;
}

// ─── Shared ─────────────────────────────────────────────────────────────────

export function buildTitlePrompt(firstMessage: string): string {
  return `Generate a very short conversation title (3-5 words max) for this user message. Return ONLY the title, no quotes, no punctuation at the end:\n\n"${firstMessage.slice(0, 200)}"`;
}

export function buildTranslatePrompt(text: string): string {
  return `Translate the following message into professional English (maintain the original tone and formality):\n\n"${text}"`;
}

export function buildRewritePrompt(text: string): string {
  return `Rewrite the following text to sound more professional, confident, and polished. Keep the same meaning:\n\n"${text}"`;
}

// ─── Freelancer Quick Actions ───────────────────────────────────────────────

export function buildProposalPrompt(params: AIActionParams): string {
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

export function buildReplyPrompt(clientMessage: string): string {
  return `Help me write a professional, friendly reply to this client message:\n\n"${clientMessage}"`;
}

export function buildEstimatePrompt(requirements: string): string {
  return `Estimate the effort and pricing for a project with these requirements:\n\n"${requirements}"\n\nBreak it down by phase, tasks, estimated hours, and total price range.`;
}

export function buildContractPrompt(projectDetails: string): string {
  return `Draft a professional freelance contract for:\n\n"${projectDetails}"\n\nInclude: scope, deliverables, timeline, payment terms, revisions policy, and termination clause.`;
}

export function buildTaskBreakdownPrompt(projectDescription: string): string {
  return `Break down the following project into a detailed work breakdown structure:\n\n"${projectDescription}"\n\nFor each task, provide: Phase, Task name, Estimated hours, Dependencies, and Priority (High/Medium/Low). Format as a clear table or structured list.`;
}

// ─── Client Quick Actions ───────────────────────────────────────────────────

export function buildProjectDescriptionPrompt(params: AIActionParams): string {
  const { title, description, budget, tone } = params;

  let prompt = `Write a ${tone.toLowerCase()} project description/brief for the following project:\n\n`;
  prompt += `**Project Title:** ${title}\n`;

  if (description) {
    prompt += `**Initial Requirements:** ${description}\n`;
  }

  if (budget) {
    prompt += `**Budget:** ${budget}\n`;
  }

  prompt += `\nTone: ${tone}. Make it professional, clear, and actionable for hiring a freelancer.`;

  return prompt;
}

export function buildMessageToFreelancerPrompt(text: string): string {
  return `Help me write a professional, friendly message to a freelancer regarding the following:\n\n"${text}"`;
}

export function buildImproveRequirementsPrompt(text: string): string {
  return `Please rewrite and improve these project requirements to make them crystal clear, structured, and easy for a freelancer to understand:\n\n"${text}"`;
}

export function buildCreateProjectScopePrompt(text: string): string {
  return `Help me define a clear project scope, including deliverables and out-of-scope items, based on these initial ideas:\n\n"${text}"`;
}

export function buildMeetingSummaryPrompt(text: string): string {
  return `Summarize these meeting notes into a clear action plan, key decisions, and summary for the project:\n\n"${text}"`;
}

export function buildAcceptanceCriteriaPrompt(text: string): string {
  return `Generate detailed, testable acceptance criteria for the following feature or project requirement:\n\n"${text}"`;
}
