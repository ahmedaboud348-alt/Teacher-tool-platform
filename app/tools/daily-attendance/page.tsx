"use client";
import dynamic from "next/dynamic";

const DailyAttendanceTool = dynamic(
  () => import("@/tools/daily-attendance/components/DailyAttendanceTool").then(m => m.DailyAttendanceTool),
  { ssr: false }
);

export default function DailyAttendancePage() {
  return <DailyAttendanceTool />;
}
