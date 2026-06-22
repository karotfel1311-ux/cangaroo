import z from "zod";
import { declareInstalator } from "../../../utils/declareInstalator";
import axios from "axios";

export const ps4rpi = declareInstalator("PS4RPI", {
  schema: z
    .object({
      port: z.string(),
    })
    .default({ port: "9999" }),
  description: "Remote Package Installer app",
  meta: {},
  handler: async (url, config) => {
    const formData = new FormData();
    formData.append("url", url);
    await axios.post(
      `http://${config?.console_address}:${config?.port}/api/install`,
      { type: "direct", packages: [url] },
    );
  },
});
