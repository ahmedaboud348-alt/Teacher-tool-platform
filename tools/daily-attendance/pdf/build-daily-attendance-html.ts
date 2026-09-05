import type { MassarData } from "../../grading-sheet/types";
import type { DailyAttendanceConfig } from "../types";
import { getSchoolCalendar, YEAR_LABEL } from "../calendar";
import { COVER_MALE, COVER_FEMALE } from "../../grade-book/pdf/cover-images";

/**
 * "السجل اليومي للحضور والغياب" (Moroccan primary daily attendance register):
 * image cover → info page → one grid page per month (school days as columns,
 * holidays as shaded columns), all A4 portrait.
 */
export function buildDailyAttendanceHtml(classes: MassarData[], config: DailyAttendanceConfig): string {
  const months = getSchoolCalendar();

  const coverImg = config.coverVariant === "female" ? COVER_FEMALE : COVER_MALE;
  const coverBg = coverImg
    ? `background-image:url('${coverImg}');background-size:cover;background-position:center;`
    : "background:#FBF7F2;";
  const theme = config.coverVariant === "female"
    ? { ink: "#6A4351", sub: "#8A6472", accent: "#BE9A55" }
    : { ink: "#1E2A44", sub: "#46587A", accent: "#B0893C" };
  const flourish =
    `<svg width="210" height="14" viewBox="0 0 210 14" xmlns="http://www.w3.org/2000/svg">` +
    `<line x1="14" y1="7" x2="86" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<line x1="124" y1="7" x2="196" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<path d="M105 1 L112 7 L105 13 L98 7 Z" fill="${theme.accent}"/>` +
    `<circle cx="14" cy="7" r="1.8" fill="${theme.accent}"/><circle cx="196" cy="7" r="1.8" fill="${theme.accent}"/></svg>`;
  const dir = config.directorate ? `<div class="r3">${config.directorate}</div>` : "";
  // Lift name/year above the bottom illustration (higher on the female artwork).
  const teacherTop = config.coverVariant === "female" ? "56%" : "60%";
  const yearTop = config.coverVariant === "female" ? "64%" : "68%";

  const field = (label: string, value: string) =>
    `<div class="fld"><span class="fl">${label}</span><span class="fv">${value || "................................................"}</span></div>`;

  const monthPage = (mo: (typeof months)[number], students: MassarData["students"], classLabel: string) => {
    const cols = mo.columns;
    const N = students.length;
    const span = N + 2;
    const h1 = cols.map((c) =>
      c.type === "day"
        ? `<th class="wd"><span>${c.weekday}</span></th>`
        : `<td class="hol" rowspan="${span}"><span>${c.name}</span></td>`
    ).join("");
    const h2 = cols.map((c) => (c.type === "day" ? `<th class="dn">${c.day}</th>` : "")).join("");
    const rows = students.map((st, i) => {
      const cells = cols.map((c) => (c.type === "day" ? `<td class="mk"></td>` : "")).join("");
      return `<tr>
        <td class="num">${i + 1}</td>
        <td class="nm">${st.name}</td>
        ${cells}
        <td class="sm"></td><td class="sm"></td><td class="sm"></td>
        <td class="obs"></td>
      </tr>`;
    }).join("");
    return `
    <div class="month">
      <div class="mhead">
        <div class="mtitle">${mo.name} ${mo.year}${classLabel ? ` <span class="mcls">${classLabel}</span>` : ""}</div>
        <div class="mbox">عدد أنصاف أيام الدراسة: <b>${mo.studyHalfDays}</b></div>
      </div>
      <table class="mtbl">
        <tr>
          <th class="num" rowspan="2">ر.ت</th>
          <th class="nm" rowspan="2">اسم المتعلم(ة)</th>
          ${h1}
          <th class="sm" rowspan="2"><span>أنصاف أيام الدراسة</span></th>
          <th class="sm" rowspan="2"><span>مجموع غياب الشهر</span></th>
          <th class="sm" rowspan="2"><span>أنصاف أيام الحضور</span></th>
          <th class="obs" rowspan="2">ملاحظات</th>
        </tr>
        <tr>${h2}</tr>
        ${rows}
      </table>
      <div class="mformula">
        <span>النسبة المئوية الشهرية للمواظبة =</span>
        <span class="frac"><span class="num2">مجموع أنصاف أيام الحضور</span><span class="den">مجموع أنصاف أيام الدراسة</span></span>
        <span>× 100</span>
      </div>
    </div>`;
  };

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 portrait; margin: 0; }
  @page sheet { size: A4 portrait; margin: 9mm 7mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Cairo', sans-serif; color: #0D1117; direction: rtl;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ── Cover ── */
  .cover { position: relative; width: 210mm; height: 297mm; overflow: hidden; ${coverBg} }
  .cover .layer { position: absolute; left: 0; right: 0; text-align: center; direction: rtl; }
  .cv-header { top: 6.5%; }
  .cv-header .r1 { font-size: 18px; font-weight: 800; color: ${theme.ink}; margin-bottom: 5px; }
  .cv-header .r2 { font-size: 12.5px; font-weight: 600; color: ${theme.ink}; margin-bottom: 3px; }
  .cv-header .r3 { font-size: 11px; font-weight: 500; color: ${theme.sub}; }
  .cv-frame { position: absolute; top: 30%; bottom: 44%; left: 16%; right: 16%;
    border: 1.4px solid ${theme.accent}; border-radius: 3px; }
  .cv-frame::after { content: ''; position: absolute; inset: 4px; border: 0.7px solid ${theme.accent}; border-radius: 2px; }
  .cv-title { top: 33%; font-family: 'Amiri', serif; font-size: 40px; font-weight: 700; line-height: 1.25;
    color: ${theme.ink}; text-shadow: 0 2px 4px rgba(0,0,0,0.12); }
  .cv-flourish { top: 47%; }
  .cv-tier { top: 51%; font-size: 16px; font-weight: 600; color: ${theme.sub}; }
  .cv-teacher { top: ${teacherTop}; }
  .cv-year { top: ${yearTop}; }
  .cv-teacher .lbl, .cv-year .lbl { font-weight: 600; color: ${theme.sub}; }
  .cv-teacher .lbl { font-size: 17px; } .cv-year .lbl { font-size: 16px; }
  .cv-teacher .val, .cv-year .val { font-weight: 800; color: ${theme.ink};
    border-bottom: 1.5px solid ${theme.accent}; padding: 0 8px 4px; }
  .cv-teacher .val { font-size: 21px; } .cv-year .val { font-size: 20px; direction: ltr; unicode-bidi: isolate; }

  /* ── Info page ── */
  .info { page: sheet; page-break-before: always; }
  .info .ministry { text-align: center; line-height: 1.6; margin-bottom: 14mm; }
  .info .ministry .b { font-size: 15px; font-weight: 800; color: #1A3055; }
  .info .ministry .n { font-size: 12px; color: #3D5A6E; }
  .info .fld { display: flex; align-items: baseline; gap: 6px; margin-bottom: 9mm; font-size: 14px; }
  .info .fld .fl { font-weight: 700; color: #1A3055; white-space: nowrap; }
  .info .fld .fv { flex: 1; font-weight: 700; color: #0D1117; border-bottom: 1px dotted #90A4B5; }
  .info .legend { margin-top: 12mm; font-size: 12px; color: #3D5A6E; line-height: 1.9; }
  .info .legend b { color: #1A3055; }
  .info .formula { margin-top: 8mm; font-size: 12px; color: #1A3055; display: flex; align-items: center; gap: 8px; }

  /* ── Month grid ── */
  .month { page: sheet; page-break-before: always; }
  .mhead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3mm; }
  .mhead .mtitle { font-size: 15px; font-weight: 900; color: #1A3055; }
  .mhead .mcls { font-size: 11px; font-weight: 800; color: #fff; background: #1D4ED8; border-radius: 999px; padding: 2px 10px; margin-right: 6px; }
  .mhead .mbox { font-size: 10px; font-weight: 700; color: #1A3055; border: 1px solid #8FA8BB; border-radius: 4px; padding: 3px 8px; }

  table.mtbl { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #4A6178; }
  table.mtbl th, table.mtbl td { border: 0.5px solid #9AB0C0; text-align: center; }
  table.mtbl th { background: #1A3055; color: #fff; }
  table.mtbl th.num { width: 8mm; font-size: 8px; }
  table.mtbl th.nm  { width: 34mm; font-size: 9px; }
  table.mtbl th.sm  { width: 8mm; }
  table.mtbl th.sm span { writing-mode: vertical-rl; font-size: 7.5px; font-weight: 700; display: inline-block; padding: 2px 0; }
  table.mtbl th.obs { width: 16mm; font-size: 8.5px; }
  table.mtbl th.wd { height: 20mm; }
  table.mtbl th.wd span { writing-mode: vertical-rl; font-size: 7px; font-weight: 700; display: inline-block; }
  table.mtbl th.dn { font-size: 7.5px; font-weight: 700; height: 5mm; }
  table.mtbl td.hol { background: #DDE5EC; }
  table.mtbl td.hol span { writing-mode: vertical-rl; font-size: 8px; font-weight: 800; color: #1A3055; display: inline-block; }
  table.mtbl td.num { font-size: 8px; font-weight: 700; color: #3D5A6E; height: 5.6mm; }
  table.mtbl td.nm  { text-align: right; direction: rtl; padding: 0 4px; font-size: 9.5px; font-weight: 700; }
  table.mtbl tbody tr:nth-child(even) td { background: #F1F5F9; }

  .mformula { margin-top: 3mm; font-size: 10px; color: #1A3055; display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
  .mformula .frac { display: inline-flex; flex-direction: column; text-align: center; }
  .mformula .frac .num2 { border-bottom: 1px solid #1A3055; padding: 0 6px 1px; }
  .mformula .frac .den { padding: 1px 6px 0; }
</style>
</head>
<body>

  <div class="cover">
    <div class="layer cv-header">
      <div class="r1">المملكة المغربية</div>
      <div class="r2">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
      ${dir}
    </div>
    <div class="cv-frame"></div>
    <div class="layer cv-title">السجل اليومي<br>للحضور والغياب</div>
    <div class="layer cv-flourish">${flourish}</div>
    <div class="layer cv-tier">التعليم الابتدائي</div>
    <div class="layer cv-teacher"><span class="lbl">الأستاذ(ة): </span><span class="val">${config.teacher || ".........................."}</span></div>
    <div class="layer cv-year"><span class="lbl">السنة الدراسية: </span><span class="val">${YEAR_LABEL}</span></div>
  </div>

  <div class="info">
    <div class="ministry">
      <div class="b">المملكة المغربية</div>
      <div class="n">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
    </div>
    ${field("الأكاديمية الجهوية للتربية والتكوين لجهة :", config.academy)}
    ${field("المديرية الإقليمية :", config.directorate)}
    ${field("المؤسسة :", config.school)}
    ${field("الأستاذ(ة) :", config.teacher)}
    ${field("المستوى :", config.level)}
    <div class="legend">
      • توضع علامة <b>(-)</b> عند تغيب كل متعلم(ة) نصف يوم.<br>
      • توضع علامة <b>(+)</b> عند تغيب كل متعلم(ة) يوماً كاملاً.
    </div>
    <div class="formula">
      <span>النسبة المئوية الشهرية للمواظبة =</span>
      <span style="display:inline-flex;flex-direction:column;text-align:center">
        <span style="border-bottom:1px solid #1A3055;padding:0 6px 1px">مجموع أنصاف أيام الحضور</span>
        <span style="padding:1px 6px 0">مجموع أنصاف أيام الدراسة</span>
      </span>
      <span>× 100</span>
    </div>
  </div>

  ${classes.map((cls) => months.map((mo) => monthPage(mo, cls.students, cls.meta.className || cls.meta.level || "")).join("")).join("")}

</body>
</html>`;
}
