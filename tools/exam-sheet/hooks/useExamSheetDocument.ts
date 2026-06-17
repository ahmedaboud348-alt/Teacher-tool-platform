"use client";

import { useMemo } from "react";
import { ExamSheetDraft } from "../types/exam-sheet-draft";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";
import { draftToDocumentModel } from "../mappers/draftToDocumentModel";
import { ExamSheetCalculationResult } from "@/lib/calculations/exam-sheet";

export function useExamSheetDocument(
  draft: ExamSheetDraft,
  calculationResult: ExamSheetCalculationResult | null
): ExamSheetDocumentModel | null {
  return useMemo(() => {
    if (!calculationResult) {
      return null;
    }

    return draftToDocumentModel(draft, calculationResult);
  }, [draft, calculationResult]);
}