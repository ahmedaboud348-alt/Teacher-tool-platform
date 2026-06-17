import { ExamSheetCalculationError } from "./types";
import {
  createUnitContext,
  isMultipleOfStep,
  sum,
  sumColumn,
  toNearestUnits,
} from "./units";

type IntegrityInput = {
  rowPoints: number[];
  matrix: number[][];
  columnTargets: number[];
  totalPoints: number;
  roundingStep: number;
};

export function assertExamSheetIntegrity(input: IntegrityInput): void {
  const ctx = createUnitContext(input.roundingStep);

  for (const row of input.matrix) {
    for (const value of row) {
      if (value < 0) {
        throw new ExamSheetCalculationError(
          "Integrity check failed: negative matrix value found."
        );
      }

      if (!isMultipleOfStep(value, ctx)) {
        throw new ExamSheetCalculationError(
          "Integrity check failed: matrix value is not a multiple of roundingStep."
        );
      }
    }
  }

  for (const value of input.rowPoints) {
    if (value < 0) {
      throw new ExamSheetCalculationError(
        "Integrity check failed: negative lesson points found."
      );
    }

    if (!isMultipleOfStep(value, ctx)) {
      throw new ExamSheetCalculationError(
        "Integrity check failed: lesson points are not a multiple of roundingStep."
      );
    }
  }

  for (const value of input.columnTargets) {
    if (value < 0) {
      throw new ExamSheetCalculationError(
        "Integrity check failed: negative column target found."
      );
    }

    if (!isMultipleOfStep(value, ctx)) {
      throw new ExamSheetCalculationError(
        "Integrity check failed: column target is not a multiple of roundingStep."
      );
    }
  }

  for (let rowIndex = 0; rowIndex < input.matrix.length; rowIndex += 1) {
    const actual = toNearestUnits(sum(input.matrix[rowIndex]), ctx);
    const expected = toNearestUnits(input.rowPoints[rowIndex], ctx);

    if (actual !== expected) {
      throw new ExamSheetCalculationError(
        `Integrity check failed: row ${rowIndex} total mismatch. Expected ${input.rowPoints[rowIndex]}, got ${sum(
          input.matrix[rowIndex]
        )}.`
      );
    }
  }

  for (let columnIndex = 0; columnIndex < input.columnTargets.length; columnIndex += 1) {
    const actual = toNearestUnits(sumColumn(input.matrix, columnIndex), ctx);
    const expected = toNearestUnits(input.columnTargets[columnIndex], ctx);

    if (actual !== expected) {
      throw new ExamSheetCalculationError(
        `Integrity check failed: column ${columnIndex} total mismatch. Expected ${input.columnTargets[columnIndex]}, got ${sumColumn(
          input.matrix,
          columnIndex
        )}.`
      );
    }
  }

  const rowTotal = toNearestUnits(sum(input.rowPoints), ctx);
  const columnTotal = toNearestUnits(sum(input.columnTargets), ctx);
  const matrixTotal = toNearestUnits(
    input.matrix.reduce((acc, row) => acc + sum(row), 0),
    ctx
  );
  const globalTarget = toNearestUnits(input.totalPoints, ctx);

  if (rowTotal !== globalTarget) {
    throw new ExamSheetCalculationError(
      "Integrity check failed: lesson point total does not match totalPoints."
    );
  }

  if (columnTotal !== globalTarget) {
    throw new ExamSheetCalculationError(
      "Integrity check failed: column total does not match totalPoints."
    );
  }

  if (matrixTotal !== globalTarget) {
    throw new ExamSheetCalculationError(
      "Integrity check failed: matrix total does not match totalPoints."
    );
  }
}