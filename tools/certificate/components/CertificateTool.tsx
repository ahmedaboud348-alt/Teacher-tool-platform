"use client";

import { useState } from "react";
import type { CertificateType, CertificateData } from "../types";
import { CERTIFICATE_LABELS } from "../types";
import Link from "next/link";

const AMBER = "#B45309";
const AMBER_LIGHT = "#FFFBEB";
const NAVY = "#1A3055";

const TYPES: { id: CertificateType; icon: string }[] = [
  { id: "excellence", icon: "🏆" },
  { id: "encouragement", icon: "⭐" },
  { id: "merit", icon: "🎖️" },
];

export default function CertificateTool() {
  const [studentName, setStudentName] = useState("");
  const [type, setType] = useState<CertificateType>("excellence");
  const [teacherName, setTeacherName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [level, setLevel] = useState("الأولى إعدادي");
  const [year, setYear] = useState("2026-2027");
  const [date, setDate] = useState("");
  const [exporting, setExporting] = useState(false);

  async function handleDownload() {
    if (!studentName.trim()) return;
    setExporting(true);
    try {
      const data: CertificateData = { studentName, type, teacherName, schoolName, level, year, date };
      const res = await fetch("/api/unit-plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "certificate", payload: data }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `شهادة_${CERTIFICATE_LABELS[type].title}_${studentName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={wrapStyle}>

      {/* نوع الشهادة */}
      <section style={cardStyle}>
        <h2 style={secTitle}><span>🎓</span> نوع الشهادة</h2>
        <div style={typeGridStyle}>
          {TYPES.map(t => {
            const active = type === t.id;
            const labels = CERTIFICATE_LABELS[t.id];
            return (
              <button key={t.id} onClick={() => setType(t.id)}
                style={{ ...typeCardStyle, ...(active ? typeCardActiveStyle : {}) }}>
                <span style={{ fontSize: 32 }}>{t.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: active ? "#fff" : NAVY }}>{labels.title}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: active ? "rgba(255,255,255,0.7)" : "#94A3B8" }}>{labels.subtitle}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* معلومات التلميذ */}
      <section style={cardStyle}>
        <h2 style={secTitle}><span>👤</span> معلومات التلميذ</h2>
        <div style={fieldStyle}>
          <label style={lblStyle}>اسم التلميذ(ة) الكامل</label>
          <input style={inpLargeStyle} value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="الاسم الكامل كما سيظهر في الشهادة" />
        </div>
        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>المستوى</label>
            <select style={inpStyle} value={level} onChange={e => setLevel(e.target.value)}>
              <option>الأولى إعدادي</option>
              <option>الثانية إعدادي</option>
              <option>الثالثة إعدادي</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>التاريخ</label>
            <input style={inpStyle} value={date} onChange={e => setDate(e.target.value)} placeholder="مثال: 2026/01/15" />
          </div>
        </div>
      </section>

      {/* معلومات الأستاذ */}
      <section style={cardStyle}>
        <h2 style={secTitle}><span>🏫</span> معلومات الأستاذ والمؤسسة</h2>
        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>اسم الأستاذ(ة)</label>
            <input style={inpStyle} value={teacherName} onChange={e => setTeacherName(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>المؤسسة</label>
            <input style={inpStyle} value={schoolName} onChange={e => setSchoolName(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>السنة الدراسية</label>
            <input style={inpStyle} value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>
      </section>

      {/* تحميل */}
      <button onClick={handleDownload} disabled={!studentName.trim() || exporting}
        style={{ ...dlBtnStyle, opacity: studentName.trim() && !exporting ? 1 : 0.5, cursor: studentName.trim() && !exporting ? "pointer" : "not-allowed" }}>
        {exporting ? "جارٍ الإنشاء..." : "⬇  تحميل الشهادة PDF"}
      </button>
    </div>
  );
}

/* ── Styles ── */
const wrapStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16 };
const cardStyle: React.CSSProperties = { backgroundColor: "#fff", borderRadius: 20, padding: "22px 24px", borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };
const secTitle: React.CSSProperties = { fontSize: 16, fontWeight: 900, color: NAVY, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 };

const typeGridStyle: React.CSSProperties = { display: "flex", gap: 12 };
const typeCardStyle: React.CSSProperties = {
  flex: 1, padding: "20px 16px", borderRadius: 16,
  borderWidth: 2, borderStyle: "solid", borderColor: "#E2E8F0",
  backgroundColor: "#FAFBFC", cursor: "pointer", fontFamily: "Cairo, sans-serif",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
};
const typeCardActiveStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${NAVY}, #243F63)`,
  borderColor: NAVY, color: "#fff",
  boxShadow: "0 8px 24px rgba(26,48,85,0.25)",
  transform: "translateY(-4px)",
};

const fieldStyle: React.CSSProperties = { marginBottom: 14 };
const rowStyle: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const lblStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 };
const inpStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, borderWidth: 1.5, borderStyle: "solid", borderColor: "#E2E8F0", fontSize: 14, fontFamily: "Cairo, sans-serif", fontWeight: 600, color: "#0F172A", outline: "none", backgroundColor: "#FAFBFC" };
const inpLargeStyle: React.CSSProperties = { ...inpStyle, fontSize: 18, fontWeight: 800, padding: "14px 18px", textAlign: "center" };

const dlBtnStyle: React.CSSProperties = {
  width: "100%", padding: "16px", borderRadius: 14, border: "none",
  background: `linear-gradient(135deg, #B45309, #D97706)`,
  color: "#fff", fontSize: 16, fontWeight: 900,
  fontFamily: "Cairo, sans-serif",
  boxShadow: "0 6px 20px rgba(180,83,9,0.3)",
  transition: "all 250ms",
};
