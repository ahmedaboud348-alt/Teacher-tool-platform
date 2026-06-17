import { ExamSheetDraftLesson } from "../types/exam-sheet-draft";
import { ds, formatObjectivesCount, ui } from "../ui/design-system";

type Props = {
  lesson: ExamSheetDraftLesson;
  addObjective: (lessonId: string) => void;
  updateObjective: (
    lessonId: string,
    objectiveId: string,
    text: string
  ) => void;
  removeObjective: (lessonId: string, objectiveId: string) => void;
};

export function ObjectivesEditor({
  lesson,
  addObjective,
  updateObjective,
  removeObjective,
}: Props) {
  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div style={titleBlockStyle}>
          <div style={titleStyle}>الأهداف</div>
          <div style={metaStyle}>
            {formatObjectivesCount(lesson.objectives.length)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => addObjective(lesson.id)}
          style={ui.buttonSecondary}
        >
          إضافة هدف
        </button>
      </div>

      <div style={listStyle}>
        {lesson.objectives.map((objective, index) => (
          <div key={objective.id} style={rowStyle}>
            <div style={indexStyle}>{index + 1}</div>

            <div style={inputWrapStyle}>
              <input
                type="text"
                value={objective.text}
                placeholder="نص الهدف"
                onChange={(event) =>
                  updateObjective(lesson.id, objective.id, event.target.value)
                }
                style={ui.input}
              />
            </div>

            <button
              type="button"
              onClick={() => removeObjective(lesson.id, objective.id)}
              style={ui.buttonDanger}
            >
              حذف
            </button>
          </div>
        ))}

        {lesson.objectives.length === 0 && (
          <div style={emptyStyle}>لا توجد أهداف لهذا الدرس بعد.</div>
        )}
      </div>
    </div>
  );
}

const wrapperStyle = {
  paddingTop: ds.spacing[2],
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: ds.spacing[3],
  marginBottom: ds.spacing[2],
};

const titleBlockStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: ds.spacing[2],
};

const titleStyle = {
  ...ds.typography.body,
  fontWeight: 800,
  color: ds.colors.textPrimary,
};

const metaStyle = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const listStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: ds.spacing[2],
};

const rowStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: ds.spacing[3],
};

const indexStyle = {
  minWidth: 28,
  height: 28,
  borderRadius: ds.radius.pill,
  backgroundColor: ds.colors.bgSubtle,
  color: ds.colors.textSecondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 800,
  marginTop: 8,
};

const inputWrapStyle = {
  flex: 1,
  minWidth: 0,
};

const emptyStyle = {
  ...ds.typography.body,
  color: ds.colors.textMuted,
  backgroundColor: ds.colors.bgSubtle,
  borderRadius: ds.radius.md,
  padding: ds.spacing[3],
};