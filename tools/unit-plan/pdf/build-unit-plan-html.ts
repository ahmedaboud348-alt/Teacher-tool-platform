import type { PhysicsChemistryLevelId, PhysicsChemistryLessonReference } from "@/lib/subjects/physics-chemistry/types";
import type { UnitDefinition } from "@/lib/subjects/physics-chemistry/unit-catalog";
import { LEVEL_LABELS } from "@/lib/subjects/physics-chemistry/unit-catalog";

type Input = {
  prof: string;
  school: string;
  year: string;
  levelId: PhysicsChemistryLevelId;
  unit: UnitDefinition;
  lessons: PhysicsChemistryLessonReference[];
  totalHours: number;
};

export function buildUnitPlanHtml(input: Input): string {
  const { prof, school, year, levelId, unit, lessons, totalHours } = input;
  const level = LEVEL_LABELS[levelId];

  const valuesHtml = unit.values.map(v => `<li>${v}</li>`).join("\n");
  const prereqHtml = unit.prerequisites.map(p => `<li>${p}</li>`).join("\n");

  const lessonsRowsHtml = lessons.map((l, i) => {
    const objHtml = l.defaultObjectives.map(o => `<li>${o}</li>`).join("\n");
    const bg = i % 2 === 0 ? "#F8FAFC" : "#fff";
    return `
      <tr style="background:${bg}">
        <td class="td-lesson">${l.label}</td>
        <td class="td-hours">${l.defaultDurationHours} س</td>
        <td class="td-objectives"><ul>${objHtml}</ul></td>
      </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

  :root {
    --navy: #1A3055;
    --navy-deep: #0F1E35;
    --gold: #C8960C;
    --gold-light: #FEF3C7;
    --text: #1E293B;
    --text-light: #334155;
    --text-muted: #4B5563;
    --border: #9CA3AF;
    --border-light: #D1D5DB;
    --bg-alt: #F8FAFC;
    --white: #FFFFFF;
  }

  @page { margin: 14mm 12mm 18mm 12mm; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Cairo', 'Segoe UI', sans-serif;
    font-size: 12px;
    color: var(--text);
    direction: rtl;
    line-height: 1.55;
    background: var(--white);
    padding-bottom: 30px;
  }

  /* ═══ HEADER ═══ */
  .doc-header {
    text-align: center;
    border-bottom: 3px double var(--navy);
    padding-bottom: 12px;
    margin-bottom: 14px;
  }
  .doc-eyebrow {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .doc-title {
    font-size: 22px;
    font-weight: 900;
    color: var(--navy);
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .doc-subtitle {
    font-size: 11px;
    font-weight: 700;
    color: var(--gold);
  }
  .title-line {
    width: 60px;
    height: 3px;
    background: var(--gold);
    margin: 8px auto 0;
  }

  /* ═══ META TABLE ═══ */
  .meta-table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid var(--navy);
    font-size: 12px;
    margin-bottom: 14px;
  }
  .meta-table td {
    padding: 6px 10px;
    border: 1.5px solid var(--border);
  }
  .mt-label {
    background: var(--navy);
    color: var(--white);
    font-weight: 800;
    font-size: 11px;
    text-align: center;
    white-space: nowrap;
    width: 12%;
  }
  .mt-value {
    font-weight: 700;
    color: var(--text);
    font-size: 12px;
    background: var(--white);
    width: 38%;
  }

  /* ═══ SECTIONS ═══ */
  .section { margin-bottom: 14px; }

  .sec-title {
    font-size: 13px;
    font-weight: 900;
    color: var(--navy);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 2px solid var(--navy);
  }
  .sec-bar {
    width: 4px;
    height: 16px;
    background: var(--gold);
    border-radius: 1px;
    flex-shrink: 0;
  }

  /* ═══ INFO SECTIONS ═══ */
  .info-box {
    display: flex;
    flex-direction: row;
    border: 2px solid var(--navy);
    margin-bottom: 8px;
    overflow: hidden;
  }
  .info-label {
    width: 120px;
    flex-shrink: 0;
    background: var(--navy);
    color: var(--white);
    font-size: 12px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px 6px;
  }
  .info-content {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.7;
  }
  .info-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .info-content ul li {
    padding-right: 14px;
    position: relative;
    line-height: 1.7;
  }
  .info-content ul li::before {
    content: "";
    width: 5px;
    height: 5px;
    background: var(--gold);
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 8px;
  }

  /* ═══ LESSONS TABLE ═══ */
  .lessons-table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid var(--navy);
    font-size: 12px;
  }
  .lessons-table th {
    background: var(--navy);
    color: var(--white);
    font-weight: 900;
    font-size: 12px;
    padding: 10px 10px;
    text-align: center;
    border: 1.5px solid var(--navy-deep);
  }
  .td-lesson {
    font-weight: 900;
    text-align: center;
    width: 120px;
    padding: 8px 10px;
    border: 1.5px solid var(--border);
    vertical-align: top;
    color: var(--navy);
    font-size: 13px;
  }
  .td-hours {
    font-weight: 900;
    text-align: center;
    width: 50px;
    padding: 8px 10px;
    border: 1.5px solid var(--border);
    vertical-align: top;
  }
  .td-objectives {
    padding: 8px 12px;
    border: 1.5px solid var(--border);
    vertical-align: top;
    text-align: right;
  }
  .td-objectives ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .td-objectives ul li {
    line-height: 1.65;
    margin-bottom: 1px;
    padding-right: 14px;
    position: relative;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-light);
  }
  .td-objectives ul li::before {
    content: "";
    width: 5px;
    height: 5px;
    background: var(--gold);
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 7px;
  }
  .lessons-table tr {
    page-break-inside: avoid;
  }

  /* ═══ FOOTER ═══ */
  .doc-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 4px 12mm;
    border-top: 2px solid var(--navy);
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-align: center;
  }

  /* ═══ PRINT B&W ═══ */
  @media print {
    .mt-label, .info-label, .lessons-table th {
      background: var(--navy) !important;
      color: var(--white) !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="doc-header">
  <div class="doc-eyebrow">المملكة المغربية — وزارة التربية الوطنية</div>
  <div class="doc-title">التوزيع المرحلي — وحدة ${unit.domainLabel}</div>
  <div class="doc-subtitle">${level} — ${year}</div>
  <div class="title-line"></div>
</div>

<!-- META -->
<div class="section">
  <table class="meta-table">
    <tr>
      <td class="mt-label">الأستاذ(ة)</td>
      <td class="mt-value">${prof || "—"}</td>
      <td class="mt-label">المؤسسة</td>
      <td class="mt-value">${school || "—"}</td>
    </tr>
    <tr>
      <td class="mt-label">المستوى</td>
      <td class="mt-value">${level}</td>
      <td class="mt-label">المدة الإجمالية</td>
      <td class="mt-value">${totalHours} ساعة</td>
    </tr>
  </table>
</div>

<!-- COMPETENCY -->
<div class="section">
  <div class="info-box">
    <div class="info-label">الكفاية المستهدفة</div>
    <div class="info-content">${unit.competency}</div>
  </div>
</div>

<!-- VALUES -->
<div class="section">
  <div class="info-box">
    <div class="info-label">القيم المدمجة</div>
    <div class="info-content"><ul>${valuesHtml}</ul></div>
  </div>
</div>

<!-- PREREQUISITES -->
<div class="section">
  <div class="info-box">
    <div class="info-label">المكتسبات السابقة</div>
    <div class="info-content"><ul>${prereqHtml}</ul></div>
  </div>
</div>

<!-- LESSONS TABLE -->
<div class="section">
  <h2 class="sec-title"><span class="sec-bar"></span>جدول الدروس والأهداف</h2>
  <table class="lessons-table">
    <thead>
      <tr>
        <th>الدروس</th>
        <th>المدة</th>
        <th>الأهداف التعلمية</th>
      </tr>
    </thead>
    <tbody>
      ${lessonsRowsHtml}
    </tbody>
  </table>
</div>

<!-- FOOTER -->
<div class="doc-footer">
  ${prof} — ${school} — ${level} — ${year}
</div>

</body>
</html>`;
}
