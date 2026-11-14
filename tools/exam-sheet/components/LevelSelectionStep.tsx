"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

type Props = {
  onSelectLevel: (levelId: string) => void;
};

const LEVELS = [
  { id: "1ac", code: "1AC", label: "الأولى إعدادي", sub: "1ère année collège" },
  { id: "2ac", code: "2AC", label: "الثانية إعدادي", sub: "2ème année collège" },
  { id: "3ac", code: "3AC", label: "الثالثة إعدادي", sub: "3ème année collège" },
] as const;

export function LevelSelectionStep({ onSelectLevel }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section dir="rtl" style={pageStyle}>

      {/* ── Nav ── */}
      <nav style={navStyle}>
        <div style={navInnerStyle}>
          <Link href="/" style={backLinkStyle}>← الرئيسية</Link>
          <span style={navTitleStyle}>جذاذة الفرض المحروس</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={heroPatternStyle} />
        <div style={heroContentStyle}>
          <div style={heroBadgeStyle}>الفيزياء والكيمياء — المنهج المغربي</div>
          <h1 style={h1Style}>اختر المستوى الدراسي</h1>
          <p style={heroDescStyle}>حدد المستوى للبدء في إعداد جذاذة الفرض المحروس</p>
          <div style={goldLineStyle} />
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={bodyStyle}>
        <div style={gridStyle}>
          {LEVELS.map(({ id, code, label, sub }) => {
            const active = hovered === id;
            return (
              <button
                key={id}
                type="button"
                style={{
                  ...cardStyle,
                  ...(active ? cardHoverStyle : {}),
                }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectLevel(id)}
              >
                <div style={{ ...cardGoldBar, opacity: active ? 1 : 0.7 }} />

                <div style={cardBodyStyle}>
                  <span style={{ ...codeBadgeStyle, ...(active ? codeBadgeActiveStyle : {}) }}>{code}</span>
                  <div style={cardTitleStyle}>{label}</div>
                  <div style={cardSubStyle}>{sub}</div>
                </div>

                <div style={{ ...cardFootStyle, ...(active ? cardFootActiveStyle : {}) }}>
                  <span>اختيار</span>
                  <span style={{ transition: "transform 200ms", transform: active ? "translateX(-4px)" : "none" }}>←</span>
                </div>
              </button>
            );
          })}
        </div>

        <p style={footerStyle}>مخصص للتعليم الإعدادي — المملكة المغربية 🇲🇦</p>
      </div>
    </section>
  );
}

/* ── Colors ── */
const NAVY = "#1A3055";
const NAVY_DEEP = "#0F1E35";
const GOLD = "#C8960C";
const GOLD_LIGHT = "#FEF3C7";

/* ── Styles ── */

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  fontFamily: "Cairo, system-ui, sans-serif",
};

const navStyle: CSSProperties = {
  position: "sticky", top: 0, zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(16px)",
  borderBottom: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};
const navInnerStyle: CSSProperties = {
  maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const backLinkStyle: CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none",
};
const navTitleStyle: CSSProperties = {
  fontSize: 14, fontWeight: 900, color: NAVY,
};

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
const heroBadgeStyle: CSSProperties = {
  display: "inline-block", fontSize: 12, fontWeight: 700,
  color: GOLD, backgroundColor: "rgba(200,150,12,0.1)",
  border: "1px solid rgba(200,150,12,0.25)",
  borderRadius: 999, padding: "5px 18px", marginBottom: 24,
};
const h1Style: CSSProperties = {
  fontSize: 44, fontWeight: 900, color: "#FFFFFF",
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
  display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20, maxWidth: 800, margin: "0 auto",
};

const cardStyle: CSSProperties = {
  position: "relative", backgroundColor: "#fff",
  border: "1.5px solid #E2E8F0", borderRadius: 16,
  overflow: "hidden", cursor: "pointer",
  display: "flex", flexDirection: "column",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  transition: "transform 250ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 250ms ease, border-color 250ms ease",
  textAlign: "right", padding: 0,
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
  padding: "24px 20px 16px", flex: 1,
  display: "flex", flexDirection: "column", gap: 8,
};
const codeBadgeStyle: CSSProperties = {
  display: "inline-block", alignSelf: "flex-start",
  fontSize: 12, fontWeight: 900, letterSpacing: "0.08em",
  color: NAVY, backgroundColor: "#F1F5F9",
  border: "1.5px solid #E2E8F0", borderRadius: 8,
  padding: "4px 12px", transition: "all 200ms",
};
const codeBadgeActiveStyle: CSSProperties = {
  backgroundColor: NAVY, color: GOLD, borderColor: NAVY,
};
const cardTitleStyle: CSSProperties = {
  fontSize: 22, fontWeight: 900, color: NAVY, lineHeight: 1.3,
};
const cardSubStyle: CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#94A3B8",
};
const cardFootStyle: CSSProperties = {
  padding: "12px 20px", borderTop: "1px solid #F1F5F9",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  fontSize: 12, fontWeight: 800, color: "#94A3B8",
  transition: "color 200ms",
};
const cardFootActiveStyle: CSSProperties = {
  color: GOLD,
};
const footerStyle: CSSProperties = {
  textAlign: "center", fontSize: 12, color: "#94A3B8",
  marginTop: 32, fontWeight: 600,
};
