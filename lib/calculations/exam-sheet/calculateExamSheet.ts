import {
  ExamSheetCalculationError,
  ExamSheetCalculationInput,
  ExamSheetCalculationResult,
  NormalizedExamSheetCalculationInput,
} from "./types";
import { normalizeExamSheetCalculationInput } from "./validate";
import { balanceMatrix } from "./balanceMatrix";
import { assertExamSheetIntegrity } from "./integrity";
import {
  createUnitContext,
  fromUnits,
  roundForOutput,
  sum,
  toRawUnits,
} from "./units";

type RankedUnit = {
  index: number;
  fraction: number;
  rawUnits: number;
};

function compareRankedUnits(a: RankedUnit, b: RankedUnit): number {
  if (b.fraction !== a.fraction) {
    return b.fraction - a.fraction;
  }

  if (b.rawUnits !== a.rawUnits) {
    return b.rawUnits - a.rawUnits;
  }

  return a.index - b.index;
}

function balanceVectorToStep(
  rawValues: number[],
  totalValue: number,
  roundingStep: number
): { values: number[]; adjustments: number[] } {
  const ctx = createUnitContext(roundingStep);

  const rawUnits = rawValues.map((value) => toRawUnits(value, ctx));
  const baseUnits = rawUnits.map((value) => Math.floor(value));
  const targetUnits = Math.round(totalValue / roundingStep);

  let remainingUnits = targetUnits - sum(baseUnits);

  const ranked = rawUnits
    .map((value, index) => ({
      index,
      fraction: value - baseUnits[index],
      rawUnits: value,
    }))
    .sort(compareRankedUnits);

  if (ranked.length === 0 && targetUnits > 0) {
    throw new ExamSheetCalculationError(
      "Vector balancing failed: no entries available for remaining units."
    );
  }

  let cursor = 0;
  while (remainingUnits > 0) {
    const current = ranked[cursor % ranked.length];
    baseUnits[current.index] += 1;
    remainingUnits -= 1;
    cursor += 1;
  }

  const values = baseUnits.map((units) => fromUnits(units, ctx));
  const adjustments = values.map((value, index) =>
    roundForOutput(value - rawValues[index], ctx)
  );

  return { values, adjustments };
}

function calculateTotalHours(
  input: NormalizedExamSheetCalculationInput
): number {
  return input.lessons.reduce((acc, lesson) => acc + lesson.hours, 0);
}

function buildBalanceSummary(params: {
  skillAdjustments: number[][];
}): ExamSheetCalculationResult["balanceSummary"] {
  const allAdjustments = params.skillAdjustments.flat();

  const nonZeroAdjustments = allAdjustments.filter(
    (value) => Math.abs(value) > 1e-9
  );

  const adjustedCells = nonZeroAdjustments.length;
  const maxAdjustment =
    nonZeroAdjustments.length === 0
      ? 0
      : Math.max(...nonZeroAdjustments.map((value) => Math.abs(value)));
  const totalAbsoluteAdjustment = nonZeroAdjustments.reduce(
    (acc, value) => acc + Math.abs(value),
    0
  );

  return {
    adjustedCells,
    maxAdjustment,
    totalAbsoluteAdjustment,
  };
}

export function calculateExamSheet(
  input: ExamSheetCalculationInput
): ExamSheetCalculationResult {
  const normalized = normalizeExamSheetCalculationInput(input);
  const ctx = createUnitContext(normalized.roundingStep);

  const totalHours = calculateTotalHours(normalized);

  const lessonRatios = normalized.lessons.map((lesson) =>
    lesson.hours === 0 ? 0 : lesson.hours / totalHours
  );

  const lessonPercentages = lessonRatios.map((ratio) => ratio * 100);

  const rawLessonPoints = lessonRatios.map(
    (ratio) => ratio * normalized.totalPoints
  );

  const balancedLessonPoints = balanceVectorToStep(
    rawLessonPoints,
    normalized.totalPoints,
    normalized.roundingStep
  );

  const columnRawPoints = normalized.skills.map(
    (skill) => skill.percentage * normalized.totalPoints
  );

  const balancedColumnTargets = balanceVectorToStep(
    columnRawPoints,
    normalized.totalPoints,
    normalized.roundingStep
  );

  const rawMatrix = balancedLessonPoints.values.map((lessonPoints) =>
    normalized.skills.map((skill) => lessonPoints * skill.percentage)
  );

  const balancedMatrix = balanceMatrix({
    rawMatrix,
    rowTargets: balancedLessonPoints.values,
    columnTargets: balancedColumnTargets.values,
    roundingStep: normalized.roundingStep,
  });

  assertExamSheetIntegrity({
    rowPoints: balancedLessonPoints.values,
    matrix: balancedMatrix.matrix,
    columnTargets: balancedColumnTargets.values,
    totalPoints: normalized.totalPoints,
    roundingStep: normalized.roundingStep,
  });

  const rows = normalized.lessons.map((lesson, rowIndex) => ({
    lessonEntryId: lesson.id,
    lessonLabel: lesson.label,
    hours: lesson.hours,
    percentage: roundForOutput(lessonPercentages[rowIndex], ctx),
    points: balancedLessonPoints.values[rowIndex],
    rawPoints: roundForOutput(rawLessonPoints[rowIndex], ctx),
    lessonAdjustment: balancedLessonPoints.adjustments[rowIndex],
    skills: balancedMatrix.matrix[rowIndex],
    rawSkills: rawMatrix[rowIndex].map((value) => roundForOutput(value, ctx)),
    skillAdjustments: balancedMatrix.adjustments[rowIndex],
  }));

  const totalsBySkill = normalized.skills.map((_, columnIndex) => {
    const total = rows.reduce(
      (acc, row) => acc + (row.skills[columnIndex] ?? 0),
      0
    );
    return roundForOutput(total, ctx);
  });

  const lessonPointTotal = roundForOutput(
    rows.reduce((acc, row) => acc + row.points, 0),
    ctx
  );

  const percentageTotal = roundForOutput(sum(lessonPercentages), ctx);

  return {
    rows,
    totalHours: roundForOutput(totalHours, ctx),
    lessonPointTotal,
    totalsBySkill,
    percentageTotal,
    columnTargetPoints: balancedColumnTargets.values,
    balanceSummary: buildBalanceSummary({
      skillAdjustments: balancedMatrix.adjustments,
    }),
  };
}