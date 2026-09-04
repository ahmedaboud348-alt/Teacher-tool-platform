import type { GradeBookEntry, GradeBookConfig } from "../types";
import {
  sheetCss,
  NAVY_SCHEME,
  ROSE_SCHEME,
  infoStripHtml,
  sheetTableHtml,
  legendHtml,
} from "../../grading-sheet/pdf/sheet-shared";
import { COVER_MALE, COVER_FEMALE } from "./cover-images";

/**
 * "دفتر التنقيط" (Carnet de notes): a decorative full-page image cover (one of
 * two variants) with the Moroccan header / title / teacher / year overlaid on
 * top, followed by one grading sheet per class.
 */
export function buildGradeBookHtml(entries: GradeBookEntry[], config: GradeBookConfig): string {
  const coverImg = config.coverVariant === "female" ? COVER_FEMALE : COVER_MALE;
  const coverBg = coverImg
    ? `background-image:url('${coverImg}');background-size:cover;background-position:center;`
    : "background:#FBF7F2;";

  // Per-variant ink so the text harmonises with each artwork.
  const theme = config.coverVariant === "female"
    ? { ink: "#6A4351", sub: "#8A6472", accent: "#BE9A55" }  // warm mauve + soft gold
    : { ink: "#1E2A44", sub: "#46587A", accent: "#B0893C" }; // deep navy + gold

  // Small gold flourish placed under the title.
  const flourish =
    `<svg width="210" height="14" viewBox="0 0 210 14" xmlns="http://www.w3.org/2000/svg">` +
    `<line x1="14" y1="7" x2="86" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<line x1="124" y1="7" x2="196" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<path d="M105 1 L112 7 L105 13 L98 7 Z" fill="${theme.accent}"/>` +
    `<circle cx="14" cy="7" r="1.8" fill="${theme.accent}"/>` +
    `<circle cx="196" cy="7" r="1.8" fill="${theme.accent}"/></svg>`;

  const directorateLine = config.directorate ? `<div class="r3">${config.directorate}</div>` : "";
  const tierLine = config.tier ? `<div class="layer cv-tier">${config.tier}</div>` : "";
  const teacherLabel = config.coverVariant === "female" ? "الأستاذة" : "الأستاذ";
  // The female artwork's bottom illustration sits higher, so lift the name/year.
  const teacherTop = config.coverVariant === "female" ? "55%" : "59%";
  const yearTop = config.coverVariant === "female" ? "63%" : "69%";
  const teacher = config.prof || "..........................";
  const year = config.annee || "..................";

  const classSections = entries
    .map((e) => {
      const m = e.data.meta;
      return `
    <div class="gb-class">
      ${infoStripHtml({
        prof: config.prof || m.teacher,
        classe: m.className,
        niveau: m.level,
        annee: config.annee || m.year,
      })}
      ${sheetTableHtml(e.data.students, config)}
      ${legendHtml(config)}
    </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
<meta charset="UTF-8">
<style>
  /* Cover prints full-bleed; class sheets use a named page so their margin
     repeats on every page (including continuation pages). */
  @page { size: A4 portrait; margin: 0; }
  @page sheet { size: A4 portrait; margin: 11mm 9mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif; color: #0D1117;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* ── Image cover with overlaid text ── */
  .gb-cover {
    position: relative; width: 210mm; height: 297mm; overflow: hidden;
    ${coverBg}
  }
  .gb-cover .layer { position: absolute; left: 0; right: 0; text-align: center; direction: rtl; }

  .cv-header { top: 6.5%; }
  .cv-header .r1 { font-size: 18px; font-weight: 800; color: ${theme.ink}; margin-bottom: 6px; }
  .cv-header .r2 { font-size: 12.5px; font-weight: 600; color: ${theme.ink}; margin-bottom: 4px; }
  .cv-header .r3 { font-size: 11px; font-weight: 500; color: ${theme.sub}; }

  /* decorative cartouche around the title block */
  .cv-frame { position: absolute; top: 28%; bottom: 46%; left: 20%; right: 20%;
    border: 1.4px solid ${theme.accent}; border-radius: 3px; }
  .cv-frame::after { content: ''; position: absolute; inset: 4px;
    border: 0.7px solid ${theme.accent}; border-radius: 2px; }

  .cv-title { top: 32%; font-family: 'Amiri', serif; font-size: 62px; font-weight: 700;
    color: ${theme.ink}; text-shadow: 0 2px 4px rgba(0,0,0,0.12); }
  .cv-flourish { top: 43.5%; }
  .cv-tier { top: 48%; font-size: 16px; font-weight: 600; color: ${theme.sub}; }

  .cv-teacher { top: ${teacherTop}; }
  .cv-year    { top: ${yearTop}; }
  .cv-teacher .lbl, .cv-year .lbl { font-weight: 600; color: ${theme.sub}; }
  .cv-teacher .lbl { font-size: 17px; }
  .cv-year .lbl { font-size: 16px; }
  .cv-teacher .val, .cv-year .val { font-weight: 800; color: ${theme.ink};
    border-bottom: 1.5px solid ${theme.accent}; padding: 0 8px 4px; }
  .cv-teacher .val { font-size: 22px; }
  /* keep "2025-2026" in logical order inside the RTL line */
  .cv-year .val { font-size: 20px; direction: ltr; unicode-bidi: isolate; }

  /* ── Class sheets ── */
  .gb-class { page: sheet; page-break-before: always; }
  ${sheetCss(config.coverVariant === "female" ? ROSE_SCHEME : NAVY_SCHEME)}
</style>
</head>
<body>

  <div class="gb-cover">
    <div class="cv-frame"></div>
    <div class="layer cv-header">
      <div class="r1">المملكة المغربية</div>
      <div class="r2">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
      ${directorateLine}
    </div>

    <div class="layer cv-title">دفتر التنقيط</div>
    <div class="layer cv-flourish">${flourish}</div>
    ${tierLine}

    <div class="layer cv-teacher"><span class="lbl">${teacherLabel}: </span><span class="val">${teacher}</span></div>
    <div class="layer cv-year"><span class="lbl">السنة الدراسية: </span><span class="val">${year}</span></div>
  </div>

  ${classSections}

</body>
</html>`;
}
