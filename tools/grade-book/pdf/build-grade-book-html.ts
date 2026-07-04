import type { GradeBookEntry, GradeBookConfig } from "../types";
import {
  SHEET_CSS,
  ATOM_SVG,
  officialHeaderHtml,
  bannerHtml,
  infoStripHtml,
  sheetTableHtml,
  legendHtml,
} from "../../grading-sheet/pdf/sheet-shared";

/**
 * "دفتر التنقيط" (Carnet de notes): a cover page listing all classes,
 * followed by one grading sheet per class. The cover is designed to stay on a
 * single A4 page even with up to 12 classes.
 */
export function buildGradeBookHtml(entries: GradeBookEntry[], config: GradeBookConfig): string {
  const first = entries[0]?.data.meta;
  const totalStudents = entries.reduce((acc, e) => acc + e.data.students.length, 0);
  const totalPages = 1 + entries.reduce((acc, e) => acc + Math.ceil(e.data.students.length / 30), 0);

  // Compact the classes table rows when there are many classes (keeps 12 on one page).
  const dense = entries.length > 8;
  const rowPad = dense ? 4 : 6;

  const classRows = entries
    .map((e, i) => {
      const m = e.data.meta;
      const bg = i % 2 !== 0 ? "background:#EEF3F8;" : "";
      return `
      <tr style="${bg}">
        <td style="padding:${rowPad}px 0;text-align:center;">${i + 1}</td>
        <td style="padding:${rowPad}px 0;text-align:center;font-weight:700;color:#1A3055;">${m.className || e.filename}</td>
        <td style="padding:${rowPad}px 0;text-align:center;" class="rtl">${m.level || "-"}</td>
        <td style="padding:${rowPad}px 0;text-align:center;">${e.data.students.length}</td>
      </tr>`;
    })
    .join("");

  const classSections = entries
    .map((e) => {
      const m = e.data.meta;
      return `
    <div class="gb-class">
      ${officialHeaderHtml(m)}
      ${bannerHtml()}
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

  /* ── Cover ── */
  .gb-cover { display: flex; flex-direction: column; min-height: 297mm; }
  .ministry { display: flex; align-items: center; justify-content: space-between;
    padding: 10px 28px; border-bottom: 1px solid #AABDCC; }
  .ministry .side { width: 200px; text-align: center; line-height: 1.4; }
  .ministry .ar-b { font-size: 9px; font-weight: 700; color: #1A3055; }
  .ministry .ar { font-size: 8.5px; color: #3D5A6E; }
  .ministry .emblem { width: 48px; height: 48px; }

  .hero { background: #1A3055; padding: 22px 40px 18px; text-align: center; }
  .hero .logo { width: 54px; height: 54px; border-radius: 27px; background: #C8960C;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;
    font-size: 24px; font-weight: 900; color: #FFFFFF; }
  .hero .t-ar { font-size: 30px; font-weight: 900; color: #FFFFFF; }
  .hero .t-fr { font-size: 13px; font-weight: 700; color: #F5E6C0; margin-top: 3px; letter-spacing: 1px; }
  .hero .t-sub { font-size: 8.5px; color: #7BAFD4; margin-top: 3px; }
  .gold-bar { height: 5px; background: #C8960C; }

  .cover-body { padding: 16px 28px; flex: 1; }
  .info-panel { display: flex; border: 1.5px solid #8FA8BB; border-radius: 5px;
    margin-bottom: 14px; overflow: hidden; }
  .info-panel .blk { flex: 1; padding: 9px 8px; text-align: center; border-left: 1px solid #AABDCC; }
  .info-panel .blk:first-child { border-left: none; }
  .info-panel .lbl { font-size: 8.5px; font-weight: 700; color: #2E6DA4; margin-bottom: 2px; }
  .info-panel .val { font-size: 11px; font-weight: 900; color: #0D1117; }

  .stats { display: flex; gap: 8px; margin-bottom: 16px; }
  .stats .box { flex: 1; background: #EEF3F8; border: 1px solid #AABDCC; border-radius: 5px;
    padding: 9px 0; text-align: center; }
  .stats .num { font-size: 19px; font-weight: 900; color: #1A3055; }
  .stats .lbl { font-size: 8.5px; font-weight: 700; color: #3D5A6E; margin-top: 1px; }

  .sec-title { font-size: 11px; font-weight: 900; color: #1A3055; margin-bottom: 5px; }
  .sec-line { height: 2px; background: #1A3055; margin-bottom: 8px; }

  table.cover-tbl { width: 100%; border-collapse: collapse; }
  table.cover-tbl thead th { background: #1A3055; color: #FFFFFF; font-size: 9px; font-weight: 900;
    padding: 7px 0; text-align: center; }
  table.cover-tbl tbody td { font-size: 9.5px; border-bottom: 0.75px solid #AABDCC; }
  table.cover-tbl .rtl { direction: rtl; }

  .cover-foot { margin-top: auto; background: #1A3055; padding: 11px 28px;
    display: flex; justify-content: space-between; align-items: center; }
  .cover-foot .t { font-size: 8.5px; color: #7BAFD4; }
  .cover-foot .b { font-size: 9px; font-weight: 700; color: #F5E6C0; }

  /* ── Class sheets ── */
  .gb-class { page: sheet; page-break-before: always; }
  ${SHEET_CSS}
</style>
</head>
<body>

  <div class="gb-cover">
    <div class="ministry">
      <div class="side">
        <div class="ar-b">المملكة المغربية</div>
        <div class="ar">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
        ${first?.academy ? `<div class="ar">${first.academy}</div>` : ""}
      </div>
      <div class="emblem">${ATOM_SVG}</div>
      <div class="side">
        <div class="ar-b">Royaume du Maroc</div>
        <div class="ar">Ministère de l'Éducation Nationale</div>
        ${first?.school ? `<div class="ar-b">${first.school}</div>` : ""}
      </div>
    </div>

    <div class="hero">
      <div class="logo">م</div>
      <div class="t-ar">دفتر التنقيط</div>
      <div class="t-fr">CARNET DE NOTES</div>
      <div class="t-sub">Contrôle Continu — Activités Intégrées</div>
    </div>
    <div class="gold-bar"></div>

    <div class="cover-body">
      <div class="info-panel">
        <div class="blk"><div class="lbl">الأستاذ / الأستاذة</div><div class="val">${config.prof || "-"}</div></div>
        <div class="blk"><div class="lbl">المادة الدراسية</div><div class="val">${first?.subject || "-"}</div></div>
        <div class="blk"><div class="lbl">السنة الدراسية</div><div class="val">${config.annee || "-"}</div></div>
        <div class="blk"><div class="lbl">الدورة</div><div class="val">${first?.term || "-"}</div></div>
      </div>

      <div class="stats">
        <div class="box"><div class="num">${entries.length}</div><div class="lbl">قسم</div></div>
        <div class="box"><div class="num">${totalStudents}</div><div class="lbl">تلميذ</div></div>
        <div class="box"><div class="num">${totalPages}</div><div class="lbl">صفحة</div></div>
        <div class="box"><div class="num">${first?.year || config.annee || "-"}</div><div class="lbl">السنة</div></div>
      </div>

      <div class="sec-title">قائمة الأقسام</div>
      <div class="sec-line"></div>
      <table class="cover-tbl">
        <thead><tr><th style="width:10%">#</th><th>القسم</th><th>المستوى</th><th>عدد التلاميذ</th></tr></thead>
        <tbody>${classRows}</tbody>
      </table>
    </div>

    <div class="cover-foot">
      <div class="t">adat-aloustadh.ma</div>
      <div class="b">${config.annee || ""}</div>
      <div class="t">${entries.length} أقسام — ${totalStudents} تلميذ</div>
    </div>
  </div>

  ${classSections}

</body>
</html>`;
}
