"use client";

import type { ExamData, ExamMeta, StudentRecord } from "./types";

function cellVal(row: unknown[], col: number): string {
  const v = row[col];
  return v != null ? String(v).trim() : "";
}

function cellNum(row: unknown[], col: number): number | null {
  const v = row[col];
  if (v == null || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

/** Normalise a label cell: drop colons and collapse whitespace. */
function norm(s: string): string {
  return s.replace(/[:：]/g, " ").replace(/\s+/g, " ").trim();
}

/** Find the column in a header row whose (normalised) text matches any keyword. */
function colOf(header: unknown[], keywords: string[]): number {
  for (let c = 0; c < header.length; c++) {
    const t = norm(cellVal(header, c));
    if (t && keywords.some((k) => t === k || t.includes(k))) return c;
  }
  return -1;
}

/** Search the meta region (rows before the student header) for a label and
 *  return the first non-empty cell to its right on the same row. */
function labeledValue(rows: unknown[][], uptoRow: number, keywords: string[]): string {
  for (let r = 0; r < uptoRow; r++) {
    const row = rows[r] ?? [];
    for (let c = 0; c < row.length; c++) {
      const t = norm(cellVal(row, c));
      if (!t) continue;
      if (keywords.some((k) => t === k || t.startsWith(k) || t.includes(k))) {
        for (let d = c + 1; d < row.length; d++) {
          const v = cellVal(row, d);
          if (v) return v;
        }
      }
    }
  }
  return "";
}

/**
 * Parse a Massar Excel export into exam data. Two layouts are supported:
 *  1. The newer label-based export (meta + a student table located by their
 *     Arabic column labels; name may be split into النسب / الإسم). Grade
 *     columns are detected by their headers when present.
 *  2. The legacy "NotesCC" export (fixed row/column positions) — kept as a
 *     fallback so existing files keep working.
 */
export async function parseExamFile(file: File): Promise<ExamData> {
  const XLSX = await import("xlsx"); // lazy: keep the heavy lib out of the page's initial JS
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  const h = findLabelHeader(rows);
  return h >= 0 ? parseLabelled(rows, h, sheetName) : parseNotesCC(rows);
}

/** Header row of the newer label-based export: a code column (الرمز) + a name
 *  column, distinguished from NotesCC by a gender column (النوع) or the list
 *  title, so the legacy grades export never matches here. */
function findLabelHeader(rows: unknown[][]): number {
  const hasTitle = rows
    .slice(0, 6)
    .some((r) => (r ?? []).some((v) => norm(v != null ? String(v) : "").includes("لائحة التلاميذ")));
  for (let i = 0; i < Math.min(rows.length, 40); i++) {
    const row = rows[i] ?? [];
    const hasCode = colOf(row, ["الرمز", "رمز التلميذ", "رمز مسار"]) >= 0;
    const hasName =
      colOf(row, ["الاسم والنسب", "الاسم الكامل"]) >= 0 ||
      colOf(row, ["الإسم", "الاسم الشخصي"]) >= 0 ||
      colOf(row, ["النسب", "الاسم العائلي"]) >= 0;
    const hasGender = colOf(row, ["النوع"]) >= 0;
    if (hasCode && hasName && (hasGender || hasTitle)) return i;
  }
  return -1;
}

/** Grade keywords used to locate note columns in the label-based export. */
const GRADE_KEYS = ["النقطة", "نقطة", "الفرض", "فرض", "المراقبة", "الاختبار", "الامتحان", "النتيجة", "المعدل", "/20", "20"];

function parseLabelled(rows: unknown[][], h: number, sheetName: string): ExamData {
  const header = rows[h] ?? [];
  const colCode = colOf(header, ["الرمز", "رمز التلميذ", "رمز مسار"]);
  const colFull = colOf(header, ["الاسم والنسب", "الاسم الكامل"]);
  const colLast = colOf(header, ["النسب", "الاسم العائلي"]);
  const colFirst = colOf(header, ["الاسم الشخصي", "الإسم", "الاسم"]);

  // Locate up to three grade columns by their headers (a plain student list
  // has none → grades stay empty, which is correct).
  const gradeCols: number[] = [];
  for (let c = 0; c < header.length && gradeCols.length < 3; c++) {
    const t = norm(cellVal(header, c));
    if (t && GRADE_KEYS.some((k) => t === k || t.includes(k))) gradeCols.push(c);
  }

  const meta: ExamMeta = {
    school: labeledValue(rows, h, ["المؤسسة"]),
    level: labeledValue(rows, h, ["المستوى"]),
    className: labeledValue(rows, h, ["القسم"]) || sheetName.trim(),
    teacher: labeledValue(rows, h, ["الأستاذ", "المدرس"]),
    subject: labeledValue(rows, h, ["المادة"]),
    term: labeledValue(rows, h, ["الدورة", "الأسدس", "الفترة"]),
    year: labeledValue(rows, h, ["السنة الدراسية", "الموسم الدراسي", "السنة"]),
  };

  const students: StudentRecord[] = [];
  for (let i = h + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name =
      colFull >= 0
        ? cellVal(row, colFull)
        : [cellVal(row, colLast), cellVal(row, colFirst)].filter(Boolean).join(" ");
    if (!name || name.length < 2) continue;
    const code = colCode >= 0 ? cellVal(row, colCode) : "";
    if (code && !/^[A-Za-z]/.test(code)) continue;

    const grades: (number | null)[] = [0, 1, 2].map((k) =>
      gradeCols[k] != null ? cellNum(row, gradeCols[k]) : null
    );
    const absents: boolean[] = [0, 1, 2].map(() => false);
    students.push({ name, grades, absents });
  }

  return { meta, students };
}

/** Legacy "NotesCC" continuous-assessment export (fixed row/column layout). */
function parseNotesCC(rows: unknown[][]): ExamData {
  const r7 = rows[6] ?? [];
  const r9 = rows[8] ?? [];
  const r11 = rows[10] ?? [];
  const r13 = rows[12] ?? [];

  const meta: ExamMeta = {
    school: cellVal(r7, 14),
    level: cellVal(r9, 3),
    className: cellVal(r9, 8),
    teacher: cellVal(r9, 14),
    subject: cellVal(r11, 14),
    term: cellVal(r11, 3),
    year: cellVal(r13, 3),
  };

  const students: StudentRecord[] = [];
  for (let i = 17; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cellVal(row, 3);
    const code = cellVal(row, 2);
    if (!name || name.length < 2) continue;
    if (code && !/^[A-Za-z]/.test(code)) continue;

    // grades: col 6, 8, 10 — absents: col 7, 9, 11
    const grades: (number | null)[] = [cellNum(row, 6), cellNum(row, 8), cellNum(row, 10)];
    const absents: boolean[] = [row[7] != null, row[9] != null, row[11] != null];
    students.push({ name, grades, absents });
  }

  return { meta, students };
}
