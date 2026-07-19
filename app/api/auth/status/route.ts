import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isDisabled: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isDisabled: true },
    });

    return NextResponse.json({ isDisabled: user?.isDisabled ?? false });
  } catch (error) {
    return NextResponse.json({ isDisabled: false });
  }
}
