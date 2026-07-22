import crypto from "crypto";

const TOKEN_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

function getSecretKey(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "clienthub-ai-verification-secret-fallback-key-2026"
  );
}

export function generateOneTimeAuthToken(userId: string, email: string): string {
  const expiresAt = Date.now() + TOKEN_EXPIRATION_MS;
  const payload = `${userId}:${email.toLowerCase()}:${expiresAt}`;
  
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");

  const tokenBuffer = Buffer.from(payload).toString("base64url");
  return `${tokenBuffer}.${signature}`;
}

export function verifyOneTimeAuthToken(
  userId: string,
  email: string,
  token: string
): boolean {
  try {
    if (!token || !token.includes(".")) return false;

    const [tokenBuffer, signature] = token.split(".");
    if (!tokenBuffer || !signature) return false;

    const payload = Buffer.from(tokenBuffer, "base64url").toString("utf-8");
    const [payloadUserId, payloadEmail, expiresAtStr] = payload.split(":");

    if (!payloadUserId || !payloadEmail || !expiresAtStr) return false;

    if (
      payloadUserId !== userId ||
      payloadEmail.toLowerCase() !== email.toLowerCase()
    ) {
      return false;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", getSecretKey())
      .update(payload)
      .digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expectedSigBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedSigBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedSigBuffer);
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}
