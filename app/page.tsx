import Link from "next/link";
import type { CSSProperties } from "react";

const TOOLS = [
  {
    href: "/tools/exam-sheet",
    icon: "📋",
    title: "جذاذة الفرض المحروس",
    titleFr: "Fiche d'évaluation",
    desc: "إعداد جذاذات الفروض المحروسة مع جدول التخصيص وتصدير PDF",
    badge: "عام + دولي",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
    colorBorder: "#DDD6FE",
  },
  {
    href: "/tools/grading-sheet",
    icon: "📊",
    title: "ورقة التنقيط",
    titleFr: "Feuille de Notes",
    desc: "استيراد لائحة التلاميذ من منظومة مسار وإنتاج ورقة التنقيط PDF",
    badge: "جديد",
    color: "#059669",
    colorLight: "#ECFDF5",
    colorBorder: "#A7F3D0",
  },
  {
    href: "/tools/grade-book",
    icon: "📚",
    title: "دفتر التنقيط",
    titleFr: "Carnet de Notes",
    desc: "ارفع ملفات جميع أقسامك دفعة واحدة وأنتج دفتراً كاملاً مع واجهة وجميع اللوائح",
    badge: "جديد",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
    colorBorder: "#DDD6FE",
  },
];

export default function HomePage() {
  return (
    <main style={pageStyle}>
      {/* App Bar */}
      <nav style={appBarStyle}>
        <div style={appBarInnerStyle}>
          <div style={brandStyle}>
            <div style={logoStyle}>م</div>
            <div>
              <div style={brandNameStyle}>منصة الأدوات التربوية</div>
              <div style={brandSubStyle}>أدوات رقمية للأساتذة</div>
            </div>
          </div>
          <span style={versionStyle}>v1.0 · Beta</span>
        </div>
        <div style={appBarLineStyle} />
      </nav>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroBgStyle} />
        <div style={heroInnerStyle}>
          <div style={eyebrowStyle}>🇲🇦 المنهج الرسمي المغربي</div>
          <h1 style={heroTitleStyle}>منصة الأدوات التربوية</h1>
          <p style={heroDescStyle}>
            أدوات رقمية مصممة للأساتذة — سريعة، دقيقة، جاهزة للطباعة
          </p>
        </div>
        <div style={heroCurveStyle} />
      </div>

      {/* Tools grid */}
      <div style={bodyStyle}>
        <div style={gridStyle}>
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href} style={cardLinkStyle}>
              <article
                style={{
                  ...cardStyle,
                  borderColor: tool.colorBorder,
                }}
              >
                {/* Top accent */}
                <div style={{ ...cardAccentStyle, background: `linear-gradient(90deg, ${tool.color}, ${tool.color}99)` }} />

                <div style={cardBodyStyle}>
                  {/* Icon + badge */}
                  <div style={cardTopRowStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: tool.colorLight, border: `1px solid ${tool.colorBorder}` }}>
                      <span style={iconStyle}>{tool.icon}</span>
                    </div>
                    <span style={{ ...badgeStyle, color: tool.color, backgroundColor: tool.colorLight, borderColor: tool.colorBorder }}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={cardTitleStyle}>{tool.title}</h2>
                  <div style={cardTitleFrStyle}>{tool.titleFr}</div>

                  {/* Description */}
                  <p style={cardDescStyle}>{tool.desc}</p>
                </div>

                {/* CTA */}
                <div style={{ ...cardFooterStyle, color: tool.color, borderTopColor: tool.colorBorder }}>
                  <span>فتح الأداة</span>
                  <span>←</span>
                </div>
              </article>
            </Link>
          ))}

          {/* Coming soon placeholder */}
          <article style={comingSoonStyle}>
            <div style={cardBodyStyle}>
              <div style={cardTopRowStyle}>
                <div style={{ ...iconBoxStyle, backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <span style={iconStyle}>🔜</span>
                </div>
              </div>
              <h2 style={{ ...cardTitleStyle, color: "#94A3B8" }}>أدوات قادمة</h2>
              <p style={{ ...cardDescStyle, color: "#94A3B8" }}>المزيد من الأدوات التربوية قريباً...</p>
            </div>
            <div style={{ ...cardFooterStyle, color: "#CBD5E1", borderTopColor: "#E2E8F0" }}>
              <span>قريباً</span>
            </div>
          </article>
        </div>

        <p style={footerStyle}>
          مخصص للتعليم الإعدادي — فيزياء وكيمياء · المملكة المغربية
        </p>
      </div>
    </main>
  );
}

/* ── Styles ── */
const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#F7F6FB",
  fontFamily: "Cairo, system-ui, sans-serif",
  direction: "rtl",
};

const appBarStyle: CSSProperties = {
  position: "sticky", top: 0, zIndex: 40,
  backgroundColor: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 4px 16px rgba(0,0,0,0.04)",
};
const appBarInnerStyle: CSSProperties = {
  maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 64,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const brandStyle: CSSProperties  = { display: "flex", alignItems: "center", gap: 12 };
const logoStyle: CSSProperties   = {
  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontWeight: 900, fontSize: 18,
  boxShadow: "0 4px 12px rgba(124,58,237,0.30)",
};
const brandNameStyle: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 };
const brandSubStyle: CSSProperties  = { fontSize: 11, color: "#64748B", lineHeight: 1 };
const versionStyle: CSSProperties   = {
  fontSize: 11, fontWeight: 700, color: "#7C3AED",
  backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE",
  borderRadius: 999, padding: "3px 10px",
};
const appBarLineStyle: CSSProperties = {
  height: 2,
  background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, transparent 100%)",
};

const heroStyle: CSSProperties = {
  position: "relative", overflow: "hidden",
  background: "linear-gradient(140deg, #3B0764 0%, #6D28D9 55%, #7C3AED 100%)",
  paddingTop: 80, paddingBottom: 120, paddingLeft: 24, paddingRight: 24,
};
const heroBgStyle: CSSProperties = {
  position: "absolute", inset: 0,
  backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "28px 28px", pointerEvents: "none",
};
const heroInnerStyle: CSSProperties = {
  position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640, margin: "0 auto",
};
const eyebrowStyle: CSSProperties = {
  display: "inline-block", fontSize: 13, fontWeight: 700,
  color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.20)", borderRadius: 999,
  padding: "6px 18px", marginBottom: 20,
};
const heroTitleStyle: CSSProperties = {
  fontSize: 52, fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.1,
};
const heroDescStyle: CSSProperties = {
  fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0,
};
const heroCurveStyle: CSSProperties = {
  position: "absolute", bottom: -2, left: 0, right: 0, height: 64,
  backgroundColor: "#F7F6FB", borderRadius: "60% 60% 0 0 / 100% 100% 0 0",
};

const bodyStyle: CSSProperties = {
  padding: "0 24px 64px", marginTop: -44, position: "relative", zIndex: 2,
};
const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 20, maxWidth: 1100, margin: "0 auto",
};

const cardLinkStyle: CSSProperties = { textDecoration: "none", display: "block" };
const cardStyle: CSSProperties = {
  backgroundColor: "#fff",
  border: "1.5px solid",
  borderRadius: 20,
  overflow: "hidden",
  display: "flex", flexDirection: "column",
  boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
  transition: "transform 180ms ease, box-shadow 180ms ease",
  cursor: "pointer",
  height: "100%",
};
const cardAccentStyle: CSSProperties = { height: 4, flexShrink: 0 };
const cardBodyStyle: CSSProperties  = { padding: "20px 20px 12px", flex: 1 };
const cardTopRowStyle: CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
};
const iconBoxStyle: CSSProperties = {
  width: 48, height: 48, borderRadius: 12,
  display: "flex", alignItems: "center", justifyContent: "center",
};
const iconStyle: CSSProperties = { fontSize: 24 };
const badgeStyle: CSSProperties = {
  fontSize: 11, fontWeight: 800, border: "1px solid",
  borderRadius: 999, padding: "3px 10px",
};
const cardTitleStyle: CSSProperties = {
  fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 2px", lineHeight: 1.2,
};
const cardTitleFrStyle: CSSProperties = {
  fontSize: 12, color: "#94A3B8", fontWeight: 600, marginBottom: 10,
};
const cardDescStyle: CSSProperties = {
  fontSize: 13, color: "#475569", lineHeight: 1.65, margin: 0,
};
const cardFooterStyle: CSSProperties = {
  padding: "14px 20px",
  borderTop: "1px solid",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  fontSize: 13, fontWeight: 800,
};

const comingSoonStyle: CSSProperties = {
  ...cardStyle,
  borderColor: "#E2E8F0",
  opacity: 0.6,
  cursor: "default",
};

const footerStyle: CSSProperties = {
  textAlign: "center", fontSize: 12, color: "#94A3B8",
  marginTop: 36, maxWidth: 1100, margin: "36px auto 0",
};
