export type { MassarData, MassarMeta } from "../grading-sheet/types";

export type CoverVariant = "male" | "female";

export type AttendanceConfig = {
  prof: string;
  annee: string;
  sessionsPerWeek: 1 | 2 | 3;
  coverVariant: CoverVariant;
  tier: string;        // المستوى على الغلاف — اختياري (فارغ = يختفي)
  directorate: string; // المديرية على الغلاف — اختياري (فارغ = يختفي)
  term: "first" | "second" | "both"; // الدورة — "both" يُصدّر ملفين
};
