"use client";

import { useRef, useState } from "react";
import type { ExamData, ExamStats } from "../types";
import { parseExamFile } from "../parser";
import { computeExamStats } from "../stats";

const ACCENT = "#0284C7";
const ACCENT_LIGHT = "#E0F2FE";
const ACCENT_BORDER = "#BAE6FD";

type ExamIndex = 0 | 1 | 2;
const EXAM_OPTIONS: { idx: ExamIndex; label: string }[] = [
  { idx: 0, label: "الفرض الأول" },
  { idx: 1, label: "الفرض الثاني" },
  { idx: 2, label: "الفرض الثالث" },
];

export default function ExamStatsTool() {
  const [data, setData] = useState<ExamData | null>(null);
  const [selected, setSelected] = useState<Set<ExamIndex>>(new Set([0]));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseExamFile(file);
      if (parsed.students.length === 0) throw new Error("لم يُعثر على تلاميذ في الملف");
      setData(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ في قراءة الملف");
    } finally {
      setLoading(false);
    }
  }

  function toggleExam(idx: ExamIndex) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        if (next.size > 1) next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  const [exporting, setExporting] = useState(false);

  async function handleDownload() {
    if (!data) return;
    setExporting(true);
    try {
      const { downloadExamStatsPdf } = await import("../pdf/render-exam-stats-pdf");
      await downloadExamStatsPdf(data, [...selected].sort() as (0 | 1 | 2)[]);
    } finally {
      setExporting(false);
    }
  }

  const statsList: ExamStats[] = data
    ? ([...selected] as ExamIndex[]).sort().map(idx => computeExamStats(data.students, idx))
    : [];

  return (
    <div style={wrapStyle}>
      {/* Upload */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>رفع ملف مسار</h2>
        <div
          style={dropZoneStyle}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <span style={{ fontSize: 36 }}>📊</span>
          <p style={dropTextStyle}>
            {loading ? "جارٍ القراءة..." : data ? `✓ ${data.meta.className} — ${data.students.length} تلميذ` : "انقر أو اسحب ملف Excel من مسار"}
          </p>
          {data && <p style={dropSubStyle}>{data.meta.level} · {data.meta.subject} · {data.meta.year}</p>}
        </div>
        {error && <p style={errorStyle}>{error}</p>}
      </section>

      {/* Exam selector */}
      {data && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>اختر الفرض</h2>
          <div style={examRowStyle}>
            {EXAM_OPTIONS.map(({ idx, label }) => {
              const active = selected.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleExam(idx)}
                  style={{
                    ...examBtnStyle,
                    backgroundColor: active ? ACCENT : "#fff",
                    color: active ? "#fff" : "#334155",
                    borderColor: active ? ACCENT : "#CBD5E1",
                    fontWeight: active ? 800 : 600,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Download button */}
      {data && (
        <button
          onClick={handleDownload}
          disabled={exporting}
          style={{
            ...dlBtnStyle,
            backgroundColor: exporting ? "#CBD5E1" : ACCENT,
            cursor: exporting ? "not-allowed" : "pointer",
          }}
        >
          {exporting ? "جارٍ الإنشاء..." : "⬇  تحميل PDF"}
        </button>
      )}

      {/* Stats */}
      {statsList.map(stats => (
        <StatsCard key={stats.examLabel} stats={stats} />
      ))}
    </div>
  );
}

function StatsCard({ stats }: { stats: ExamStats }) {
  const maxBandCount = Math.max(...stats.bands.map(b => b.count), 1);

  return (
    <section style={cardSectionStyle}>
      <h2 style={cardTitleStyle}>{stats.examLabel}</h2>
      <p style={cardSubStyle}>{stats.presentCount} تلميذ حاضر · {stats.absentCount} غائب</p>

      {/* KPI row 1 */}
      <div style={kpiRowStyle}>
        <KPI label="المعدل العام" value={fmt(stats.avg)} unit="/20" color={ACCENT} />
        <KPI label="الوسيط" value={fmt(stats.median)} unit="/20" color="#7C3AED" />
        <KPI label="الانحراف المعياري" value={fmt(stats.stdDev)} unit="" color="#0891B2" />
      </div>

      {/* KPI row 2 */}
      <div style={kpiRowStyle}>
        <KPI label="أعلى نقطة" value={fmt(stats.max)} unit="/20" color="#059669" />
        <KPI label="أدنى نقطة" value={fmt(stats.min)} unit="/20" color="#DC2626" />
        <KPI label="عدد الغائبين" value={String(stats.absentCount)} unit={`/ ${stats.total}`} color="#92400E" />
      </div>

      {/* Pass rate highlight */}
      <div style={passRateBoxStyle}>
        <div>
          <span style={passNumStyle}>{stats.passingCount}</span>
          <span style={passTotalStyle}> / {stats.presentCount} تلميذ</span>
        </div>
        <div style={passLabelStyle}>حصلوا على المعدل</div>
        <div style={passPercentStyle}>{stats.passRate.toFixed(1)}%</div>
      </div>

      {/* Distribution */}
      <h3 style={distTitleStyle}>توزيع النقط على الشرائح</h3>
      <div style={distGridStyle}>
        {/* Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>الشريحة</th>
              <th style={thStyle}>النطاق</th>
              <th style={thStyle}>العدد</th>
              <th style={thStyle}>النسبة</th>
            </tr>
          </thead>
          <tbody>
            {stats.bands.map((b, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                <td style={tdStyle}>{b.label}</td>
                <td style={{ ...tdStyle, direction: "ltr", fontFamily: "monospace" }}>{b.range}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: ACCENT }}>{b.count}</td>
                <td style={tdStyle}>
                  {stats.presentCount > 0 ? ((b.count / stats.presentCount) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bar chart */}
        <div style={chartStyle}>
          {stats.bands.map((b, i) => {
            const pct = (b.count / maxBandCount) * 100;
            const colors = [BAND_COLORS[0], BAND_COLORS[1], BAND_COLORS[2], BAND_COLORS[3]];
            return (
              <div key={i} style={barRowStyle}>
                <span style={barLabelStyle}>{b.range}</span>
                <div style={barTrackStyle}>
                  <div style={{ ...barFillStyle, width: `${pct}%`, backgroundColor: colors[i] }} />
                </div>
                <span style={barCountStyle}>{b.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function KPI({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div style={{ ...kpiBoxStyle, borderTopColor: color }}>
      <span style={kpiLabelStyle}>{label}</span>
      <div style={kpiValRowStyle}>
        <span style={{ ...kpiNumStyle, color }}>{value}</span>
        {unit && <span style={kpiUnitStyle}>{unit}</span>}
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "") || "0";
}

const BAND_COLORS = ["#EF4444", "#F97316", "#3B82F6", "#10B981"];

/* ── Styles ── */
const wrapStyle: React.CSSProperties = {
  maxWidth: 860, margin: "0 auto", padding: "0 0 48px", display: "flex", flexDirection: "column", gap: 24,
};
const sectionStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };
const sectionTitleStyle: React.CSSProperties = {
  fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0,
};
const dropZoneStyle: React.CSSProperties = {
  border: `2px dashed ${ACCENT_BORDER}`, borderRadius: 16,
  backgroundColor: ACCENT_LIGHT, padding: "32px 24px",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  cursor: "pointer", transition: "background 150ms",
};
const dropTextStyle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 };
const dropSubStyle: React.CSSProperties = { fontSize: 12, color: "#64748B", margin: 0 };
const errorStyle: React.CSSProperties = {
  color: "#DC2626", fontSize: 13, fontWeight: 600,
  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
  borderRadius: 8, padding: "8px 14px",
};
const examRowStyle: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
const examBtnStyle: React.CSSProperties = {
  padding: "10px 24px", borderRadius: 10, border: "1.5px solid",
  fontSize: 14, cursor: "pointer", transition: "all 150ms",
  fontFamily: "Cairo, sans-serif",
};
const cardSectionStyle: React.CSSProperties = {
  backgroundColor: "#fff", borderRadius: 20,
  border: "1.5px solid #E2E8F0",
  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: 16,
  borderTop: `4px solid ${ACCENT}`,
};
const cardTitleStyle: React.CSSProperties = { fontSize: 20, fontWeight: 900, color: "#0F172A", margin: 0 };
const cardSubStyle: React.CSSProperties = { fontSize: 13, color: "#64748B", margin: 0, marginTop: -8 };
const kpiRowStyle: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const kpiBoxStyle: React.CSSProperties = {
  flex: 1, minWidth: 140,
  backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
  borderRadius: 12, borderTop: "3px solid",
  padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4,
};
const kpiLabelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#64748B" };
const kpiValRowStyle: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 4 };
const kpiNumStyle: React.CSSProperties = { fontSize: 26, fontWeight: 900, lineHeight: 1 };
const kpiUnitStyle: React.CSSProperties = { fontSize: 12, color: "#94A3B8", fontWeight: 600 };
const passRateBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A", borderRadius: 14,
  padding: "18px 24px",
  display: "flex", alignItems: "center", gap: 16,
};
const passNumStyle: React.CSSProperties = { fontSize: 32, fontWeight: 900, color: "#38BDF8" };
const passTotalStyle: React.CSSProperties = { fontSize: 14, color: "#94A3B8" };
const passLabelStyle: React.CSSProperties = { flex: 1, fontSize: 14, fontWeight: 700, color: "#CBD5E1" };
const passPercentStyle: React.CSSProperties = { fontSize: 36, fontWeight: 900, color: "#10B981" };
const distTitleStyle: React.CSSProperties = { fontSize: 14, fontWeight: 800, color: "#0F172A", margin: 0 };
const distGridStyle: React.CSSProperties = { display: "flex", gap: 20, flexWrap: "wrap" };
const tableStyle: React.CSSProperties = {
  flex: "0 0 auto", borderCollapse: "collapse", fontSize: 13, minWidth: 280,
};
const thStyle: React.CSSProperties = {
  backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 12,
  padding: "8px 14px", textAlign: "center",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 14px", textAlign: "center", color: "#334155",
  border: "1px solid #E2E8F0", fontWeight: 600,
};
const chartStyle: React.CSSProperties = { flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" };
const barRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
const barLabelStyle: React.CSSProperties = { fontSize: 11, color: "#64748B", width: 72, textAlign: "right", direction: "ltr", flexShrink: 0, fontFamily: "monospace" };
const barTrackStyle: React.CSSProperties = { flex: 1, height: 22, backgroundColor: "#F1F5F9", borderRadius: 6, overflow: "hidden" };
const barFillStyle: React.CSSProperties = { height: "100%", borderRadius: 6, transition: "width 600ms ease" };
const barCountStyle: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: "#0F172A", width: 24, textAlign: "left", flexShrink: 0 };
const dlBtnStyle: React.CSSProperties = {
  width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
  color: "#fff", fontSize: 15, fontWeight: 800,
  fontFamily: "Cairo, sans-serif", transition: "background 150ms",
};
