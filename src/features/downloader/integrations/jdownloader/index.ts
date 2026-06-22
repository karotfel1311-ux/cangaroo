import { Downloader, CreateTaskOptions } from "../../utils/declareDownloader";
import { loadEnv } from "../../../../utils/env";
import {
  createSecret,
  sign,
  encrypt,
  decrypt,
  updateEncryptionToken,
} from "./utils/crypto";
import { TaskStatus } from "../../types";

const INACTIVITY_TIMEOUT_MS = 60 * 1000;

function bytesToGb(bytes: number): number {
  if (!bytes || bytes <= 0) return 0;
  return Math.round((bytes / 1024 ** 3) * 100) / 100;
}

function mapLinkStatus(link: any): TaskStatus {
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

/**
 * JDownloader implementation of Downloader interface
 */
export class JDownloader extends Downloader {
  private appKey = "my_jd_nodeJS_webinterface";
  private apiUrl = "https://api.jdownloader.org";
  private connectionType: "my" | "api" = "my";

  private loginSecret: Buffer | null = null;
  private deviceSecret: Buffer | null = null;
  private serverEncryptionToken: Buffer | null = null;
  private deviceEncryptionToken: Buffer | null = null;
  private sessionToken: string | null = null;
  private configuredDeviceId: string | null = null;
  private deviceId: string | null = null;
  private ridCounter = 0;
  private lastActivity = 0;
  private initializing: Promise<void> | null = null;
  private initPromise: Promise<void> | null = null;

  private email?: string;
  private password?: string;

  constructor() {
    super();
  }

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const { MY_JD_EMAIL, MY_JD_PASSWORD, MY_JD_DEVICE_ID } = loadEnv();

      this.email = MY_JD_EMAIL?.toLowerCase();
      this.password = MY_JD_PASSWORD;
      this.configuredDeviceId = MY_JD_DEVICE_ID ?? null;
      this.deviceId = MY_JD_DEVICE_ID ?? null;

      if (!this.email || !this.password) {
        this.connectionType = "api";
        return;
      }

      if (!this.configuredDeviceId) {
        throw new Error("Missing deviceId. Configure MY_JD_DEVICE_ID in env.");
      }
      this.connectionType = "my";
    })().catch((err) => {
      this.initPromise = null;
      throw err;
    });

    await this.initPromise;
  }

  // ================== Connection Management ==================

  async connect(): Promise<void> {
    await this.init();

    if (this.initializing) return this.initializing;

    this.initializing = (async () => {
      try {
        if (this.connectionType === "api") {
          const response = await fetch(this.apiUrl + "/jdcheckjson");
          const data = await response.json();
          this.deviceId = data.deviceId;
          console.log(
            `[JDownloader] Connected to API with device ${this.deviceId}`,
          );
        } else {
          this.loginSecret = createSecret(
            this.email!,
            this.password!,
            "server",
          );
          this.deviceSecret = createSecret(
            this.email!,
            this.password!,
            "device",
          );

          const query = `/my/connect?email=${encodeURIComponent(this.email!)}&appkey=${this.appKey}`;
          const response = await this.callServer(query, this.loginSecret);

          this.sessionToken = response.sessiontoken;
          this.deviceId = this.configuredDeviceId ?? response.deviceid ?? null;

          if (!this.deviceId) {
            throw new Error(
              "Missing deviceId. Configure MY_JD_DEVICE_ID in env.",
            );
          }

          this.serverEncryptionToken = updateEncryptionToken(
            this.loginSecret,
            this.sessionToken!,
          );
          this.deviceEncryptionToken = updateEncryptionToken(
            this.deviceSecret,
            this.sessionToken!,
          );

          console.log(
            `[JDownloader] Connected to MyJD with device ${this.deviceId}`,
          );
        }
        this.lastActivity = Date.now();
      } catch (err) {
        this.initializing = null;
        throw err;
      }
    })();

    await this.initializing;
  }

  async disconnect(): Promise<void> {
    if (this.connectionType === "api") {
      this.deviceId = this.configuredDeviceId;
      return;
    }

    if (!this.sessionToken || !this.serverEncryptionToken) {
      return;
    }

    try {
      const query = `/my/disconnect?sessiontoken=${encodeURIComponent(this.sessionToken)}`;
      await this.callServer(query, this.serverEncryptionToken);
    } catch (err) {
      console.error("[JDownloader] Disconnect error:", err);
    } finally {
      this.sessionToken = null;
      this.deviceId = this.configuredDeviceId;
      this.serverEncryptionToken = null;
      this.deviceEncryptionToken = null;
      this.initializing = null;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.ensureValidSession();
      return !!this.deviceId;
    } catch {
      return false;
    }
  }

  // ================== Session Management ==================

  private async ensureValidSession(): Promise<void> {
    if (!this.deviceId) {
      await this.connect();
      return;
    }

    // Reconnect po timeoutcie
    if (Date.now() - this.lastActivity > INACTIVITY_TIMEOUT_MS) {
      console.log(
        "[JDownloader] Session expired due to inactivity → reconnecting",
      );
      try {
        await this.disconnect();
      } catch {}
      await this.connect();
    }

    this.lastActivity = Date.now();
  }

  // ================== API Calls ==================

  private uniqueRid(): number {
    this.ridCounter = Date.now();
    return this.ridCounter;
  }

  private async callServer(
    query: string,
    key: Buffer,
    params: any = null,
  ): Promise<any> {
    let rid = this.uniqueRid();

    if (params) {
      params = encrypt(JSON.stringify(params), key);
      rid = this.ridCounter;
    }

    if (query.includes("?")) {
      query += "&";
    } else {
      query += "?";
    }

    query = `${query}rid=${rid}`;
    const signature = sign(key, query);
    query += `&signature=${signature}`;

    const url = this.apiUrl + query;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/aesjson-jd; charset=utf-8",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    const decrypted = decrypt(data, key);
    return JSON.parse(decrypted.replace(/[^\x20-\x7E]/g, ""));
  }

  private async callAction(action: string, params: any = null): Promise<any> {
    if (this.connectionType === "api") {
      const response = await fetch(this.apiUrl + action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(params),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText);
      }
      return JSON.parse(responseText);
    }

    if (!this.sessionToken || !this.deviceEncryptionToken) {
      throw new Error("Not connected");
    }

    const query = `/t_${encodeURIComponent(this.sessionToken)}_${encodeURIComponent(this.deviceId!)}${action}`;

    const json = {
      url: action,
      params,
      rid: this.uniqueRid(),
      apiVer: 1,
    };

    const body = encrypt(JSON.stringify(json), this.deviceEncryptionToken);

    const response = await fetch(this.apiUrl + query, {
      method: "POST",
      headers: {
        "Content-Type": "application/aesjson-jd; charset=utf-8",
      },
      body,
    });

    const responseText = await response.text();

    if (!response.ok) {
      // MyJD can return either plain JSON error or encrypted error payload.
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson?.src && errorJson?.type) {
          throw new Error(`MyJD Error: ${errorJson.src} - ${errorJson.type}`);
        }
      } catch {}

      if (this.deviceEncryptionToken) {
        try {
          const decryptedError = decrypt(
            responseText,
            this.deviceEncryptionToken,
          );
          const maybeJson = JSON.parse(decryptedError);
          if (maybeJson?.src && maybeJson?.type) {
            throw new Error(`MyJD Error: ${maybeJson.src} - ${maybeJson.type}`);
          }
          throw new Error(decryptedError);
        } catch (decryptErr) {
          if (decryptErr instanceof Error) {
            throw decryptErr;
          }
        }
      }

      throw new Error(responseText);
    }

    const decrypted = decrypt(responseText, this.deviceEncryptionToken);
    return JSON.parse(decrypted.replace(/[^\x20-\x7E]/g, ""));
  }

  // ================== Downloader API ==================

  async fetchTasks(): Promise<any> {
    await this.ensureValidSession();

    const loadTasks = async () => {
      const [packages, links] = await Promise.all([
        this.callAction("/downloadsV2/queryPackages", [
          JSON.stringify({
            bytesLoaded: true,
            bytesTotal: true,
            name: true,
            status: true,
            running: true,
            finished: true,
            packageUUIDs: [],
          }),
        ]),
        this.callAction("/downloadsV2/queryLinks", [
          JSON.stringify({
            bytesLoaded: true,
            bytesTotal: true,
            name: true,
            status: true,
            running: true,
            finished: true,
            url: true,
            packageUUID: true,
          }),
        ]),
      ]);

      return { packages, links };
    };

    let packages: any;
    let links: any;

    try {
      ({ packages, links } = await loadTasks());
    } catch (err) {
      console.warn(
        "[JDownloader] fetchTasks failed, retrying after reconnect",
        err,
      );
      try {
        await this.disconnect();
        await this.connect();
        ({ packages, links } = await loadTasks());
      } catch (retryErr) {
        console.error("[JDownloader] fetchTasks retry failed", retryErr);
        return [];
      }
    }

    const linksByPackage = new Map<string, any[]>();
    for (const link of links?.data ?? []) {
      const bucket = linksByPackage.get(link.packageUUID) ?? [];
      bucket.push(link);
      linksByPackage.set(link.packageUUID, bucket);
    }

    const now = new Date().toISOString();

    return (packages?.data ?? []).map((pkg: any) => ({
      task_id: String(pkg.uuid),
      title: pkg.name ?? "Unknown Package",
      passwords: [],
      items: (linksByPackage.get(pkg.uuid) ?? []).map((link: any) => ({
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
      })),
      created_at: now,
      updated_at: now,
    }));
  }

  async createTask(links: string[], options: CreateTaskOptions): Promise<any> {
    await this.ensureValidSession();

    return this.callAction("/linkgrabberv2/addLinks", [
      JSON.stringify({
        links: links.join(","),
        autostart: true,
        packageName: options.id,
        extractPassword: options.password,
      }),
    ]);
  }
}
