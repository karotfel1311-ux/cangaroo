"use server";

import { configSchema } from "../schemas/configSchema";
import { updateConfig } from "../utils/updateConfig";
import { instalatorSchema } from "../../localStore/schemas/instalatorSchema";

export const handleUpdateConfig = async (input: Record<string, string>) => {
  const configData = (await configSchema.parseAsync(input)) || {};
  const instalatorData = (await instalatorSchema.parseAsync(input)) || {};

  await updateConfig({ ...configData, ...instalatorData });
};
