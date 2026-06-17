import { ExamSessionTerm, ExamTrack } from "./exam-sheet-draft";

export type ExamSheetDocumentSectionType =
  | "metadata"
  | "lessons"
  | "allocation-table"
  | "skills-summary";

export type ExamSheetDocumentModel = {
  meta: {
    title: string;
    institutionName: string;
    teacherName: string;
    subjectLabel: string;
    levelLabel: string;
    track: ExamTrack;
    term: ExamSessionTerm;
    examDurationHours: number;
    totalPoints: number;
    roundingStep: number;
  };

  lessons: ExamSheetDocumentLessonEntry[];

  allocation: {
    totalHours: number;
    rowCount: number;
    lessonPointTotal: number;
    skillTotals: ExamSheetDocumentSkillTotal[];
    table: ExamSheetDocumentAllocationTable;
  };

  sections: ExamSheetDocumentSectionType[];
};

export type ExamSheetDocumentLessonEntry = {
  id: string;
  label: string;
  hours: number;
  order: number;
  objectives: ExamSheetDocumentObjectiveEntry[];
};

export type ExamSheetDocumentObjectiveEntry = {
  id: string;
  text: string;
  source: "reference" | "custom";
};

export type ExamSheetDocumentSkillTotal = {
  skillId: string;
  skillLabel: string;
  percentage: number;
  value: number;
};

export type ExamSheetDocumentAllocationTable = {
  columns: ExamSheetDocumentAllocationColumn[];
  rows: ExamSheetDocumentAllocationRow[];
  footer: {
    skillTotals: number[];
    grandTotal: number;
  };
};

export type ExamSheetDocumentAllocationColumn = {
  skillId: string;
  skillLabel: string;
  percentage: number;
};

export type ExamSheetDocumentAllocationRow = {
  lessonId: string;
  lessonLabel: string;
  lessonPercentage: number;
  lessonPoints: number;
  lessonAdjustment: number;
  skillCells: ExamSheetDocumentAllocationCell[];
};

export type ExamSheetDocumentAllocationCell = {
  skillId: string;
  value: number;
  adjustment: number;
};