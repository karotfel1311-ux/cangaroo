import { z } from "zod";

const envSchema = z.object({
  SHOP_TITLE: z.string().trim().min(1).default("PS5 PKG Virtual Shop"),
  MY_JD_EMAIL: z.string().optional(),
  MY_JD_PASSWORD: z.string().optional(),
  MY_JD_DEVICE_ID: z.string().optional(),
  SERVICE_ADDRESS: z.string(),
});

type ParsedEnv = z.infer<typeof envSchema>;

let parsedEnvCache: ParsedEnv | null = null;

export function loadEnv(): ParsedEnv {
  if (parsedEnvCache) return parsedEnvCache;
  parsedEnvCache = envSchema.parse(process.env);
  return parsedEnvCache;
}
