"use server";

import { declareServerAction } from "../../../utils/declareServerAction";
import { getActiveDownloader } from "../utils/getActiveDownloader";

export const createTask = declareServerAction(
  async (input: { links: Array<string>; id: string; password?: string }) => {
    const jd = await getActiveDownloader();

    await jd?.createTask(input.links, {
      id: input.id,
      password: input.password,
    });
  },
);
