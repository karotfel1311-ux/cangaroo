"use server";

import { headers } from "next/headers";
import { getDownloader } from "../../features/downloader/utils/jdownloader";
import { detectDevice } from "../detectDevice";
import { Device } from "../../types";

export interface AppStatus {
  downloader_ok: boolean;
  device: Device;
}

export async function getAppStatus(): Promise<AppStatus> {
  const [headersList, downloader] = await Promise.all([
    headers(),
    getDownloader(),
  ]);
  const userAgent = headersList.get("user-agent");
  const device = detectDevice(userAgent);
  const isConnected = await downloader?.checkConnectivity();

  return {
    downloader_ok: Boolean(isConnected),
    device,
  };
}
