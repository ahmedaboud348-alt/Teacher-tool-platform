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
import Link from "next/link";

const NAVY = "#1A3055";
const NAVY_DEEP = "#0F1E35";
const GOLD = "#C8960C";

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
    <div style={{ ...ui.pageShell(dir), fontFamily: "Cairo, system-ui, sans-serif", backgroundColor: "#F8FAFC" }}>
      {/* ── Nav ── */}
      <nav style={navStyle}>
        <div style={navInnerStyle}>
          <div style={navLeftStyle}>
            <Link href="/" style={navBackStyle}>← الرئيسية</Link>
            <span style={navSepStyle}>|</span>
            <span style={navTitleStyle}>جذاذة الفرض المحروس</span>
          </div>
          <div style={navBadgesStyle}>
            <span style={navLevelBadgeStyle}>
              {getLevelLabelI18n(draft.meta.levelId, track)}
            </span>
            <span style={navTrackBadgeStyle}>
              {getTrackLabelI18n(track)}
            </span>
          </div>
        </div>
        <div style={navLineStyle} />
      </nav>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={heroPatternStyle} />
        <div style={heroContentStyle}>
          <div style={heroInnerStyle}>
            <div>
              <div style={heroEyebrowStyle}>{L.docSetup}</div>
              <h1 style={heroTitleStyle}>{draft.meta.title || L.toolTitle}</h1>
            </div>
            <ExportPdfButton documentModel={documentModel} />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={bodyStyle}>
        <div style={ui.pageFrame}>
          <div style={editorStyle}>
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

          <div style={previewStyle}>
            <div style={previewHeaderStyle}>
              <span style={{ fontSize: 14, fontWeight: 900, color: NAVY }}>📄 معاينة الوثيقة</span>
              <ExportPdfButton documentModel={documentModel} />
            </div>
            <PreviewPanel documentModel={documentModel} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Nav ── */
const navStyle = {
  position: "sticky" as const,
  top: 0,
  zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};
const navInnerStyle = {
  maxWidth: 1400,
  margin: "0 auto",
  padding: "0 24px",
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const navLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};
const navBackStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#64748B",
  textDecoration: "none",
};
const navSepStyle = {
  color: "#CBD5E1",
  fontSize: 14,
};
const navTitleStyle = {
  fontSize: 14,
  fontWeight: 900,
  color: NAVY,
};
const navBadgesStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};
const navLevelBadgeStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: NAVY,
  backgroundColor: "#F1F5F9",
  borderWidth: 1.5,
  borderStyle: "solid",
  borderColor: "#E2E8F0",
  borderRadius: 8,
  padding: "3px 10px",
};
const navTrackBadgeStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: GOLD,
  backgroundColor: "#FFFBEB",
  borderWidth: 1.5,
  borderStyle: "solid",
  borderColor: "#FDE68A",
  borderRadius: 8,
  padding: "3px 10px",
};
const navLineStyle = {
  height: 3,
  background: `linear-gradient(90deg, ${NAVY} 0%, ${GOLD} 50%, transparent 100%)`,
};

/* ── Hero ── */
const heroStyle = {
  position: "relative" as const,
  overflow: "hidden" as const,
  background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 60%, #243F63 100%)`,
  padding: "28px 24px",
};
const heroPatternStyle = {
  position: "absolute" as const,
  inset: 0,
  pointerEvents: "none" as const,
  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};
const heroContentStyle = {
  position: "relative" as const,
  zIndex: 1,
  maxWidth: 1400,
  margin: "0 auto",
};
const heroInnerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
};
const heroEyebrowStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: GOLD,
  marginBottom: 4,
};
const heroTitleStyle = {
  fontSize: 24,
  fontWeight: 900,
  color: "#FFFFFF",
  margin: 0,
  lineHeight: 1.3,
};

/* ── Body ── */
const bodyStyle = {
  padding: "24px",
};

const editorStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 20,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
};

const previewStyle = {
  marginTop: 24,
  width: "100%",
  minWidth: 0,
};

const previewHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};
