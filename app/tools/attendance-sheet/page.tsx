"use client";
import dynamic from "next/dynamic";

const AttendanceSheetTool = dynamic(
  () => import("@/tools/attendance-sheet/components/AttendanceSheetTool").then(m => m.AttendanceSheetTool),
  { ssr: false }
);

export default function AttendanceSheetPage() {
  return <AttendanceSheetTool />;
}
