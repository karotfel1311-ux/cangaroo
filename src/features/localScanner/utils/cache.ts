import { DB_FILE } from "./const";
import fs from "fs";
import { PkgMappedItem } from "./types";

export function loadCache(): PkgMappedItem[] {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveCache(cache: PkgMappedItem[]): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
}
