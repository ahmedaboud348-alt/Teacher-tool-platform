"use client";

import * as XLSX from "xlsx";
import type { MassarData, MassarMeta, MassarStudent } from "./types";

function cellVal(row: unknown[], col: number): string {
  const v = row[col];
  return v != null ? String(v).trim() : "";
}

export async function parseMassarFile(file: File): Promise<MassarData> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  // Use first sheet (NotesCC)
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
  });

  // ── Extract meta ──
  // Row index 6  (R7):  col[3]=academy/city, col[14]=school
  // Row index 8  (R9):  col[3]=level,        col[8]=class,   col[14]=teacher
  // Row index 10 (R11): col[3]=term,          col[14]=subject
  // Row index 12 (R13): col[3]=year
  const r7  = rows[6]  ?? [];
  const r9  = rows[8]  ?? [];
  const r11 = rows[10] ?? [];
  const r13 = rows[12] ?? [];

  const meta: MassarMeta = {
    academy:   cellVal(r7,  3),
    school:    cellVal(r7,  14),
    level:     cellVal(r9,  3),
    className: cellVal(r9,  8),
    teacher:   cellVal(r9,  14),
    term:      cellVal(r11, 3),
    subject:   cellVal(r11, 14),
    year:      cellVal(r13, 3),
  };

  // ── Extract students ──
  // Headers are at row index 15 (R16) and 16 (R17)
  // Students start at row index 17 (R18)
  // col[2] = student code, col[3] = student name
  const students: MassarStudent[] = [];
  let studentIndex = 1;

  for (let i = 17; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cellVal(row, 3);
    const code = cellVal(row, 2);
    if (!name || name.length < 2) continue;
    // Skip if code doesn't start with a letter (not a real student row)
    if (code && !/^[A-Za-z]/.test(code)) continue;

    students.push({ index: studentIndex++, code, name });
  }

  return { meta, students };
}
