import { ExamTrack } from "./types/exam-sheet-draft";

export function getUILabels(track: ExamTrack) {
  if (track === "international") {
    return {
      // App bar / workspace
      brand:           "Plateforme des outils pédagogiques",
      toolTitle:       "Fiche d'évaluation",
      docSetup:        "Préparation du document",
      levelBadge:      "Niveau :",
      trackBadge:      "Filière :",

      // Metadata section
      metaSection:     "Informations générales",
      fieldTitle:      "Titre du document",
      fieldInstitution:"Établissement",
      fieldTerm:       "Session",
      termFirst:       "1ère session",
      termSecond:      "2ème session",
      fieldDuration:   "Durée",
      durationUnit:    "h",
      fieldTotal:      "Note totale",
      fieldRounding:   "Pas d'arrondi",

      // Lessons section
      lessonsSection:  "Leçons concernées",
      addLesson:       "Ajouter une leçon",
      lessonDefault:   "Nouvelle leçon",
      badgeCatalog:    "Référence",
      badgeCustom:     "Personnalisé",
      removeBtn:       "Supprimer",
      fieldLesson:     "Titre de la leçon",
      fieldLessonPh:   "Titre de la leçon",
      fieldLessonDuration: "Durée",

      // Autocomplete
      suggestionsHeader: "Leçons de référence",
      durationSuffix:    "h",

      // Objectives editor
      objectivesTitle:   "Objectifs",
      addObjective:      "Ajouter un objectif",
      objectivePh:       "Texte de l'objectif",
      objectivesEmpty:   "Aucun objectif pour cette leçon.",

      // Skills section
      skillsSection:   "Compétences",
      addSkill:        "Ajouter une compétence",
      skillDefault:    "Nouvelle compétence",
      fieldSkillName:  "Nom de la compétence",
      fieldSkillPh:    "Nom de la compétence",
      fieldSkillPct:   "Pourcentage",

      // Preview panel
      previewEyebrow:  "Aperçu du document",
      previewDefault:  "Fiche d'évaluation",
      previewEmpty:    "Impossible de construire l'aperçu avec les données actuelles.",
      previewTrackLabel: "Filière",
      metaInstitution: "Établissement",
      metaTeacher:     "Professeur(e)",
      metaSubject:     "Matière",
      metaLevel:       "Niveau",
      metaTerm:        "Session",
      metaDuration:    "Durée",
      metaTotal:       "Note totale",
      previewLessons:  "Leçons concernées",
      lessonDurationPrefix: "Durée :",
      objectivesTitlePrev: "Objectifs",
      objectivesEmptyPrev: "Aucun objectif pour cette leçon.",
      tableSection:    "Tableau d'allocation",
      thLesson:        "Leçon",
      thPercent:       "% Cours",
      thNote:          "Note",
      tfTotal:         "Total",
      skillsPreviewSection: "Récapitulatif des compétences",

      // Export button
      exportPdf:       "Exporter PDF",
      exporting:       "Exportation...",
    };
  }

  return {
    // App bar / workspace
    brand:           "منصة الأدوات التربوية",
    toolTitle:       "جذاذة الفرض المحروس",
    docSetup:        "إعداد الوثيقة",
    levelBadge:      "المستوى:",
    trackBadge:      "المسار:",

    // Metadata section
    metaSection:     "المعطيات الأساسية",
    fieldTitle:      "عنوان الوثيقة",
    fieldInstitution:"المؤسسة",
    fieldTerm:       "الدورة",
    termFirst:       "الدورة الأولى",
    termSecond:      "الدورة الثانية",
    fieldDuration:   "مدة الفرض",
    durationUnit:    "س",
    fieldTotal:      "نقطة الفرض",
    fieldRounding:   "درجة التقريب",

    // Lessons section
    lessonsSection:  "الدروس المعتمدة",
    addLesson:       "إضافة درس",
    lessonDefault:   "درس جديد",
    badgeCatalog:    "مرجع",
    badgeCustom:     "مخصص",
    removeBtn:       "حذف",
    fieldLesson:     "عنوان الدرس",
    fieldLessonPh:   "عنوان الدرس",
    fieldLessonDuration: "المدة",

    // Autocomplete
    suggestionsHeader: "الدروس المرجعية",
    durationSuffix:    "س",

    // Objectives editor
    objectivesTitle:   "الأهداف",
    addObjective:      "إضافة هدف",
    objectivePh:       "نص الهدف",
    objectivesEmpty:   "لا توجد أهداف لهذا الدرس بعد.",

    // Skills section
    skillsSection:   "المهارات",
    addSkill:        "إضافة مهارة",
    skillDefault:    "مهارة جديدة",
    fieldSkillName:  "اسم المهارة",
    fieldSkillPh:    "عنوان المهارة",
    fieldSkillPct:   "النسبة",

    // Preview panel
    previewEyebrow:  "معاينة الوثيقة",
    previewDefault:  "جذاذة الفرض المحروس",
    previewEmpty:    "تعذر بناء المعاينة من المعطيات الحالية.",
    previewTrackLabel: "المسار",
    metaInstitution: "المؤسسة",
    metaTeacher:     "الأستاذ",
    metaSubject:     "المادة",
    metaLevel:       "المستوى",
    metaTerm:        "الدورة",
    metaDuration:    "مدة الفرض",
    metaTotal:       "نقطة الفرض",
    previewLessons:  "الدروس المعتمدة",
    lessonDurationPrefix: "المدة:",
    objectivesTitlePrev: "الأهداف",
    objectivesEmptyPrev: "لا توجد أهداف لهذا الدرس بعد.",
    tableSection:    "جدول التخصيص",
    thLesson:        "الدرس",
    thPercent:       "النسبة %",
    thNote:          "النقطة",
    tfTotal:         "المجموع",
    skillsPreviewSection: "مجاميع المهارات",

    // Export button
    exportPdf:       "تصدير PDF",
    exporting:       "جارٍ التصدير...",
  };
}

export function getLevelLabelI18n(levelId: string, track: ExamTrack): string {
  if (track === "international") {
    switch (levelId) {
      case "1ac": return "1ère année collège";
      case "2ac": return "2ème année collège";
      case "3ac": return "3ème année collège";
      default:    return levelId;
    }
  }
  switch (levelId) {
    case "1ac": return "الأولى إعدادي";
    case "2ac": return "الثانية إعدادي";
    case "3ac": return "الثالثة إعدادي";
    default:    return levelId;
  }
}

export function getTrackLabelI18n(track: ExamTrack): string {
  return track === "general" ? "العام" : "Internationale";
}

export function formatObjectivesCountI18n(count: number, track: ExamTrack): string {
  if (track === "international") {
    if (count === 0) return "0 objectif";
    if (count === 1) return "1 objectif";
    return `${count} objectifs`;
  }
  if (count === 1) return "هدف واحد";
  if (count === 2) return "هدفان";
  if (count >= 3 && count <= 10) return `${count} أهداف`;
  if (count >= 11) return `${count} هدفًا`;
  return "0 أهداف";
}

export function formatTermI18n(term: "first" | "second", track: ExamTrack): string {
  if (track === "international") {
    return term === "second" ? "2ème session" : "1ère session";
  }
  return term === "second" ? "الدورة الثانية" : "الدورة الأولى";
}

export function formatDurationI18n(value: number, track: ExamTrack): string {
  const n = !Number.isFinite(value) ? "—" : String(value);
  return track === "international" ? `${n}h` : `${n}س`;
}
