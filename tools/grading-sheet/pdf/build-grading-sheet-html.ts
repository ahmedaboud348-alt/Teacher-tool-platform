import type { MassarData, GradingSheetConfig } from "../types";
import {
  SHEET_CSS,
  officialHeaderHtml,
  bannerHtml,
  infoStripHtml,
  sheetTableHtml,
  legendHtml,
} from "./sheet-shared";

/**
 * Standalone "ورقة التنقيط" (Feuille de notes) for a single class.
 * The table auto-paginates in the browser; its header repeats on every page.
 */
export function buildGradingSheetHtml(data: MassarData, config: GradingSheetConfig): string {
  const m = data.meta;
  return `<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
<meta charset="UTF-8">
<style>
  /* Margins on @page repeat on every page, incl. continuation pages. */
  @page { size: A4 portrait; margin: 11mm 9mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif; color: #0D1117;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  ${SHEET_CSS}
</style>
</head>
<body>
  <div class="sheet">
    ${officialHeaderHtml(m)}
    ${bannerHtml()}
    ${infoStripHtml({
      prof: config.prof || m.teacher,
      classe: config.classe || m.className,
      niveau: m.level,
      annee: config.annee || m.year,
    })}
    ${sheetTableHtml(data.students, config)}
    ${legendHtml(config)}
  </div>
</body>
</html>`;
}
