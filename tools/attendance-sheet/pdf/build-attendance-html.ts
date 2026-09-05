import type { MassarData } from "../../grading-sheet/types";
import type { AttendanceConfig } from "../types";
import { COVER_MALE, COVER_FEMALE } from "./cover-images";
import { COVER_L, pick, termLabel, tierLabel } from "../../grading-sheet/pdf/labels";

/**
 * "سجل الغياب" (Registre des absences): a decorative full-page landscape image
 * cover (one of two variants) with the Moroccan header / title / teacher / year
 * overlaid on top, followed by one attendance grid per class
 * (18 weeks × sessions/week columns). Grids auto-paginate; the header row
 * repeats on every page.
 */
const WEEKS = 18;

/** A class may carry its own sessions/week (blank mode); otherwise the global
 *  config value applies to every class (Massar mode). */
type AttendanceClass = MassarData & { sessionsPerWeek?: 1 | 2 | 3 };

export function buildAttendanceHtml(classes: AttendanceClass[], config: AttendanceConfig): string {
  const lang = config.lang;
  const htmlDir = lang === "fr" ? "ltr" : "rtl";
  const nameCol = lang === "fr" ? "Nom de l'élève" : "اسم التلميذ";
  const totalCol = lang === "fr" ? "Total" : "مجموع";
  // The French title ("Registre des Absences") is far longer than the Arabic one,
  // so widen the cartouche and shrink the title so it stays inside the frame.
  const titleFz = lang === "fr" ? "44px" : "60px";
  const frameSide = lang === "fr" ? "15%" : "34%";
  const coverImg = config.coverVariant === "female" ? COVER_FEMALE : COVER_MALE;
  const coverBg = coverImg
    ? `background-image:url('${coverImg}');background-size:cover;background-position:center;`
    : "background:#FBF7F2;";

  // Cover text ink, harmonised per variant.
  const theme = config.coverVariant === "female"
    ? { ink: "#6A4351", sub: "#8A6472", accent: "#BE9A55" }
    : { ink: "#1E2A44", sub: "#46587A", accent: "#B0893C" };

  // Grid palette — dark headers keep it legible in B&W print.
  const g = config.coverVariant === "female"
    ? { ink: "#6A4351", line: "#9B6576", row: "#F7EEF1", goldLt: "#F3E3D8" }
    : { ink: "#1A3055", line: "#2E6DA4", row: "#EEF3F8", goldLt: "#F5E6C0" };

  const flourish =
    `<svg width="210" height="14" viewBox="0 0 210 14" xmlns="http://www.w3.org/2000/svg">` +
    `<line x1="14" y1="7" x2="86" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<line x1="124" y1="7" x2="196" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<path d="M105 1 L112 7 L105 13 L98 7 Z" fill="${theme.accent}"/>` +
    `<circle cx="14" cy="7" r="1.8" fill="${theme.accent}"/>` +
    `<circle cx="196" cy="7" r="1.8" fill="${theme.accent}"/></svg>`;

  const directorateLine = config.directorate ? `<div class="r3">${config.directorate}</div>` : "";
  const term = config.term === "second" ? "second" : "first";
  const tierTerm = [tierLabel(config.tier, lang), termLabel(term, lang)].filter(Boolean).join("  —  ");
  const tierLine = `<div class="layer cv-tier">${tierTerm}</div>`;
  const teacherLabel = config.coverVariant === "female" ? pick(COVER_L.teacherF, lang) : pick(COVER_L.teacherM, lang);
  const teacher = config.prof || classes[0]?.meta.teacher || "..........................";
  const year = config.annee || classes[0]?.meta.year || "..................";

  const classSections = classes
    .map((cls) => {
      const perWeek = cls.sessionsPerWeek || config.sessionsPerWeek;
      const totalSessions = perWeek * WEEKS;
      const sessFz = totalSessions <= 18 ? 8 : totalSessions <= 36 ? 7 : 6;
      const sessionHeadCells = Array.from(
        { length: totalSessions },
        (_, i) => `<th class="ses">${i + 1}</th>`
      ).join("");

      const rows = cls.students
        .map((st) => {
          const cells = Array(totalSessions).fill(`<td class="ses"></td>`).join("");
          return `
          <tr>
            <td class="a-num">${st.index}</td>
            <td class="a-name">${st.name}</td>
            ${cells}
            <td class="a-tot"></td>
          </tr>`;
        })
        .join("");

      const clsYear = config.annee || cls.meta.year || "";
      // In blank mode level === className (one typed name); avoid echoing it twice.
      const lvl = cls.meta.level && cls.meta.level !== cls.meta.className ? cls.meta.level : "";
      return `
    <div class="att-class">
      <div class="class-hdr">
        <span class="sub">${lvl}</span>
        <span class="main">— ${cls.meta.className || ""} —</span>
        <span class="sub yr">${clsYear}</span>
      </div>
      <table class="att-tbl" style="--ses-fz:${sessFz}px">
        <thead>
          <tr>
            <th class="a-num">#</th>
            <th class="a-name">${nameCol}</th>
            ${sessionHeadCells}
            <th class="a-tot">${totalCol}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
<head>
<meta charset="UTF-8">
<style>
  /* Cover prints full-bleed; class grids use a named page so their margin
     repeats on every page (including continuation pages). */
  @page { size: A4 landscape; margin: 0; }
  @page sheet { size: A4 landscape; margin: 8mm 10mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif; color: #0D1117; direction: ${htmlDir};
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* ── Image cover with overlaid text ── */
  .att-cover { position: relative; width: 297mm; height: 210mm; overflow: hidden; ${coverBg} }
  .att-cover .layer { position: absolute; left: 0; right: 0; text-align: center; direction: ${htmlDir}; }

  .cv-header { top: 8%; }
  .cv-header .r1 { font-size: 18px; font-weight: 800; color: ${theme.ink}; margin-bottom: 5px; }
  .cv-header .r2 { font-size: 12.5px; font-weight: 600; color: ${theme.ink}; margin-bottom: 3px; }
  .cv-header .r3 { font-size: 11px; font-weight: 500; color: ${theme.sub}; }

  /* decorative cartouche around the title block */
  .cv-frame { position: absolute; top: 30%; bottom: 42%; left: ${frameSide}; right: ${frameSide};
    border: 1.4px solid ${theme.accent}; border-radius: 3px; }
  .cv-frame::after { content: ''; position: absolute; inset: 4px;
    border: 0.7px solid ${theme.accent}; border-radius: 2px; }

  .cv-title { top: 34%; font-family: 'Amiri', serif; font-size: ${titleFz}; font-weight: 700;
    color: ${theme.ink}; text-shadow: 0 2px 4px rgba(0,0,0,0.12); }
  .cv-flourish { top: 47.5%; }
  .cv-tier { top: 52%; font-size: 16px; font-weight: 600; color: ${theme.sub}; }

  .cv-teacher { top: 64%; }
  .cv-year    { top: 80%; }
  .cv-teacher .lbl, .cv-year .lbl { font-weight: 600; color: ${theme.sub}; }
  .cv-teacher .lbl { font-size: 17px; }
  .cv-year .lbl { font-size: 16px; }
  .cv-teacher .val, .cv-year .val { font-weight: 800; color: ${theme.ink};
    border-bottom: 1.5px solid ${theme.accent}; padding: 0 8px 4px; }
  .cv-teacher .val { font-size: 22px; }
  .cv-year .val { font-size: 20px; direction: ltr; unicode-bidi: isolate; }

  /* ── Class grids ── */
  .att-class { page: sheet; page-break-before: always; }
  .class-hdr { background: ${g.ink}; border-radius: 4px 4px 0 0; padding: 6px 0; text-align: center; }
  .class-hdr .main { font-size: 12px; font-weight: 900; color: #FFFFFF; }
  .class-hdr .sub { font-size: 9.5px; font-weight: 700; color: ${g.goldLt}; margin: 0 8px; }
  .class-hdr .yr { direction: ltr; unicode-bidi: isolate; display: inline-block; }

  table.att-tbl { width: 100%; border-collapse: collapse; table-layout: fixed;
    border: 1px solid #8FA8BB; }
  table.att-tbl thead { display: table-header-group; }
  table.att-tbl th { background: ${g.ink}; color: #FFFFFF; font-weight: 900;
    border-left: 0.75px solid ${g.line}; padding: 3px 0; text-align: center; }
  table.att-tbl th.a-num { width: 26px; font-size: 8px; }
  table.att-tbl th.a-name { width: 150px; font-size: 9px; }
  table.att-tbl th.a-tot { width: 38px; font-size: 7.5px; }
  table.att-tbl th.ses { font-size: var(--ses-fz); }
  table.att-tbl td { border-left: 0.75px solid #AABDCC; border-bottom: 0.75px solid #AABDCC;
    height: 17px; }
  table.att-tbl td.a-num { width: 26px; text-align: center; font-size: 8px; font-weight: 700; color: #3D5A6E; }
  table.att-tbl td.a-name { width: 150px; text-align: right; direction: rtl; padding: 0 5px;
    font-size: 10px; font-weight: 700; color: #0D1117; }
  table.att-tbl td.a-tot { width: 38px; }
  table.att-tbl tbody tr:nth-child(even) td { background: ${g.row}; }
  table.att-tbl tbody tr { page-break-inside: avoid; }
</style>
</head>
<body>

  <div class="att-cover">
    <div class="layer cv-header">
      <div class="r1">${pick(COVER_L.kingdom, lang)}</div>
      <div class="r2">${pick(COVER_L.ministry, lang)}</div>
      ${directorateLine}
    </div>

    <div class="cv-frame"></div>
    <div class="layer cv-title">${pick(COVER_L.attendanceTitle, lang)}</div>
    <div class="layer cv-flourish">${flourish}</div>
    ${tierLine}

    <div class="layer cv-teacher"><span class="lbl">${teacherLabel}: </span><span class="val">${teacher}</span></div>
    <div class="layer cv-year"><span class="lbl">${pick(COVER_L.yearLabel, lang)}: </span><span class="val">${year}</span></div>
  </div>

  ${classSections}

</body>
</html>`;
}
