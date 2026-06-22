"use server";

import { revalidateLocalFiles } from "..";
import { refresh } from "next/cache";

export const revalidateStorage = async () => {
  revalidateLocalFiles();

  // performFullScan();
  refresh();
};
