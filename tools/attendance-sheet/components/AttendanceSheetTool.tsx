"use client";
import { useState, useCallback, type CSSProperties, type DragEvent, type ChangeEvent } from "react";
import type { MassarData } from "../../grading-sheet/types";
import type { AttendanceConfig } from "../types";
import { parseMassarFile } from "../../grading-sheet/parser";
import Link from "next/link";

const SLATE = "#334155";
const SLATE_DEEP = "#1E293B";
const ORANGE = "#EA580C";
const ORANGE_LIGHT = "#FFF7ED";
const ORANGE_BORDER = "#FED7AA";

export function AttendanceSheetTool() {
  const [classes, setClasses] = useState<MassarData[]>([]);
  const [config, setConfig] = useState<AttendanceConfig>({ prof: "", annee: "", sessionsPerWeek: 2 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.name.match(/\.(xlsx|xls)$/i));
    if (arr.length === 0) { setError("الملفات يجب أن تكون بصيغة Excel (.xlsx أو .xls)"); return; }
    setLoading(true); setError(null);
    try {
      const parsed = await Promise.all(arr.map(f => parseMassarFile(f)));
      setClasses(prev => {
        const existing = new Set(prev.map(c => c.meta.className));
        const newOnes = parsed.filter(p => !existing.has(p.meta.className));
        const merged = [...prev, ...newOnes];
        if (merged.length !== prev.length + parsed.length) setError("بعض الأقسام موجودة مسبقاً — تم تخطيها");
        return merged;
      });
      setConfig(c => ({ ...c, prof: c.prof || parsed[0]?.meta.teacher || "", annee: c.annee || parsed[0]?.meta.year || "" }));
    } catch { setError("تعذّر قراءة أحد الملفات. تأكد أنها ملفات مسار صالحة."); }
    finally { setLoading(false); }
  }, []);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) handleFiles(e.target.files); };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); };
  const removeClass = (idx: number) => setClasses(prev => prev.filter((_, i) => i !== idx));
  const handleDownload = async () => {
    if (classes.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/unit-plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "attendance", payload: { classes, config } }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "سجل-الغياب.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  };
  const totalSessions = config.sessionsPerWeek * 18;

  return (
    <div style={pageStyle}>
      {/* Nav */}
      <nav style={navStyle}>
        <div style={navInner}>
          <Link href="/" style={backLink}>← الرئيسية</Link>
          <span style={navTitle}>سجل الغياب</span>
        </div>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${SLATE_DEEP}, ${SLATE}, ${ORANGE})` }} />
      </nav>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroPattern} />
        <div style={heroContent}>
          <span style={heroPill}>📅 سجل الغياب — الفيزياء والكيمياء</span>
          <h1 style={h1Style}>سجل الغياب</h1>
          <p style={heroDesc}>ارفع ملفات مسار وأنتج سجل غياب كاملاً جاهزاً للطباعة</p>
        </div>
      </div>

      <div style={bodyStyle}>

        {/* Upload */}
        <section style={cardStyle}>
          <h2 style={secTitle}><span style={secIcon}>📂</span> رفع ملفات مسار</h2>
          <label
            style={{ ...dropStyle, ...(dragging ? dropActiveStyle : {}) }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input type="file" accept=".xlsx,.xls" multiple style={{ display: "none" }} onChange={onInput} />
            <div style={{ fontSize: 40, marginBottom: 10 }}>📎</div>
            <div style={{ fontWeight: 800, color: SLATE_DEEP, marginBottom: 4, fontSize: 14 }}>اسحب ملفات Excel أو اضغط للاختيار</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>يمكن رفع أقسام متعددة دفعة واحدة</div>
          </label>
          {error && <div style={errStyle}>{error}</div>}
        </section>

        {/* Classes */}
        {classes.length > 0 && (
          <section style={cardStyle}>
            <h2 style={secTitle}><span style={secIcon}>📋</span> الأقسام المرفوعة <span style={countBadge}>{classes.length}</span></h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {classes.map((cls, i) => (
                <div key={i} style={classRow}>
                  <div style={classNum}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: SLATE_DEEP }}>{cls.meta.className || "—"}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{cls.meta.level || "—"} · {cls.students.length} تلميذ</div>
                  </div>
                  <button style={rmBtn} onClick={() => removeClass(i)} title="حذف">✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Config */}
        <section style={cardStyle}>
          <h2 style={secTitle}><span style={secIcon}>⚙️</span> الإعدادات</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={lbl}>اسم الأستاذ(ة)</label>
              <input style={inp} value={config.prof} onChange={e => setConfig(c => ({ ...c, prof: e.target.value }))} placeholder="يُملأ تلقائياً" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={lbl}>السنة الدراسية</label>
              <input style={inp} value={config.annee} onChange={e => setConfig(c => ({ ...c, annee: e.target.value }))} placeholder="2025/2026" />
            </div>
          </div>

          <label style={lbl}>عدد الحصص في الأسبوع</label>
          <div style={{ display: "flex", gap: 12 }}>
            {([1, 2, 3] as const).map(n => {
              const active = config.sessionsPerWeek === n;
              return (
                <button key={n} onClick={() => setConfig(c => ({ ...c, sessionsPerWeek: n }))}
                  style={{ ...sessionBtn, ...(active ? sessionBtnActive : {}) }}>
                  <span style={{ fontSize: 20, fontWeight: 900 }}>{n}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? ORANGE : "#64748B" }}>
                    {n === 1 ? "حصة" : n === 2 ? "حصتان" : "حصص"}
                  </span>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{n * 18} ح/دورة</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Summary */}
        {classes.length > 0 && (
          <div style={summaryRow}>
            <SummaryCard label="عدد الأقسام" value={String(classes.length)} icon="📚" />
            <SummaryCard label="إجمالي التلاميذ" value={String(classes.reduce((s, c) => s + c.students.length, 0))} icon="👥" />
            <SummaryCard label="حصص/دورة" value={String(totalSessions)} icon="📊" />
          </div>
        )}

        {/* Download */}
        <button
          style={{ ...dlBtn, opacity: classes.length > 0 && !loading ? 1 : 0.5, cursor: classes.length > 0 && !loading ? "pointer" : "not-allowed" }}
          disabled={classes.length === 0 || loading}
          onClick={handleDownload}
        >
          {loading ? "جارٍ الإنشاء..." : "⬇  تحميل PDF سجل الغياب"}
        </button>

      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={sumCard}>
      <span style={{ fontSize: 24, marginBottom: 4 }}>{icon}</span>
      <span style={sumValue}>{value}</span>
      <span style={sumLabel}>{label}</span>
    </div>
  );
}

/* ── Styles ── */
const pageStyle: CSSProperties = { minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" };

const navStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const navInner: CSSProperties = { maxWidth: 800, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" };
const backLink: CSSProperties = { fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none" };
const navTitle: CSSProperties = { fontSize: 14, fontWeight: 900, color: SLATE_DEEP };

const heroStyle: CSSProperties = { position: "relative", overflow: "hidden", background: `linear-gradient(150deg, #0F172A 0%, ${SLATE_DEEP} 40%, ${SLATE} 100%)`, padding: "40px 24px 56px", textAlign: "center" };
const heroPattern: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 25% 50%, rgba(234,88,12,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 40%, rgba(234,88,12,0.1) 0%, transparent 50%)", backgroundSize: "36px 36px, 36px 36px, 100% 100%, 100% 100%" };
const heroContent: CSSProperties = { position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto" };
const heroPill: CSSProperties = { display: "inline-block", fontSize: 12, fontWeight: 700, color: ORANGE, backgroundColor: "rgba(234,88,12,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(234,88,12,0.2)", borderRadius: 999, padding: "5px 18px", marginBottom: 14 };
const h1Style: CSSProperties = { fontSize: 34, fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 8px" };
const heroDesc: CSSProperties = { fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 };

const bodyStyle: CSSProperties = { maxWidth: 800, margin: "-20px auto 0", padding: "0 24px 56px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 16 };

const cardStyle: CSSProperties = { backgroundColor: "#fff", borderRadius: 20, padding: "22px 24px", borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };
const secTitle: CSSProperties = { fontSize: 16, fontWeight: 900, color: SLATE_DEEP, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 };
const secIcon: CSSProperties = { fontSize: 18 };
const countBadge: CSSProperties = { fontSize: 12, fontWeight: 800, color: ORANGE, backgroundColor: ORANGE_LIGHT, borderWidth: 1, borderStyle: "solid", borderColor: ORANGE_BORDER, borderRadius: 999, padding: "1px 10px", marginRight: 4 };

const dropStyle: CSSProperties = { display: "block", borderWidth: 2, borderStyle: "dashed", borderColor: ORANGE, borderRadius: 14, padding: "32px 24px", textAlign: "center", cursor: "pointer", transition: "all 200ms", backgroundColor: ORANGE_LIGHT };
const dropActiveStyle: CSSProperties = { borderColor: ORANGE, backgroundColor: ORANGE_LIGHT };
const errStyle: CSSProperties = { marginTop: 12, padding: "10px 14px", borderRadius: 10, backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 600 };

const classRow: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, backgroundColor: "#F8FAFC", borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0" };
const classNum: CSSProperties = { width: 30, height: 30, borderRadius: 8, backgroundColor: SLATE_DEEP, color: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 };
const rmBtn: CSSProperties = { width: 28, height: 28, borderRadius: 8, borderWidth: 1, borderStyle: "solid", borderColor: "#FCA5A5", backgroundColor: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

const lbl: CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 };
const inp: CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, borderWidth: 1.5, borderStyle: "solid", borderColor: "#E2E8F0", fontSize: 14, fontFamily: "Cairo, sans-serif", color: "#0F172A", outline: "none", backgroundColor: "#FAFBFC" };

const sessionBtn: CSSProperties = { flex: 1, padding: "14px 8px", borderRadius: 14, borderWidth: 2, borderStyle: "solid", borderColor: "#E2E8F0", backgroundColor: "#FAFBFC", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "Cairo, sans-serif", color: SLATE_DEEP, transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)" };
const sessionBtnActive: CSSProperties = { borderColor: ORANGE, backgroundColor: ORANGE_LIGHT, transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(234,88,12,0.15)" };

const summaryRow: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 };
const sumCard: CSSProperties = { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderStyle: "solid", borderColor: "#E2E8F0", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
const sumValue: CSSProperties = { fontSize: 28, fontWeight: 900, color: SLATE_DEEP };
const sumLabel: CSSProperties = { fontSize: 11, fontWeight: 700, color: "#64748B" };

const dlBtn: CSSProperties = { width: "100%", padding: "16px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${SLATE_DEEP}, ${SLATE})`, color: "#fff", fontSize: 16, fontWeight: 900, fontFamily: "Cairo, sans-serif", boxShadow: "0 6px 20px rgba(30,41,59,0.25)", transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)" };
