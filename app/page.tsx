import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/exam-sheet",
    icon: "📋",
    title: "جذاذة الفرض المحروس",
    titleFr: "Fiche d'évaluation",
    desc: "إعداد جذاذات الفروض المحروسة مع جدول التخصيص وتصدير PDF",
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
    colorLight: "#F5F3FF",
    tag: "التقويم",
  },
  {
    href: "/tools/grading-sheet",
    icon: "📊",
    title: "ورقة التنقيط",
    titleFr: "Feuille de Notes",
    desc: "استيراد لائحة التلاميذ من منظومة مسار وإنتاج ورقة تنقيط PDF احترافية",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    colorLight: "#ECFDF5",
    tag: "التنقيط",
  },
  {
    href: "/tools/grade-book",
    icon: "📚",
    title: "دفتر التنقيط",
    titleFr: "Carnet de Notes",
    desc: "ارفع ملفات جميع أقسامك دفعة واحدة وأنتج دفتراً كاملاً مع واجهة احترافية",
    color: "#6D28D9",
    gradient: "linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)",
    colorLight: "#EDE9FE",
    tag: "التنقيط",
  },
  {
    href: "/tools/attendance-sheet",
    icon: "📅",
    title: "سجل الغياب",
    titleFr: "Registre des Absences",
    desc: "ارفع ملفات جميع أقسامك وأنتج سجل غياب كاملاً جاهزاً للطباعة",
    color: "#0891B2",
    gradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
    colorLight: "#ECFEFF",
    tag: "التتبع",
  },
  {
    href: "/tools/unit-plan",
    icon: "📝",
    title: "التخطيط المرحلي",
    titleFr: "Planification par unité",
    desc: "اختر المستوى والمحور واحصل على تخطيط مرحلي جاهز بالكفايات والأهداف",
    color: "#0F766E",
    gradient: "linear-gradient(135deg, #0F766E 0%, #134E4A 100%)",
    colorLight: "#F0FDFA",
    tag: "التخطيط",
  },
  {
    href: "/tools/certificate",
    icon: "🏆",
    title: "شهادات تقديرية",
    titleFr: "Certificats d'honneur",
    desc: "أنشئ شهادات تفوق وتشجيع وتنويه بتصميم فخم جاهزة للطباعة",
    color: "#B45309",
    gradient: "linear-gradient(135deg, #B45309 0%, #92400E 100%)",
    colorLight: "#FFFBEB",
    tag: "جديد",
  },
  {
    href: "/tools/exam-stats",
    icon: "📈",
    title: "إحصائيات الامتحان",
    titleFr: "Statistiques d'examen",
    desc: "ارفع ملف مسار واحصل على تحليل شامل للنقط والمعدل وتوزيع الشرائح",
    color: "#0284C7",
    gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    colorLight: "#E0F2FE",
    tag: "التحليل",
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "سريع وفوري",
    desc: "ارفع الملف واحصل على النتيجة في ثوان معدودة",
  },
  {
    icon: "🎯",
    title: "دقيق ومطابق",
    desc: "مبني وفق المنهاج الرسمي المغربي والأطر المرجعية المعتمدة",
  },
  {
    icon: "🖨️",
    title: "جاهز للطباعة",
    desc: "ملفات PDF احترافية بجودة عالية جاهزة مباشرة للطباعة",
  },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>

      {/* ══ Nav ══ */}
      <nav style={navStyle}>
        <div style={navInnerStyle}>
          <div style={brandStyle}>
            <div style={logoStyle}>
              <span style={{ fontSize: 20 }}>⚗️</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>منصة الأستاذ</div>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>فيزياء وكيمياء</div>
            </div>
          </div>
          <span style={versionBadgeStyle}>الإعدادي 🇲🇦</span>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <section style={heroStyle}>
        <div className="hero-grid-pattern" style={heroPatternStyle} />
        <div style={heroContentStyle}>
          <span className="hero-badge" style={heroBadgeStyle}>
            المنهاج الرسمي المغربي — الفيزياء والكيمياء
          </span>
          <h1 className="hero-title" style={heroTitleStyle}>
            كل ما يحتاجه الأستاذ
            <br />
            <span style={{ color: "#5EEAD4" }}>في مكان واحد</span>
          </h1>
          <p className="hero-desc" style={heroDescStyle}>
            أدوات رقمية احترافية تختصر ساعات العمل — من التخطيط إلى التنقيط والإحصائيات
          </p>
          <div className="hero-stats" style={heroStatsStyle}>
            {[
              { num: "6", label: "أدوات متاحة" },
              { num: "PDF", label: "جاهز للطباعة" },
              { num: "∞", label: "استعمال مجاني" },
            ].map((s, i) => (
              <div key={i} style={heroStatStyle}>
                <span style={heroStatNumStyle}>{s.num}</span>
                <span style={heroStatLabelStyle}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom curve */}
        <div style={heroCurveStyle} />
      </section>

      {/* ══ Tools Grid ══ */}
      <section style={toolsSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>الأدوات المتاحة</h2>
          <p style={sectionSubStyle}>اختر الأداة وابدأ العمل فوراً — لا تسجيل ولا انتظار</p>
        </div>

        <div style={toolsGridStyle}>
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
              <article className="tool-card" style={cardStyle}>
                {/* Colored header with icon */}
                <div style={{ ...cardHeaderStyle, background: tool.gradient }}>
                  <span style={cardTagStyle}>{tool.tag}</span>
                  <div className="card-icon" style={cardIconLargeStyle}>
                    <span style={{ fontSize: 38 }}>{tool.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={cardBodyStyle}>
                  <h3 style={cardTitleStyle}>{tool.title}</h3>
                  <div style={cardTitleFrStyle}>{tool.titleFr}</div>
                  <p style={cardDescStyle}>{tool.desc}</p>
                </div>

                {/* Footer CTA */}
                <div style={{ ...cardFooterStyle, color: tool.color }}>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>فتح الأداة</span>
                  <span className="card-arrow" style={{ fontSize: 18, fontWeight: 900 }}>←</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ Features ══ */}
      <section style={featuresSectionStyle}>
        <div style={featuresInnerStyle}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={featureCardStyle}>
              <span style={featureIconStyle}>{f.icon}</span>
              <h3 style={featureTitleStyle}>{f.title}</h3>
              <p style={featureDescStyle}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer style={footerStyle}>
        <div style={footerInnerStyle}>
          <div style={footerBrandStyle}>
            <span style={{ fontSize: 18 }}>⚗️</span>
            <span style={{ fontWeight: 900, fontSize: 14 }}>منصة الأستاذ</span>
          </div>
          <p style={footerTextStyle}>
            مخصص لأساتذة الفيزياء والكيمياء — التعليم الإعدادي — المملكة المغربية 🇲🇦
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════════
   Styles
   ══════════════════════════════════════════════════════════════ */

import type { CSSProperties } from "react";

// ── Nav ──
const navStyle: CSSProperties = {
  position: "sticky", top: 0, zIndex: 50,
  backgroundColor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid #E2E8F0",
};
const navInnerStyle: CSSProperties = {
  maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: 60,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const brandStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const logoStyle: CSSProperties = {
  width: 40, height: 40, borderRadius: 12,
  background: "linear-gradient(135deg, #0F766E, #134E4A)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 4px 12px rgba(15,118,110,0.25)",
};
const versionBadgeStyle: CSSProperties = {
  fontSize: 11, fontWeight: 800, color: "#0F766E",
  backgroundColor: "#F0FDFA", border: "1px solid #99F6E4",
  borderRadius: 999, padding: "4px 14px",
};

// ── Hero ──
const heroStyle: CSSProperties = {
  position: "relative", overflow: "hidden",
  background: "linear-gradient(160deg, #0A3D3A 0%, #134E4A 30%, #0F766E 70%, #14B8A6 100%)",
  paddingTop: 100, paddingBottom: 140,
};
const heroPatternStyle: CSSProperties = {
  position: "absolute", inset: 0, pointerEvents: "none",
};
const heroContentStyle: CSSProperties = {
  position: "relative", zIndex: 1, textAlign: "center",
  maxWidth: 720, margin: "0 auto", padding: "0 24px",
};
const heroBadgeStyle: CSSProperties = {
  display: "inline-block", fontSize: 12, fontWeight: 700,
  color: "#99F6E4", backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 999, padding: "6px 20px", marginBottom: 24,
};
const heroTitleStyle: CSSProperties = {
  fontSize: 52, fontWeight: 900, color: "#fff",
  lineHeight: 1.15, margin: "0 0 20px",
};
const heroDescStyle: CSSProperties = {
  fontSize: 17, color: "rgba(255,255,255,0.7)",
  lineHeight: 1.8, margin: "0 0 36px", maxWidth: 540, marginLeft: "auto", marginRight: "auto",
};
const heroStatsStyle: CSSProperties = {
  display: "flex", justifyContent: "center", gap: 0,
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, overflow: "hidden", maxWidth: 440, margin: "0 auto",
};
const heroStatStyle: CSSProperties = {
  flex: 1, padding: "16px 0",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
};
const heroStatNumStyle: CSSProperties = {
  fontSize: 24, fontWeight: 900, color: "#5EEAD4",
};
const heroStatLabelStyle: CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)",
};
const heroCurveStyle: CSSProperties = {
  position: "absolute", bottom: -2, left: 0, right: 0, height: 80,
  backgroundColor: "#FAFAFA",
  borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
};

// ── Tools Section ──
const toolsSectionStyle: CSSProperties = {
  padding: "0 28px 80px", marginTop: -40,
  position: "relative", zIndex: 2,
};
const sectionHeaderStyle: CSSProperties = {
  textAlign: "center", marginBottom: 40, maxWidth: 1200, margin: "0 auto 40px",
};
const sectionTitleStyle: CSSProperties = {
  fontSize: 28, fontWeight: 900, color: "#0F172A", marginBottom: 8,
};
const sectionSubStyle: CSSProperties = {
  fontSize: 15, color: "#64748B", fontWeight: 600,
};
const toolsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 24, maxWidth: 1100, margin: "0 auto",
};

// ── Card ──
const cardStyle: CSSProperties = {
  backgroundColor: "#fff", borderRadius: 20, overflow: "hidden",
  border: "1px solid #E2E8F0",
  display: "flex", flexDirection: "column", height: "100%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
  cursor: "pointer",
};
const cardHeaderStyle: CSSProperties = {
  padding: "28px 24px 24px",
  display: "flex", flexDirection: "column", alignItems: "center",
  position: "relative",
};
const cardTagStyle: CSSProperties = {
  position: "absolute", top: 12, left: 12,
  fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.85)",
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: 999, padding: "3px 10px",
  backdropFilter: "blur(4px)",
};
const cardIconLargeStyle: CSSProperties = {
  width: 72, height: 72, borderRadius: 20,
  backgroundColor: "rgba(255,255,255,0.2)",
  border: "1.5px solid rgba(255,255,255,0.25)",
  display: "flex", alignItems: "center", justifyContent: "center",
  backdropFilter: "blur(8px)",
};
const cardBodyStyle: CSSProperties = {
  padding: "20px 24px 14px", flex: 1,
};
const cardTitleStyle: CSSProperties = {
  fontSize: 19, fontWeight: 900, color: "#0F172A", margin: "0 0 2px",
};
const cardTitleFrStyle: CSSProperties = {
  fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 10,
};
const cardDescStyle: CSSProperties = {
  fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0,
};
const cardFooterStyle: CSSProperties = {
  padding: "14px 24px", borderTop: "1px solid #F1F5F9",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  fontSize: 13,
};

// ── Features ──
const featuresSectionStyle: CSSProperties = {
  padding: "0 28px 80px",
};
const featuresInnerStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20, maxWidth: 900, margin: "0 auto",
};
const featureCardStyle: CSSProperties = {
  backgroundColor: "#fff", borderRadius: 20,
  border: "1px solid #E2E8F0", padding: "28px 24px",
  textAlign: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
};
const featureIconStyle: CSSProperties = {
  fontSize: 32, display: "block", marginBottom: 12,
};
const featureTitleStyle: CSSProperties = {
  fontSize: 16, fontWeight: 900, color: "#0F172A", marginBottom: 6,
};
const featureDescStyle: CSSProperties = {
  fontSize: 13, color: "#64748B", lineHeight: 1.7, margin: 0,
};

// ── Footer ──
const footerStyle: CSSProperties = {
  backgroundColor: "#134E4A", padding: "32px 28px",
};
const footerInnerStyle: CSSProperties = {
  maxWidth: 1200, margin: "0 auto", textAlign: "center",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
};
const footerBrandStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, color: "#99F6E4",
};
const footerTextStyle: CSSProperties = {
  fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0,
};
