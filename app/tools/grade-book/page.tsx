import dynamic from "next/dynamic";

const GradeBookTool = dynamic(
  () => import("../../../tools/grade-book/components/GradeBookTool").then(m => m.GradeBookTool),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif", fontSize: 16 }}>جارٍ التحميل...</div> }
);

export default function GradeBookPage() {
  return <GradeBookTool />;
}
