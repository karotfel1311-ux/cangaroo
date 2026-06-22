import { Downloader } from "../utils/declareDownloader";
import { JDownloader } from "./jdownloader";

enum AvailableDownloader {
  JDOWNLOADER = "JDOWNLOADER",
}

export type DownloaderConstructor = new () => Downloader;

export const downloader: Record<AvailableDownloader, DownloaderConstructor> = {
  JDOWNLOADER: JDownloader,
};

export { AvailableDownloader };
