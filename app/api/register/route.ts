import { NextResponse } from "next/server";

import { RegisterSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/auth.service";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIdentifier } from "@/lib/security/request-ip";

export async function POST(req: Request) {
  const identifier = await getRequestIdentifier();

  console.log(`[REGISTER_API] Received registration request from IP/Identifier: ${identifier}`);

  const allowed = rateLimit(`register:${identifier}`, 5, 60_000);

  if (!allowed.success) {
    console.warn(`[REGISTER_API] Rate limit exceeded for identifier: ${identifier}`);
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
      console.warn(`[REGISTER_API] Validation failed:`, parsed.error.flatten());
      return NextResponse.json(parsed.error.flatten(), {
        status: 400,
      });
    }

    const { confirmPassword, ...userData } = parsed.data;
    console.log(`[REGISTER_API] Validated registration data for email: ${userData.email}, role: ${userData.role}`);

    const user = await registerUser(userData);

    console.log(`[REGISTER_API] Registration succeeded for ${user.email}. Returning 201 response.`);

    return NextResponse.json(
      {
        success: true,
        email: user.email,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[REGISTER_API ERROR] Registration failed:", error);

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
