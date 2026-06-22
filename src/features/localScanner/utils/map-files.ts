import { PkgMappedItem } from "./types";
import fs from "fs";
import path from "path";
import { parsePkgHeader, parseSfo, readPkgFile } from "./parser";
import {
  formatFileSize,
  md5Hash,
  sanitizeFilename,
  toUiFilePath,
} from "./format";
import { saveCache } from "./cache";
import { parseGroupDirName } from "../../../utils/parseGroupName";

const ICON0_ID = 0x1200;
const PARAM_SFO_ID = 0x1000;

export function mapAllPkgFiles(): void {
  const rootDir = path.join(process.cwd(), "files");
  if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
    console.log("Katalog 'files' nie istnieje.");
    return;
  }

  const groups = new Map<string, PkgMappedItem>(); // key = fullGroupKey (slug-index)
  const standalonePkgs: PkgMappedItem[] = [];

  // Mapa: fullGroupKey → lista wszystkich ścieżek .pkg należących do tej grupy
  const groupPkgMap = new Map<string, string[]>();

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const parsed = parseGroupDirName(entry.name);

        if (parsed.success && parsed.fullGroupKey) {
          // Znaleziono katalog grupy → zbieramy z niego wszystkie .pkg
          collectPkgsFromDir(fullPath, parsed.fullGroupKey);
        } else {
          walk(fullPath); // zwykły katalog — idziemy dalej
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pkg")) {
        processSinglePkg(fullPath, standalonePkgs);
      }
    }
  }

  function collectPkgsFromDir(dirPath: string, groupKey: string) {
    const existing = groupPkgMap.get(groupKey) || [];

    function collect(subDir: string) {
      const entries = fs.readdirSync(subDir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(subDir, e.name);
        if (e.isDirectory()) {
          collect(p);
        } else if (e.isFile() && e.name.toLowerCase().endsWith(".pkg")) {
          existing.push(p);
        }
      }
    }

    collect(dirPath);
    groupPkgMap.set(groupKey, existing);
  }

  function processSinglePkg(
    pkgPath: string,
    targetArray?: PkgMappedItem[],
  ): PkgMappedItem | null {
    try {
      const stat = fs.statSync(pkgPath);
      const pkgInfo = parsePkgHeader(pkgPath);

      const contentId = pkgInfo?.contentId ?? null;

      let title: string | null = null;
      let titleId: string | null = null;

      if (pkgInfo) {
        const sfoEntry = pkgInfo.files.get(PARAM_SFO_ID);
        if (sfoEntry) {
          const sfoData = readPkgFile(pkgPath, sfoEntry);
          if (sfoData) {
            const sfo = parseSfo(sfoData);
            title = sfo.title;
            titleId = sfo.titleId;
          }
        }
      }

      // Ikona
      let imagePath: string | null = null;
      const imageBaseName =
        sanitizeFilename(contentId) ?? md5Hash(path.resolve(pkgPath));

      if (pkgInfo) {
        const iconEntry = pkgInfo.files.get(ICON0_ID);
        if (iconEntry) {
          const iconData = readPkgFile(pkgPath, iconEntry);
          if (iconData) {
            const cacheDir = path.join(process.cwd(), "cached");
            fs.mkdirSync(cacheDir, { recursive: true });

            const imgFilename = `${imageBaseName}.png`;
            fs.writeFileSync(path.join(cacheDir, imgFilename), iconData);
            imagePath = `/api/cached/${imgFilename}`;
          }
        }
      }

      const fileSizeBytes = stat.size;
      const idForUrl = contentId ?? md5Hash(path.resolve(pkgPath));
      const filePath = toUiFilePath(pkgPath);
      const item: PkgMappedItem = {
        title: title || path.basename(pkgPath),
        contentId,
        imagePath,
        fileSizeBytes,
        fileSizeStr: formatFileSize(fileSizeBytes),
        installUrl: `/api/serve_pkg/${encodeURIComponent(idForUrl)}`,
        filePath,
        isDlc: filePath.includes("DLC"),
        packages: [],
      };

      if (targetArray) targetArray.push(item);
      return item;
    } catch (err) {
      console.error(`Błąd przetwarzania ${pkgPath}:`, err);
      return null;
    }
  }

  // Przetwarzanie wszystkich grup
  function processAllGroups() {
    for (const [groupKey, pkgPaths] of groupPkgMap.entries()) {
      if (pkgPaths.length === 0) continue;

      const groupItems = pkgPaths
        .map((pkgPath) => processSinglePkg(pkgPath))
        .filter((item): item is PkgMappedItem => item !== null);

      if (groupItems.length === 0) continue;

      const mainPkg = groupItems[0];

      // Wyciągamy index z groupKey (ostatnia część po ostatnim myślniku)
      const indexMatch = groupKey.match(/-(\d+)$/);
      const index = indexMatch ? indexMatch[1] : "0";

      const groupTitle = `[#${index}] ${mainPkg.title}`;

      const groupItem: PkgMappedItem = {
        title: groupTitle,
        contentId: mainPkg.contentId,
        imagePath: mainPkg.imagePath,
        fileSizeBytes: null,
        fileSizeStr: null,
        installUrl: null,
        filePath: null,
        packages: groupItems,
      };

      groups.set(groupKey, groupItem);
    }
  }

  // === Uruchomienie ===
  walk(rootDir);
  processAllGroups();

  const result: PkgMappedItem[] = [...groups.values(), ...standalonePkgs];

  result.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));

  console.log(
    `Zmapowano ${result.length} pozycji (${groups.size} grup + ${standalonePkgs.length} standalone)`,
  );

  saveCache(result);
}
