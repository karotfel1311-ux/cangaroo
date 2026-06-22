export interface ParsedGroupDir {
  success: boolean;
  slug: string | null;
  index: string | null;
  description: string | null;
  fullGroupKey: string | null;
  originalDirName: string | null;
  matchedDirName?: string; // dodane dla debugu
}

/**
 * Wyciąga informacje grupy nawet z pełnej ścieżki
 */
export function parseGroupDirName(input: string | null): ParsedGroupDir {
  const trimmed = input?.trim();

  // Szukamy fragmentu w formacie [CG][...][...][...]
  const regex = /\[CG\]\[(.+?)\]\[(.+?)\]\[(.+?)\](?=\/|$)/;
  const match = trimmed?.match(regex);

  if (!match) {
    return {
      success: false,
      slug: null,
      index: null,
      description: null,
      fullGroupKey: null,
      originalDirName: trimmed || null,
    };
  }

  const [, slugRaw, indexRaw, descriptionRaw] = match;

  const slug = slugRaw.trim();
  const index = indexRaw.trim();
  const description = descriptionRaw.trim();
  const fullGroupKey = `${slug}-${index}`.toLowerCase().trim();

  return {
    success: true,
    slug,
    index,
    description,
    fullGroupKey,
    originalDirName: trimmed || null,
    matchedDirName: match[0], // cały dopasowany fragment
  };
}
