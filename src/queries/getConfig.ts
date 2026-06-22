import { getBaseConfigContent } from "../utils/config";

export type AppConfig = {
  server_address: string;
  console_address: string;
};

export async function getConfig(): Promise<AppConfig> {
  const config = getBaseConfigContent();

  return {
    server_address: config.server_address || "",
    console_address: config.console_address || "",
  };
}
