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
          <div style={appBarBrandStyle}>منصة الأدوات التربوية</div>
          <div style={appBarPageStyle}>اختيار المسار</div>
        </div>
      </div>

      <div style={pageBodyStyle}>
        <div style={ui.pageFrame}>
          <div style={{ ...ui.panel, padding: ds.spacing[7] }}>
            <div style={headerStyle}>
              <div>
                <div style={eyebrowStyle}>جذاذة الفرض المحروس</div>
                <h1 style={titleStyle}>اختيار المسار</h1>
              </div>

              <button type="button" style={ui.buttonSecondary} onClick={onBack}>
                تغيير المستوى
              </button>
            </div>

            <div style={contextStyle}>
              <span style={contextLabelStyle}>المستوى</span>
              <strong style={contextValueStyle}>
                {getLevelLabel(selectedLevelId)}
              </strong>
            </div>

            <div style={gridStyle}>
              <button
                type="button"
                style={{ ...cardStyle, ...generalCardStyle }}
                onClick={() => onSelectTrack("general")}
              >
                <div style={cardHeaderStyle}>
                  <span style={ui.badgePrimary}>المسار المعتمد</span>
                </div>

                <div style={cardTitleStyle}>المسار العام</div>
                <div style={cardMetaStyle}>مناسب للعمل باللغة العربية</div>

                <div style={{ ...cardFooterStyle, ...generalFooterStyle }}>
                  الدخول إلى الأداة
                </div>
              </button>

              <button
                type="button"
                style={{ ...cardStyle, ...internationalCardStyle }}
                onClick={() => onSelectTrack("international")}
              >
                <div style={cardHeaderStyle}>
                  <span style={ui.badgeAccent}>جاهز للتوسع</span>
                </div>

                <div style={cardTitleStyle}>المسار الدولي</div>
                <div style={cardMetaStyle}>تهيئة مستقلة قابلة للتوسع</div>

                <div style={{ ...cardFooterStyle, ...internationalFooterStyle }}>
                  الدخول إلى الأداة
                </div>
              </button>
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

const appBarBrandStyle = {
  ...ds.typography.meta,
  color: ds.colors.textPrimary,
  fontWeight: 800,
};

const appBarPageStyle = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[4],
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

const contextStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: ds.spacing[3],
  marginTop: ds.spacing[5],
  marginBottom: ds.spacing[6],
  padding: "10px 12px",
  borderRadius: ds.radius.md,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderSoft}`,
};

const contextLabelStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textMuted,
};

const contextValueStyle: CSSProperties = {
  ...ds.typography.body,
  fontWeight: 800,
  color: ds.colors.textPrimary,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: ds.spacing[4],
};

const cardStyle: CSSProperties = {
  minHeight: 228,
  padding: ds.spacing[6],
  borderRadius: ds.radius.xl,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  textAlign: "right",
  cursor: "pointer",
  boxSizing: "border-box",
  boxShadow: ds.shadow.sm,
};

const generalCardStyle: CSSProperties = {
  backgroundColor: ds.colors.primary50,
  border: `1px solid ${ds.colors.primary200}`,
};

const internationalCardStyle: CSSProperties = {
  backgroundColor: ds.colors.accent50,
  border: `1px solid ${ds.colors.accent200}`,
};

const cardHeaderStyle: CSSProperties = {
  marginBottom: ds.spacing[5],
};

const cardTitleStyle: CSSProperties = {
  fontSize: 28,
  lineHeight: 1.2,
  fontWeight: 800,
  color: ds.colors.textPrimary,
};

const cardMetaStyle: CSSProperties = {
  marginTop: ds.spacing[2],
  ...ds.typography.body,
  color: ds.colors.textSecondary,
};

const cardFooterStyle: CSSProperties = {
  marginTop: "auto",
  paddingTop: ds.spacing[5],
  borderTop: `1px solid rgba(15, 23, 42, 0.08)`,
  ...ds.typography.meta,
  fontWeight: 800,
};

const generalFooterStyle: CSSProperties = {
  color: ds.colors.primary600,
};

const internationalFooterStyle: CSSProperties = {
  color: ds.colors.accent600,
};