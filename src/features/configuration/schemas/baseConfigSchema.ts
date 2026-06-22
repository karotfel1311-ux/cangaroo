import z from "zod";

export const baseConfigSchema = z.object({
  server_address: z.string().optional(),
  console_address: z.string().optional(),
});
