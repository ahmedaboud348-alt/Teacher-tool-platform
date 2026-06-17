import type { CSSProperties } from "react";
import { ExamTrack } from "../types/exam-sheet-draft";
import { ds, getLevelLabel, ui } from "../ui/design-system";

type Props = {
  selectedLevelId: string;
  onSelectTrack: (track: ExamTrack) => void;
  onBack: () => void;
};

export function TrackSelectionStep({
  selectedLevelId,
  onSelectTrack,
  onBack,
}: Props) {
  return (
    <section dir="rtl" style={ui.pageShell("rtl")}>
      <div style={ui.appBar}>
        <div style={ui.appBarInner}>
          <div style={brandStyle}>
            <span style={brandDotStyle} />
            منصة الأدوات التربوية
          </div>
          <div style={appBarPageStyle}>جذاذة الفرض المحروس</div>
        </div>
      </div>

      <div style={pageBodyStyle}>
        <div style={ui.pageFrame}>

          <div style={heroSectionStyle}>
            <div style={heroLabelStyle}>جذاذة الفرض المحروس</div>
            <h1 style={heroTitleStyle}>اختر المسار الدراسي</h1>
            <div style={levelContextStyle}>
              <span style={levelContextLabelStyle}>المستوى المختار:</span>
              <span style={levelContextValueStyle}>{getLevelLabel(selectedLevelId)}</span>
              <button type="button" style={changeBtn} onClick={onBack}>تغيير</button>
            </div>
          </div>

          <div style={gridStyle}>
            {/* General Track */}
            <button
              type="button"
              style={generalCardStyle}
              onClick={() => onSelectTrack("general")}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 48px rgba(124,58,237,0.18)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.10)";
              }}
            >
              <div style={cardBadgeRow}>
                <span style={primaryBadge}>المسار المعتمد</span>
              </div>
              <div style={cardIconStyle}>📘</div>
              <div style={cardTitleStyle}>المسار العام</div>
              <div style={cardDescStyle}>الوثيقة باللغة العربية — الاتجاه من اليمين لليسار</div>
              <div style={generalFooterStyle}>الدخول إلى الأداة ←</div>
            </button>

            {/* International Track */}
            <button
              type="button"
              style={internationalCardStyle}
              onClick={() => onSelectTrack("international")}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 48px rgba(234,88,12,0.14)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(234,88,12,0.08)";
              }}
            >
              <div style={cardBadgeRow}>
                <span style={accentBadge}>المسار الدولي</span>
              </div>
              <div style={cardIconStyle}>📗</div>
              <div style={cardTitleStyle}>Filière Internationale</div>
              <div style={cardDescStyle}>Document en français — de gauche à droite</div>
              <div style={internationalFooterStyle}>Accéder à l&apos;outil →</div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

const pageBodyStyle: CSSProperties = { paddingTop: ds.spacing[7] };

const brandStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textPrimary,
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  gap: ds.spacing[2],
};

const brandDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: ds.colors.primary500,
  display: "inline-block",
};

const appBarPageStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const heroSectionStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: ds.spacing[8],
};

const heroLabelStyle: CSSProperties = {
  display: "inline-block",
  ...ds.typography.small,
  color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100,
  border: `1px solid ${ds.colors.primary200}`,
  borderRadius: ds.radius.pill,
  padding: "4px 14px",
  marginBottom: ds.spacing[4],
};

const heroTitleStyle: CSSProperties = {
  ...ds.typography.h1,
  color: ds.colors.textPrimary,
  margin: `0 0 ${ds.spacing[4]}px`,
};

const levelContextStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: ds.spacing[3],
  padding: "8px 16px",
  borderRadius: ds.radius.pill,
  backgroundColor: ds.colors.bgMuted,
  border: `1px solid ${ds.colors.borderSoft}`,
};

const levelContextLabelStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textMuted,
};

const levelContextValueStyle: CSSProperties = {
  ...ds.typography.body,
  fontWeight: 800,
  color: ds.colors.textPrimary,
};

const changeBtn: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.primary600,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  textDecoration: "underline",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: ds.spacing[5],
  maxWidth: 700,
  margin: "0 auto",
};

const baseCardStyle: CSSProperties = {
  minHeight: 260,
  padding: ds.spacing[6],
  borderRadius: ds.radius.xl,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  textAlign: "right",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  border: "none",
};

const generalCardStyle: CSSProperties = {
  ...baseCardStyle,
  background: `linear-gradient(135deg, ${ds.colors.primary50} 0%, #EDE9FE 100%)`,
  boxShadow: "0 8px 24px rgba(124,58,237,0.10)",
};

const internationalCardStyle: CSSProperties = {
  ...baseCardStyle,
  background: `linear-gradient(135deg, ${ds.colors.accent50} 0%, #FFEDD5 100%)`,
  boxShadow: "0 8px 24px rgba(234,88,12,0.08)",
};

const cardBadgeRow: CSSProperties = { marginBottom: ds.spacing[4] };

const primaryBadge: CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: ds.radius.pill,
  fontSize: 11,
  fontWeight: 800,
  backgroundColor: ds.colors.primary100,
  color: ds.colors.primary700,
  border: `1px solid ${ds.colors.primary200}`,
};

const accentBadge: CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: ds.radius.pill,
  fontSize: 11,
  fontWeight: 800,
  backgroundColor: ds.colors.accent100,
  color: ds.colors.accent600,
  border: `1px solid ${ds.colors.accent200}`,
};

const cardIconStyle: CSSProperties = {
  fontSize: 36,
  marginBottom: ds.spacing[3],
};

const cardTitleStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.2,
  marginBottom: ds.spacing[2],
};

const cardDescStyle: CSSProperties = {
  ...ds.typography.body,
  color: ds.colors.textSecondary,
  flex: 1,
};

const generalFooterStyle: CSSProperties = {
  marginTop: ds.spacing[5],
  paddingTop: ds.spacing[4],
  borderTop: `1px solid rgba(124,58,237,0.15)`,
  ...ds.typography.meta,
  fontWeight: 800,
  color: ds.colors.primary600,
};

const internationalFooterStyle: CSSProperties = {
  marginTop: ds.spacing[5],
  paddingTop: ds.spacing[4],
  borderTop: `1px solid rgba(234,88,12,0.15)`,
  ...ds.typography.meta,
  fontWeight: 800,
  color: ds.colors.accent600,
  textAlign: "left",
};
