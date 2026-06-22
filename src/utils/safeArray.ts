export function safeArray(input: unknown) {
  if (!input) return null;
  if (Array.isArray(input)) return input;
  return [input];
}
