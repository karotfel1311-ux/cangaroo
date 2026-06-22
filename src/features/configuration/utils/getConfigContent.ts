import { configSchema } from "../schemas/configSchema";
import { getRawConfigContent } from "./getRawConfigContent";

export function getBaseConfigContent() {
  const content = getRawConfigContent();

  const cfg = configSchema.parse(content);

  return cfg;
}
