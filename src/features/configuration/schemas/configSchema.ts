import z from "zod";
import { baseConfigSchema } from "./baseConfigSchema";
import { instalatorSchema } from "../../localStore/schemas/instalatorSchema";

export const configSchema = z.object(instalatorSchema).and(baseConfigSchema);
