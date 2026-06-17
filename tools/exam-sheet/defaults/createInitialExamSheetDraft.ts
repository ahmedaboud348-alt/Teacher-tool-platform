import { getPhysicsChemistryDefaultSkills } from "@/lib/subjects/physics-chemistry/default-skills";
import type { ExamSheetDraft, ExamTrack } from "../types/exam-sheet-draft";

type Params = {
  track: ExamTrack;
  levelId: string;
};

function getLevelLabel(levelId: string): string {
  switch (levelId) {
    case "1ac": return "الأولى إعدادي";
    case "2ac": return "الثانية إعدادي";
    case "3ac": return "الثالثة إعدادي";
    default:    return levelId;
  }
}

export function createInitialExamSheetDraft({
  track,
  levelId,
}: Params): ExamSheetDraft {
  const defaultSkills = getPhysicsChemistryDefaultSkills(track);

  return {
    meta: {
      title: "جذاذة الفرض المحروس رقم 1",
      institutionName: "",
      teacherName: "",
      subjectId: "physics-chemistry",
      subjectLabel: "الفيزياء والكيمياء",
      levelId,
      levelLabel: getLevelLabel(levelId),
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