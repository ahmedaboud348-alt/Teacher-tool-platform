"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";

const UnitPlanTool = dynamic(
  () => import("@/tools/unit-plan/components/UnitPlanTool"),
  { ssr: false }
);

export default function UnitPlanPage() {
  return (
    <div style={pageStyle}>
      {/* Nav */}
      <nav style={navStyle}>
        <div style={navInner}>
          <Link href="/" style={backLink}>← الرئيسية</Link>
          <span style={navTitle}>التخطيط المرحلي</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={heroStyle}>
        <div style={heroOverlay} />
        <div style={heroContent}>
          <span style={heroPill}>📝 الفيزياء والكيمياء — الإعدادي</span>
          <h1 style={heroH1}>التخطيط المرحلي</h1>
          <p style={heroP}>اختر المستوى والمحور لإنشاء التوزيع المرحلي الكامل بالكفايات والأهداف</p>
          <div style={heroLine} />
        </div>
      </section>

      {/* Body */}
      <main style={bodyStyle}>
        <UnitPlanTool />
      </main>
    </div>
  );
}

/* ── Design tokens ── */
const C1 = "#1E3A5F";  // deep blue-slate
const C2 = "#2563EB";  // vivid blue
const C3 = "#3B82F6";  // blue accent
const BG = "#F1F5F9";

const pageStyle: CSSProperties = {
  minHeight: "100vh", backgroundColor: BG,
  fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl",
};

/* Nav */
const navStyle: CSSProperties = {
  position: "sticky", top: 0, zIndex: 50,
  backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
  borderBottom: "1px solid #E2E8F0",
};
const navInner: CSSProperties = {
  maxWidth: 960, margin: "0 auto", padding: "0 28px", height: 52,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const backLink: CSSProperties = { fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none" };
const navTitle: CSSProperties = { fontSize: 14, fontWeight: 900, color: C1 };

/* Hero */
const heroStyle: CSSProperties = {
  position: "relative", overflow: "hidden",
  background: `linear-gradient(150deg, #0F172A 0%, ${C1} 40%, ${C2} 100%)`,
  padding: "56px 28px 72px", textAlign: "center",
};
const heroOverlay: CSSProperties = {
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 30% 50%, rgba(59,130,246,0.2) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(147,51,234,0.15) 0%, transparent 50%)",
  backgroundSize: "36px 36px, 36px 36px, 100% 100%, 100% 100%",
};
const heroContent: CSSProperties = { position: "relative", zIndex: 1, maxWidth: 540, margin: "0 auto" };
const heroPill: CSSProperties = {
  display: "inline-block", fontSize: 12, fontWeight: 700,
  color: "#93C5FD", backgroundColor: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999,
  padding: "5px 18px", marginBottom: 20,
};
const heroH1: CSSProperties = { fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 10px" };
const heroP: CSSProperties = { fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: "0 0 20px" };
const heroLine: CSSProperties = { width: 48, height: 3, background: C3, margin: "0 auto", borderRadius: 2 };

/* Body */
const bodyStyle: CSSProperties = {
  maxWidth: 960, margin: "-24px auto 0", padding: "0 28px 56px", position: "relative", zIndex: 2,
};
