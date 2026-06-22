import z, { ZodDefault, ZodObject } from "zod";
import { configSchema } from "../features/configuration/schemas/configSchema";
import { getRawConfigContent } from "../features/configuration/utils/getRawConfigContent";
import { getBaseConfigContent } from "../features/configuration/utils/getConfigContent";

type Output<T extends ZodDefault<ZodObject>> = {
  schema: T;
  handler: (url: string) => Promise<void>;
  description: string;
  meta: Record<string, unknown>;
};

type Input<T extends ZodDefault<ZodObject>> = {
  schema: T;
  description: string;
  meta: Record<string, unknown>;
  handler: (
    url: string,
    schema?: Partial<z.output<T> & z.infer<typeof configSchema>>,
  ) => Promise<void>;
};

export function declareInstalator<T extends ZodDefault<ZodObject>>(
  key: string,
  input: Input<T>,
): Output<T> {
  const configContent = getRawConfigContent();
  const parsedData = input.schema.safeParse?.(configContent[key])
    .data as Partial<z.output<T>>;
  const cfg = getBaseConfigContent();
  const handler = async (url: string) => {
    try {
      return await input.handler(cfg.server_address + url, {
        ...cfg,
        ...parsedData,
      });
    } catch (err) {
      console.warn("Instalator error", err);
      throw err;
    }
  };

  return {
    handler,
    schema: input.schema,
    description: input.description,
    meta: input.meta,
  };
}
