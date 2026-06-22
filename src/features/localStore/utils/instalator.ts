import { getRawConfigContent } from "../../configuration/utils/getRawConfigContent";
import { instalators } from "../integrations";
import { instalatorSchema } from "../schemas/instalatorSchema";

export function getAvailableInstalators() {
  return instalators;
}

export async function getInstalatorConfig() {
  const fileContent = getRawConfigContent();
  const result = await instalatorSchema.parseAsync(fileContent);
  return result;
}

export function getInstalatorMetadata() {
  return Object.fromEntries(
    Object.entries(instalators).map(([key, instalator]) => [
      key,
      { ...instalator.meta, description: instalator.description },
    ]),
  );
}

export async function getActiveInstalator() {
  const config = await getInstalatorConfig();
  const method = config?.instal_method;

  if (!method) return null;

  return instalators[method];
}
