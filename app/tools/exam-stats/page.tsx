"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";

const ExamStatsTool = dynamic(
  () => import("@/tools/exam-stats/components/ExamStatsTool"),
  { ssr: false }
);

const ACCENT = "#0284C7";
const ACCENT_LIGHT = "#E0F2FE";
const ACCENT_BORDER = "#BAE6FD";

export default function ExamStatsPage() {
  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}99)` }} />
        <div style={headerInnerStyle}>
          <Link href="/" style={backStyle}>← الرئيسية</Link>
          <div style={headerContentStyle}>
            <div style={iconBoxStyle}>📈</div>
            <div>
              <h1 style={titleStyle}>إحصائيات الامتحان</h1>
              <p style={subtitleStyle}>Statistiques d'examen</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main style={bodyStyle}>
        <ExamStatsTool />
      </main>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh", backgroundColor: "#F7F6FB",
  fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl",
};
const headerStyle: CSSProperties = {
  backgroundColor: "#fff",
  boxShadow: "0 1px 0 rgba(2,132,199,0.08), 0 4px 16px rgba(0,0,0,0.04)",
  marginBottom: 28,
};
const headerInnerStyle: CSSProperties = {
  maxWidth: 900, margin: "0 auto", padding: "0 24px",
};
const backStyle: CSSProperties = {
  display: "inline-block", fontSize: 13, color: "#64748B", fontWeight: 600,
  textDecoration: "none", padding: "10px 0", borderBottom: "none",
};
const headerContentStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 16, padding: "16px 0 20px",
};
const iconBoxStyle: CSSProperties = {
  width: 52, height: 52, borderRadius: 14,
  backgroundColor: ACCENT_LIGHT, border: `1.5px solid ${ACCENT_BORDER}`,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 26, flexShrink: 0,
};
const titleStyle: CSSProperties = { fontSize: 22, fontWeight: 900, color: "#0F172A", margin: 0 };
const subtitleStyle: CSSProperties = { fontSize: 12, color: "#94A3B8", margin: 0 };
const bodyStyle: CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" };
