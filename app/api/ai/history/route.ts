import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiRepository } from "@/lib/repositories/ai.repository";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await aiRepository.findChatsByUser(session.user.id);

    return NextResponse.json({ chats });
  } catch (err) {
    console.error("[AI History] Error:", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
