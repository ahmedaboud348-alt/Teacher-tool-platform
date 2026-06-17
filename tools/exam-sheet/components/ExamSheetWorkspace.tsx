import {
  ExamSheetDraft,
  ExamSheetDraftLesson,
  ExamSheetDraftSkill,
} from "../types/exam-sheet-draft";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";
import { LessonSuggestion } from "../hooks/useLessonSuggestions";

import { ExamMetadataSection } from "./ExamMetadataSection";
import { LessonsSection } from "./LessonsSection";
import { SkillsSection } from "./SkillsSection";
import { PreviewPanel } from "./PreviewPanel";
import { ExportPdfButton } from "./ExportPdfButton";
import { ds, ui } from "../ui/design-system";
import { getUILabels, getLevelLabelI18n, getTrackLabelI18n } from "../i18n";

type Props = {
  draft: ExamSheetDraft;

  updateMeta: <K extends keyof ExamSheetDraft["meta"]>(
    key: K,
    value: ExamSheetDraft["meta"][K]
  ) => void;

  addLesson: () => void;
  updateLesson: (
    lessonId: string,
    patch: Partial<ExamSheetDraftLesson>
  ) => void;
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

  addSkill: () => void;
  updateSkill: (
    skillId: string,
    patch: Partial<ExamSheetDraftSkill>
  ) => void;
  removeSkill: (skillId: string) => void;

  documentModel: ExamSheetDocumentModel | null;
};

export function ExamSheetWorkspace({
  draft,
  updateMeta,
  addLesson,
  updateLesson,
  removeLesson,
  applyLessonReference,
  addObjective,
  updateObjective,
  removeObjective,
  addSkill,
  updateSkill,
  removeSkill,
  documentModel,
}: Props) {
  const track = draft.meta.track;
  const L = getUILabels(track);
  const dir = track === "general" ? "rtl" : "ltr";

  return (
    <div style={ui.pageShell(dir)}>
      <div style={ui.appBar}>
        <div style={ui.appBarInner}>
          <div style={appBarBrandStyle}>{L.brand}</div>
          <div style={appBarPageStyle}>{L.toolTitle}</div>
        </div>
      </div>

      <div style={pageBodyStyle}>
        <div style={ui.pageFrame}>
          <header style={heroStyle}>
            <div style={heroContentStyle}>
              <div style={heroEyebrowStyle}>{L.docSetup}</div>
              <h1 style={heroTitleStyle}>
                {draft.meta.title || L.toolTitle}
              </h1>
            </div>

            <div style={heroBadgesStyle}>
              <span style={ui.badgeNeutral}>
                {L.levelBadge} {getLevelLabelI18n(draft.meta.levelId, track)}
              </span>
              <span style={ui.badgeNeutral}>
                {L.trackBadge} {getTrackLabelI18n(track)}
              </span>
            </div>
          </header>

          <div style={editorColumnStyle}>
            <ExamMetadataSection draft={draft} updateMeta={updateMeta} />

            <LessonsSection
              draft={draft}
              addLesson={addLesson}
              updateLesson={updateLesson}
              removeLesson={removeLesson}
              applyLessonReference={applyLessonReference}
              addObjective={addObjective}
              updateObjective={updateObjective}
              removeObjective={removeObjective}
            />

            <SkillsSection
              draft={draft}
              addSkill={addSkill}
              updateSkill={updateSkill}
              removeSkill={removeSkill}
            />
          </div>

          <div style={previewSectionStyle}>
            <div style={exportBarStyle}>
              <ExportPdfButton documentModel={documentModel} />
            </div>
            <PreviewPanel documentModel={documentModel} />
          </div>
        </div>
      </div>
    </div>
  );
}

const pageBodyStyle = {
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

const heroStyle = {
  ...ui.sectionPanel,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[4],
  marginBottom: ds.spacing[5],
  backgroundColor: ds.colors.bgPanel,
};

const heroContentStyle = {
  minWidth: 0,
  flex: 1,
};

const heroEyebrowStyle = {
  ...ds.typography.meta,
  color: ds.colors.primary600,
  marginBottom: ds.spacing[2],
};

const heroTitleStyle = {
  ...ds.typography.h1,
  color: ds.colors.textPrimary,
  margin: 0,
};

const heroBadgesStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: ds.spacing[2],
  justifyContent: "flex-end",
};

const editorColumnStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: ds.spacing[4],
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
};

const previewSectionStyle = {
  marginTop: ds.spacing[5],
  width: "100%",
  maxWidth: ds.layout.previewMaxWidth,
  minWidth: 0,
};

const exportBarStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: ds.spacing[3],
};
