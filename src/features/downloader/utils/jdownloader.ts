import { loadEnv } from "../../../utils/env";
import { JDownloader } from "../integrations/jdownloader/JDownloader";
import { TaskStatus } from "../types";

function bytesToGb(bytes: number): number {
  if (!bytes || bytes <= 0) return 0;
  return Math.round((bytes / 1024 ** 3) * 100) / 100;
}

function mapLinkStatus(link: {
  running: boolean;
  finished: boolean;
  status?: string;
}): TaskStatus {
  if (link.status?.includes("Extraction error"))
    return TaskStatus.EXTRACT_ERROR;
  if (link.running) return TaskStatus.DOWNLOADING;
  if (link.finished) return TaskStatus.COMPLETED;

  const s = (link.status ?? "").toLowerCase();
  if (s.includes("error") || s.includes("failed") || s.includes("offline"))
    return TaskStatus.ERROR;
  if (s.includes("pause")) return TaskStatus.PAUSED;
  if (s.includes("file not found")) return TaskStatus.FILE_NOT_FOUND;
  return TaskStatus.UNKNOWN;
}

export class MyJDownloader {
  private instance: JDownloader | null = null;

  constructor(
    private readonly login: string,
    private readonly password: string,
    private readonly deviceId: string,
  ) {}

  async init(): Promise<this> {
    this.instance = new JDownloader(this.login, this.password);
    await this.instance.connect();
    return this;
  }

  private get client() {
    if (!this.instance) {
      throw new Error("MyJDownloader is not initialized");
    }

    return this.instance;
  }

  async listDevices() {
    return this.client.listDevices();
  }

  async isConnected(): Promise<boolean> {
    const { list } = await this.listDevices();
    return list.length > 0;
  }

  async fetchTasks() {
    const [packages, links] = await Promise.all([
      this.client.downloadsV2.queryPackages(this.deviceId, [], {
        bytesLoaded: true,
        bytesTotal: true,
        name: true,
        status: true,
        running: true,
        finished: true,
      }),
      this.client.downloadsV2.queryLinks(this.deviceId, {
        bytesLoaded: true,
        bytesTotal: true,
        name: true,
        status: true,
        running: true,
        finished: true,
        url: true,
        packageUUID: true,
      }),
    ]);
    const linksByPackage = new Map();
    for (const link of links?.data) {
      const bucket = linksByPackage.get(link.packageUUID) ?? [];
      bucket.push(link);
      linksByPackage.set(link.packageUUID, bucket);
    }

    const now = new Date().toISOString();

    return packages?.data.map((pkg) => {
      const pkgLinks = linksByPackage.get(pkg.uuid) ?? [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = pkgLinks.map((link: any) => ({
        id: String(link.uuid),
        title: link.name ?? link.url ?? "Unknown",
        downloaded_gb: bytesToGb(link.bytesLoaded),
        total_gb: bytesToGb(link.bytesTotal),
        status: mapLinkStatus(link),
        icon: null,
        source: "url" as const,
        file_name: link.name ?? null,
        url: link.url ?? null,
        created_at: now,
        updated_at: now,
      }));

      return {
        task_id: String(pkg.uuid),
        title: pkg.name ?? "Unknown Package",
        passwords: [],
        items,
        created_at: now,
        updated_at: now,
      };
    });
  }

  async getTasks() {
    try {
      return await this.fetchTasks();
    } catch (error) {
      console.error("MyJDownloader.getTasks failed", error);
      return [];
    }
  }

  async checkConnectivity() {
    try {
      return await this.isConnected();
    } catch (error) {
      console.error("MyJDownloader.checkConnectivity failed", error);
      return false;
    }
  }

  async createTask(
    links: Array<string>,
    options: { password?: string; id: string },
  ) {
    return await this.client.linkgrabberV2.addLinks(this.deviceId, links, {
      autostart: true,
      packageName: options.id,
      extractPassword: options.password,
    });
  }
}

let downloaderPromise: Promise<MyJDownloader> | null = null;

export function getDownloader(): Promise<MyJDownloader> | null {
  const { MY_JD_EMAIL, MY_JD_DEVICE_ID, MY_JD_PASSWORD } = loadEnv();
  if (!MY_JD_EMAIL || !MY_JD_PASSWORD || !MY_JD_DEVICE_ID) return null;

  if (!downloaderPromise) {
    downloaderPromise = new MyJDownloader(
      MY_JD_EMAIL,
      MY_JD_PASSWORD,
      MY_JD_DEVICE_ID,
    )
      .init()
      .catch((error) => {
        downloaderPromise = null;
        throw error;
      });
  }

  return downloaderPromise;
}
