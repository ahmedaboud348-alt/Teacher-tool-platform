export type ExamTrack = "general" | "international";
export type ExamSessionTerm = "first" | "second";

export type ExamSheetDraft = {
  meta: {
    title: string;
    institutionName: string;

    teacherName: string;

    subjectId: string;
    subjectLabel: string;

    levelId: string;
    levelLabel: string;

    track: ExamTrack;
    term: ExamSessionTerm;

    examDurationHours: number;

    totalPoints: number;
    roundingStep: number;
  };

  lessons: ExamSheetDraftLesson[];

  skills: ExamSheetDraftSkill[];

  ui: ExamSheetDraftUIState;
};

export type ExamSheetDraftLesson = {
  id: string;

  referenceLessonId: string | null;

  label: string;

  hours: number;

  objectives: ExamSheetDraftObjective[];

  source: "catalog" | "custom";

  order: number;
};

export type ExamSheetDraftObjective = {
  id: string;
  text: string;
  source: "reference" | "custom";
};

export type ExamSheetDraftSkill = {
  id: string;
  label: string;
  percentage: number;
  order: number;
};

export type ExamSheetDraftUIState = {
  expandedSections: {
    metadata: boolean;
    lessons: boolean;
    skills: boolean;
  };

  selectedLessonId: string | null;
};