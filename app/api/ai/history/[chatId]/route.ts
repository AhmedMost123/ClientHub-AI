import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiRepository } from "@/lib/repositories/ai.repository";
import { UpdateChatSchema } from "@/lib/ai/validators";
import { AISenderRole } from "@prisma/client";

interface Params {
  params: Promise<{ chatId: string }>;
}

/** GET — load full conversation with messages */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    const chat = await aiRepository.findChat(chatId, session.user.id);

    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Map DB role to frontend role
    const messages = chat.messages.map((m) => ({
      id: m.id,
      role: m.role === AISenderRole.USER ? "user" : "assistant",
      content: m.content,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ chat: { ...chat, messages } });
  } catch (err) {
    console.error("[AI History/chatId GET] Error:", err);
    return NextResponse.json({ error: "Failed to load conversation" }, { status: 500 });
  }
}

/** DELETE — delete a conversation */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    await aiRepository.deleteChat(chatId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[AI History/chatId DELETE] Error:", err);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}

/** PATCH — rename a conversation */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = UpdateChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    const { chatId } = await params;
    await aiRepository.updateChatTitle(chatId, session.user.id, parsed.data.title);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[AI History/chatId PATCH] Error:", err);
    return NextResponse.json({ error: "Failed to rename conversation" }, { status: 500 });
  }
}
