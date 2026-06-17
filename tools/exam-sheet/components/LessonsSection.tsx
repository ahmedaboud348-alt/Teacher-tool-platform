import type { CSSProperties } from "react";
import { ExamSheetDraft, ExamSheetDraftLesson } from "../types/exam-sheet-draft";
import { LessonSuggestion } from "../hooks/useLessonSuggestions";
import { LessonAutocomplete } from "./LessonAutocomplete";
import { ObjectivesEditor } from "./ObjectivesEditor";
import { ds, ui } from "../ui/design-system";
import { getUILabels } from "../i18n";

type Props = {
  draft: ExamSheetDraft;
  addLesson: () => void;
  updateLesson: (lessonId: string, patch: Partial<ExamSheetDraftLesson>) => void;
  removeLesson: (lessonId: string) => void;
  applyLessonReference: (
    lessonId: string,
    lessonReference: LessonSuggestion
  ) => void;
  addObjective: (lessonId: string) => void;
  updateObjective: (
    lessonId: string,
    objectiveId: string,
    text: string
  ) => void;
  removeObjective: (lessonId: string, objectiveId: string) => void;
};

export function LessonsSection({
  draft,
  addLesson,
  updateLesson,
  removeLesson,
  applyLessonReference,
  addObjective,
  updateObjective,
  removeObjective,
}: Props) {
  const L = getUILabels(draft.meta.track);
  return (
    <section style={ui.sectionPanel}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>{L.lessonsSection}</h2>

        <button type="button" onClick={addLesson} style={ui.buttonSecondary}>
          {L.addLesson}
        </button>
      </div>

      <div style={listStyle}>
        {draft.lessons.map((lesson, index) => (
          <div key={lesson.id} style={lessonCardStyle}>
            <div style={lessonHeaderStyle}>
              <div style={lessonIdentityStyle}>
                <div style={lessonIndexStyle}>{index + 1}</div>

                <div>
                  <div style={lessonTitleStyle}>
                    {lesson.label || L.lessonDefault}
                  </div>

                  <div style={lessonMetaRowStyle}>
                    <span
                      style={
                        lesson.source === "catalog"
                          ? ui.badgePrimary
                          : ui.badgeNeutral
                      }
                    >
                      {lesson.source === "catalog" ? L.badgeCatalog : L.badgeCustom}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeLesson(lesson.id)}
                style={ui.buttonDanger}
              >
                {L.removeBtn}
              </button>
            </div>

            <div style={fieldsGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>{L.fieldLesson}</label>

                <LessonAutocomplete
                  value={lesson.label}
                  levelId={draft.meta.levelId}
                  track={draft.meta.track}
                  onChange={(value) =>
                    updateLesson(lesson.id, {
                      label: value,
                      source: lesson.referenceLessonId ? lesson.source : "custom",
                    })
                  }
                  onSelectSuggestion={(suggestion) =>
                    applyLessonReference(lesson.id, suggestion)
                  }
                />
              </div>

              <div style={durationFieldStyle}>
                <label style={labelStyle}>{L.fieldLessonDuration}</label>

                <div style={unitWrapStyle}>
                  <div style={unitFieldStyle}>
                    <input
                      type="number"
                      value={lesson.hours}
                      placeholder="0"
                      onChange={(event) =>
                        updateLesson(lesson.id, {
                          hours: Number(event.target.value),
                        })
                      }
                      style={unitInputStyle}
                    />
                  </div>
                  <span style={unitBadgeStyle}>{L.durationUnit}</span>
                </div>
              </div>
            </div>

            <div style={objectivesWrapStyle}>
              <ObjectivesEditor
                lesson={lesson}
                track={draft.meta.track}
                addObjective={addObjective}
                updateObjective={updateObjective}
                removeObjective={removeObjective}
              />
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

const lessonCardStyle: CSSProperties = {
  padding: ds.spacing[3],
  borderRadius: ds.radius.lg,
  backgroundColor: ds.colors.bgMuted,
  border: `1px solid ${ds.colors.borderMuted}`,
};

const lessonHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[3],
  marginBottom: ds.spacing[3],
};

const lessonIdentityStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: ds.spacing[3],
  minWidth: 0,
};

const lessonIndexStyle: CSSProperties = {
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

const lessonTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.45,
};

const lessonMetaRowStyle: CSSProperties = {
  marginTop: ds.spacing[1],
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: ds.spacing[2],
};

const fieldsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 146px",
  gap: ds.spacing[3],
  alignItems: "start",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
  minWidth: 0,
};

const durationFieldStyle: CSSProperties = {
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

const objectivesWrapStyle: CSSProperties = {
  marginTop: ds.spacing[2],
};