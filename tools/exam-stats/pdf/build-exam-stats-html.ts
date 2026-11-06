import type { ExamData, ExamStats } from "../types";
import { computeExamStats } from "../stats";

function fmt(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "") || "0";
}

const BAND_COLORS = ["#B91C1C", "#C2570A", "#1D6FBF", "#047857"];

export function buildExamStatsHtml(data: ExamData, examIndices: (0 | 1 | 2)[]): string {
  const { meta } = data;
  const statsList = examIndices.map(i => computeExamStats(data.students, i));

  const pagesHtml = statsList.map(stats => {
    const maxBand = Math.max(...stats.bands.map(b => b.count), 1);

    const bandRowsHtml = stats.bands.map((b, i) => {
      const pct = stats.presentCount > 0 ? ((b.count / stats.presentCount) * 100).toFixed(1) : "0.0";
      return `<tr class="${i % 2 === 0 ? "even" : "odd"}">
        <td style="font-weight:900; color:${BAND_COLORS[i]}">${b.label}</td>
        <td>${b.range}</td>
        <td style="font-weight:900; color:#1A3055">${b.count}</td>
        <td>${pct}%</td>
      </tr>`;
    }).join("");

    const barsHtml = stats.bands.map((b, i) => {
      const pct = (b.count / maxBand) * 100;
      return `<div class="bar-row">
        <span class="bar-label">${b.range}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${BAND_COLORS[i]}"></div></div>
        <span class="bar-count">${b.count}</span>
      </div>`;
    }).join("");

    return `
    <div class="exam-page">
      <!-- Header -->
      <div class="doc-header">
        <div class="doc-eyebrow">المملكة المغربية — وزارة التربية الوطنية</div>
        <div class="doc-title">احصائيات الامتحان — ${stats.examLabel}</div>
        <div class="doc-subtitle">${meta.level} — ${meta.className} — ${meta.subject}${meta.term ? " — " + meta.term : ""} — ${meta.year}</div>
        <div class="title-line"></div>
      </div>

      <!-- Meta -->
      <div class="meta-strip">
        <div class="meta-item"><span class="meta-label">الأستاذ(ة)</span><span class="meta-value">${meta.teacher || "—"}</span></div>
        <div class="meta-sep">|</div>
        <div class="meta-item"><span class="meta-label">المؤسسة</span><span class="meta-value">${meta.school || "—"}</span></div>
        <div class="meta-sep">|</div>
        <div class="meta-item"><span class="meta-label">المستوى</span><span class="meta-value">${meta.level || "—"}</span></div>
        <div class="meta-sep">|</div>
        <div class="meta-item"><span class="meta-label">القسم</span><span class="meta-value">${meta.className || "—"}</span></div>
      </div>

      <!-- KPIs Row 1 -->
      <div class="kpi-row">
        <div class="kpi" style="border-top-color:#1A3055">
          <div class="kpi-label">المعدل العام</div>
          <div class="kpi-value" style="color:#1A3055">${fmt(stats.avg)}</div>
          <div class="kpi-unit">/20</div>
        </div>
        <div class="kpi" style="border-top-color:#6D28D9">
          <div class="kpi-label">الوسيط</div>
          <div class="kpi-value" style="color:#6D28D9">${fmt(stats.median)}</div>
          <div class="kpi-unit">/20</div>
        </div>
        <div class="kpi" style="border-top-color:#0369A1">
          <div class="kpi-label">الانحراف المعياري</div>
          <div class="kpi-value" style="color:#0369A1">${fmt(stats.stdDev)}</div>
        </div>
      </div>

      <!-- KPIs Row 2 -->
      <div class="kpi-row">
        <div class="kpi" style="border-top-color:#047857">
          <div class="kpi-label">أعلى نقطة</div>
          <div class="kpi-value" style="color:#047857">${fmt(stats.max)}</div>
          <div class="kpi-unit">/20</div>
        </div>
        <div class="kpi" style="border-top-color:#B91C1C">
          <div class="kpi-label">أدنى نقطة</div>
          <div class="kpi-value" style="color:#B91C1C">${fmt(stats.min)}</div>
          <div class="kpi-unit">/20</div>
        </div>
        <div class="kpi" style="border-top-color:#B45309">
          <div class="kpi-label">عدد الغائبين</div>
          <div class="kpi-value" style="color:#B45309">${stats.absentCount}</div>
          <div class="kpi-unit">/ ${stats.total} تلميذ</div>
        </div>
      </div>

      <!-- Pass rate -->
      <div class="pass-box">
        <span class="pass-pct">${stats.passRate.toFixed(1)}%</span>
        <span class="pass-label">حصلوا بالمعدل فما فوق</span>
        <span class="pass-detail">${stats.passingCount} / ${stats.presentCount} تلميذ</span>
      </div>

      <!-- Distribution -->
      <div class="sec-title"><span class="sec-bar"></span>توزيع النقط على الشرائح</div>

      <div class="dist-row">
        <table class="dist-table">
          <thead><tr><th>الشريحة</th><th>النطاق</th><th>العدد</th><th>النسبة</th></tr></thead>
          <tbody>${bandRowsHtml}</tbody>
        </table>

        <div class="bars-wrap">${barsHtml}</div>
      </div>
    </div>`;
  }).join('<div class="page-break"></div>');

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
    --text: #1E293B;
    --text-muted: #4B5563;
    --border: #9CA3AF;
    --bg-alt: #F8FAFC;
  }

  @page { margin: 12mm 12mm 14mm 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Cairo', sans-serif;
    font-size: 12px;
    color: var(--text);
    direction: rtl;
    line-height: 1.5;
  }

  .page-break { page-break-before: always; }

  /* Header */
  .doc-header {
    text-align: center;
    border-bottom: 3px double var(--navy);
    padding-bottom: 10px;
    margin-bottom: 12px;
  }
  .doc-eyebrow { font-size: 10px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; }
  .doc-title { font-size: 20px; font-weight: 900; color: var(--navy); margin-bottom: 3px; }
  .doc-subtitle { font-size: 11px; font-weight: 700; color: var(--gold); }
  .title-line { width: 50px; height: 3px; background: var(--gold); margin: 6px auto 0; border-radius: 2px; }

  /* Meta strip */
  .meta-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: var(--navy);
    padding: 10px 20px;
    margin-bottom: 12px;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .meta-label {
    font-size: 10px;
    font-weight: 700;
    color: #94A3B8;
  }
  .meta-value {
    font-size: 12px;
    font-weight: 900;
    color: #fff;
  }
  .meta-sep {
    color: #64748B;
    font-size: 16px;
    font-weight: 300;
  }

  /* KPIs */
  .kpi-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .kpi {
    flex: 1; background: #fff; border: 1.5px solid #D1D5DB;
    border-top: 4px solid; padding: 8px 10px; text-align: center;
  }
  .kpi-label { font-size: 10px; font-weight: 800; color: var(--text-muted); margin-bottom: 2px; }
  .kpi-value { font-size: 22px; font-weight: 900; line-height: 1; }
  .kpi-unit { font-size: 10px; font-weight: 700; color: var(--text-muted); }

  /* Pass rate */
  .pass-box {
    background: var(--navy-deep); padding: 10px 16px;
    display: flex; align-items: center; margin-bottom: 12px;
  }
  .pass-pct { font-size: 26px; font-weight: 900; color: #6EE7B7; }
  .pass-label { flex: 1; font-size: 12px; font-weight: 900; color: #CBD5E1; text-align: center; }
  .pass-detail { font-size: 14px; font-weight: 900; color: #7DD3FC; }

  /* Section title */
  .sec-title {
    font-size: 12px; font-weight: 900; color: var(--navy);
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px; padding-bottom: 4px;
    border-bottom: 2px solid var(--navy);
  }
  .sec-bar { width: 4px; height: 14px; background: var(--gold); border-radius: 1px; }

  /* Distribution */
  .dist-row { display: flex; flex-direction: column; gap: 12px; }

  .dist-table {
    flex: 1; border-collapse: collapse; border: 2px solid var(--navy); font-size: 11px;
  }
  .dist-table th {
    background: var(--navy); color: #fff; font-weight: 800;
    padding: 6px 8px; text-align: center; border: 1px solid var(--navy-deep);
  }
  .dist-table td {
    padding: 6px 8px; text-align: center; border: 1px solid #D1D5DB; font-weight: 700;
  }
  .even { background: #fff; }
  .odd { background: var(--bg-alt); }

  /* Bars */
  .bars-wrap { display: flex; flex-direction: column; justify-content: center; gap: 12px; }
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { font-size: 11px; font-weight: 800; color: var(--text-muted); width: 60px; text-align: left; }
  .bar-track { flex: 1; height: 26px; background: #E5E7EB; border: 1.5px solid #D1D5DB; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .bar-count { font-size: 13px; font-weight: 900; color: var(--text); width: 26px; text-align: right; }

  /* Footer */
  .doc-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    padding: 4px 12mm; border-top: 2px solid var(--navy);
    font-size: 10px; font-weight: 700; color: var(--text-muted); text-align: center;
  }

  @media print {
    .ml, .dist-table th, .pass-box {
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
  }
</style>
</head>
<body>

${pagesHtml}

<div class="doc-footer">
  ${meta.teacher || "—"} — ${meta.school || "—"} — ${meta.subject} — ${meta.year}
</div>

</body>
</html>`;
}
