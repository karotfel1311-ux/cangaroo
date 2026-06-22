"use server";

import { headers } from "next/headers";
import { getActiveDownloader } from "../../features/downloader/utils/getActiveDownloader";
import { detectDevice } from "../detectDevice";
import { Device } from "../../types";

export interface AppStatus {
  downloader_ok: boolean;
  device: Device;
}

export async function getAppStatus(): Promise<AppStatus> {
  const [headersList] = await Promise.all([headers(), getActiveDownloader()]);
  const userAgent = headersList.get("user-agent");
  const device = detectDevice(userAgent);

  return {
    downloader_ok: true,
    device,
  };
}
