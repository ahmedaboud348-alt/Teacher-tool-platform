"use client";

import { useState } from "react";
import {
  ExamSheetDraft,
  ExamSheetDraftLesson,
  ExamSheetDraftObjective,
  ExamSheetDraftSkill,
  ExamTrack,
} from "../types/exam-sheet-draft";
import { createInitialExamSheetDraft } from "../defaults/createInitialExamSheetDraft";
import type { LessonSuggestion } from "./useLessonSuggestions";

type Params = {
  track: ExamTrack;
  levelId: string;
};

export function useExamSheetDraft({ track, levelId }: Params) {
  const [draft, setDraft] = useState<ExamSheetDraft>(() =>
    createInitialExamSheetDraft({
      track,
      levelId,
    })
  );

  function updateMeta<K extends keyof ExamSheetDraft["meta"]>(
    key: K,
    value: ExamSheetDraft["meta"][K]
  ) {
    setDraft((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value,
      },
    }));
  }

  function addLesson() {
    setDraft((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: crypto.randomUUID(),
          referenceLessonId: null,
          label: "",
          hours: 1,
          objectives: [],
          source: "custom",
          order: prev.lessons.length + 1,
        },
      ],
    }));
  }

  function updateLesson(
    lessonId: string,
    patch: Partial<ExamSheetDraftLesson>
  ) {
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...patch } : lesson
      ),
    }));
  }

  function removeLesson(lessonId: string) {
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons
        .filter((lesson) => lesson.id !== lessonId)
        .map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
    }));
  }

  function applyLessonReference(
    lessonId: string,
    lessonReference: LessonSuggestion
  ) {
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) => {
        if (lesson.id !== lessonId) {
          return lesson;
        }

        return {
          ...lesson,
          referenceLessonId: lessonReference.id,
          label: lessonReference.label,
          hours: lessonReference.defaultDurationHours,
          objectives: lessonReference.defaultObjectives.map((text) => ({
            id: crypto.randomUUID(),
            text,
            source: "reference" as const,
          })),
          source: "catalog" as const,
        };
      }),
    }));
  }

  function addObjective(lessonId: string) {
    const newObjective: ExamSheetDraftObjective = {
      id: crypto.randomUUID(),
      text: "",
      source: "custom",
    };

    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              objectives: [...lesson.objectives, newObjective],
            }
          : lesson
      ),
    }));
  }

  function updateObjective(
    lessonId: string,
    objectiveId: string,
    text: string
  ) {
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              objectives: lesson.objectives.map((objective) =>
                objective.id === objectiveId ? { ...objective, text } : objective
              ),
            }
          : lesson
      ),
    }));
  }

  function removeObjective(lessonId: string, objectiveId: string) {
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              objectives: lesson.objectives.filter(
                (objective) => objective.id !== objectiveId
              ),
            }
          : lesson
      ),
    }));
  }

  function addSkill() {
    setDraft((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: crypto.randomUUID(),
          label: "",
          percentage: 0,
          order: prev.skills.length + 1,
        },
      ],
    }));
  }

  function updateSkill(skillId: string, patch: Partial<ExamSheetDraftSkill>) {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === skillId ? { ...skill, ...patch } : skill
      ),
    }));
  }

  function removeSkill(skillId: string) {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills
        .filter((skill) => skill.id !== skillId)
        .map((skill, index) => ({
          ...skill,
          order: index + 1,
        })),
    }));
  }

  return {
    draft,
    setDraft,
    updateMeta,
    addLesson,
    updateLesson,
    removeLesson,
    applyLessonReference,
    addObjective,
    updateObjective,
    removeObjective,
    addSkill,
    updateSkill,
    removeSkill,
  };
}