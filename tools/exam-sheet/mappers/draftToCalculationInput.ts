import { ExamSheetDraft } from "../types/exam-sheet-draft";
import { ExamSheetCalculationInput } from "@/lib/calculations/exam-sheet";

/**
 * تحويل Draft (واجهة المستخدم)
 * إلى CalculationInput الذي يتوقعه Calculation Engine.
 *
 * لا يحتوي أي منطق حسابي.
 */
export function draftToCalculationInput(
  draft: ExamSheetDraft
): ExamSheetCalculationInput {
  return {
    totalPoints: draft.meta.totalPoints,
    roundingStep: draft.meta.roundingStep,

    lessons: draft.lessons.map((lesson) => ({
      id: lesson.id,
      label: lesson.label,
      hours: lesson.hours,
    })),

    skills: draft.skills.map((skill) => ({
      id: skill.id,
      label: skill.label,
      percentage: skill.percentage,
    })),
  };
}