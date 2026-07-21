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
    if (!body?.tasks) {
      return NextResponse.json({ error: "Tasks data required" }, { status: 400 });
    }

    const { tasks, workHoursPerDay = 8 } = body;

    const tasksSummary = tasks
      .slice(0, 20)
      .map((t: { title: string; priority: string; estimatedHours?: number | null; dueDate?: string | null; status: string; projectTitle: string }) => 
        `- ${t.title} (Project: ${t.projectTitle}, Priority: ${t.priority}, Est: ${t.estimatedHours || 2}h, Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No due date"}, Status: ${t.status})`
      )
      .join("\n");

    const systemPrompt = `You are an AI Daily Planner for freelancers. Create an optimal daily work schedule based on task priorities, deadlines, and estimated hours. Be practical and realistic.`;

    const userPrompt = `Create today's optimal work schedule for these tasks. Prioritize by urgency, due date, and priority.

Available tasks:
${tasksSummary}

Work hours available today: ${workHoursPerDay} hours
Current time: ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}

Return a JSON object:
{
  "schedule": [
    {
      "startTime": "09:00",
      "endTime": "10:30",
      "taskTitle": "task name",
      "projectTitle": "project name",
      "activity": "what to accomplish",
      "type": "deep_work|review|testing|meeting|break"
    }
  ],
  "totalHours": 7.5,
  "focusTask": "The most important task for today",
  "recommendation": "Today's key advice",
  "risks": ["identified risks for today"]
}

Return ONLY the JSON object.`;

    const completion = await groqClient.chat.completions.create({
      model: AI_CONFIG.chatModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    let parsed;
    try {
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
    console.error("[Daily Planner] Error:", err);
    return NextResponse.json({ error: "Failed to generate daily plan" }, { status: 500 });
  }
}
