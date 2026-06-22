import fs from "fs";
import { CONFIG_FILE } from "../consts";

export function getRawConfigContent(): Record<string, string> {
  try {
    const entireConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));

    return entireConfig;
  } catch {
    return {};
  }
}
