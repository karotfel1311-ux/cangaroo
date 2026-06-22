import z from "zod";
import { Instalator, instalators } from "../integrations";

export const instalatorSchema = z.object({
  instal_method: z.enum(Instalator).optional(),
  ...Object.fromEntries(
    Object.entries(instalators).map(([key, { schema }]) => [
      key,
      schema.optional(),
    ]),
  ),
});

export type InstalatorSchema = z.infer<typeof instalatorSchema>;
