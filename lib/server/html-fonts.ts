import { readFileSync } from "fs";
import { join } from "path";

/**
 * Builds @font-face CSS with the Arabic fonts embedded as base64 data URIs.
 *
 * Embedding the fonts means the PDF renderer needs ZERO network access: the
 * Puppeteer page can have all external requests blocked, which removes any
 * SSRF / external-resource surface entirely. Generated once and cached.
 */

function loadBase64(file: string): string {
  const buf = readFileSync(join(process.cwd(), "public", "fonts", file));
  return buf.toString("base64");
}

function face(family: string, weight: number, file: string): string {
  return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('data:font/ttf;base64,${loadBase64(file)}') format('truetype');}`;
}

let cached: string | null = null;

export function embeddedFontCss(): string {
  if (cached) return cached;
  cached = [
    face("Cairo", 400, "Cairo-Regular.ttf"),
    face("Cairo", 600, "Cairo-Regular.ttf"),
    face("Cairo", 700, "Cairo-Bold.ttf"),
    face("Cairo", 800, "Cairo-ExtraBold.ttf"),
    face("Cairo", 900, "Cairo-ExtraBold.ttf"),
    face("Amiri", 400, "Amiri-Regular.ttf"),
    face("Amiri", 700, "Amiri-Bold.ttf"),
  ].join("");
  return cached;
}
