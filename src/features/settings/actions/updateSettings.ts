"use server";

import { updateConfig } from "../../../utils/config";
import { baseConfigSchema } from "../../configuration/schemas/baseConfigSchema";
import { instalatorSchema } from "../../localStore/schemas/instalatorSchema";

export const handleUpdateSettings = async (input: Record<string, string>) => {
  const configData = await baseConfigSchema.parseAsync(input);
  const instalatorData = await instalatorSchema.parseAsync(input);

  await updateConfig({ ...(configData || {}), ...(instalatorData || {}) });
};
