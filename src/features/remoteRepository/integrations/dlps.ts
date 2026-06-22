import * as cheerio from "cheerio";
import { declareIntegration } from "../utils/declareIntegration";
import { getHtml } from "../../../utils/getHtml";
import { SingleItemSection, Strategy } from "../types/strategy";

const base = "https://dlpsgame.com";

export const list: Strategy["fetchList"] = async (
  pageNum: number,
  search: string,
  category: string,
) => {
  const url = `${base}/category/${category}/page/${pageNum}/${search ? `?s=${search}` : ""}`;

  const { html } = await getHtml(url);

  const $ = cheerio.load(html);

  const blogSection = $(".main.section#main");

  const lastPage = blogSection.find("[role=navigation] .last").attr("href");
  const current = blogSection.find("[role=navigation] .current").text();

  const pagesAvailable = lastPage?.match(/page\/(\d+)\/?/)?.[1];

  const items = blogSection
    .find(".post.bar.hentry")
    .map((_, el) => {
      const title = $(el).find(".post-title a").text();
      const image = $(el).find("img").attr("src");
      const slug = $(el).find("a").attr("href")?.replace(base, "") || "#";

      return { title, image, slug };
    })
    .get();

  return {
    items,
    pages: Number(pagesAvailable || pageNum),
    currentPage: Number(current),
  };
};

export const item: Strategy["fetchItem"] = async (slug: string) => {
  const url = `${base}/${slug}`;

  const { html } = await getHtml(url);

  const $ = cheerio.load(html);

  const title = $(".post-title.entry-title").text();
  const videoUrl = $("iframe[src*=youtube]").attr("src");
  const images = $(".ari-fancybox img")
    .map((_, el) => $(el).attr("src"))
    .get();
  const coreContent = $(".secure-data")
    .map((index, section) => {
      const { info, solid, links } = $(section)
        .find(".secure-data p")
        .get()
        .reduce<SingleItemSection>(
          (acc, el) => {
            const $el = $(el);

            const text = $el.text().trim();
            const hasLink = $el.find("a").length > 0;

            if (hasLink) {
              const [groupName] = $el.text().split(":");
              const links = $el
                .find("a")
                .map((_, el) => {
                  return {
                    provider: $(el).text(),
                    address: $(el).attr("href")!,
                  };
                })
                .get();
              acc.links.push({
                groupName,
                items: links,
                id: `[CG][${slug}][${index}][${groupName}]`,
              });
            } else if (text.includes(":")) {
              acc.solid.push(text);
            } else {
              acc.info.push(text);
            }

            return acc;
          },
          { info: [], solid: [], links: [] },
        );

      return {
        solid,
        info,
        links,
      };
    })
    .get();

  return { title, videoUrl, images, sections: coreContent };
};

export const dlps = declareIntegration("dlps", {
  fetchList: list,
  fetchItem: item,
});
