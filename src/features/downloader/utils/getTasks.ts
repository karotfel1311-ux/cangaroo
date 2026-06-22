import { getDownloader } from "./jdownloader";

export async function getTasks() {
  const jd = await getDownloader();
  const tasks = await jd?.getTasks();
  return tasks?.toReversed() || [];
}
