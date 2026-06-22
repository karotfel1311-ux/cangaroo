import z, { ZodDefault, ZodObject } from "zod";
import { getBaseConfigContent, getRawConfigContent } from "./config";
import { AppStatus } from "./status";
import { baseConfigSchema } from "../features/configuration/schemas/baseConfigSchema";

type Output<T extends ZodDefault<ZodObject>> = {
  schema: T;
  handler: (url: string) => Promise<void>;
};

type Input<T extends ZodDefault<ZodObject>> = {
  schema: T;
  handler: (
    url: string,
    schema?: Partial<
      z.output<T> & z.infer<typeof baseConfigSchema> & AppStatus
    >,
  ) => Promise<void>;
};

export function declareInstalator<T extends ZodDefault<ZodObject>>(
  key: string,
  input: Input<T>,
): Output<T> {
  const configContent = getRawConfigContent();
  const parsedData = input.schema.safeParse(configContent[key]).data;
  const cfg = getBaseConfigContent();
  const handler = async (url: string) => {
    try {
      // @ts-expect-error can't determine correct types
      return await input.handler(cfg.server_address + url, {
        ...cfg,
        ...parsedData,
      });
    } catch (err) {
      console.warn("Instalator error", err);
    }
  };

  return { schema: input.schema, handler };
}
