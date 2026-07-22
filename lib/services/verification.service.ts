import { prisma } from "@/lib/prisma";

import { generateOTP } from "@/lib/generate-otp";
import { hashVerificationCode } from "@/lib/hash-code";
import { sendVerificationEmail } from "@/lib/email";

const OTP_EXPIRATION_MINUTES = 10;

export async function createVerification(user: {
  id: string;
  email: string;
  name: string;
}) {
  const code = generateOTP();

  const hashed = hashVerificationCode(code);

  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.verificationCode.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      code: hashed,
      expiresAt,
    },
  });

  await sendVerificationEmail(user.email, user.name, code);
}
