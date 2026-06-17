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
    <div style={{ ...ui.pageShell(dir), fontFamily: "Cairo, system-ui, sans-serif" }}>
      {/* ── App Bar ── */}
      <nav style={appBarStyle}>
        <div style={appBarInnerStyle}>
          <div style={brandWrapStyle}>
            <div style={logoMarkStyle}>م</div>
            <div>
              <div style={brandNameStyle}>{L.brand}</div>
              <div style={brandSubStyle}>{L.toolTitle}</div>
            </div>
          </div>
          <div style={appBarMetaStyle}>
            <span style={appBarLevelBadgeStyle}>
              {getLevelLabelI18n(draft.meta.levelId, track)}
            </span>
            <span style={appBarTrackBadgeStyle}>
              {getTrackLabelI18n(track)}
            </span>
          </div>
        </div>
        <div style={appBarAccentLineStyle} />
      </nav>

      <div style={pageBodyStyle}>
        <div style={ui.pageFrame}>
          {/* ── Hero header ── */}
          <header style={heroStyle}>
            <div style={heroBgStyle} />
            <div style={heroContentStyle}>
              <div style={heroEyebrowStyle}>{L.docSetup}</div>
              <h1 style={heroTitleStyle}>
                {draft.meta.title || L.toolTitle}
              </h1>
            </div>
            <div style={heroBadgesStyle}>
              <ExportPdfButton documentModel={documentModel} />
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
            <PreviewPanel documentModel={documentModel} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── App Bar ── */
const appBarStyle = {
  position: "sticky" as const,
  top: 0,
  zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 4px 16px rgba(0,0,0,0.04)",
};

const appBarInnerStyle = {
  maxWidth: ds.layout.maxWidth,
  margin: "0 auto",
  padding: "0 24px",
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: ds.spacing[4],
};

const brandWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const logoMarkStyle = {
  width: 34,
  height: 34,
  borderRadius: 9,
  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 900,
  fontSize: 16,
  boxShadow: "0 4px 10px rgba(124,58,237,0.30)",
  flexShrink: 0,
};

const brandNameStyle = {
  fontSize: 13,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.2,
};

const brandSubStyle = {
  fontSize: 11,
  fontWeight: 500,
  color: ds.colors.textMuted,
  lineHeight: 1,
};

const appBarMetaStyle = {
  display: "flex",
  alignItems: "center",
  gap: ds.spacing[2],
};

const appBarLevelBadgeStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100,
  border: `1px solid ${ds.colors.primary200}`,
  borderRadius: 999,
  padding: "3px 10px",
};

const appBarTrackBadgeStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: ds.colors.textMuted,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderSoft}`,
  borderRadius: 999,
  padding: "3px 10px",
};

const appBarAccentLineStyle = {
  height: 2,
  background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, transparent 100%)",
};

/* ── Page body ── */
const pageBodyStyle = {
  padding: `${ds.spacing[6]}px`,
};

/* ── Hero header ── */
const heroStyle = {
  position: "relative" as const,
  overflow: "hidden" as const,
  borderRadius: ds.radius.xl,
  padding: "28px 28px",
  marginBottom: ds.spacing[5],
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[4],
  background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 60%, #DDD6FE 100%)",
  border: `1px solid ${ds.colors.primary200}`,
  boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
  boxSizing: "border-box" as const,
};

const heroBgStyle = {
  position: "absolute" as const,
  inset: 0,
  backgroundImage: "radial-gradient(rgba(124,58,237,0.06) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none" as const,
};

const heroContentStyle = {
  minWidth: 0,
  flex: 1,
  position: "relative" as const,
  zIndex: 1,
};

const heroEyebrowStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: ds.colors.primary600,
  backgroundColor: "rgba(124,58,237,0.10)",
  borderRadius: ds.radius.pill,
  padding: "3px 12px",
  display: "inline-block",
  marginBottom: ds.spacing[3],
  letterSpacing: "0.04em",
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
  alignItems: "flex-start",
  position: "relative" as const,
  zIndex: 1,
};

/* ── Editor layout ── */
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
