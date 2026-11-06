"use client";

import { useState, type CSSProperties } from "react";
import { ExamTrack } from "../types/exam-sheet-draft";
import Link from "next/link";

const NAVY = "#1A3055";
const NAVY_DEEP = "#0F1E35";
const GOLD = "#C8960C";

const LEVEL_LABELS: Record<string, string> = {
  "1ac": "الأولى إعدادي",
  "2ac": "الثانية إعدادي",
  "3ac": "الثالثة إعدادي",
};

type Props = {
  selectedLevelId: string;
  onSelectTrack: (track: ExamTrack) => void;
  onBack: () => void;
};

export function TrackSelectionStep({ selectedLevelId, onSelectTrack, onBack }: Props) {
  const [hovered, setHovered] = useState<ExamTrack | null>(null);
  const levelLabel = LEVEL_LABELS[selectedLevelId] || selectedLevelId;

  return (
    <section dir="rtl" style={pageStyle}>

      {/* ── Nav ── */}
      <nav style={navStyle}>
        <div style={navInnerStyle}>
          <button type="button" style={backBtnStyle} onClick={onBack}>← تغيير المستوى</button>
          <span style={navTitleStyle}>جذاذة الفرض المحروس</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={heroPatternStyle} />
        <div style={heroContentStyle}>
          <div style={levelBadgeStyle}>{levelLabel}</div>
          <h1 style={h1Style}>اختر المسار الدراسي</h1>
          <p style={heroDescStyle}>الوثيقة تُنشأ بلغة ومحتوى المسار الذي تختاره</p>
          <div style={goldLineStyle} />
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={bodyStyle}>
        <div style={gridStyle}>

          {/* المسار العام */}
          <button
            type="button"
            style={{ ...cardStyle, ...(hovered === "general" ? cardHoverStyle : {}) }}
            onMouseEnter={() => setHovered("general")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectTrack("general")}
          >
            <div style={{ ...cardGoldBar, opacity: hovered === "general" ? 1 : 0.7 }} />
            <div style={cardBodyStyle}>
              <span style={{ fontSize: 36, marginBottom: 8 }}>📘</span>
              <span style={tagStyle}>المسار الرسمي</span>
              <div style={cardTitleStyle}>المسار العام</div>
              <div style={cardDescStyle}>الوثيقة باللغة العربية — مطابقة للمنهج الرسمي</div>
            </div>
            <div style={{ ...cardFootStyle, ...(hovered === "general" ? cardFootActiveStyle : {}) }}>
              <span>الدخول</span>
              <span>←</span>
            </div>
          </button>

          {/* المسار الدولي */}
          <button
            type="button"
            style={{ ...cardDarkStyle, ...(hovered === "international" ? cardDarkHoverStyle : {}) }}
            onMouseEnter={() => setHovered("international")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectTrack("international")}
          >
            <div style={{ height: 4, background: "linear-gradient(90deg, #3B82F6, #60A5FA)", opacity: hovered === "international" ? 1 : 0.7, transition: "opacity 200ms" }} />
            <div style={cardBodyStyle}>
              <span style={{ fontSize: 36, marginBottom: 8 }}>📗</span>
              <span style={tagDarkStyle}>Filière Internationale</span>
              <div style={{ ...cardTitleStyle, color: "#fff" }}>المسار الدولي</div>
              <div style={{ ...cardDescStyle, color: "rgba(255,255,255,0.6)" }}>Document en français — conforme au programme officiel</div>
            </div>
            <div style={cardFootDarkStyle}>
              <span>Accéder</span>
              <span>→</span>
            </div>
          </button>

        </div>
      </div>
    </section>
  );
}

/* ── Styles ── */

const pageStyle: CSSProperties = {
  minHeight: "100vh", backgroundColor: "#F8FAFC",
  fontFamily: "Cairo, system-ui, sans-serif",
};

const navStyle: CSSProperties = {
  position: "sticky", top: 0, zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
  borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};
const navInnerStyle: CSSProperties = {
  maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const backBtnStyle: CSSProperties = {
  fontSize: 13, fontWeight: 700, color: GOLD,
  backgroundColor: "transparent", border: `1.5px solid ${GOLD}`,
  borderRadius: 10, padding: "7px 16px", cursor: "pointer",
  fontFamily: "Cairo, sans-serif",
};
const navTitleStyle: CSSProperties = { fontSize: 14, fontWeight: 900, color: NAVY };

const heroStyle: CSSProperties = {
  position: "relative", overflow: "hidden",
  background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 50%, #243F63 100%)`,
  paddingTop: 80, paddingBottom: 100,
};
const heroPatternStyle: CSSProperties = {
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};
const heroContentStyle: CSSProperties = {
  position: "relative", zIndex: 1, textAlign: "center",
  maxWidth: 600, margin: "0 auto", padding: "0 24px",
};
const levelBadgeStyle: CSSProperties = {
  display: "inline-block", fontSize: 13, fontWeight: 900,
  color: NAVY, backgroundColor: "rgba(255,255,255,0.92)",
  borderRadius: 999, padding: "6px 20px", marginBottom: 24,
};
const h1Style: CSSProperties = {
  fontSize: 44, fontWeight: 900, color: "#fff",
  lineHeight: 1.2, margin: "0 0 12px",
};
const heroDescStyle: CSSProperties = {
  fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 20px",
};
const goldLineStyle: CSSProperties = {
  width: 50, height: 3, background: GOLD, margin: "0 auto", borderRadius: 2,
};

const bodyStyle: CSSProperties = {
  padding: "0 24px 64px", marginTop: -36, position: "relative", zIndex: 2,
};
const gridStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
  gap: 20, maxWidth: 700, margin: "0 auto",
};

const cardStyle: CSSProperties = {
  position: "relative", backgroundColor: "#fff",
  border: "1.5px solid #E2E8F0", borderRadius: 16, overflow: "hidden",
  cursor: "pointer", display: "flex", flexDirection: "column",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "right", padding: 0,
  transition: "transform 250ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 250ms ease, border-color 250ms ease",
};
const cardHoverStyle: CSSProperties = {
  transform: "translateY(-8px)",
  boxShadow: `0 20px 40px rgba(26,48,85,0.15), 0 0 0 2px ${GOLD}`,
  borderColor: GOLD,
};
const cardGoldBar: CSSProperties = {
  height: 4, background: `linear-gradient(90deg, ${GOLD}, #D4A017)`,
  transition: "opacity 200ms",
};
const cardBodyStyle: CSSProperties = {
  padding: "24px 24px 16px", flex: 1, display: "flex",
  flexDirection: "column", gap: 4, position: "relative", zIndex: 1,
};
const tagStyle: CSSProperties = {
  display: "inline-block", alignSelf: "flex-start",
  fontSize: 11, fontWeight: 800, color: NAVY,
  backgroundColor: "#F1F5F9", border: "1.5px solid #E2E8F0",
  borderRadius: 8, padding: "3px 10px", marginBottom: 4,
};
const cardTitleStyle: CSSProperties = {
  fontSize: 24, fontWeight: 900, color: NAVY, lineHeight: 1.3,
};
const cardDescStyle: CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "#64748B", lineHeight: 1.6,
};
const cardFootStyle: CSSProperties = {
  padding: "12px 24px", borderTop: "1px solid #F1F5F9",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  fontSize: 13, fontWeight: 800, color: "#94A3B8", transition: "color 200ms",
};
const cardFootActiveStyle: CSSProperties = { color: GOLD };

const cardDarkStyle: CSSProperties = {
  ...cardStyle,
  background: `linear-gradient(145deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)`,
  border: "1.5px solid #243F63",
  boxShadow: "0 4px 16px rgba(15,30,53,0.25)",
};
const cardDarkHoverStyle: CSSProperties = {
  transform: "translateY(-8px)",
  boxShadow: "0 20px 40px rgba(15,30,53,0.35), 0 0 0 2px #3B82F6",
  borderColor: "#3B82F6",
};
const tagDarkStyle: CSSProperties = {
  ...tagStyle,
  color: "#60A5FA", backgroundColor: "rgba(59,130,246,0.12)",
  border: "1.5px solid rgba(59,130,246,0.25)",
};
const cardFootDarkStyle: CSSProperties = {
  ...cardFootStyle,
  borderTopColor: "rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.4)",
  flexDirection: "row-reverse",
  textAlign: "left",
};
