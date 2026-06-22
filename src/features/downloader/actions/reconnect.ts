"use server";

import { refresh } from "next/cache";
import { getDownloader } from "../utils/jdownloader";

export async function reconnectDownloader() {
  const jd = await getDownloader();
  await jd?.init();
  refresh();
  return true;
}
