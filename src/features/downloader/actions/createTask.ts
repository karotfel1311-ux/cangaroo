"use server";

import { getDownloader } from "../utils/jdownloader";

export async function createTask(
  links: Array<string>,
  id: string,
  password?: string,
) {
  const jd = await getDownloader();

  await jd?.createTask(links, { id, password });
}
