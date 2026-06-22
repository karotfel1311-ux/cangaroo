"use server";

import { revalidateLocalFiles } from "..";
import { refresh } from "next/cache";
import { declareServerAction } from "../../../utils/declareServerAction";

export const revalidateStorage = declareServerAction(async () => {
  revalidateLocalFiles();
  refresh();
});
