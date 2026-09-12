import puppeteer, { type Browser } from "puppeteer";
import { embeddedFontCss } from "./html-fonts";

/**
 * Hardened HTML -> PDF renderer.
 *
 * Security model (defense in depth):
 *  - JavaScript is disabled in the page (no script execution at all).
 *  - Every network request is blocked except inline `data:` URIs, so there is
 *    no SSRF / file-read / external-resource surface whatsoever.
 *  - Fonts are embedded as data URIs (see html-fonts.ts), so blocking the
 *    network does not break Arabic rendering.
 *  - A single browser instance is reused across requests (relaunched if it
 *    dies) instead of spawning a full Chromium per request.
 *  - Hard timeouts bound every step.
 */

const LAUNCH_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserPromise) {
    const existing = await browserPromise.catch(() => null);
    if (existing && existing.connected) return existing;
  }
  browserPromise = puppeteer.launch({ headless: true, args: LAUNCH_ARGS });
  return browserPromise;
}

/** Warm up Chromium at startup so the first user doesn't pay the launch cost. */
export function warmUpBrowser(): void {
  getBrowser().catch(() => {});
}

/** Strip any external @import / stylesheet and inject the locally-embedded fonts. */
function prepareHtml(html: string): string {
  const withoutRemoteImports = html.replace(
    /@import\s+url\(\s*['"]?https?:\/\/[^)]*\)\s*;?/gi,
    ""
  );
  const fontStyle = `<style>${embeddedFontCss()}</style>`;
  return withoutRemoteImports.includes("</head>")
    ? withoutRemoteImports.replace("</head>", `${fontStyle}</head>`)
    : fontStyle + withoutRemoteImports;
}

export type RenderOptions = {
  landscape?: boolean;
  noMargin?: boolean;
  /** Let the document's own CSS @page rules control margins (needed for
   *  multi-section docs where a full-bleed cover and margined inner pages
   *  coexist via named pages). When set, Puppeteer adds no margin of its own. */
  cssMargins?: boolean;
};

export async function renderPdf(
  html: string,
  opts: RenderOptions = {}
): Promise<Uint8Array> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setJavaScriptEnabled(false);

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().startsWith("data:")) {
        req.continue().catch(() => {});
      } else {
        req.abort().catch(() => {});
      }
    });

    page.setDefaultTimeout(20000);
    await page.setContent(prepareHtml(html), {
      waitUntil: "load",
      timeout: 20000,
    });

    const pdfOptions: Parameters<typeof page.pdf>[0] = {
      format: "A4",
      landscape: !!opts.landscape,
      printBackground: true,
      timeout: 20000,
    };
    if (!opts.cssMargins) {
      pdfOptions.margin = opts.noMargin
        ? { top: "0", bottom: "0", left: "0", right: "0" }
        : { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" };
    }
    return await page.pdf(pdfOptions);
  } finally {
    await page.close().catch(() => {});
  }
}
