import {
  AvailableDownloader,
  downloader,
  DownloaderConstructor,
} from "../integrations";
import { Downloader } from "./declareDownloader";

let activeDownloaderPromise: Promise<Downloader> | null = null;

function getActiveDownloaderName(): AvailableDownloader {
  return AvailableDownloader.JDOWNLOADER;
}

export function getActiveDownloader(): Promise<Downloader> | null {
  if (!activeDownloaderPromise) {
    activeDownloaderPromise = (async () => {
      const active = getActiveDownloaderName();
      const DownloaderClass: DownloaderConstructor = downloader[active];

      const instance = new DownloaderClass();
      await instance.init();
      return instance;
    })().catch((err) => {
      activeDownloaderPromise = null;
      throw err;
    });
  }

  return activeDownloaderPromise;
}
