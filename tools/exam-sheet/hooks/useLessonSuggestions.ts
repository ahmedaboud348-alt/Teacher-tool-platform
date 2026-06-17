"use client";

import { useMemo } from "react";
import type { ExamTrack } from "../types/exam-sheet-draft";
import { searchPhysicsChemistryLessons } from "@/lib/subjects/physics-chemistry";

export type LessonSuggestion = {
  id: string;
  label: string;
  levelId: string;
  track: ExamTrack;
  defaultDurationHours: number;
  defaultObjectives: string[];
};

type Params = {
  query: string;
  levelId: string;
  track: ExamTrack;
};

export function useLessonSuggestions({
  query,
  levelId,
  track,
}: Params): LessonSuggestion[] {
  return useMemo(() => {
    const normalizedQuery = query.trim();



    if (!normalizedQuery) {
      console.log("lesson search result", []);
      return [];
    }

    const results = searchPhysicsChemistryLessons({
      levelId: levelId as "1ac" | "2ac" | "3ac",
      track,
      query: normalizedQuery,
    });

  

    return results.map((lesson) => ({
      id: lesson.id,
      label: lesson.label,
      levelId: lesson.levelId,
      track: lesson.track,
      defaultDurationHours: lesson.defaultDurationHours,
      defaultObjectives: lesson.defaultObjectives,
    }));
  }, [levelId, query, track]);
}