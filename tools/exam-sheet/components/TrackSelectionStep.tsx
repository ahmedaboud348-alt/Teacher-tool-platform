"use client";

import { useState, type CSSProperties } from "react";
import { ExamTrack } from "../types/exam-sheet-draft";
import { ds, getLevelLabel } from "../ui/design-system";

type Props = {
  selectedLevelId: string;
  onSelectTrack: (track: ExamTrack) => void;
  onBack: () => void;
};

export function TrackSelectionStep({ selectedLevelId, onSelectTrack, onBack }: Props) {
  const [hovered, setHovered] = useState<ExamTrack | null>(null);

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
          <button type="button" style={backBtnStyle} onClick={onBack}>
            ← تغيير المستوى
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={heroWrapStyle}>
        <div style={heroBgPatternStyle} />
        <div style={heroInnerStyle}>
          <div style={levelPillStyle} className="hero-eyebrow">
            {getLevelLabel(selectedLevelId)}
          </div>
          <h1 style={heroTitleStyle} className="hero-title">
            اختر مسارك الدراسي
          </h1>
          <p style={heroDescStyle} className="hero-desc">
            الوثيقة تُنشأ بلغة ومحتوى المسار الذي تختاره
          </p>
        </div>
        <div style={heroCurveStyle} />
      </div>

      {/* ── Cards ── */}
      <div style={bodyStyle}>
        <div style={cardsWrapStyle}>

          {/* General Track */}
          <button
            type="button"
            className="track-card"
            style={{
              ...cardBaseStyle,
              ...generalCardStyle,
              ...(hovered === "general" ? generalHoveredStyle : {}),
            }}
            onMouseEnter={() => setHovered("general")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectTrack("general")}
          >
            <div style={cardPatternStyle} />
            <div style={generalIconBoxStyle}>📘</div>
            <div style={{ ...trackBadgeStyle, ...generalBadgeStyle }}>
              المسار الرسمي
            </div>
            <div style={trackTitleStyle}>المسار العام</div>
            <div style={trackDescStyle}>
              الوثيقة باللغة العربية — الاتجاه من اليمين لليسار — مطابق للمنهج الرسمي
            </div>
            <div style={{ ...ctaRowStyle, ...generalCtaStyle }}>
              <span>الدخول إلى الأداة</span>
              <span>←</span>
            </div>
          </button>

          {/* International Track */}
          <button
            type="button"
            className="track-card"
            style={{
              ...cardBaseStyle,
              ...intlCardStyle,
              ...(hovered === "international" ? intlHoveredStyle : {}),
            }}
            onMouseEnter={() => setHovered("international")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectTrack("international")}
          >
            <div style={{ ...cardPatternStyle, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)" }} />
            <div style={intlIconBoxStyle}>📗</div>
            <div style={{ ...trackBadgeStyle, ...intlBadgeStyle }}>
              Filière Internationale
            </div>
            <div style={{ ...trackTitleStyle, color: "#fff" }}>
              المسار الدولي
            </div>
            <div style={{ ...trackDescStyle, color: "rgba(255,255,255,0.65)" }}>
              Le document en français — de gauche à droite — conforme au programme officiel
            </div>
            <div style={{ ...ctaRowStyle, ...intlCtaStyle }}>
              <span>Accéder à l&apos;outil</span>
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

const backBtnStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100,
  border: `1.5px solid ${ds.colors.primary200}`,
  borderRadius: 10,
  padding: "8px 16px",
  cursor: "pointer",
  transition: "background-color 150ms ease",
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
  backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  pointerEvents: "none",
};

const heroInnerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: 600,
  margin: "0 auto",
  textAlign: "center",
};

const levelPillStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 13,
  fontWeight: 800,
  color: "#7C3AED",
  backgroundColor: "rgba(255,255,255,0.92)",
  borderRadius: 999,
  padding: "6px 18px",
  marginBottom: 20,
};

const heroTitleStyle: CSSProperties = {
  fontSize: 44,
  fontWeight: 900,
  color: "#FFFFFF",
  lineHeight: 1.15,
  margin: "0 0 14px",
};

const heroDescStyle: CSSProperties = {
  fontSize: 15,
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

const cardsWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 20,
  maxWidth: 760,
  margin: "0 auto",
};

/* Cards */
const cardBaseStyle: CSSProperties = {
  position: "relative",
  borderRadius: 20,
  padding: "28px 28px 0",
  minHeight: 300,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  cursor: "pointer",
  overflow: "hidden",
  border: "none",
  transition: "transform 180ms cubic-bezier(0.4,0,0.2,1), box-shadow 180ms cubic-bezier(0.4,0,0.2,1)",
  textAlign: "right",
  boxSizing: "border-box",
};

const cardPatternStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  pointerEvents: "none",
};

const generalCardStyle: CSSProperties = {
  backgroundColor: "#fff",
  boxShadow: "0 4px 16px rgba(124,58,237,0.08), 0 0 0 1.5px rgba(124,58,237,0.12)",
};

const generalHoveredStyle: CSSProperties = {
  transform: "translateY(-6px)",
  boxShadow: "0 24px 56px rgba(124,58,237,0.20), 0 0 0 2px rgba(124,58,237,0.40)",
};

const intlCardStyle: CSSProperties = {
  background: "linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)",
  boxShadow: "0 4px 16px rgba(30,27,75,0.25)",
};

const intlHoveredStyle: CSSProperties = {
  transform: "translateY(-6px)",
  boxShadow: "0 24px 56px rgba(30,27,75,0.40)",
};

const generalIconBoxStyle: CSSProperties = {
  fontSize: 40,
  marginBottom: 12,
  position: "relative",
  zIndex: 1,
};

const intlIconBoxStyle: CSSProperties = {
  ...generalIconBoxStyle,
};

const trackBadgeStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 800,
  borderRadius: 8,
  padding: "4px 12px",
  marginBottom: 10,
  position: "relative",
  zIndex: 1,
  letterSpacing: "0.04em",
};

const generalBadgeStyle: CSSProperties = {
  color: ds.colors.primary700,
  backgroundColor: ds.colors.primary100,
  border: `1px solid ${ds.colors.primary200}`,
};

const intlBadgeStyle: CSSProperties = {
  color: "#FB923C",
  backgroundColor: "rgba(251,146,60,0.15)",
  border: "1px solid rgba(251,146,60,0.30)",
};

const trackTitleStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  color: ds.colors.textPrimary,
  lineHeight: 1.15,
  marginBottom: 10,
  position: "relative",
  zIndex: 1,
};

const trackDescStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: ds.colors.textSecondary,
  lineHeight: 1.7,
  flex: 1,
  position: "relative",
  zIndex: 1,
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
  marginTop: 20,
  fontSize: 13,
  fontWeight: 800,
  position: "relative",
  zIndex: 1,
  borderTop: "1px solid",
};

const generalCtaStyle: CSSProperties = {
  color: ds.colors.primary600,
  borderTopColor: ds.colors.primary200,
};

const intlCtaStyle: CSSProperties = {
  color: "#FB923C",
  borderTopColor: "rgba(251,146,60,0.25)",
  textAlign: "left",
  flexDirection: "row-reverse" as const,
};
