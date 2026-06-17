"use client";

import { useState, type CSSProperties } from "react";
import { ds, getLevelLabel, ui } from "../ui/design-system";

type Props = {
  onSelectLevel: (levelId: string) => void;
};

const LEVELS = [
  { id: "1ac", code: "1AC", arabicNum: "١", label: "الأولى إعدادي" },
  { id: "2ac", code: "2AC", arabicNum: "٢", label: "الثانية إعدادي" },
  { id: "3ac", code: "3AC", arabicNum: "٣", label: "الثالثة إعدادي" },
] as const;

export function LevelSelectionStep({ onSelectLevel }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section dir="rtl" style={pageStyle}>

      {/* ── App Bar ── */}
      <nav style={appBarStyle}>
        <div style={appBarInnerStyle}>
          <div style={brandWrapStyle}>
            <div style={logoMarkStyle}>م</div>
            <div>
              <div style={brandNameStyle}>منصة الأدوات التربوية</div>
              <div style={brandSubStyle}>أدوات رقمية للأساتذة</div>
            </div>
          </div>
          <span style={versionPillStyle}>v1.0 · Beta</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={heroWrapStyle}>
        <div style={heroBgPatternStyle} />
        <div style={heroInnerStyle}>
          <div style={heroEyebrowStyle} className="hero-eyebrow">
            📋 &nbsp;جذاذة الفرض المحروس — فيزياء وكيمياء
          </div>
          <h1 style={heroTitleStyle} className="hero-title">
            اختر مستواك الدراسي
          </h1>
          <p style={heroDescStyle} className="hero-desc">
            أداة احترافية لبناء جذاذات الفروض المحروسة وفق المنهج الرسمي المغربي
          </p>
        </div>
        {/* Bottom curve */}
        <div style={heroCurveStyle} />
      </div>

      {/* ── Cards ── */}
      <div style={bodyStyle}>
        <div style={ui.pageFrame}>
          <div style={gridStyle}>
            {LEVELS.map(({ id, code, arabicNum, label }) => {
              const isHovered = hovered === id;
              return (
                <button
                  key={id}
                  type="button"
                  className="level-card"
                  style={{
                    ...cardStyle,
                    ...(isHovered ? cardHoveredStyle : {}),
                  }}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelectLevel(id)}
                >
                  {/* Accent top bar */}
                  <div style={{
                    ...cardTopBarStyle,
                    opacity: isHovered ? 1 : 0.85,
                  }} />

                  {/* Watermark */}
                  <div className="level-watermark" style={watermarkStyle}>
                    {arabicNum}
                  </div>

                  {/* Content */}
                  <div style={cardBodyStyle}>
                    <span style={{
                      ...codeBadgeStyle,
                      ...(isHovered ? codeBadgeHoveredStyle : {}),
                    }}>
                      {code}
                    </span>
                    <div style={cardLevelNameStyle}>{label}</div>
                  </div>

                  {/* Footer CTA */}
                  <div style={{
                    ...cardFooterStyle,
                    ...(isHovered ? cardFooterHoveredStyle : {}),
                  }}>
                    <span>اختيار هذا المستوى</span>
                    <span style={arrowStyle}>←</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p style={footerNoteStyle}>
            المنهج الرسمي للتعليم الإعدادي — المملكة المغربية
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Styles ── */

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: ds.colors.bgPage,
  fontFamily: "Cairo, system-ui, sans-serif",
};

const appBarStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(16px)",
  borderBottom: "1px solid rgba(124,58,237,0.10)",
  boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 4px 16px rgba(0,0,0,0.04)",
};

const appBarInnerStyle: CSSProperties = {
  maxWidth: ds.layout.maxWidth,
  margin: "0 auto",
  padding: "0 24px",
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const brandWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const logoMarkStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 900,
  fontSize: 18,
  boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
  flexShrink: 0,
};

const brandNameStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.2,
};

const brandSubStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: ds.colors.textMuted,
  lineHeight: 1,
};

const versionPillStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100,
  border: `1px solid ${ds.colors.primary200}`,
  borderRadius: 999,
  padding: "3px 10px",
};

/* Hero */
const heroWrapStyle: CSSProperties = {
  position: "relative",
  background: "linear-gradient(140deg, #3B0764 0%, #6D28D9 55%, #7C3AED 100%)",
  paddingTop: 72,
  paddingBottom: 120,
  paddingLeft: 24,
  paddingRight: 24,
  overflow: "hidden",
};

const heroBgPatternStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  pointerEvents: "none",
};

const heroInnerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: 700,
  margin: "0 auto",
  textAlign: "center",
};

const heroEyebrowStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 13,
  fontWeight: 700,
  color: "rgba(255,255,255,0.75)",
  backgroundColor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.20)",
  borderRadius: 999,
  padding: "6px 18px",
  marginBottom: 20,
  letterSpacing: "0.02em",
};

const heroTitleStyle: CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  color: "#FFFFFF",
  lineHeight: 1.15,
  margin: "0 0 16px",
  letterSpacing: "-0.01em",
};

const heroDescStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: "rgba(255,255,255,0.65)",
  lineHeight: 1.7,
  margin: 0,
};

const heroCurveStyle: CSSProperties = {
  position: "absolute",
  bottom: -2,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: ds.colors.bgPage,
  borderRadius: "60% 60% 0 0 / 100% 100% 0 0",
};

/* Body */
const bodyStyle: CSSProperties = {
  padding: "0 24px 64px",
  marginTop: -40,
  position: "relative",
  zIndex: 2,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 20,
  maxWidth: 860,
  margin: "0 auto",
};

/* Card */
const cardStyle: CSSProperties = {
  position: "relative",
  backgroundColor: "#FFFFFF",
  border: "1.5px solid rgba(124,58,237,0.10)",
  borderRadius: 20,
  boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
  padding: 0,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 180ms cubic-bezier(0.4,0,0.2,1), box-shadow 180ms cubic-bezier(0.4,0,0.2,1), border-color 180ms ease",
  textAlign: "right",
  boxSizing: "border-box",
};

const cardHoveredStyle: CSSProperties = {
  transform: "translateY(-6px)",
  boxShadow: "0 20px 48px rgba(124,58,237,0.18), 0 0 0 2px rgba(124,58,237,0.35)",
  borderColor: "rgba(124,58,237,0.35)",
};

const cardTopBarStyle: CSSProperties = {
  height: 4,
  background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)",
  flexShrink: 0,
  transition: "opacity 180ms ease",
};

const watermarkStyle: CSSProperties = {
  position: "absolute",
  bottom: -10,
  insetInlineEnd: 12,
  fontSize: 120,
  fontWeight: 900,
  color: ds.colors.primary500,
  opacity: 0.06,
  lineHeight: 1,
  pointerEvents: "none",
  userSelect: "none",
  fontFamily: "serif",
};

const cardBodyStyle: CSSProperties = {
  padding: "20px 20px 12px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  position: "relative",
  zIndex: 1,
};

const codeBadgeStyle: CSSProperties = {
  display: "inline-block",
  alignSelf: "flex-start",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.08em",
  color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100,
  border: `1px solid ${ds.colors.primary200}`,
  borderRadius: 8,
  padding: "3px 10px",
  transition: "background-color 180ms ease, color 180ms ease",
};

const codeBadgeHoveredStyle: CSSProperties = {
  backgroundColor: ds.colors.primary500,
  color: "#fff",
  borderColor: ds.colors.primary500,
};

const cardLevelNameStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.25,
};

const cardFooterStyle: CSSProperties = {
  padding: "12px 20px",
  borderTop: `1px solid ${ds.colors.borderMuted}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 12,
  fontWeight: 700,
  color: ds.colors.textMuted,
  transition: "color 180ms ease, border-color 180ms ease",
  position: "relative",
  zIndex: 1,
};

const cardFooterHoveredStyle: CSSProperties = {
  color: ds.colors.primary600,
  borderTopColor: ds.colors.primary200,
};

const arrowStyle: CSSProperties = {
  fontSize: 14,
};

const footerNoteStyle: CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  color: ds.colors.textMuted,
  marginTop: 28,
  fontWeight: 500,
};
