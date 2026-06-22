import z from "zod";

export const configSchema = z.object({
  server_address: z.string().optional(),
  console_address: z.string().optional(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
