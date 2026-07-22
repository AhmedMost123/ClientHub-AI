import { hashVerificationCode } from "./hash-code";

export function verifyCode(inputCode: string, hashedCode: string): boolean {
  return hashVerificationCode(inputCode) === hashedCode;
}
