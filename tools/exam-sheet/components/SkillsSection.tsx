import type { CSSProperties } from "react";
import { ExamSheetDraft, ExamSheetDraftSkill } from "../types/exam-sheet-draft";
import { ds, ui } from "../ui/design-system";

type Props = {
  draft: ExamSheetDraft;
  addSkill: () => void;
  updateSkill: (skillId: string, patch: Partial<ExamSheetDraftSkill>) => void;
  removeSkill: (skillId: string) => void;
};

export function SkillsSection({
  draft,
  addSkill,
  updateSkill,
  removeSkill,
}: Props) {
  return (
    <section style={ui.sectionPanel}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>المهارات</h2>

        <button type="button" onClick={addSkill} style={ui.buttonSecondary}>
          إضافة مهارة
        </button>
      </div>

      <div style={listStyle}>
        {draft.skills.map((skill, index) => (
          <div key={skill.id} style={skillCardStyle}>
            <div style={skillHeaderStyle}>
              <div style={skillIdentityStyle}>
                <div style={skillIndexStyle}>{index + 1}</div>
                <div style={skillNamePreviewStyle}>
                  {skill.label || "مهارة جديدة"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                style={ui.buttonDanger}
              >
                حذف
              </button>
            </div>

            <div style={fieldsGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>اسم المهارة</label>
                <input
                  type="text"
                  value={skill.label}
                  placeholder="عنوان المهارة"
                  onChange={(e) =>
                    updateSkill(skill.id, { label: e.target.value })
                  }
                  style={ui.input}
                />
              </div>

              <div style={percentageFieldStyle}>
                <label style={labelStyle}>النسبة</label>

                <div style={unitWrapStyle}>
                  <div style={unitFieldStyle}>
                    <input
                      type="number"
                      value={skill.percentage}
                      onChange={(e) =>
                        updateSkill(skill.id, {
                          percentage: Number(e.target.value),
                        })
                      }
                      style={unitInputStyle}
                    />
                  </div>
                  <span style={unitBadgeStyle}>%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: ds.spacing[4],
  marginBottom: ds.spacing[4],
};

const sectionTitleStyle: CSSProperties = {
  ...ds.typography.h2,
  color: ds.colors.textPrimary,
  margin: 0,
};

const listStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[3],
};

const skillCardStyle: CSSProperties = {
  padding: ds.spacing[3],
  borderRadius: ds.radius.lg,
  backgroundColor: ds.colors.bgMuted,
  border: `1px solid ${ds.colors.borderMuted}`,
};

const skillHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[3],
  marginBottom: ds.spacing[3],
};

const skillIdentityStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ds.spacing[3],
  minWidth: 0,
};

const skillIndexStyle: CSSProperties = {
  minWidth: 30,
  height: 30,
  borderRadius: ds.radius.pill,
  backgroundColor: ds.colors.primary100,
  color: ds.colors.primary600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 800,
  flexShrink: 0,
};

const skillNamePreviewStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.45,
};

const fieldsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 166px",
  gap: ds.spacing[3],
  alignItems: "start",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
  minWidth: 0,
};

const percentageFieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
  minWidth: 0,
};

const labelStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textSecondary,
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