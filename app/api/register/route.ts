import { NextResponse } from "next/server";

import { RegisterSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/auth.service";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIdentifier } from "@/lib/security/request-ip";

export async function POST(req: Request) {
  const identifier = await getRequestIdentifier();

  const allowed = rateLimit(`register:${identifier}`, 5, 60_000);

  if (!allowed.success) {
    return NextResponse.json(
      {
        message: "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  try {
    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), {
        status: 400,
      });
    }

    const { confirmPassword, ...userData } = parsed.data;

    const user = await registerUser(userData);

    return NextResponse.json(
      {
        success: true,
        requiresVerification: true,
        email: user.email,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      },
      {
        status: 400,
      },
    );
  }
}
