"use client";
import dynamic from "next/dynamic";

const GradingSheetTool = dynamic(
  () => import("@/tools/grading-sheet/components/GradingSheetTool").then(m => m.GradingSheetTool),
  { ssr: false }
);

export default function GradingSheetPage() {
  return <GradingSheetTool />;
}
