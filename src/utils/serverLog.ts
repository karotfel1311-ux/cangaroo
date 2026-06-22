"use server";

export async function log(title: string, content: unknown) {
  console.error(`[LOG] ${title}`, content);
}
