export type ExamSheetDocumentModel = {
  meta: {
    title: string;
    institutionName: string;
    teacherName: string;
    subjectLabel: string;
    levelLabel: string;
    track: "general" | "international";
    direction: "rtl" | "ltr";
    totalPoints: number;
    roundingStep: number;
    examDurationMinutes?: number | null;
    semesterLabel?: string;
    notes?: string;
  };
  lessonEntries: Array<{
    id: string;
    label: string;
    hours: number;
    objectives: Array<{
      id: string;
      text: string;
    }>;
  }>;
  allocation: {
    skills: Array<{
      id: string;
      label: string;
    }>;
    rows: Array<{
      lessonId: string;
      lessonLabel: string;
      lessonPercentage: number;
      lessonPoints: number;
      cells: Array<{
        skillId: string;
        value: number;
      }>;
    }>;
    columnTotals: Array<{
      skillId: string;
      value: number;
    }>;
    globalTotal: number;
  };
};
