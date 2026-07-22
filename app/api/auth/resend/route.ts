import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createVerification } from "@/lib/services/verification.service";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIdentifier } from "@/lib/security/request-ip";

const ResendSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const identifier = await getRequestIdentifier();

  const allowed = rateLimit(`resend:${identifier}`, 3, 60_000);

  if (!allowed.success) {
    return NextResponse.json(
      {
        message: "Too many requests. Please wait a minute before trying again.",
      },
      {
        status: 429,
      },
    );
  }

  try {
    const body = await req.json();
    const parsed = ResendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please provide a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        verification: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Email already verified.",
        },
        {
          status: 400,
        },
      );
    }

    if (user.verification) {
      const secondsSinceLast =
        (Date.now() - user.verification.createdAt.getTime()) / 1000;
      if (secondsSinceLast < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLast);
        return NextResponse.json(
          {
            message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
          },
          {
            status: 429,
          },
        );
      }
    }

    await createVerification({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent.",
    });
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to resend code. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}
