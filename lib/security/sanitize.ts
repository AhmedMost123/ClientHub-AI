export function sanitizeText(value: string | null | undefined) {
  if (!value) return "";

  return value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
