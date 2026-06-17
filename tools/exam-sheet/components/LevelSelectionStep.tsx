import type { CSSProperties } from "react";
import { ds, getLevelLabel, ui } from "../ui/design-system";

type Props = {
  onSelectLevel: (levelId: string) => void;
};

const LEVEL_OPTIONS = [
  { id: "1ac", num: "١" },
  { id: "2ac", num: "٢" },
  { id: "3ac", num: "٣" },
] as const;

export function LevelSelectionStep({ onSelectLevel }: Props) {
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
            <h1 style={heroTitleStyle}>اختر المستوى الدراسي</h1>
            <p style={heroSubStyle}>حدد المستوى لبدء إعداد الوثيقة</p>
          </div>

          <div style={gridStyle}>
            {LEVEL_OPTIONS.map(({ id, num }) => (
              <button
                key={id}
                type="button"
                style={cardStyle}
                onClick={() => onSelectLevel(id)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ds.colors.primary500;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(124,58,237,0.14)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ds.colors.borderSoft;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = ds.shadow.sm;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                <div style={cardNumStyle}>{num}</div>
                <div style={cardBodyStyle}>
                  <span style={ui.badgePrimary}>{id.toUpperCase()}</span>
                  <div style={cardTitleStyle}>{getLevelLabel(id)}</div>
                </div>
                <div style={cardArrowStyle}>→</div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

const pageBodyStyle: CSSProperties = {
  paddingTop: ds.spacing[7],
};

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
  letterSpacing: "0.04em",
};

const heroTitleStyle: CSSProperties = {
  ...ds.typography.h1,
  color: ds.colors.textPrimary,
  margin: `0 0 ${ds.spacing[2]}px`,
};

const heroSubStyle: CSSProperties = {
  ...ds.typography.body,
  color: ds.colors.textMuted,
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: ds.spacing[4],
  maxWidth: 800,
  margin: "0 auto",
};

const cardStyle: CSSProperties = {
  backgroundColor: ds.colors.bgPanel,
  border: `1.5px solid ${ds.colors.borderSoft}`,
  borderRadius: ds.radius.xl,
  boxShadow: ds.shadow.sm,
  padding: `${ds.spacing[6]}px`,
  textAlign: "right",
  cursor: "pointer",
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: ds.spacing[4],
  boxSizing: "border-box",
  transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
};

const cardNumStyle: CSSProperties = {
  fontSize: 48,
  lineHeight: 1,
  fontWeight: 800,
  color: ds.colors.primary200,
  fontFamily: "serif",
};

const cardBodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
  flex: 1,
};

const cardTitleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.3,
};

const cardArrowStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.primary500,
  fontWeight: 800,
  borderTop: `1px solid ${ds.colors.borderMuted}`,
  paddingTop: ds.spacing[3],
};
