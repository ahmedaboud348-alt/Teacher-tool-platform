export type ExamSheetCalculationInput = {
  totalPoints: number;
  roundingStep: number;
  lessons: {
    id: string;
    label: string;
    hours: number;
  }[];
  skills: {
    id: string;
    label: string;
    percentage: number;
  }[];
};

export type ExamSheetCalculationResult = {
  rows: {
    lessonEntryId: string;
    lessonLabel: string;
    hours: number;
    percentage: number;
    points: number;
    rawPoints: number;
    lessonAdjustment: number;
    skills: number[];
    rawSkills: number[];
    skillAdjustments: number[];
  }[];
  totalHours: number;
  lessonPointTotal: number;
  totalsBySkill: number[];
  percentageTotal: number;
  columnTargetPoints: number[];
  balanceSummary: {
    adjustedCells: number;
    maxAdjustment: number;
    totalAbsoluteAdjustment: number;
  };
};

export type NormalizedSkill = {
  id: string;
  label: string;
  percentage: number; // normalized ratio in [0..1], sum = 1
};

export type NormalizedExamSheetCalculationInput = {
  totalPoints: number;
  roundingStep: number;
  lessons: {
    id: string;
    label: string;
    hours: number;
  }[];
  skills: NormalizedSkill[];
};

export type UnitContext = {
  step: number;
  unitsPerPoint: number;
  precision: number;
};

export type MatrixBalanceInput = {
  rawMatrix: number[][];
  rowTargets: number[];
  columnTargets: number[];
  roundingStep: number;
};

export type MatrixBalanceResult = {
  matrix: number[][];
  adjustments: number[][];
};

export class ExamSheetCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExamSheetCalculationError";
  }
}