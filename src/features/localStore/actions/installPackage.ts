"use server";

import { getActiveInstalator } from "../utils/instalator";

export async function installPackage(links: Array<string>) {
  try {
    const method = await getActiveInstalator();
    if (!method) return false;

    for (const element of links) {
      await method?.handler(element);
    }
    return true;
  } catch (er) {
    console.error("Cant install package", er);
  }
}

// nfs://192.168.0.200/mnt/ssd/jdownloader/data/[CG][cities-skylines-ps4-download-free][0][Game ]/Cities.Skylines_CUSA06548_v1.00_[4.00]_OPOISSO893.pkg
