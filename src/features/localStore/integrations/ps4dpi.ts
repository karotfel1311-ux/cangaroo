import z from "zod";
import { declareInstalator } from "../../../utils/declareInstalator";
import axios from "axios";

export const ps4dpi = declareInstalator("PS4DPI", {
  schema: z
    .object({
      port: z.string(),
      type: z.string(),
    })
    .default({ port: "9020", type: "direct" }),
  description: "goldhen DPI (debug settings)",
  meta: {
    port: { type: "number", placeholder: "9020" },
    type: { placeholder: "direct/install/pkg" },
  },
  handler: async (url, config) => {
    const consoleAddress = config?.console_address;
    const consolePort = config?.port;
    const payload = {
      type: "proxy",
      packages: [url],
    };

    const response = await axios.post(
      `http://${consoleAddress}:${consolePort}/api/install`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15_000,
      },
    );

    return response.data;
  },
});
