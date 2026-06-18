import type { ExamStats, GradeBand, StudentRecord } from "./types";

const EXAM_LABELS = ["الفرض الأول", "الفرض الثاني", "الفرض الثالث"];

export function computeExamStats(students: StudentRecord[], examIndex: 0 | 1 | 2): ExamStats {
  const total = students.length;
  let absentCount = 0;
  const grades: number[] = [];

  for (const s of students) {
    if (s.absents[examIndex] || s.grades[examIndex] == null) {
      absentCount++;
    } else {
      grades.push(s.grades[examIndex] as number);
    }
  }

  const presentCount = grades.length;
  const avg = presentCount > 0 ? grades.reduce((a, b) => a + b, 0) / presentCount : 0;

  const sorted = [...grades].sort((a, b) => a - b);
  const median =
    presentCount === 0
      ? 0
      : presentCount % 2 === 0
      ? (sorted[presentCount / 2 - 1] + sorted[presentCount / 2]) / 2
      : sorted[Math.floor(presentCount / 2)];

  const variance =
    presentCount > 0
      ? grades.reduce((s, g) => s + (g - avg) ** 2, 0) / presentCount
      : 0;
  const stdDev = Math.sqrt(variance);

  const passingCount = grades.filter(g => g >= 10).length;
  const passRate = presentCount > 0 ? (passingCount / presentCount) * 100 : 0;
  const max = presentCount > 0 ? Math.max(...grades) : 0;
  const min = presentCount > 0 ? Math.min(...grades) : 0;

  const bands: GradeBand[] = [
    { label: "ضعيف جداً",  range: "[0 – 5[",   count: grades.filter(g => g < 5).length },
    { label: "ضعيف",       range: "[5 – 10[",  count: grades.filter(g => g >= 5 && g < 10).length },
    { label: "متوسط–جيد",  range: "[10 – 15[", count: grades.filter(g => g >= 10 && g < 15).length },
    { label: "جيد جداً–ممتاز", range: "[15 – 20]", count: grades.filter(g => g >= 15).length },
  ];

  return {
    examLabel: EXAM_LABELS[examIndex],
    total,
    absentCount,
    presentCount,
    avg,
    median,
    stdDev,
    max,
    min,
    passingCount,
    passRate,
    bands,
  };
}
