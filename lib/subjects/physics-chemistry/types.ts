export type SubjectTrack = "general" | "international";

export type PhysicsChemistryLevelId =
  | "1ac"
  | "2ac"
  | "3ac";

export type PhysicsChemistryLessonReference = {
  id: string;
  label: string;
  levelId: PhysicsChemistryLevelId;
  track: SubjectTrack;

  defaultDurationHours: number;

  defaultObjectives: string[];

  keywords?: string[];
};