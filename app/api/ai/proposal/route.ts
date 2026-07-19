import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai.service";
import { ProposalRequestSchema } from "@/lib/ai/validators";
import { buildProposalPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import { AI_CONFIG } from "@/lib/ai/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limit (shared with chat)
    const rateCheck = checkRateLimit(`proposal:${session.user.id}`, AI_CONFIG.rateLimitPerMinute);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before generating another proposal." },
        { status: 429 },
      );
    }

    // 3. Validate body
    const body = await req.json().catch(() => null);
    const parsed = ProposalRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const prompt = buildProposalPrompt(parsed.data);
    const stream = await aiService.generateProposal(prompt);

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "token", content: token })}\n\n`),
              );
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Stream error";
          console.error("[AI Proposal] Stream error:", message);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[AI Proposal] Error:", message);
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
  }
}
