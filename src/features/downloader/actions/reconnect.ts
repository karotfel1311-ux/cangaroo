"use server";

import { refresh } from "next/cache";
import { getActiveDownloader } from "../utils/getActiveDownloader";

export async function reconnectDownloader() {
  const jd = await getActiveDownloader();
  await jd?.connect();
  refresh();
  return true;
}
