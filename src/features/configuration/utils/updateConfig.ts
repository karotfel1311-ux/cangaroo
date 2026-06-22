import { CONFIG_FILE } from "../consts";
import { getRawConfigContent } from "./getRawConfigContent";
import fs from "fs";

export async function updateConfig(input: Record<string, string>) {
  const actualConfig = getRawConfigContent();
  const updatedConfig = { ...actualConfig, ...input };
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(updatedConfig, null, 2),
    "utf-8",
  );
}
