import type { MassarData } from "../grading-sheet/types";

export type GradeBookEntry = {
  id: string;          // unique key (filename + timestamp)
  filename: string;
  data: MassarData;
};

export type GradeBookConfig = {
  prof:           string;
  annee:          string;
  evalCount:      1 | 2 | 3;
  showActivites:  boolean;
  showObservation: boolean;
};
