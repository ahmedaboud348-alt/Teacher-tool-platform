import type { ExamSheetDocumentModel } from "../../../../tools/exam-sheet/types/exam-sheet-document";

function fmt(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const r = Math.round(v * 100) / 100;
  return r.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function fmtAdj(v: number): string {
  return `${v > 0 ? "+" : ""}${fmt(v)}`;
}

const SITUATION_LABELS = ["الوضعية المشكلة", "Situation-problème"];

export function buildExamSheetHtml(doc: ExamSheetDocumentModel): string {
  const { meta, lessons, allocation, sections } = doc;
  const isRtl = meta.track === "general";
  const dir = isRtl ? "rtl" : "ltr";
  const termLabel = isRtl
    ? (meta.term === "second" ? "الدورة الثانية" : "الدورة الأولى")
    : (meta.term === "second" ? "2ème semestre" : "1er semestre");
  const dur = isRtl ? `${fmt(meta.examDurationHours)} ساعة` : `${fmt(meta.examDurationHours)} h`;
  const trackLabel = isRtl ? "المسار العام" : "Parcours International";
  const side = isRtl ? "right" : "left";

  const L = isRtl ? {
    eyebrow: "المملكة المغربية — وزارة التربية الوطنية",
    title: meta.title || "جذاذة الفرض المحروس",
    institution: "المؤسسة", teacher: "الأستاذ(ة)", subject: "المادة",
    level: "المستوى", term: "الدورة", duration: "مدة الإنجاز", total: "سلم التنقيط",
    track: "المسار",
    lessonsTitle: "الدروس المعنية بالفرض",
    durationPfx: "المدة:", objectives: "الأهداف التعلمية",
    noObj: "—",
    allocTitle: "جدول التخصيص",
    thLesson: "الدرس", thPct: "النسبة", thNote: "النقطة",
    tfTotal: "المجموع",
    skillsTitle: "توزيع النقط حسب المهارات",
    skillUnit: "ن",
  } : {
    eyebrow: "Royaume du Maroc — Ministère de l'Éducation Nationale",
    title: meta.title || "Fiche d'évaluation",
    institution: "Établissement", teacher: "Professeur(e)", subject: "Matière",
    level: "Niveau", term: "Session", duration: "Durée", total: "Barème",
    track: "Filière",
    lessonsTitle: "Leçons concernées",
    durationPfx: "Durée :", objectives: "Objectifs",
    noObj: "—",
    allocTitle: "Tableau de spécification",
    thLesson: "Leçon", thPct: "%", thNote: "Note",
    tfTotal: "Total",
    skillsTitle: "Répartition par compétence",
    skillUnit: "pts",
  };

  // ── Meta ──
  const metaHtml = `
    <table class="meta-table">
      <tr>
        <td class="ml">${L.institution}</td><td class="mv">${meta.institutionName || "—"}</td>
        <td class="ml">${L.subject}</td><td class="mv">${meta.subjectLabel || "—"}</td>
      </tr>
      <tr>
        <td class="ml">${L.teacher}</td><td class="mv">${meta.teacherName || "—"}</td>
        <td class="ml">${L.level}</td><td class="mv">${meta.levelLabel || "—"}</td>
      </tr>
      <tr>
        <td class="ml">${L.term}</td><td class="mv">${termLabel}</td>
        <td class="ml">${L.duration}</td><td class="mv">${dur}</td>
      </tr>
      <tr>
        <td class="ml">${L.track}</td><td class="mv">${trackLabel}</td>
        <td class="ml">${L.total}</td><td class="mv">${fmt(meta.totalPoints)} ${isRtl ? "نقطة" : "pts"}</td>
      </tr>
    </table>`;

  // ── Lessons ──
  const lessonsHtml = lessons.map((l, i) => {
    const objs = (l.objectives || []).filter(o => o.text);
    const objItems = objs.length > 0
      ? objs.map(o => `<li>${o.text}</li>`).join("")
      : `<li class="no-obj">${L.noObj}</li>`;
    return `
    <div class="lesson-row">
      <div class="lesson-num-col"><span class="lesson-num">${i + 1}</span></div>
      <div class="lesson-content">
        <div class="lesson-top">
          <span class="lesson-name">${l.label}</span>
          <span class="lesson-hours">${L.durationPfx} ${isRtl ? fmt(l.hours) + " س" : fmt(l.hours) + " h"}</span>
        </div>
        <div class="lesson-objs">
          <ul>${objItems}</ul>
        </div>
      </div>
    </div>`;
  }).join("");

  // ── Allocation table ──
  const cols = allocation.table.columns || [];
  const rows = allocation.table.rows || [];
  const foot = allocation.table.footer || { skillTotals: [], grandTotal: 0 };

  const thSkills = cols.map(c =>
    `<th>${c.skillLabel}<br><span class="th-pct">${fmt(c.percentage)}%</span></th>`
  ).join("");

  const tbody = rows.map((r, i) => {
    const cells = (r.skillCells || []).map((cell, ci) => {
      const isSit = SITUATION_LABELS.includes(cols[ci]?.skillLabel ?? "");
      if (isSit) return `<td class="al-center">—</td>`;
      const adjH = cell.adjustment !== 0
        ? `<div class="adj ${cell.adjustment > 0 ? "pos" : "neg"}">${fmtAdj(cell.adjustment)}</div>` : "";
      return `<td class="al-center"><div class="cell-stack"><span class="cell-val">${fmt(cell.value)}</span>${adjH}</div></td>`;
    }).join("");
    const rowAdj = r.lessonAdjustment !== 0
      ? `<div class="adj ${r.lessonAdjustment > 0 ? "pos" : "neg"}">${fmtAdj(r.lessonAdjustment)}</div>` : "";
    return `<tr class="${i % 2 === 0 ? "even" : "odd"}">
      <td class="al-lesson">${r.lessonLabel}</td>
      <td class="al-center">${fmt(r.lessonPercentage)}%</td>
      <td class="al-center"><div class="cell-stack"><span class="cell-val">${fmt(r.lessonPoints)}</span>${rowAdj}</div></td>
      ${cells}
    </tr>`;
  }).join("");

  const tfCells = (foot.skillTotals || []).map(v => `<td class="al-foot">${fmt(v)}</td>`).join("");

  // ── Skills cards ──
  const skillsHtml = (allocation.skillTotals || []).map(sk =>
    `<div class="sk-card">
      <div class="sk-name">${sk.skillLabel}</div>
      <div class="sk-num">${fmt(sk.value)}</div>
      <div class="sk-meta">${fmt(sk.percentage)}%</div>
    </div>`
  ).join("");

  // ── Section rendering ──
  const sectionMap: Record<string, string> = {
    metadata: `<div class="section">${metaHtml}</div>`,
    lessons: `
      <div class="section">
        <h2 class="sec-title"><span class="sec-bar"></span>${L.lessonsTitle}</h2>
        <div class="lessons-list">${lessonsHtml}</div>
      </div>`,
    "allocation-table": `
      <div class="section avoid-break">
        <h2 class="sec-title"><span class="sec-bar"></span>${L.allocTitle}</h2>
        <table class="alloc">
          <thead><tr>
            <th class="al-th-lesson">${L.thLesson}</th>
            <th>${L.thPct}</th>
            <th>${L.thNote}</th>
            ${thSkills}
          </tr></thead>
          <tbody>${tbody}</tbody>
          <tfoot><tr>
            <td class="al-foot al-foot-lesson">${L.tfTotal}</td>
            <td class="al-foot">100%</td>
            <td class="al-foot">${fmt(foot.grandTotal)}</td>
            ${tfCells}
          </tr></tfoot>
        </table>
      </div>`,
    "skills-summary": `
      <div class="section avoid-break">
        <h2 class="sec-title"><span class="sec-bar"></span>${L.skillsTitle}</h2>
        <div class="sk-row">${skillsHtml}</div>
      </div>`,
  };

  const content = sections.filter(s => sectionMap[s]).map(s => sectionMap[s]).join("");

  return `<!DOCTYPE html>
<html lang="${isRtl ? "ar" : "fr"}" dir="${dir}">
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
    --bg-alt: #F3F4F6;
    --white: #FFFFFF;
    --green: #15803D;
    --red: #B91C1C;
  }

  @page { margin: 14mm 12mm 18mm 12mm; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Cairo', 'Segoe UI', sans-serif;
    font-size: 12px;
    color: var(--text);
    direction: ${dir};
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

  /* ═══ META TABLE ═══ */
  .meta-table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid var(--navy);
    font-size: 11px;
  }
  .meta-table td {
    padding: 6px 10px;
    border: 1.5px solid var(--border);
  }
  .ml {
    background: var(--navy);
    color: var(--white);
    font-weight: 800;
    font-size: 11px;
    width: 12%;
    text-align: center;
    white-space: nowrap;
  }
  .mv {
    font-weight: 700;
    color: var(--text);
    width: 38%;
    background: var(--white);
    font-size: 12px;
  }

  /* ═══ LESSONS ═══ */
  .lessons-list { display: flex; flex-direction: column; gap: 6px; }

  .lesson-row {
    display: flex;
    border: 2px solid var(--border);
    overflow: hidden;
    page-break-inside: avoid;
  }
  .lesson-num-col {
    width: 36px;
    background: var(--navy);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .lesson-num {
    font-size: 16px;
    font-weight: 900;
    color: var(--gold);
  }
  .lesson-content { flex: 1; }

  .lesson-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--bg-alt);
    border-bottom: 1.5px solid var(--border-light);
  }
  .lesson-name { font-size: 12px; font-weight: 900; color: var(--navy); }
  .lesson-hours { font-size: 11px; font-weight: 700; color: var(--text-muted); }

  .lesson-objs { padding: 6px 12px; }
  .lesson-objs ul {
    list-style: none; padding: 0; margin: 0;
  }
  .lesson-objs ul li {
    font-size: 11px; font-weight: 600; color: var(--text-light);
    line-height: 1.7; position: relative;
    padding-${side}: 14px;
    margin-bottom: 1px;
  }
  .lesson-objs ul li::before {
    content: "";
    width: 5px; height: 5px;
    background: var(--gold);
    border-radius: 50%;
    position: absolute;
    ${side}: 0;
    top: 8px;
  }
  .no-obj { color: var(--text-muted) !important; font-style: italic; }
  .no-obj::before { display: none !important; }

  /* ═══ ALLOCATION TABLE ═══ */
  .alloc {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid var(--navy);
    font-size: 11px;
  }
  .alloc thead tr { background: var(--navy); }
  .alloc th {
    color: var(--white);
    font-weight: 800;
    font-size: 11px;
    padding: 10px 6px;
    text-align: center;
    border: 1.5px solid var(--navy-deep);
  }
  .al-th-lesson {
    text-align: ${side};
    padding-${side}: 10px;
    min-width: 100px;
  }
  .th-pct {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: var(--gold-light);
    margin-top: 2px;
  }
  .alloc td {
    padding: 8px 6px;
    text-align: center;
    border: 1.5px solid var(--border);
    font-weight: 700;
    font-size: 12px;
  }
  .al-lesson {
    text-align: ${side};
    font-weight: 900;
    padding-${side}: 10px;
    color: var(--navy);
    font-size: 12px;
  }
  .al-center { text-align: center; }
  .even { background: var(--white); }
  .odd { background: var(--bg-alt); }

  /* Cell with adjustment below */
  .cell-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .cell-val { font-size: 12px; font-weight: 700; }
  .adj { font-size: 10px; font-weight: 800; }
  .pos { color: var(--green); }
  .neg { color: var(--red); }

  .al-foot {
    background: var(--navy) !important;
    color: var(--white) !important;
    font-weight: 900 !important;
    font-size: 13px !important;
    border-color: var(--navy-deep) !important;
    text-align: center;
    padding: 10px 6px;
  }
  .al-foot-lesson {
    text-align: ${side};
    padding-${side}: 10px;
  }

  /* ═══ SKILLS ═══ */
  .sk-row { display: flex; gap: 8px; }
  .sk-card {
    flex: 1;
    border: 2px solid var(--border);
    padding: 10px 12px;
    text-align: center;
    background: var(--bg-alt);
    border-top: 4px solid var(--gold);
  }
  .sk-name { font-size: 11px; font-weight: 900; color: var(--navy); margin-bottom: 4px; }
  .sk-num { font-size: 24px; font-weight: 900; color: var(--navy); line-height: 1; }
  .sk-meta { font-size: 10px; font-weight: 700; color: var(--text-muted); margin-top: 3px; }

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

  .avoid-break { page-break-inside: avoid; }

  /* ═══ PRINT: B&W safe ═══ */
  @media print {
    .ml { background: var(--navy) !important; color: var(--white) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .alloc thead tr { background: var(--navy) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .alloc th { color: var(--white) !important; }
    .al-foot { background: var(--navy) !important; color: var(--white) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .lesson-num-col { background: var(--navy) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .lesson-num { color: var(--white) !important; }
    .sk-card { border-top-color: var(--gold) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bg-alt, .odd, .even { background: var(--white) !important; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="doc-header">
  <div class="doc-eyebrow">${L.eyebrow}</div>
  <div class="doc-title">${L.title}</div>
  <div class="doc-subtitle">${meta.levelLabel || "—"} — ${trackLabel} — ${termLabel}</div>
  <div class="title-line"></div>
</div>

<!-- CONTENT -->
${content}

<!-- FOOTER -->
<div class="doc-footer">
  ${meta.institutionName || "—"} — ${meta.teacherName || "—"} — ${meta.subjectLabel} — ${meta.levelLabel || "—"} — ${termLabel}
</div>

</body>
</html>`;
}
