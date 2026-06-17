export type PhysicsChemistryDefaultSkill = {
  label: string;
  percentage: number;
  order: number;
};

const GENERAL_TRACK_DEFAULT_SKILLS: PhysicsChemistryDefaultSkill[] = [
  { label: "الاسترداد", percentage: 40, order: 1 },
  { label: "التطبيق", percentage: 40, order: 2 },
  { label: "الوضعية المشكلة", percentage: 20, order: 3 },
];

const INTERNATIONAL_TRACK_DEFAULT_SKILLS: PhysicsChemistryDefaultSkill[] = [
  { label: "Restitution", percentage: 40, order: 1 },
  { label: "Application", percentage: 40, order: 2 },
  { label: "Situation-problème", percentage: 20, order: 3 },
];

export function getPhysicsChemistryDefaultSkills(
  track: "general" | "international"
): PhysicsChemistryDefaultSkill[] {
  const source =
    track === "international"
      ? INTERNATIONAL_TRACK_DEFAULT_SKILLS
      : GENERAL_TRACK_DEFAULT_SKILLS;

  return source.map((s) => ({ ...s }));
}