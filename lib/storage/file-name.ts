import crypto from "crypto";

export function generateUniqueFileName(name: string) {
  const extension = name.split(".").pop();

  return `${crypto.randomUUID()}.${extension}`;
}
