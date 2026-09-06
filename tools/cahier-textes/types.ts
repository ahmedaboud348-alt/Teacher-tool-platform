export type { MassarData, MassarMeta } from "../grading-sheet/types";
import type { MassarData } from "../grading-sheet/types";

export type CoverVariant = "male" | "female";
export type Lang = "ar" | "fr";

/** One teaching level (المستوى) — e.g. "الأولى إعدادي". Holds its classes
 *  (rosters, imported from Massar or created blank) and how many blank
 *  lesson-log pages to print per class. */
export type CTLevel = {
  name: string;              // اسم المستوى
  classes: MassarData[];     // الأقسام داخل المستوى
  logPagesPerClass: number;  // عدد صفحات سجل الدروس لكل قسم
};

export type CahierTextesConfig = {
  lang: Lang;                // تُحدَّد أولاً قبل أي إدخال
  coverVariant: CoverVariant;
  // Cover / official header
  subject: string;           // المادة
  academy: string;           // الأكاديمية الجهوية
  directorate: string;       // المديرية الإقليمية
  school: string;            // المؤسسة
  prof: string;              // الأستاذ(ة)
  annee: string;             // الموسم الدراسي
  // Sections
  levels: CTLevel[];         // المستويات (غالباً اثنان)
  showHolidays: boolean;     // إدراج جدول العطل تلقائياً
  showStudentLists: boolean; // إدراج لوائح التلاميذ
  showCards: boolean;        // إدراج البطاقة الشخصية/المهنية
  showStructure: boolean;    // البنية التربوية + جدول الحصص + التواقيع
};
