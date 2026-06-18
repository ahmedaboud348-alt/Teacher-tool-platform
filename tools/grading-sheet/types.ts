export type MassarMeta = {
  school: string;
  academy: string;
  level: string;
  className: string;
  teacher: string;
  term: string;
  subject: string;
  year: string;
};

export type MassarStudent = {
  index: number;
  code: string;
  name: string;
};

export type MassarData = {
  meta: MassarMeta;
  students: MassarStudent[];
};

export type GradingSheetConfig = {
  // Header
  prof: string;
  annee: string;
  classe: string;
  // Columns
  evalCount: 1 | 2 | 3;
  showActivites: boolean;
  showObservation: boolean;
};
