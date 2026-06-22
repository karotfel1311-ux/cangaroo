export interface FileEntry {
  id: number;
  offset: number;
  size: number;
}

export interface PkgInfo {
  contentId: string | null;
  files: Map<number, FileEntry>;
}

export interface SfoInfo {
  title: string | null;
  category: string | null;
  titleId: string | null;
}

export interface PkgMappedItem {
  title: string | null;
  contentId: string | null;
  imagePath: string | null;
  fileSizeBytes: number | null;
  fileSizeStr: string | null;
  installUrl: string | null;
  filePath: string | null;
  isDlc?: boolean;
  packages?: Array<PkgMappedItem>;
}
