"use client";

import * as XLSX from "xlsx";
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

export async function parseExamFile(file: File): Promise<ExamData> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  const r7  = rows[6]  ?? [];
  const r9  = rows[8]  ?? [];
  const r11 = rows[10] ?? [];
  const r13 = rows[12] ?? [];

  const meta: ExamMeta = {
    school:    cellVal(r7,  14),
    level:     cellVal(r9,  3),
    className: cellVal(r9,  8),
    teacher:   cellVal(r9,  14),
    subject:   cellVal(r11, 14),
    term:      cellVal(r11, 3),
    year:      cellVal(r13, 3),
  };

  const students: StudentRecord[] = [];

  for (let i = 17; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cellVal(row, 3);
    const code = cellVal(row, 2);
    if (!name || name.length < 2) continue;
    if (code && !/^[A-Za-z]/.test(code)) continue;

    // grades: col 6, 8, 10 — absents: col 7, 9, 11
    const grades: (number | null)[] = [
      cellNum(row, 6),
      cellNum(row, 8),
      cellNum(row, 10),
    ];
    const absents: boolean[] = [
      row[7] != null,
      row[9] != null,
      row[11] != null,
    ];

    students.push({ name, grades, absents });
  }

  return { meta, students };
}
