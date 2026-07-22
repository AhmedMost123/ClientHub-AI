import crypto from "crypto";

export function hashVerificationCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}
