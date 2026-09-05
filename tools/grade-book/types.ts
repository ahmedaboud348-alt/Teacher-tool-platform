import type { MassarData } from "../grading-sheet/types";

export type GradeBookEntry = {
  id: string;          // unique key (filename + timestamp)
  filename: string;
  data: MassarData;
};

export type CoverVariant = "male" | "female";

export type GradeBookConfig = {
  prof:           string;
  annee:          string;
  subject:        string; // المادة الدراسية على الغلاف
  evalCount:      1 | 2 | 3 | 4;
  showActivites:  boolean;
  showObservation: boolean;
  coverVariant:   CoverVariant;
  tier:           string; // المستوى التعليمي على الغلاف — اختياري (فارغ = يختفي)
  directorate:    string; // المديرية على الغلاف — اختياري (فارغ = يختفي)
  term:           "first" | "second" | "both"; // الدورة — "both" يُصدّر ملفين
  lang:           "ar" | "fr"; // لغة المستند المُنتَج
};
