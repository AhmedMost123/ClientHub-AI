import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai.service";
import { ChatRequestSchema } from "@/lib/ai/validators";
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

    // 2. Rate limit
    const rateCheck = checkRateLimit(session.user.id, AI_CONFIG.rateLimitPerMinute);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before sending another message." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)) },
        },
      );
    }

    // 3. Validate body
    const body = await req.json().catch(() => null);
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { message, chatId } = parsed.data;

    // 4. Call AI service (get stream)
    const { stream, chatId: resolvedChatId } = await aiService.sendMessage(
      session.user.id,
      message,
      session.user.role === "CLIENT" ? "CLIENT" : "FREELANCER",
      chatId,
    );

    // 5. Build SSE stream
    const encoder = new TextEncoder();
    let fullContent = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send chatId as the first SSE event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "chatId", chatId: resolvedChatId })}\n\n`),
          );

          // Stream tokens
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              fullContent += token;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "token", content: token })}\n\n`),
              );
            }
          }

          // Persist full response after streaming
          await aiService.saveAssistantMessage(resolvedChatId, fullContent);

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Stream error";
          console.error("[AI Chat] Stream error:", message);
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
    console.error("[AI Chat] Error:", message);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
