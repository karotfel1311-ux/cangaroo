import path from "path";
import fs from "fs";
import { baseConfigSchema } from "../../features/configuration/schemas/baseConfigSchema";

export const CONFIG_FILE = path.join(process.cwd(), "./cached/config.json");

export function getRawConfigContent(): Record<string, string> {
  try {
    const entireConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));

    return entireConfig;
  } catch {
    return {};
  }
}

export function getBaseConfigContent() {
  const content = getRawConfigContent();

  const cfg = baseConfigSchema.parse(content);

  return cfg;
}

export async function updateConfig(input: Record<string, string>) {
  const actualConfig = getRawConfigContent();
  const updatedConfig = { ...actualConfig, ...input };
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(updatedConfig, null, 2),
    "utf-8",
  );
}
