export type ExamSheetDraft = {
  meta: {
    title: string;
    institutionName: string;
    teacherName: string;
    subjectId: string;
    subjectLabel: string;
    levelId: string;
    levelLabel: string;
    track: "general" | "international";
    totalPoints: number;
    roundingStep: number;
  };
  lessons: Array<{
    id: string;
    referenceLessonId?: string | null;
    label: string;
    hours: number;
    objectives: Array<{
      id: string;
      text: string;
      source: "reference" | "custom";
    }>;
    source: "catalog" | "custom";
    order: number;
  }>;
  skills: Array<{
    id: string;
    label: string;
    percentage: number;
    order: number;
  }>;
  ui: {
    selectedLessonIdForFocus?: string | null;
    expandedSectionIds: string[];
    touched: boolean;
  };
};
