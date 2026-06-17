import {
  ExamSheetCalculationError,
  MatrixBalanceInput,
  MatrixBalanceResult,
} from "./types";
import {
  createUnitContext,
  fromUnits,
  roundForOutput,
  sum,
  sumColumn,
  toNearestUnits,
  toRawUnits,
} from "./units";

type Candidate = {
  rowIndex: number;
  columnIndex: number;
  fraction: number;
  rawUnits: number;
};

function compareCandidates(a: Candidate, b: Candidate): number {
  if (b.fraction !== a.fraction) {
    return b.fraction - a.fraction;
  }

  if (b.rawUnits !== a.rawUnits) {
    return b.rawUnits - a.rawUnits;
  }

  if (a.rowIndex !== b.rowIndex) {
    return a.rowIndex - b.rowIndex;
  }

  return a.columnIndex - b.columnIndex;
}

export function balanceMatrix(
  input: MatrixBalanceInput
): MatrixBalanceResult {
  const ctx = createUnitContext(input.roundingStep);

  const rowCount = input.rawMatrix.length;
  const columnCount = input.rawMatrix[0]?.length ?? 0;

  if (rowCount === 0 || columnCount === 0) {
    return {
      matrix: [],
      adjustments: [],
    };
  }

  const rowTargetUnits = input.rowTargets.map((value) =>
    toNearestUnits(value, ctx)
  );
  const columnTargetUnits = input.columnTargets.map((value) =>
    toNearestUnits(value, ctx)
  );

  const rawUnitsMatrix: number[][] = input.rawMatrix.map((row) =>
    row.map((cell) => toRawUnits(cell, ctx))
  );

  const baseUnitsMatrix: number[][] = rawUnitsMatrix.map((row) =>
    row.map((cell) => Math.floor(cell))
  );

  const fractions: number[][] = rawUnitsMatrix.map((row, rowIndex) =>
    row.map((cell, columnIndex) => cell - baseUnitsMatrix[rowIndex][columnIndex])
  );

  const rowDeficits = rowTargetUnits.map(
    (target, rowIndex) => target - sum(baseUnitsMatrix[rowIndex])
  );

  const columnDeficits = columnTargetUnits.map(
    (target, columnIndex) => target - sumColumn(baseUnitsMatrix, columnIndex)
  );

  const totalRowDeficit = sum(rowDeficits);
  const totalColumnDeficit = sum(columnDeficits);

  if (totalRowDeficit !== totalColumnDeficit) {
    throw new ExamSheetCalculationError(
      `Matrix balancing failed: row deficit (${totalRowDeficit}) does not match column deficit (${totalColumnDeficit}).`
    );
  }

  while (sum(rowDeficits) > 0) {
    let bestCandidate: Candidate | null = null;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      if (rowDeficits[rowIndex] <= 0) {
        continue;
      }

      for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
        if (columnDeficits[columnIndex] <= 0) {
          continue;
        }

        const candidate: Candidate = {
          rowIndex,
          columnIndex,
          fraction: fractions[rowIndex][columnIndex],
          rawUnits: rawUnitsMatrix[rowIndex][columnIndex],
        };

        if (
          !bestCandidate ||
          compareCandidates(candidate, bestCandidate) < 0
        ) {
          bestCandidate = candidate;
        }
      }
    }

    if (!bestCandidate) {
      throw new ExamSheetCalculationError(
        "Matrix balancing failed: no valid candidate found while deficits remain."
      );
    }

    baseUnitsMatrix[bestCandidate.rowIndex][bestCandidate.columnIndex] += 1;
    rowDeficits[bestCandidate.rowIndex] -= 1;
    columnDeficits[bestCandidate.columnIndex] -= 1;
  }

  const matrix = baseUnitsMatrix.map((row) =>
    row.map((cellUnits) => fromUnits(cellUnits, ctx))
  );

  const adjustments = matrix.map((row, rowIndex) =>
    row.map((value, columnIndex) =>
      roundForOutput(value - input.rawMatrix[rowIndex][columnIndex], ctx)
    )
  );

  return {
    matrix,
    adjustments,
  };
}