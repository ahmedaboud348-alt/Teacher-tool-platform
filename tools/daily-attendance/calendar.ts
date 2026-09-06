/**
 * Moroccan primary "السجل اليومي للحضور والغياب" school calendar.
 *
 * The calendar is the SAME for every teacher in a given year, so it is defined
 * ONCE here (the holiday list) and expanded automatically into the monthly
 * grids. Next year: update HOLIDAYS + MONTHS + YEAR_LABEL only.
 *
 * Rule: school days are Monday→Saturday (Sundays excluded); official holidays
 * are shown as a single shaded column each.
 */

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export const YEAR_LABEL = "2026 - 2027";

const MONTHS_DEF = [
  { y: 2026, m: 8, name: "شتنبر" },
  { y: 2026, m: 9, name: "أكتوبر" },
  { y: 2026, m: 10, name: "نونبر" },
  { y: 2026, m: 11, name: "دجنبر" },
  { y: 2027, m: 0, name: "يناير" },
  { y: 2027, m: 1, name: "فبراير" },
  { y: 2027, m: 2, name: "مارس" },
  { y: 2027, m: 3, name: "أبريل" },
  { y: 2027, m: 4, name: "ماي" },
  { y: 2027, m: 5, name: "يونيو" },
];

/** [name, startISO, endISO] inclusive. Edit this list for a new school year. */
export const HOLIDAYS: [string, string, string][] = [
  ["الفترة البينية الأولى", "2026-10-18", "2026-10-25"],
  ["عيد الوحدة", "2026-10-31", "2026-10-31"],
  ["ذكرى المسيرة الخضراء", "2026-11-06", "2026-11-06"],
  ["عيد الاستقلال", "2026-11-18", "2026-11-18"],
  ["الفترة البينية الثانية", "2026-12-06", "2026-12-13"],
  ["فاتح السنة الميلادية", "2027-01-01", "2027-01-01"],
  ["ذكرى تقديم وثيقة الاستقلال", "2027-01-11", "2027-01-11"],
  ["رأس السنة الأمازيغية", "2027-01-14", "2027-01-14"],
  ["عطلة منتصف السنة", "2027-01-24", "2027-01-31"],
  ["عيد الفطر", "2027-03-19", "2027-03-22"],
  ["الفترة البينية الثالثة", "2027-03-21", "2027-03-28"],
  ["عيد الشغل", "2027-05-01", "2027-05-01"],
  ["الفترة البينية الرابعة", "2027-05-09", "2027-05-16"],
  ["عيد الأضحى", "2027-05-26", "2027-05-28"],
  ["فاتح محرم", "2027-06-16", "2027-06-16"],
];

export type DayColumn = { type: "day"; day: number; weekday: string };
export type HolidayColumn = { type: "holiday"; name: string };
export type CalColumn = DayColumn | HolidayColumn;
export type MonthCalendar = {
  name: string;
  year: number;
  columns: CalColumn[];
  schoolDays: number;    // number of study days in the month
  studyHalfDays: number; // schoolDays × 2
};

const isoOf = (y: number, m: number, day: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

function holidayAt(iso: string): string | null {
  for (const [name, start, end] of HOLIDAYS) if (iso >= start && iso <= end) return name;
  return null;
}

let cached: MonthCalendar[] | null = null;

/** Expand the holiday list into the monthly grids (computed once, then cached). */
export function getSchoolCalendar(): MonthCalendar[] {
  if (cached) return cached;
  cached = MONTHS_DEF.map((mo) => {
    const columns: CalColumn[] = [];
    let schoolDays = 0;
    const lastDay = new Date(mo.y, mo.m + 1, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      const wd = new Date(mo.y, mo.m, day).getDay();
      if (wd === 0) continue; // Sundays are not columns
      const h = holidayAt(isoOf(mo.y, mo.m, day));
      if (h) {
        const prev = columns[columns.length - 1];
        // merge consecutive days of the same holiday into ONE shaded column
        if (!(prev && prev.type === "holiday" && prev.name === h)) {
          columns.push({ type: "holiday", name: h });
        }
      } else {
        columns.push({ type: "day", day, weekday: WEEKDAYS[wd] });
        schoolDays++;
      }
    }
    return { name: mo.name, year: mo.y, columns, schoolDays, studyHalfDays: schoolDays * 2 };
  });
  return cached;
}
