export type { MassarData, MassarMeta } from "../grading-sheet/types";

export type CoverVariant = "male" | "female";

export type DailyAttendanceConfig = {
  academy: string;      // الأكاديمية الجهوية
  directorate: string;  // المديرية الإقليمية
  school: string;       // المؤسسة
  teacher: string;      // الأستاذ(ة)
  level: string;        // المستوى
  coverVariant: CoverVariant;
};
