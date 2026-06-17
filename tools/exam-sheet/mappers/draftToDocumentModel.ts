import { ExamSheetDraft } from "../types/exam-sheet-draft";
import {
  ExamSheetDocumentAllocationRow,
  ExamSheetDocumentModel,
  ExamSheetDocumentSkillTotal,
} from "../types/exam-sheet-document";
import { ExamSheetCalculationResult } from "@/lib/calculations/exam-sheet";

export function draftToDocumentModel(
  draft: ExamSheetDraft,
  calculationResult: ExamSheetCalculationResult
): ExamSheetDocumentModel {
  const skillTotals: ExamSheetDocumentSkillTotal[] = draft.skills.map(
    (skill, index) => ({
      skillId: skill.id,
      skillLabel: skill.label || `Skill ${index + 1}`,
      percentage: skill.percentage,
      value: calculationResult.totalsBySkill[index] ?? 0,
    })
  );

  const tableRows: ExamSheetDocumentAllocationRow[] = calculationResult.rows.map(
    (row, rowIndex) => {
      const draftLesson = draft.lessons.find(
        (lesson) => lesson.id === row.lessonEntryId
      );

      return {
        lessonId: row.lessonEntryId,
        lessonLabel:
          draftLesson?.label || row.lessonLabel || `Lesson ${rowIndex + 1}`,
        lessonPercentage: row.percentage,
        lessonPoints: row.points,
        lessonAdjustment: row.lessonAdjustment,
        skillCells: draft.skills.map((skill, skillIndex) => ({
          skillId: skill.id,
          value: row.skills[skillIndex] ?? 0,
          adjustment: row.skillAdjustments[skillIndex] ?? 0,
        })),
      };
    }
  );

  return {
    meta: {
      title: draft.meta.title,
      institutionName: draft.meta.institutionName,
      teacherName: draft.meta.teacherName,
      subjectLabel: draft.meta.subjectLabel,
      levelLabel: draft.meta.levelLabel,
      track: draft.meta.track,
      term: draft.meta.term,
      examDurationHours: draft.meta.examDurationHours,
      totalPoints: draft.meta.totalPoints,
      roundingStep: draft.meta.roundingStep,
    },

    lessons: [...draft.lessons]
      .sort((a, b) => a.order - b.order)
      .map((lesson, index) => ({
        id: lesson.id,
        label: lesson.label || `Lesson ${index + 1}`,
        hours: lesson.hours,
        order: lesson.order,
        objectives: lesson.objectives.map((objective) => ({
          id: objective.id,
          text: objective.text,
          source: objective.source,
        })),
      })),

    allocation: {
      totalHours: calculationResult.totalHours,
      rowCount: calculationResult.rows.length,
      lessonPointTotal: calculationResult.lessonPointTotal,
      skillTotals,
      table: {
        columns: draft.skills.map((skill, index) => ({
          skillId: skill.id,
          skillLabel: skill.label || `Skill ${index + 1}`,
          percentage: skill.percentage,
        })),
        rows: tableRows,
        footer: {
          skillTotals: calculationResult.totalsBySkill,
          grandTotal: calculationResult.lessonPointTotal,
        },
      },
    },

    sections: ["metadata", "lessons", "allocation-table", "skills-summary"],
  };
}