import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { groqClient } from "@/lib/ai/groq";
import { AI_CONFIG } from "@/lib/ai/config";
import { checkRateLimit } from "@/lib/ai/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateCheck = checkRateLimit(session.user.id, AI_CONFIG.rateLimitPerMinute);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.task) {
      return NextResponse.json({ error: "Task data required" }, { status: 400 });
    }

    const { task, mode } = body;

    const systemPrompt = `You are an expert AI Project Manager and senior software developer. You help freelancers understand and implement their tasks with deep technical guidance. 
    
You analyze tasks and provide:
- Clear implementation steps
- File recommendations  
- Workflow guidance
- Tool suggestions
- Best practices
- Common pitfalls
- Risk identification

Always be specific, actionable, and practical. Format your response as structured JSON.`;

    let userPrompt = "";

    if (mode === "analyze") {
      userPrompt = `Analyze this task and return a JSON object with the following structure:
{
  "goal": "what this task aims to accomplish",
  "difficulty": "Easy|Medium|Hard|Expert",
  "estimatedDuration": "time estimate as string",
  "complexity": "Low|Medium|High",
  "prerequisites": ["list of prerequisites"],
  "dependencies": ["list of dependencies on other features"],
  "potentialBlockers": ["list of potential blockers"],
  "implementationSteps": [
    {"step": 1, "title": "step title", "description": "what to do"}
  ],
  "filesToEdit": ["suggested files to edit"],
  "suggestedWorkflow": ["Database", "Backend", "Validation", "Frontend", "Testing"],
  "suggestedTools": [
    {"name": "tool name", "reason": "why to use it"}
  ],
  "bestPractices": ["list of best practices"],
  "commonMistakes": ["list of common mistakes"],
  "testingChecklist": ["test case 1", "test case 2"],
  "todaysRecommendation": "What to focus on today for this task"
}

Task:
Title: ${task.title}
Description: ${task.description || "No description provided"}
Priority: ${task.priority}
Status: ${task.status}
Project: ${task.projectTitle}

Return ONLY the JSON object, no markdown, no extra text.`;
    } else if (mode === "teach") {
      userPrompt = `Act as a senior developer mentoring a junior developer. Explain how to implement this task step by step, covering the WHY behind each decision, concepts involved, and things to watch out for.

Task:
Title: ${task.title}
Description: ${task.description || "No description provided"}
Priority: ${task.priority}
Project: ${task.projectTitle}

Return a JSON object:
{
  "intro": "Brief overview of what we're building and why",
  "concepts": [
    {"name": "concept name", "explanation": "what it is and why it matters"}
  ],
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "explanation": "Detailed explanation of what to do and WHY",
      "tip": "A mentor tip or warning"
    }
  ],
  "keyInsights": ["important insights about this task"],
  "watchOut": ["things to watch out for as a junior developer"]
}

Return ONLY the JSON object.`;
    } else if (mode === "subtasks") {
      userPrompt = `Break this task into logical subtasks that a developer can work on independently.

Task:
Title: ${task.title}
Description: ${task.description || "No description provided"}
Priority: ${task.priority}
Project: ${task.projectTitle}

Return a JSON object:
{
  "subtasks": [
    {
      "title": "Subtask title",
      "description": "What to do",
      "estimatedHours": 2,
      "priority": "HIGH|MEDIUM|LOW",
      "phase": "Backend|Frontend|Testing|Documentation|DevOps"
    }
  ]
}

Return ONLY the JSON object. Generate 4-8 subtasks.`;
    }

    const completion = await groqClient.chat.completions.create({
      model: AI_CONFIG.chatModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: AI_CONFIG.chatMaxTokens,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Find JSON object in response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { raw: content };
      }
    } catch {
      parsed = { raw: content };
    }

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("[Task Coach] Error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
