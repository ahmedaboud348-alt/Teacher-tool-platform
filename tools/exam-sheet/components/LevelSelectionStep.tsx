import type { CSSProperties } from "react";
import { ds, getLevelLabel, ui } from "../ui/design-system";

type Props = {
  onSelectLevel: (levelId: string) => void;
};

const LEVEL_OPTIONS = ["1ac", "2ac", "3ac"] as const;

export function LevelSelectionStep({ onSelectLevel }: Props) {
  return (
    <section dir="rtl" style={ui.pageShell("rtl")}>
      <div style={ui.appBar}>
        <div style={ui.appBarInner}>
          <div style={appBarBrandStyle}>منصة الأدوات التربوية</div>
          <div style={appBarPageStyle}>اختيار المستوى</div>
        </div>
      </div>

      <div style={pageBodyStyle}>
        <div style={ui.pageFrame}>
          <div style={{ ...ui.panel, padding: ds.spacing[7] }}>
            <div style={heroStyle}>
              <div style={eyebrowStyle}>جذاذة الفرض المحروس</div>
              <h1 style={titleStyle}>اختيار المستوى</h1>
            </div>

            <div style={gridStyle}>
              {LEVEL_OPTIONS.map((levelId) => (
                <button
                  key={levelId}
                  type="button"
                  style={optionStyle}
                  onClick={() => onSelectLevel(levelId)}
                >
                  <div style={optionTopStyle}>
                    <span style={ui.badgeNeutral}>المستوى</span>
                    <span style={ui.badgePrimary}>{levelId.toUpperCase()}</span>
                  </div>

                  <div style={optionTitleStyle}>{getLevelLabel(levelId)}</div>
                  <div style={optionActionStyle}>اختيار</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const pageBodyStyle: CSSProperties = {
  paddingTop: ds.spacing[6],
};

const appBarBrandStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textPrimary,
  fontWeight: 800,
};

const appBarPageStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const heroStyle: CSSProperties = {
  marginBottom: ds.spacing[6],
};

const eyebrowStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
  marginBottom: ds.spacing[2],
};

const titleStyle: CSSProperties = {
  ...ds.typography.h1,
  color: ds.colors.textPrimary,
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: ds.spacing[4],
};

const optionStyle: CSSProperties = {
  ...ui.subtleBlock,
  padding: ds.spacing[5],
  textAlign: "right",
  cursor: "pointer",
  minHeight: 168,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  backgroundColor: ds.colors.bgPanel,
};

const optionTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: ds.spacing[3],
  marginBottom: ds.spacing[5],
};

const optionTitleStyle: CSSProperties = {
  fontSize: 24,
  lineHeight: 1.3,
  fontWeight: 800,
  color: ds.colors.textPrimary,
};

const optionActionStyle: CSSProperties = {
  marginTop: "auto",
  paddingTop: ds.spacing[4],
  borderTop: `1px solid ${ds.colors.borderMuted}`,
  ...ds.typography.meta,
  color: ds.colors.textSecondary,
};