"use client";

import { useState } from "react";
import type { PhysicsChemistryLevelId, SubjectTrack } from "@/lib/subjects/physics-chemistry/types";
import { getUnitsForLevel, levelLabel, type UnitDefinition } from "@/lib/subjects/physics-chemistry/unit-catalog";
import { ac1GeneralLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/general/1ac";
import { ac2GeneralLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/general/2ac";
import { ac3GeneralLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/general/3ac";
import { ac1InternationalLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/international/1ac";
import { ac2InternationalLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/international/2ac";
import { ac3InternationalLessons } from "@/lib/subjects/physics-chemistry/lesson-catalog/college/international/3ac";
import type { PhysicsChemistryLessonReference } from "@/lib/subjects/physics-chemistry/types";

const C1 = "#1E3A5F";
const C2 = "#2563EB";
const C3 = "#3B82F6";
const NAVY = "#1A3055";
const GOLD = "#C8960C";

const ALL_LESSONS: PhysicsChemistryLessonReference[] = [
  ...ac1GeneralLessons,
  ...ac2GeneralLessons,
  ...ac3GeneralLessons,
  ...ac1InternationalLessons,
  ...ac2InternationalLessons,
  ...ac3InternationalLessons,
];

function getLessonsForUnit(unit: UnitDefinition): PhysicsChemistryLessonReference[] {
  return unit.lessonIds.map(id => ALL_LESSONS.find(l => l.id === id)).filter((l): l is PhysicsChemistryLessonReference => l != null);
}

const LEVELS: PhysicsChemistryLevelId[] = ["1ac", "2ac", "3ac"];

export default function UnitPlanTool() {
  const [prof, setProf] = useState("");
  const [school, setSchool] = useState("");
  const [year, setYear] = useState("2025-2026");
  const [track, setTrack] = useState<SubjectTrack>("general");
  const [levelId, setLevelId] = useState<PhysicsChemistryLevelId>("1ac");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const units = getUnitsForLevel(levelId, track);
  const unit = units.find(u => u.id === selectedUnit) ?? null;
  const levelText = levelLabel(levelId, track);
  const lessons = unit ? getLessonsForUnit(unit) : [];
  const totalHours = lessons.reduce((s, l) => s + l.defaultDurationHours, 0);

  async function handleDownload() {
    if (!unit) return;
    setExporting(true);
    try {
      const res = await fetch("/api/unit-plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "unit-plan",
          payload: { prof, school, year, levelId, unit, lessons, totalHours, track },
        }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `تخطيط_مرحلي_${unit.domainLabel}_${levelText}_${year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={wrapStyle}>

      {/* ── معلومات الأستاذ ── */}
      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>
          <span style={cardIconStyle}>👤</span>
          معلومات الأستاذ
        </h2>
        <div style={fieldsRowStyle}>
          <Field label="الأستاذ(ة)" value={prof} onChange={setProf} />
          <Field label="المؤسسة" value={school} onChange={setSchool} />
          <Field label="السنة الدراسية" value={year} onChange={setYear} />
        </div>
      </section>

      {/* ── المسلك / اللغة ── */}
      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>
          <span style={cardIconStyle}>🌐</span>
          المسلك ولغة الوثيقة
        </h2>
        <div style={choiceGridStyle}>
          {([["general", "المسلك العام (عربية)"], ["international", "المسلك الدولي (Français)"]] as const).map(([tk, label]) => {
            const active = track === tk;
            return (
              <button key={tk} onClick={() => { setTrack(tk); setSelectedUnit(null); }}
                style={{ ...choiceBtnStyle, ...(active ? choiceBtnActiveStyle : {}) }}>
                <span style={{ ...choiceCheckStyle, opacity: active ? 1 : 0 }}>✓</span>
                <span style={choiceLabelStyle}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── المستوى ── */}
      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>
          <span style={cardIconStyle}>🎓</span>
          المستوى الدراسي
        </h2>
        <div style={choiceGridStyle}>
          {LEVELS.map(lvl => {
            const active = levelId === lvl;
            return (
              <button key={lvl} onClick={() => { setLevelId(lvl); setSelectedUnit(null); }}
                style={{ ...choiceBtnStyle, ...(active ? choiceBtnActiveStyle : {}) }}>
                <span style={{ ...choiceCheckStyle, opacity: active ? 1 : 0 }}>✓</span>
                <span style={choiceLabelStyle}>{levelLabel(lvl, track)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── الوحدة ── */}
      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>
          <span style={cardIconStyle}>📂</span>
          اختر الوحدة
        </h2>
        <div style={choiceGridStyle}>
          {units.map(u => {
            const active = selectedUnit === u.id;
            return (
              <button key={u.id} onClick={() => setSelectedUnit(u.id)}
                style={{ ...unitCardStyle, ...(active ? unitCardActiveStyle : {}) }}>
                <span style={{ ...unitCardIconWrap, ...(active ? { backgroundColor: "rgba(255,255,255,0.2)" } : {}) }}>
                  {u.domain === "matter" ? "🧪" : u.domain === "electricity" ? "⚡" : u.domain === "light" ? "💡" : "⚙️"}
                </span>
                <span style={{ fontWeight: 900, fontSize: 15 }}>{u.domainLabel}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Preview ── */}
      {unit && (
        <section style={pvDocStyle}>
          {/* PDF-like header */}
          <div style={pvHeaderStyle}>
            <div style={pvEyebrowStyle}>المملكة المغربية — وزارة التربية الوطنية</div>
            <div style={pvTitleStyle}>التوزيع المرحلي — وحدة {unit.domainLabel}</div>
            <div style={pvSubStyle}>{levelText} — {year}</div>
            <div style={pvGoldLineStyle} />
          </div>

          {/* Meta table */}
          <table style={pvMetaTableStyle}>
            <tbody>
              <tr>
                <td style={pvMlStyle}>الأستاذ(ة)</td><td style={pvMvStyle}>{prof || "—"}</td>
                <td style={pvMlStyle}>المؤسسة</td><td style={pvMvStyle}>{school || "—"}</td>
              </tr>
              <tr>
                <td style={pvMlStyle}>المستوى</td><td style={pvMvStyle}>{levelText}</td>
                <td style={pvMlStyle}>المدة</td><td style={pvMvStyle}>{totalHours} ساعة</td>
              </tr>
            </tbody>
          </table>

          {/* Info sections */}
          <PvInfoBox label="الكفاية المستهدفة"><p style={pvInfoTextStyle}>{unit.competency}</p></PvInfoBox>
          <PvInfoBox label="القيم المدمجة">
            {unit.values.map((v, i) => <div key={i} style={pvBulletStyle}><span style={pvDotStyle}>●</span>{v}</div>)}
          </PvInfoBox>
          <PvInfoBox label="المكتسبات السابقة">
            {unit.prerequisites.map((p, i) => <div key={i} style={pvBulletStyle}><span style={pvDotStyle}>●</span>{p}</div>)}
          </PvInfoBox>

          {/* Lessons table */}
          <div style={pvSecHeadStyle}><div style={pvSecBarStyle} /><span>جدول الدروس والأهداف</span></div>
          <div style={pvTableWrapStyle}>
            <table style={pvTableStyle}>
              <thead>
                <tr>
                  <th style={pvThStyle}>الدروس</th>
                  <th style={{ ...pvThStyle, width: 50 }}>المدة</th>
                  <th style={pvThStyle}>الأهداف التعلمية</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l, i) => (
                  <tr key={l.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...pvTdStyle, fontWeight: 900, color: NAVY, minWidth: 100, fontSize: 13 }}>{l.label}</td>
                    <td style={{ ...pvTdStyle, textAlign: "center", fontWeight: 800 }}>{l.defaultDurationHours} س</td>
                    <td style={pvTdStyle}>
                      {l.defaultObjectives.map((o, j) => <div key={j} style={pvObjStyle}><span style={pvDotStyle}>●</span>{o}</div>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download */}
          <div style={pvFooterStyle}>
            <button onClick={handleDownload} disabled={exporting}
              style={{ ...pvDlBtnStyle, opacity: exporting ? 0.6 : 1, cursor: exporting ? "not-allowed" : "pointer" }}>
              {exporting ? "جارٍ الإنشاء..." : "⬇ تحميل PDF"}
            </button>
          </div>
        </section>
      )}

      {/* ── Download button (bottom) ── */}
      {unit && (
        <button onClick={handleDownload} disabled={exporting}
          style={{ ...dlBtnFullStyle, opacity: exporting ? 0.6 : 1, cursor: exporting ? "not-allowed" : "pointer" }}>
          {exporting ? "جارٍ الإنشاء..." : "⬇  تحميل PDF التخطيط المرحلي"}
        </button>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ flex: 1, minWidth: 160 }}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function PvInfoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={pvInfoBoxStyle}>
      <div style={pvInfoLabelStyle}>{label}</div>
      <div style={pvInfoContentStyle}>{children}</div>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={infoBoxStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoContentStyle}>{text}</div>
    </div>
  );
}

function InfoList({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={infoBoxStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoContentStyle}>
        {items.map((item, i) => (
          <div key={i} style={infoItemStyle}><span style={infoDotStyle}>●</span>{item}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Styles ── */

const wrapStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 16,
};

/* Cards */
const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff", borderRadius: 20, padding: "24px 28px",
  borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};
const cardTitleStyle: React.CSSProperties = {
  fontSize: 16, fontWeight: 900, color: C1, margin: "0 0 16px",
  display: "flex", alignItems: "center", gap: 10,
};
const cardIconStyle: React.CSSProperties = {
  fontSize: 20,
};

/* Choice buttons (levels) */
const choiceGridStyle: React.CSSProperties = {
  display: "flex", gap: 12, flexWrap: "wrap",
};
const choiceBtnStyle: React.CSSProperties = {
  flex: 1, minWidth: 140, padding: "16px 20px", borderRadius: 14,
  borderWidth: 2, borderStyle: "solid", borderColor: "#E2E8F0",
  backgroundColor: "#FAFBFC", cursor: "pointer", fontFamily: "Cairo, sans-serif",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
};
const choiceBtnActiveStyle: React.CSSProperties = {
  borderColor: C2, backgroundColor: "#EFF6FF",
  boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
  transform: "translateY(-2px)",
};
const choiceCheckStyle: React.CSSProperties = {
  width: 22, height: 22, borderRadius: 22,
  backgroundColor: C2, color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 12, fontWeight: 900, flexShrink: 0,
  transition: "opacity 200ms",
};
const choiceLabelStyle: React.CSSProperties = {
  fontSize: 15, fontWeight: 800, color: C1,
};

/* Unit cards */
const unitCardStyle: React.CSSProperties = {
  flex: 1, minWidth: 130, padding: "20px 16px", borderRadius: 16,
  borderWidth: 2, borderStyle: "solid", borderColor: "#E2E8F0",
  backgroundColor: "#FAFBFC", cursor: "pointer", fontFamily: "Cairo, sans-serif",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
  color: C1,
};
const unitCardActiveStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C1} 0%, #2D4A7A 100%)`,
  borderColor: C1, color: "#fff",
  boxShadow: "0 8px 24px rgba(30,58,95,0.25)",
  transform: "translateY(-4px)",
};
const unitCardIconWrap: React.CSSProperties = {
  width: 48, height: 48, borderRadius: 14,
  backgroundColor: "#F1F5F9",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 24, transition: "background-color 200ms",
};

/* Fields */
const fieldsRowStyle: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 5,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  borderWidth: 1.5, borderStyle: "solid", borderColor: "#E2E8F0",
  fontSize: 14, fontFamily: "Cairo, sans-serif", fontWeight: 600,
  color: "#0F172A", outline: "none", backgroundColor: "#FAFBFC",
  transition: "border-color 150ms",
};

/* Level/Unit buttons */
const btnRowStyle: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
const lvlBtnStyle: React.CSSProperties = {
  padding: "12px 32px", borderRadius: 12,
  borderWidth: 0, borderStyle: "none", borderColor: "transparent",
  backgroundColor: "#F1F5F9", fontSize: 14, fontWeight: 800,
  color: "#475569", cursor: "pointer", fontFamily: "Cairo, sans-serif",
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  position: "relative",
  overflow: "hidden",
};
const lvlBtnActiveStyle: React.CSSProperties = {
  backgroundColor: C1, color: "#fff",
  boxShadow: "0 6px 20px rgba(30,58,95,0.25)",
  transform: "translateY(-2px)",
};
const unitBtnStyle: React.CSSProperties = {
  padding: "14px 28px", borderRadius: 14,
  borderWidth: 0, borderStyle: "none", borderColor: "transparent",
  backgroundColor: "#F1F5F9", fontSize: 15, fontWeight: 900,
  color: "#475569", cursor: "pointer", fontFamily: "Cairo, sans-serif",
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  minWidth: 120,
};
const unitBtnActiveStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C2}, ${C3})`,
  color: "#fff",
  boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
  transform: "translateY(-2px)",
};

/* Preview card */
const previewCardStyle: React.CSSProperties = {
  backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
  borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};
const previewHeaderStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "20px 24px", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E2E8F0",
  backgroundColor: "#F8FAFC",
};
const previewTitleStyle: React.CSSProperties = { fontSize: 18, fontWeight: 900, color: C1, margin: 0 };
const previewSubStyle: React.CSSProperties = { fontSize: 12, color: "#64748B", margin: "4px 0 0" };

/* Info sections */
const infoBoxStyle: React.CSSProperties = {
  display: "flex", margin: "0 24px", paddingTop: 16, paddingBottom: 16,
  borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#F1F5F9",
};
const infoLabelStyle: React.CSSProperties = {
  width: 110, flexShrink: 0, fontSize: 12, fontWeight: 900, color: C2, paddingTop: 2,
};
const infoContentStyle: React.CSSProperties = {
  flex: 1, fontSize: 13, fontWeight: 600, color: "#334155", lineHeight: 1.7,
};
const infoItemStyle: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 2,
};
const infoDotStyle: React.CSSProperties = { color: C3, fontSize: 7, marginTop: 7, flexShrink: 0 };

/* Table */
const tableHeadingStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 900, color: C1, margin: "16px 24px 10px",
  paddingBottom: 6, borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: C1,
  display: "flex", alignItems: "center", gap: 8,
};
const tableWrapStyle: React.CSSProperties = {
  margin: "0 24px 24px", borderWidth: 1.5, borderStyle: "solid", borderColor: "#D1D5DB",
  borderRadius: 8, overflow: "hidden",
};
const tableStyle: React.CSSProperties = {
  width: "100%", borderCollapse: "collapse", fontSize: 13,
};
const thStyle: React.CSSProperties = {
  backgroundColor: C1, color: "#fff", fontWeight: 800, fontSize: 12,
  padding: "10px 12px", textAlign: "right",
  borderWidth: 1, borderStyle: "solid", borderColor: "#0F172A",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", color: "#334155",
  borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0",
  verticalAlign: "top", fontSize: 12, lineHeight: 1.6,
};
const objListStyle: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const objItemStyle: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 2,
};
const objDotStyle: React.CSSProperties = { color: C3, fontSize: 7, marginTop: 6, flexShrink: 0 };

/* Download buttons */
const dlBtnStyle: React.CSSProperties = {
  padding: "12px 28px", borderRadius: 12, border: "none",
  background: `linear-gradient(135deg, ${C2}, ${C3})`,
  color: "#fff", fontSize: 14, fontWeight: 900,
  fontFamily: "Cairo, sans-serif",
  boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
};
const dlBtnFullStyle: React.CSSProperties = {
  ...dlBtnStyle, width: "100%", padding: "16px 0", fontSize: 16, borderRadius: 14,
};

/* ── Preview (PDF-like) ── */
const pvDocStyle: React.CSSProperties = {
  backgroundColor: "#fff", borderRadius: 4, overflow: "hidden",
  borderWidth: 1, borderStyle: "solid", borderColor: "#D1D5DB",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};
const pvHeaderStyle: React.CSSProperties = {
  textAlign: "center", padding: "24px 24px 16px",
  borderBottomWidth: 3, borderBottomStyle: "double", borderBottomColor: NAVY,
  margin: "0 24px",
};
const pvEyebrowStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: "#64748B", marginBottom: 6 };
const pvTitleStyle: React.CSSProperties = { fontSize: 20, fontWeight: 900, color: NAVY, lineHeight: 1.3, marginBottom: 4 };
const pvSubStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: GOLD };
const pvGoldLineStyle: React.CSSProperties = { width: 50, height: 3, background: GOLD, margin: "8px auto 0", borderRadius: 2 };

const pvMetaTableStyle: React.CSSProperties = {
  width: "calc(100% - 48px)", margin: "16px 24px", borderCollapse: "collapse",
  borderWidth: 2, borderStyle: "solid", borderColor: NAVY, fontSize: 11,
};
const pvMlStyle: React.CSSProperties = {
  background: NAVY, color: "#fff", fontWeight: 800, fontSize: 11,
  padding: "6px 10px", textAlign: "center", whiteSpace: "nowrap",
  borderWidth: 1, borderStyle: "solid", borderColor: "#D1D5DB", width: "12%",
};
const pvMvStyle: React.CSSProperties = {
  fontWeight: 700, color: "#1E293B", fontSize: 12, padding: "6px 10px",
  background: "#fff", borderWidth: 1, borderStyle: "solid", borderColor: "#D1D5DB", width: "38%",
};

const pvInfoBoxStyle: React.CSSProperties = {
  display: "flex", margin: "0 24px",
  borderWidth: 2, borderStyle: "solid", borderColor: NAVY,
  marginBottom: 8, overflow: "hidden",
};
const pvInfoLabelStyle: React.CSSProperties = {
  width: 110, flexShrink: 0, background: NAVY, color: "#fff",
  fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center",
  justifyContent: "center", textAlign: "center", padding: "8px 6px",
};
const pvInfoContentStyle: React.CSSProperties = {
  flex: 1, padding: "8px 12px", fontSize: 12, fontWeight: 700,
  color: "#1E293B", lineHeight: 1.7,
};
const pvInfoTextStyle: React.CSSProperties = { margin: 0 };
const pvBulletStyle: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 1,
};
const pvDotStyle: React.CSSProperties = { color: GOLD, fontSize: 7, marginTop: 6, flexShrink: 0 };

const pvSecHeadStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  margin: "12px 24px 8px", paddingBottom: 4,
  borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: NAVY,
  fontSize: 13, fontWeight: 900, color: NAVY,
};
const pvSecBarStyle: React.CSSProperties = {
  width: 4, height: 16, background: GOLD, borderRadius: 1, flexShrink: 0,
};
const pvTableWrapStyle: React.CSSProperties = {
  margin: "0 24px 16px",
  borderWidth: 2, borderStyle: "solid", borderColor: NAVY, overflow: "hidden",
};
const pvTableStyle: React.CSSProperties = {
  width: "100%", borderCollapse: "collapse", fontSize: 12,
};
const pvThStyle: React.CSSProperties = {
  background: NAVY, color: "#fff", fontWeight: 800, fontSize: 12,
  padding: "8px 10px", textAlign: "center",
  borderWidth: 1, borderStyle: "solid", borderColor: "#0F1E35",
};
const pvTdStyle: React.CSSProperties = {
  padding: "8px 10px", borderWidth: 1, borderStyle: "solid",
  borderColor: "#D1D5DB", verticalAlign: "top", fontSize: 12,
  fontWeight: 600, color: "#334155", lineHeight: 1.6,
};
const pvObjStyle: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 1,
};
const pvFooterStyle: React.CSSProperties = {
  padding: "16px 24px", borderTopWidth: 1, borderTopStyle: "solid",
  borderTopColor: "#E2E8F0", backgroundColor: "#F8FAFC",
  display: "flex", justifyContent: "center",
};
const pvDlBtnStyle: React.CSSProperties = {
  padding: "12px 40px", borderRadius: 10, border: "none",
  background: `linear-gradient(135deg, ${NAVY}, #243F63)`,
  color: "#fff", fontSize: 14, fontWeight: 900,
  fontFamily: "Cairo, sans-serif",
  boxShadow: "0 4px 16px rgba(26,48,85,0.25)",
  transition: "opacity 150ms",
};
