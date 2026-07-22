import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashVerificationCode } from "@/lib/hash-code";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIdentifier } from "@/lib/security/request-ip";
import { generateOneTimeAuthToken } from "@/lib/security/auth-token";

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export async function POST(req: Request) {
  const identifier = await getRequestIdentifier();

  const allowed = rateLimit(`verify:${identifier}`, 5, 60_000);

  if (!allowed.success) {
    return NextResponse.json(
      {
        message: "Too many verification attempts. Please try again later.",
      },
      {
        status: 429,
      },
    );
  }

  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input. Please provide a valid email and 6-digit code.",
        },
        {
          status: 400,
        },
      );
    }

    const { email, code } = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        verification: true,
      },
    });

    if (!user || !user.verification) {
      return NextResponse.json(
        {
          message: "Invalid verification request or code already used.",
        },
        {
          status: 400,
        },
      );
    }

    if (user.verification.expiresAt < new Date()) {
      return NextResponse.json(
        {
          message: "Verification code expired. Please request a new one.",
        },
        {
          status: 400,
        },
      );
    }

    const hashed = hashVerificationCode(code);

    if (hashed !== user.verification.code) {
      return NextResponse.json(
        {
          message: "Invalid verification code.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.verificationCode.delete({
      where: {
        userId: user.id,
      },
    });

    const verificationToken = generateOneTimeAuthToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      verificationToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      {
        message: "Verification failed. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
