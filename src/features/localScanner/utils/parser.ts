import fs from "fs";
import { FileEntry, PkgInfo, SfoInfo } from "./types";

const MAGIC_PS4 = 0x7f434e54;

function safeDecodeBuffer(buf: Buffer): string {
  return buf.toString("utf8").replace(/\x00/g, "").trim();
}

export function parsePkgHeader(filePath: string): PkgInfo | null {
  let fd: number | null = null;
  try {
    fd = fs.openSync(filePath, "r");

    const HEADER_SIZE = 160;
    const headerBuf = Buffer.alloc(HEADER_SIZE);
    const bytesRead = fs.readSync(fd, headerBuf, 0, HEADER_SIZE, 0);
    if (bytesRead < HEADER_SIZE) return null;

    if (headerBuf.readUInt32BE(0) !== MAGIC_PS4) return null;

    const entryCount = headerBuf.readUInt32BE(16);
    const tableOffset = headerBuf.readUInt32BE(24);
    const contentId = safeDecodeBuffer(headerBuf.subarray(100, 112)) || null;

    if (entryCount === 0 || entryCount > 50000) return null;

    const ENTRY_SIZE = 32;
    const tableBuf = Buffer.alloc(ENTRY_SIZE * entryCount);
    fs.readSync(fd, tableBuf, 0, ENTRY_SIZE * entryCount, tableOffset);

    const files = new Map<number, FileEntry>();
    for (let i = 0; i < entryCount; i++) {
      const base = i * ENTRY_SIZE;
      const fileId = tableBuf.readUInt32BE(base);
      const offset = tableBuf.readUInt32BE(base + 16);
      const size = tableBuf.readUInt32BE(base + 20);
      files.set(fileId, { id: fileId, offset, size });
    }

    return { contentId, files };
  } catch (err) {
    console.error(`parsePkgHeader failed for ${filePath}:`, err);
    return null;
  } finally {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch (closeErr) {
        console.error(
          `Failed to close file descriptor for ${filePath}:`,
          closeErr,
        );
      }
    }
  }
}

export function readPkgFile(filePath: string, entry: FileEntry): Buffer | null {
  let fd: number | null = null;
  try {
    fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(entry.size);
    fs.readSync(fd, buf, 0, entry.size, entry.offset);
    return buf;
  } catch (err) {
    console.error(`readPkgFile failed for ${filePath}:`, err);
    return null;
  } finally {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch {}
    }
  }
}

export function parseSfo(data: Buffer): SfoInfo {
  const result: SfoInfo = { title: null, category: null, titleId: null };
  try {
    if (data.length < 20) return result;
    if (data.readUInt32LE(0) !== 0x46535000) return result;

    const keyTableOffset = data.readUInt32LE(8);
    const dataTableOffset = data.readUInt32LE(12);
    const numEntries = data.readUInt32LE(16);

    for (let i = 0; i < numEntries; i++) {
      const base = 20 + i * 16;
      if (base + 16 > data.length) break;

      const keyOff = data.readUInt16LE(base);
      const dataLen = data.readUInt32LE(base + 4);
      const dataOff = data.readUInt32LE(base + 12);

      const keyStart = keyTableOffset + keyOff;
      const keyEnd = data.indexOf(0, keyStart);
      if (keyEnd < 0) continue;

      const key = data.subarray(keyStart, keyEnd).toString("utf8");

      const dataStart = dataTableOffset + dataOff;
      const value = data
        .subarray(dataStart, dataStart + dataLen)
        .toString("utf8")
        .replace(/\x00/g, "");

      if (key === "TITLE") result.title = value;
      else if (key === "CATEGORY") result.category = value;
      else if (key === "TITLE_ID") result.titleId = value;
    }
  } catch (err) {
    console.error("parseSfo error:", err);
  }
  return result;
}
