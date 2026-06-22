export enum TaskStatus {
  QUEUED = "queued",
  DOWNLOADING = "downloading",
  COMPLETED = "completed",
  ERROR = "error",
  PAUSED = "paused",
  EXTRACT_ERROR = "extractError",
  FILE_NOT_FOUND = "fileNotFound",
  UNKNOWN = "unknown",
}

interface TaskDownloadItemResponse {
  id: string;
  title: string;
  downloaded_gb: number;
  total_gb: number;
  status: TaskStatus;
  icon: string | null;
  source: "file" | "url";
  file_name: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskRecordResponse {
  task_id: string;
  title: string;
  password: string;
  items: TaskDownloadItemResponse[];
  created_at: string;
  updated_at: string;
}
