/**
 * Bilingual (Arabic / French) label maps shared by the grade-book and
 * attendance-sheet PDF builders. A single `lang` flag on the config switches
 * every generated string; free-text fields the teacher typed (directorate,
 * subject, class names) are always kept verbatim.
 */
export type Lang = "ar" | "fr";

/** Cover-page strings common to both tools. */
export const COVER_L = {
  kingdom:  { ar: "المملكة المغربية", fr: "Royaume du Maroc" },
  ministry: {
    ar: "وزارة التربية الوطنية والتعليم الأولي والرياضة",
    fr: "Ministère de l'Éducation Nationale, du Préscolaire et des Sports",
  },
  yearLabel:        { ar: "السنة الدراسية", fr: "Année scolaire" },
  teacherM:         { ar: "الأستاذ", fr: "Professeur" },
  teacherF:         { ar: "الأستاذة", fr: "Professeure" },
  gradeBookTitle:   { ar: "دفتر التنقيط", fr: "Carnet de Notes" },
  attendanceTitle:  { ar: "سجل الغياب", fr: "Registre des Absences" },
  cahierTitle:      { ar: "دفتر النصوص", fr: "Cahier de Textes" },
  subjectLabel:     { ar: "المادة", fr: "Matière" },
  levelLabel:       { ar: "المستوى", fr: "Niveau" },
} as const;

export function pick<T extends { ar: string; fr: string }>(m: T, lang: Lang): string {
  return lang === "fr" ? m.fr : m.ar;
}

export function termLabel(term: "first" | "second" | "both", lang: Lang): string {
  if (lang === "fr") return term === "second" ? "2ème Semestre" : "1er Semestre";
  return term === "second" ? "الدورة الثانية" : "الدورة الأولى";
}

/** Translate the fixed tier options; unknown / free values pass through. */
export function tierLabel(tier: string, lang: Lang): string {
  if (lang === "ar" || !tier) return tier;
  const map: Record<string, string> = {
    "التعليم الابتدائي": "Enseignement Primaire",
    "الثانوي الإعدادي": "Secondaire Collégial",
    "الثانوي التأهيلي": "Secondaire Qualifiant",
  };
  return map[tier] || tier;
}
