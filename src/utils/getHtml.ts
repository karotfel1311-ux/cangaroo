import { PlaywrightBlocker } from "@ghostery/adblocker-playwright";
import { chromium } from "playwright";

export const getHtml = async (url: string) => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);

  await blocker.enableBlockingInPage(page);

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();
  const finalUrl = page.url();

  await browser.close();

  return {
    html,
    finalUrl,
  };
};
