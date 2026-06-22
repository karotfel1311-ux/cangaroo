"use server";

import { headers } from "next/headers";
import { getActiveDownloader } from "../../features/downloader/utils/getActiveDownloader";
import { detectDevice } from "../detectDevice";
import { Device } from "../../types";
import { declareServerAction } from "../declareServerAction";

export interface AppStatus {
  device: Device;
}

export const getAppStatus = declareServerAction(async () => {
  const [headersList] = await Promise.all([headers(), getActiveDownloader()]);
  const userAgent = headersList.get("user-agent");
  const device = detectDevice(userAgent);

  return {
    device,
  };
});
