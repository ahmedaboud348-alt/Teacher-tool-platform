import type { MassarData } from "../../grading-sheet/types";
import type { AttendanceConfig } from "../types";

/**
 * "سجل الغياب" (Registre des absences): a landscape cover listing all classes,
 * followed by one attendance grid per class (18 weeks × sessions/week columns).
 * Grids auto-paginate; the header row repeats on every page.
 */
const WEEKS = 18;

export function buildAttendanceHtml(classes: MassarData[], config: AttendanceConfig): string {
  const school = classes[0]?.meta.school || "";
  const teacher = config.prof || classes[0]?.meta.teacher || "";
  const annee = config.annee || classes[0]?.meta.year || "";
  const totalSessions = config.sessionsPerWeek * WEEKS;
  const totalStudents = classes.reduce((s, c) => s + c.students.length, 0);
  const sessionsLabel =
    config.sessionsPerWeek === 1 ? "حصة واحدة" : config.sessionsPerWeek === 2 ? "حصتان" : "3 حصص";

  const dense = classes.length > 8;
  const rowPad = dense ? 4 : 7;

  const coverRows = classes
    .map((cls, i) => {
      const bg = i % 2 === 0 ? "background:#EEF3F8;" : "";
      return `
      <tr style="${bg}">
        <td style="padding:${rowPad}px 0;">${i + 1}</td>
        <td style="padding:${rowPad}px 0;">${cls.meta.className || "—"}</td>
        <td style="padding:${rowPad}px 0;">${cls.meta.level || "—"}</td>
        <td style="padding:${rowPad}px 0;">${cls.students.length}</td>
      </tr>`;
    })
    .join("");

  const sessionHeadCells = Array.from(
    { length: totalSessions },
    (_, i) => `<th class="ses">${i + 1}</th>`
  ).join("");
  const sessFz = totalSessions <= 18 ? 8 : totalSessions <= 36 ? 7 : 6;

  const classSections = classes
    .map((cls) => {
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

      return `
    <div class="att-class">
      <div class="class-hdr">
        <span class="sub">${cls.meta.level || ""}</span>
        <span class="main">— ${cls.meta.className || ""} —</span>
        <span class="sub">${config.annee || cls.meta.year || ""}</span>
      </div>
      <table class="att-tbl" style="--ses-fz:${sessFz}px">
        <thead>
          <tr>
            <th class="a-num">#</th>
            <th class="a-name">اسم التلميذ</th>
            ${sessionHeadCells}
            <th class="a-tot">مجموع</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  /* Cover prints full-bleed; class grids use a named page so their margin
     repeats on every page (including continuation pages). */
  @page { size: A4 landscape; margin: 0; }
  @page sheet { size: A4 landscape; margin: 8mm 10mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif; color: #0D1117; direction: rtl;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* ── Cover ── */
  .att-cover { display: flex; flex-direction: column; min-height: 210mm; padding: 10mm; }
  .cv-banner { background: #1A3055; padding: 9px 0 7px; text-align: center; }
  .cv-banner .fr { font-size: 21px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px; }
  .cv-banner .gline { height: 2px; background: #C8960C; margin: 3px 60px; }
  .cv-banner .ar { font-size: 13px; font-weight: 700; color: #F5E6C0; }
  .gold-bar { height: 3px; background: #C8960C; margin-bottom: 6px; }
  .cv-school { background: #243F63; padding: 6px 0; text-align: center;
    font-size: 11px; font-weight: 700; color: #FFFFFF; }
  .cv-school-gold { height: 2px; background: #C8960C; margin-bottom: 8px; }

  .cv-info { display: flex; gap: 8px; margin-bottom: 8px; }
  .cv-card { flex: 1; border: 1px solid #AABDCC; border-radius: 5px; overflow: hidden; text-align: center; }
  .cv-card .top { height: 3px; background: #C8960C; }
  .cv-card .lbl { font-size: 8px; font-weight: 700; color: #2E6DA4; margin: 5px 0 2px; }
  .cv-card .val { font-size: 11px; font-weight: 900; color: #1A3055; margin-bottom: 5px; }

  table.cv-tbl { width: 100%; border-collapse: collapse; border: 1px solid #8FA8BB; }
  table.cv-tbl th { background: #1A3055; color: #FFFFFF; font-size: 9.5px; font-weight: 900;
    padding: 7px 0; text-align: center; border-left: 1px solid #2E6DA4; }
  table.cv-tbl td { font-size: 10px; font-weight: 700; text-align: center;
    border-left: 0.75px solid #AABDCC; border-bottom: 0.75px solid #AABDCC; }
  table.cv-tbl .tot-row td { background: #F5E6C0; font-weight: 900; color: #1A3055;
    border-top: 1.5px solid #C8960C; padding: 6px 0; }

  .cv-summary { display: flex; background: #1A3055; border-radius: 5px; margin-top: 8px; padding: 8px 0; }
  .cv-summary .item { flex: 1; text-align: center; border-left: 1px solid #2E6DA4; }
  .cv-summary .item:last-child { border-left: none; }
  .cv-summary .num { font-size: 16px; font-weight: 900; color: #C8960C; }
  .cv-summary .lbl { font-size: 8px; font-weight: 700; color: #F5E6C0; }

  /* ── Class grids ── */
  .att-class { page: sheet; page-break-before: always; }
  .class-hdr { background: #1A3055; border-radius: 4px 4px 0 0; padding: 6px 0; text-align: center; }
  .class-hdr .main { font-size: 12px; font-weight: 900; color: #FFFFFF; }
  .class-hdr .sub { font-size: 9.5px; font-weight: 700; color: #F5E6C0; margin: 0 8px; }

  table.att-tbl { width: 100%; border-collapse: collapse; table-layout: fixed;
    border: 1px solid #8FA8BB; }
  table.att-tbl col, table.att-tbl colgroup { }
  table.att-tbl thead { display: table-header-group; }
  table.att-tbl th { background: #1A3055; color: #FFFFFF; font-weight: 900;
    border-left: 0.75px solid #2E6DA4; padding: 3px 0; text-align: center; }
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
  table.att-tbl tbody tr:nth-child(even) td { background: #EEF3F8; }
  table.att-tbl tbody tr { page-break-inside: avoid; }
</style>
</head>
<body>

  <div class="att-cover">
    <div class="cv-banner">
      <div class="fr">REGISTRE DES ABSENCES</div>
      <div class="gline"></div>
      <div class="ar">سجل الغياب</div>
    </div>
    <div class="gold-bar"></div>
    <div class="cv-school">${school || "—"}</div>
    <div class="cv-school-gold"></div>

    <div class="cv-info">
      <div class="cv-card"><div class="top"></div><div class="lbl">الأستاذ / الأستاذة</div><div class="val">${teacher || "—"}</div></div>
      <div class="cv-card"><div class="top"></div><div class="lbl">الحصص في الأسبوع</div><div class="val">${sessionsLabel}</div></div>
      <div class="cv-card"><div class="top"></div><div class="lbl">السنة الدراسية</div><div class="val">${annee || "—"}</div></div>
    </div>

    <table class="cv-tbl">
      <thead><tr><th style="width:8%">#</th><th>القسم</th><th>المستوى</th><th>عدد التلاميذ</th></tr></thead>
      <tbody>
        ${coverRows}
        <tr class="tot-row"><td>—</td><td>الإجمالي</td><td>${classes.length} أقسام</td><td>${totalStudents}</td></tr>
      </tbody>
    </table>

    <div class="cv-summary">
      <div class="item"><div class="num">${classes.length}</div><div class="lbl">عدد الأقسام</div></div>
      <div class="item"><div class="num">${totalStudents}</div><div class="lbl">إجمالي التلاميذ</div></div>
      <div class="item"><div class="num">${totalSessions}</div><div class="lbl">حصة في الدورة</div></div>
      <div class="item"><div class="num">${config.sessionsPerWeek}</div><div class="lbl">حصص في الأسبوع</div></div>
    </div>
  </div>

  ${classSections}

</body>
</html>`;
}
