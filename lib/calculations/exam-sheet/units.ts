import { ExamSheetCalculationError, UnitContext } from "./types";

const EPSILON = 1e-9;

function countDecimals(value: number): number {
  const asString = value.toString().toLowerCase();

  if (asString.includes("e-")) {
    const [, exponent] = asString.split("e-");
    const exponentValue = Number(exponent);
    return Number.isFinite(exponentValue) ? exponentValue : 0;
  }

  const parts = asString.split(".");
  return parts[1]?.length ?? 0;
}

function roundWithPrecision(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function createUnitContext(roundingStep: number): UnitContext {
  if (!Number.isFinite(roundingStep) || roundingStep <= 0) {
    throw new ExamSheetCalculationError(
      "roundingStep must be a finite number greater than 0."
    );
  }

  const precision = countDecimals(roundingStep);
  const unitsPerPointRaw = 1 / roundingStep;
  const unitsPerPointRounded = Math.round(unitsPerPointRaw);

  if (Math.abs(unitsPerPointRaw - unitsPerPointRounded) > EPSILON) {
    throw new ExamSheetCalculationError(
      `roundingStep "${roundingStep}" is not supported by integer unit conversion.`
    );
  }

  return {
    step: roundingStep,
    unitsPerPoint: unitsPerPointRounded,
    precision,
  };
}

export function toRawUnits(value: number, ctx: UnitContext): number {
  return value / ctx.step;
}

export function toNearestUnits(value: number, ctx: UnitContext): number {
  return Math.round(toRawUnits(value, ctx));
}

export function floorUnits(value: number, ctx: UnitContext): number {
  return Math.floor(toRawUnits(value, ctx) + EPSILON);
}

export function fromUnits(units: number, ctx: UnitContext): number {
  return roundWithPrecision(units * ctx.step, ctx.precision);
}

export function isMultipleOfStep(value: number, ctx: UnitContext): boolean {
  const rawUnits = toRawUnits(value, ctx);
  return Math.abs(rawUnits - Math.round(rawUnits)) <= EPSILON;
}

export function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function sumColumn(matrix: number[][], columnIndex: number): number {
  let total = 0;
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    total += matrix[rowIndex][columnIndex] ?? 0;
  }
  return total;
}

export function roundForOutput(value: number, ctx: UnitContext): number {
  return roundWithPrecision(value, ctx.precision + 6);
}