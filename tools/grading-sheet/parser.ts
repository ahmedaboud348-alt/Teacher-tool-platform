"use client";

import type { MassarData, MassarMeta, MassarStudent } from "./types";

function cellVal(row: unknown[], col: number): string {
  const v = row[col];
  return v != null ? String(v).trim() : "";
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
 * Parse the two known Massar Excel exports into a common shape:
 *  1. "لائحة التلاميذ" — the class student-list export (name split into
 *     النسب / الإسم, meta rows near the top, sheet named by class).
 *  2. "NotesCC" — the continuous-assessment grades export (fixed layout).
 * The format is auto-detected so both work transparently.
 */
export async function parseMassarFile(file: File): Promise<MassarData> {
  const XLSX = await import("xlsx"); // lazy: keep the heavy lib out of the page's initial JS
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  const listHeader = findStudentListHeader(rows);
  return listHeader >= 0
    ? parseStudentList(rows, listHeader, sheetName)
    : parseNotesCC(rows);
}

/** Header row of the "لائحة التلاميذ" export: has a code column (الرمز) plus a
 *  first-name column (الإسم/الاسم الشخصي) — i.e. a real student table header. */
function findStudentListHeader(rows: unknown[][]): number {
  for (let i = 0; i < Math.min(rows.length, 40); i++) {
    const row = rows[i] ?? [];
    const hasCode = colOf(row, ["الرمز", "رمز التلميذ", "رمز مسار"]) >= 0;
    const hasName =
      colOf(row, ["الاسم والنسب", "الاسم الكامل"]) >= 0 ||
      colOf(row, ["الإسم", "الاسم الشخصي"]) >= 0 ||
      colOf(row, ["النسب", "الاسم العائلي"]) >= 0;
    if (hasCode && hasName) return i;
  }
  return -1;
}

function parseStudentList(rows: unknown[][], h: number, sheetName: string): MassarData {
  const header = rows[h] ?? [];
  const colCode = colOf(header, ["الرمز", "رمز التلميذ", "رمز مسار"]);
  const colFull = colOf(header, ["الاسم والنسب", "الاسم الكامل"]);
  const colLast = colOf(header, ["النسب", "الاسم العائلي"]);
  const colFirst = colOf(header, ["الاسم الشخصي", "الإسم", "الاسم"]);

  const meta: MassarMeta = {
    academy: labeledValue(rows, h, ["الأكاديمية"]),
    school: labeledValue(rows, h, ["المؤسسة"]),
    level: labeledValue(rows, h, ["المستوى"]),
    className: labeledValue(rows, h, ["القسم"]) || sheetName.trim(),
    teacher: labeledValue(rows, h, ["الأستاذ", "المدرس"]),
    term: labeledValue(rows, h, ["الدورة", "الأسدس", "الفترة"]),
    subject: labeledValue(rows, h, ["المادة"]),
    year: labeledValue(rows, h, ["السنة الدراسية", "الموسم الدراسي", "السنة"]),
  };

  const students: MassarStudent[] = [];
  let idx = 1;
  for (let i = h + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name =
      colFull >= 0
        ? cellVal(row, colFull)
        : [cellVal(row, colLast), cellVal(row, colFirst)].filter(Boolean).join(" ");
    if (!name || name.length < 2) continue;
    const code = colCode >= 0 ? cellVal(row, colCode) : "";
    // Massar codes start with a letter; skip stray footer rows.
    if (code && !/^[A-Za-z]/.test(code)) continue;
    students.push({ index: idx++, code, name });
  }

  return { meta, students };
}

/** Legacy "NotesCC" continuous-assessment export (fixed row/column layout). */
function parseNotesCC(rows: unknown[][]): MassarData {
  const r7 = rows[6] ?? [];
  const r9 = rows[8] ?? [];
  const r11 = rows[10] ?? [];
  const r13 = rows[12] ?? [];

  const meta: MassarMeta = {
    academy: cellVal(r7, 3),
    school: cellVal(r7, 14),
    level: cellVal(r9, 3),
    className: cellVal(r9, 8),
    teacher: cellVal(r9, 14),
    term: cellVal(r11, 3),
    subject: cellVal(r11, 14),
    year: cellVal(r13, 3),
  };

  const students: MassarStudent[] = [];
  let studentIndex = 1;
  for (let i = 17; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cellVal(row, 3);
    const code = cellVal(row, 2);
    if (!name || name.length < 2) continue;
    if (code && !/^[A-Za-z]/.test(code)) continue;
    students.push({ index: studentIndex++, code, name });
  }

  return { meta, students };
}
