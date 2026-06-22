import z from "zod";
import { declareInstalator } from "../../../utils/declareInstalator";
import axios from "axios";

export const ps4dpi = declareInstalator("PS4DPI", {
  schema: z
    .object({
      port: z.string(),
      type: z.string(),
    })
    .default({ port: "9020", type: "direct" })
    .meta({
      description: "goldhen DPI (debug settings)",
      port: { type: "number", placeholder: "9020" },
      type: { placeholder: "direct/install/pkg" },
    }),
  handler: async (url, config) => {
    const consoleAddress = config?.console_address;
    const consolePort = config?.port;
    const payload = {
      type: "proxy", // lub "ref_pkg_url" dla manifestów
      packages: [url], // można podać wiele linków
    };
    console.log({
      req: `http://${consoleAddress}:${consolePort}/api/install`,
      payload,
    });

    try {
      const response = await axios.post(
        `http://${consoleAddress}:${consolePort}/api/install`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 sekund
        },
      );

      console.log("✅ Sukces!", response.data);
      return response.data;
    } catch (err: any) {
      console.error("❌ Błąd instalacji:", err.response?.data || err.message);
      throw err;
    }
  },
});
