"use server";

import { getActiveDownloader } from "../utils/getActiveDownloader";

export async function createTask(
  links: Array<string>,
  id: string,
  password?: string,
) {
  const jd = await getActiveDownloader();

  await jd?.createTask(links, { id, password });
}
