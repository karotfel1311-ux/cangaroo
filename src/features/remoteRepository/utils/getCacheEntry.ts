import { CACHE_DIR } from "../const";
import fs from "fs";
import path from "path";

function search<T>(pattern: string): T | null {
  try {
    const entries = fs.readdirSync(CACHE_DIR, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(CACHE_DIR, entry.name);

      if (entry.isDirectory()) {
        const result = search(fullPath);
        if (typeof result === "string") {
          return result as T;
        }
      } else if (entry.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");

          if (content.includes(pattern)) {
            console.log(`✅ Znaleziono plik: ${fullPath}`);

            try {
              return JSON.parse(content);
            } catch {
              return null;
            }
          }
        } catch {
          continue;
        }
      }
    }
  } catch {
    // Ignorujemy błędy dostępu do katalogu
  }
  return null;
}

export function getCacheEntry<T>(entry: string): T | null {
  return search<T>(entry);
}
