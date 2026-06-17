import {
  ExamSheetCalculationError,
  ExamSheetCalculationInput,
  NormalizedExamSheetCalculationInput,
} from "./types";

const EPSILON = 1e-9;

function ensureFiniteNumber(value: number, field: string): void {
  if (!Number.isFinite(value)) {
    throw new ExamSheetCalculationError(`${field} must be a finite number.`);
  }
}

function assertUniqueIds(
  items: { id: string }[],
  fieldName: "lessons" | "skills"
): void {
  const seen = new Set<string>();

  for (const item of items) {
    const normalizedId = String(item.id).trim();

    if (!normalizedId) {
      throw new ExamSheetCalculationError(
        `${fieldName} contains an item with an empty id.`
      );
    }

    if (seen.has(normalizedId)) {
      throw new ExamSheetCalculationError(
        `${fieldName} contains duplicate id "${normalizedId}".`
      );
    }

    seen.add(normalizedId);
  }
}

function assertDivisibleByStep(totalPoints: number, roundingStep: number): void {
  const quotient = totalPoints / roundingStep;
  const nearestInteger = Math.round(quotient);

  if (Math.abs(quotient - nearestInteger) > EPSILON) {
    throw new ExamSheetCalculationError(
      "totalPoints must be exactly divisible by roundingStep."
    );
  }
}

export function validateExamSheetCalculationInput(
  input: ExamSheetCalculationInput
): void {
  if (!input || typeof input !== "object") {
    throw new ExamSheetCalculationError("Input must be a valid object.");
  }

  ensureFiniteNumber(input.totalPoints, "totalPoints");
  ensureFiniteNumber(input.roundingStep, "roundingStep");

  if (input.totalPoints <= 0) {
    throw new ExamSheetCalculationError("totalPoints must be greater than 0.");
  }

  if (input.roundingStep <= 0) {
    throw new ExamSheetCalculationError(
      "roundingStep must be greater than 0."
    );
  }

  assertDivisibleByStep(input.totalPoints, input.roundingStep);

  if (!Array.isArray(input.lessons) || input.lessons.length === 0) {
    throw new ExamSheetCalculationError("At least one lesson is required.");
  }

  if (!Array.isArray(input.skills) || input.skills.length === 0) {
    throw new ExamSheetCalculationError("At least one skill is required.");
  }

  assertUniqueIds(input.lessons, "lessons");
  assertUniqueIds(input.skills, "skills");

  let totalHours = 0;
  for (const lesson of input.lessons) {
    ensureFiniteNumber(lesson.hours, `lesson "${lesson.id}" hours`);

    if (lesson.hours < 0) {
      throw new ExamSheetCalculationError(
        `Lesson "${lesson.id}" has negative hours.`
      );
    }

    totalHours += lesson.hours;
  }

  if (totalHours <= EPSILON) {
    throw new ExamSheetCalculationError(
      "Total lesson hours must be greater than 0."
    );
  }

  let skillPercentageTotal = 0;
  for (const skill of input.skills) {
    ensureFiniteNumber(skill.percentage, `skill "${skill.id}" percentage`);

    if (skill.percentage < 0) {
      throw new ExamSheetCalculationError(
        `Skill "${skill.id}" has negative percentage.`
      );
    }

    skillPercentageTotal += skill.percentage;
  }

  if (skillPercentageTotal <= EPSILON) {
    throw new ExamSheetCalculationError(
      "Total skill percentages must be greater than 0."
    );
  }
}

export function normalizeExamSheetCalculationInput(
  input: ExamSheetCalculationInput
): NormalizedExamSheetCalculationInput {
  validateExamSheetCalculationInput(input);

  const skillTotal = input.skills.reduce(
    (sum, skill) => sum + skill.percentage,
    0
  );

  return {
    totalPoints: input.totalPoints,
    roundingStep: input.roundingStep,
    lessons: input.lessons.map((lesson) => ({
      id: String(lesson.id).trim(),
      label: String(lesson.label ?? "").trim(),
      hours: lesson.hours,
    })),
    skills: input.skills.map((skill) => ({
      id: String(skill.id).trim(),
      label: String(skill.label ?? "").trim(),
      percentage: skill.percentage / skillTotal,
    })),
  };
}