"use server";

import { configSchema } from "../schemas/configSchema";
import { updateConfig } from "../utils/updateConfig";
import { instalatorSchema } from "../../localStore/schemas/instalatorSchema";
import { declareServerAction } from "../../../utils/declareServerAction";

export const handleUpdateConfig = declareServerAction(
  async (input: Record<string, string>) => {
    const configData = (await configSchema.parseAsync(input)) || {};
    const instalatorData = (await instalatorSchema.parseAsync(input)) || {};

    await updateConfig({ ...configData, ...instalatorData });
  },
);
