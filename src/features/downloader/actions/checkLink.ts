"use server";

import z from "zod";
import { checkLinkSchema } from "../schemas/checkLinkSchema";
import { getHtml } from "../../../utils/getHtml";
import { createTask } from "./createTask";
import { declareServerAction } from "../../../utils/declareServerAction";

const GOOD_PROVIDERS = ["mediafire", "aki"] as const;

function isGoodProvider(url: string): boolean {
  return GOOD_PROVIDERS.some((p) =>
    url.toLowerCase().includes(p.toLowerCase()),
  );
}

// Rekurencyjna funkcja śledząca linki
async function findDirectLink(
  url: string,
  depth = 0,
  maxDepth = 8,
): Promise<string | null> {
  if (depth > maxDepth) {
    console.warn(`Max depth reached for: ${url}`);
    return null;
  }

  try {
    const { html, finalUrl } = await getHtml(url);

    // 1. Bezpośredni dobry provider po przekierowaniu
    if (isGoodProvider(finalUrl)) {
      return finalUrl;
    }

    // 2. Szukamy linków do dobrych providerów w HTML
    const providerRegex = new RegExp(
      `https?:\/\/[^\\s"'<>]*(?:${GOOD_PROVIDERS.join("|")})[^\\s"'<>]*`,
      "gi",
    );

    const matches = html.match(providerRegex) ?? [];

    for (const candidate of matches) {
      if (!isGoodProvider(candidate)) continue;

      // Rekurencyjne sprawdzenie znalezionego linku
      const directLink = await findDirectLink(candidate, depth + 1, maxDepth);
      if (directLink) {
        return directLink;
      }
    }

    return null;
  } catch (err) {
    console.error(`Error processing link ${url}:`, err);
    return null;
  }
}

export const checkLink = declareServerAction(
  async (input: z.infer<typeof checkLinkSchema>) => {
    const parsed = await checkLinkSchema.parseAsync(input);

    const finalLinks: string[] = [];

    for (const item of parsed.links) {
      if (!isGoodProvider(item.provider)) continue;

      const directLink = await findDirectLink(item.address);

      if (directLink) {
        finalLinks.push(directLink);
        break;
      }
    }

    if (finalLinks.length > 0) {
      await createTask({ links: finalLinks, id: input.id });
      return true;
    }
  },
);
