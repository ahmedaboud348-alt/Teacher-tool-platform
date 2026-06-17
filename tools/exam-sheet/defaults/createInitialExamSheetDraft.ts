import { getPhysicsChemistryDefaultSkills } from "@/lib/subjects/physics-chemistry/default-skills";
import type { ExamSheetDraft, ExamTrack } from "../types/exam-sheet-draft";
import { getLevelLabelI18n } from "../i18n";

type Params = {
  track: ExamTrack;
  levelId: string;
};

function getDefaultTitle(track: ExamTrack): string {
  return track === "international" ? "Fiche d'évaluation n°1" : "جذاذة الفرض المحروس رقم 1";
}

function getSubjectLabel(track: ExamTrack): string {
  return track === "international" ? "Physique-Chimie" : "الفيزياء والكيمياء";
}

export function createInitialExamSheetDraft({
  track,
  levelId,
}: Params): ExamSheetDraft {
  const defaultSkills = getPhysicsChemistryDefaultSkills(track);

  return {
    meta: {
      title: getDefaultTitle(track),
      institutionName: "",
      teacherName: "",
      subjectId: "physics-chemistry",
      subjectLabel: getSubjectLabel(track),
      levelId,
      levelLabel: getLevelLabelI18n(levelId, track),
      track,
      term: "first",
      examDurationHours: 2,
      totalPoints: 20,
      roundingStep: 0.5,
    },

    lessons: [
      {
        id: crypto.randomUUID(),
        referenceLessonId: null,
        label: "",
        hours: 1,
        objectives: [],
        source: "custom",
        order: 1,
      },
    ],

    skills: defaultSkills.map((skill) => ({
      id: crypto.randomUUID(),
      label: skill.label,
      percentage: skill.percentage,
      order: skill.order,
    })),

    ui: {
      expandedSections: {
        metadata: true,
        lessons: true,
        skills: true,
      },
      selectedLessonId: null,
    },
  };
}