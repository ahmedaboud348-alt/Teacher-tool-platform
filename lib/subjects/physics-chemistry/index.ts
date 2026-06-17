import { ac1GeneralLessons } from "./lesson-catalog/college/general/1ac";
import { ac2GeneralLessons } from "./lesson-catalog/college/general/2ac";
import { ac3GeneralLessons } from "./lesson-catalog/college/general/3ac";

import { ac1InternationalLessons } from "./lesson-catalog/college/international/1ac";
import { ac2InternationalLessons } from "./lesson-catalog/college/international/2ac";
import { ac3InternationalLessons } from "./lesson-catalog/college/international/3ac";

import type {
  PhysicsChemistryLessonReference,
  PhysicsChemistryLevelId,
  SubjectTrack,
} from "./types";

const ALL_PHYSICS_CHEMISTRY_LESSONS: PhysicsChemistryLessonReference[] = [
  ...ac1GeneralLessons,
  ...ac2GeneralLessons,
  ...ac3GeneralLessons,
  ...ac1InternationalLessons,
  ...ac2InternationalLessons,
  ...ac3InternationalLessons,
];

export function getPhysicsChemistryLessonsByLevelAndTrack(
  levelId: PhysicsChemistryLevelId,
  track: SubjectTrack
): PhysicsChemistryLessonReference[] {
  return ALL_PHYSICS_CHEMISTRY_LESSONS.filter(
    (l) => l.levelId === levelId && l.track === track
  );
}

export function searchPhysicsChemistryLessons(params: {
  levelId: PhysicsChemistryLevelId;
  track: SubjectTrack;
  query: string;
}): PhysicsChemistryLessonReference[] {
  const q = params.query.trim().toLowerCase();

  return getPhysicsChemistryLessonsByLevelAndTrack(
    params.levelId,
    params.track
  ).filter((lesson) => {
    if (!q) return true;

    return (
      lesson.label.toLowerCase().includes(q) ||
      (lesson.keywords ?? []).some((k) => k.toLowerCase().includes(q))
    );
  });
}

export type {
  PhysicsChemistryLessonReference,
  PhysicsChemistryLevelId,
  SubjectTrack,
} from "./types";