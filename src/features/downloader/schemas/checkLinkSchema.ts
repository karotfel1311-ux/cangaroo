import z from "zod";

export const checkLinkSchema = z.object({
  id: z.string(),
  links: z.array(z.object({ address: z.string(), provider: z.string() })),
});
