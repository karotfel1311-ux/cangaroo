import path from "path";

export const CACHE_DIR = path.join(process.cwd(), "cached");
export const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
