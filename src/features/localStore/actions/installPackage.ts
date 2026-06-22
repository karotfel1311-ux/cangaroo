"use server";

import { declareServerAction } from "../../../utils/declareServerAction";
import { getActiveInstalator } from "../utils/instalator";

export const installPackage = declareServerAction(
  async (links: Array<string>) => {
    const method = await getActiveInstalator();
    if (!method) throw new Error("Missing method");
    for (const element of links) {
      await method?.handler(element);
    }
    return true;
  },
);
