export type ExamMeta = {
  school: string;
  level: string;
  className: string;
  teacher: string;
  subject: string;
  year: string;
  term: string;
};

export type StudentRecord = {
  name: string;
  grades: (number | null)[];   // index 0=F1, 1=F2, 2=F3
  absents: boolean[];          // index 0=F1, 1=F2, 2=F3
};

export type ExamData = {
  meta: ExamMeta;
  students: StudentRecord[];
};

export type GradeBand = {
  label: string;
  range: string;
  count: number;
};

export type ExamStats = {
  examLabel: string;
  total: number;
  absentCount: number;
  presentCount: number;
  avg: number;
  median: number;
  stdDev: number;
  max: number;
  min: number;
  passingCount: number;
  passRate: number;
  bands: GradeBand[];
};
