"use client";
import dynamic from "next/dynamic";

const GradeBookTool = dynamic(
  () => import("@/tools/grade-book/components/GradeBookTool").then(m => m.GradeBookTool),
  { ssr: false }
);

export default function GradeBookPage() {
  return <GradeBookTool />;
}
