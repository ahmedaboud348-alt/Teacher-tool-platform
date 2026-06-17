import type { CSSProperties, ReactNode } from "react";
import { ExamSheetDraft } from "../types/exam-sheet-draft";
import { ds, ui } from "../ui/design-system";
import { getUILabels } from "../i18n";

type Props = {
  draft: ExamSheetDraft;
  updateMeta: <K extends keyof ExamSheetDraft["meta"]>(
    key: K,
    value: ExamSheetDraft["meta"][K]
  ) => void;
};

export function ExamMetadataSection({ draft, updateMeta }: Props) {
  const L = getUILabels(draft.meta.track);
  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{L.metaSection}</h2>
      </div>

      <div style={gridStyle}>
        <FieldBlock label={L.fieldTitle} fullWidth>
          <input
            type="text"
            value={draft.meta.title}
            onChange={(e) => updateMeta("title", e.target.value)}
            style={ui.input}
          />
        </FieldBlock>

        <FieldBlock label={L.fieldInstitution}>
          <input
            type="text"
            value={draft.meta.institutionName}
            onChange={(e) => updateMeta("institutionName", e.target.value)}
            style={ui.input}
          />
        </FieldBlock>

        <FieldBlock label={L.fieldTerm}>
          <SelectWrap>
            <select
              value={draft.meta.term}
              onChange={(e) =>
                updateMeta(
                  "term",
                  e.target.value as ExamSheetDraft["meta"]["term"]
                )
              }
              style={ui.select}
            >
              <option value="first">{L.termFirst}</option>
              <option value="second">{L.termSecond}</option>
            </select>
          </SelectWrap>
        </FieldBlock>

        <FieldBlock label={L.fieldDuration}>
          <UnitInput unit={L.durationUnit}>
            <input
              type="number"
              value={draft.meta.examDurationHours}
              onChange={(e) =>
                updateMeta("examDurationHours", Number(e.target.value))
              }
              style={unitInputStyle}
            />
          </UnitInput>
        </FieldBlock>

        <FieldBlock label={L.fieldTotal}>
          <input
            type="number"
            value={draft.meta.totalPoints}
            onChange={(e) => updateMeta("totalPoints", Number(e.target.value))}
            style={ui.input}
          />
        </FieldBlock>

        <FieldBlock label={L.fieldRounding}>
          <input
            type="number"
            value={draft.meta.roundingStep}
            onChange={(e) => updateMeta("roundingStep", Number(e.target.value))}
            style={ui.input}
          />
        </FieldBlock>
      </div>
    </section>
  );
}

function FieldBlock({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        ...fieldStyle,
        ...(fullWidth ? fullWidthStyle : null),
      }}
    >
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function UnitInput({
  unit,
  children,
}: {
  unit: string;
  children: ReactNode;
}) {
  return (
    <div style={unitWrapStyle}>
      <div style={unitFieldStyle}>{children}</div>
      <span style={unitBadgeStyle}>{unit}</span>
    </div>
  );
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div style={selectWrapStyle}>
      {children}
      <span style={selectArrowStyle}>▾</span>
    </div>
  );
}

const sectionStyle: CSSProperties = {
  ...ui.sectionPanel,
  borderInlineStart: `3px solid ${ds.colors.primary500}`,
};

const headerStyle: CSSProperties = {
  marginBottom: ds.spacing[4],
  display: "flex",
  alignItems: "center",
  gap: ds.spacing[3],
};

const titleStyle: CSSProperties = {
  ...ds.typography.h2,
  color: ds.colors.textPrimary,
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
  gap: ds.spacing[3],
  alignItems: "start",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
  minWidth: 0,
};

const fullWidthStyle: CSSProperties = {
  gridColumn: "1 / -1",
};

const labelStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textSecondary,
};

const selectWrapStyle: CSSProperties = {
  position: "relative",
  minWidth: 0,
};

const selectArrowStyle: CSSProperties = {
  position: "absolute",
  insetInlineEnd: 12,
  top: "50%",
  transform: "translateY(-50%)",
  ...ds.typography.label,
  color: ds.colors.textMuted,
  pointerEvents: "none",
};

const unitWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  gap: ds.spacing[2],
  minWidth: 0,
};

const unitFieldStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const unitInputStyle: CSSProperties = {
  ...ui.input,
  textAlign: "center",
};

const unitBadgeStyle: CSSProperties = {
  minWidth: 46,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 12px",
  borderRadius: ds.radius.md,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderStrong}`,
  ...ds.typography.label,
  color: ds.colors.textSecondary,
  boxSizing: "border-box",
};