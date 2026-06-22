import { getActiveDownloader } from "./getActiveDownloader";

export async function getTasks() {
  const jd = await getActiveDownloader();
  const tasks = await jd?.fetchTasks();
  return tasks?.toReversed() || [];
}
