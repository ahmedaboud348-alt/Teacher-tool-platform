export type { MassarData, MassarMeta } from "../grading-sheet/types";

export type AttendanceConfig = {
  prof: string;
  annee: string;
  sessionsPerWeek: 1 | 2 | 3;
};
