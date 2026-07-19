import { NextResponse } from "next/server";

import { RegisterSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), {
        status: 400,
      });
    }

    const { confirmPassword, ...userData } = parsed.data;

    await registerUser(userData);

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
      { status: 500 },
    );
  }
}
