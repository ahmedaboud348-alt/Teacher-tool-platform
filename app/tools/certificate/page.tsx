"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";

const CertificateTool = dynamic(
  () => import("@/tools/certificate/components/CertificateTool"),
  { ssr: false }
);

const AMBER = "#B45309";
const NAVY = "#1A3055";

export default function CertificatePage() {
  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={navInner}>
          <Link href="/" style={backLink}>← الرئيسية</Link>
          <span style={navTitle}>شهادات تقديرية</span>
        </div>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY}, ${AMBER}, #D97706)` }} />
      </nav>

      <section style={heroStyle}>
        <div style={heroPattern} />
        <div style={heroContent}>
          <span style={heroPill}>🏆 شهادات التفوق والتشجيع والتنويه</span>
          <h1 style={h1Style}>شهادات تقديرية</h1>
          <p style={heroDesc}>أنشئ شهادات احترافية بتصميم فخم جاهزة للطباعة</p>
        </div>
      </section>

      <main style={bodyStyle}>
        <CertificateTool />
      </main>
    </div>
  );
}

const pageStyle: CSSProperties = { minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" };
const navStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const navInner: CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" };
const backLink: CSSProperties = { fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none" };
const navTitle: CSSProperties = { fontSize: 14, fontWeight: 900, color: AMBER };
const heroStyle: CSSProperties = { position: "relative", overflow: "hidden", background: `linear-gradient(150deg, #0F172A 0%, ${NAVY} 40%, #243F63 100%)`, padding: "48px 28px 60px", textAlign: "center" };
const heroPattern: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(180,83,9,0.12) 0%, transparent 50%)", backgroundSize: "36px 36px, 36px 36px, 100% 100%" };
const heroContent: CSSProperties = { position: "relative", zIndex: 1, maxWidth: 540, margin: "0 auto" };
const heroPill: CSSProperties = { display: "inline-block", fontSize: 12, fontWeight: 700, color: "#FCD34D", backgroundColor: "rgba(252,211,77,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(252,211,77,0.2)", borderRadius: 999, padding: "5px 18px", marginBottom: 16 };
const h1Style: CSSProperties = { fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 8px" };
const heroDesc: CSSProperties = { fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 };
const bodyStyle: CSSProperties = { maxWidth: 860, margin: "-20px auto 0", padding: "0 28px 56px", position: "relative", zIndex: 2 };
