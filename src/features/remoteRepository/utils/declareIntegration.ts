import fs from "fs/promises";
import path from "path";
import { Strategy } from "../types/strategy";
import { CACHE_DIR, CACHE_TTL } from "../const";

async function getCache<T>(
  integration: string,
  method: string,
  args: unknown[],
  fetcher: () => Promise<T>,
): Promise<T> {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const key = args.map((x) => encodeURIComponent(String(x))).join("__");

  const filePath = path.join(CACHE_DIR, `${integration}_${method}_${key}.json`);

  try {
    const cached = await fs.readFile(filePath, "utf8");
    const stat = await fs.stat(filePath);

    const age = Date.now() - stat.mtimeMs;

    if (age > CACHE_TTL) {
      await fs.unlink(filePath);
      throw new Error("remove outaded cache file");
    }

    return JSON.parse(cached);
  } catch {
    // cache miss
  }

  const result = await fetcher();

  await fs.writeFile(filePath, JSON.stringify(result, null, 2), "utf8");

  return result;
}

export function declareIntegration(
  strategyName: string,
  input: Strategy,
): Strategy {
  return {
    fetchList: async (...args) =>
      getCache(strategyName, "fetchList", args, () => input.fetchList(...args)),

    fetchItem: async (...args) =>
      getCache(strategyName, "fetchItem", args, () => input.fetchItem(...args)),
  };
}
