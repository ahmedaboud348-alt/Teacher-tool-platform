"use client";

import { useMemo } from "react";
import { ExamSheetDraft } from "../types/exam-sheet-draft";
import { draftToCalculationInput } from "../mappers/draftToCalculationInput";

import {
  calculateExamSheet,
  ExamSheetCalculationResult,
} from "@/lib/calculations/exam-sheet";

export function useExamSheetCalculation(
  draft: ExamSheetDraft
): ExamSheetCalculationResult | null {
  const calculationInput = useMemo(() => {
    return draftToCalculationInput(draft);
  }, [draft]);

  const calculationResult = useMemo(() => {
    try {
      return calculateExamSheet(calculationInput);
    } catch (error) {
      console.error("Calculation Engine Error:", error);
      return null;
    }
  }, [calculationInput]);

  return calculationResult;
}