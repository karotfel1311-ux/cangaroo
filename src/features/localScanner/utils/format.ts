import crypto from "crypto";
import path from "path";

export function sanitizeFilename(name: string | null): string | null {
  if (!name) return null;
  let s = name.replace(/\x00/g, "").trim();
  s = s.replace(/[\\/*?:"<>|]/g, "_");
  return s || null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0B";
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export function md5Hash(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex");
}

export function toUiFilePath(absolutePath: string): string {
  const relative = path.relative(process.cwd(), absolutePath);
  const normalized = relative.split(path.sep).join("/");
  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}
