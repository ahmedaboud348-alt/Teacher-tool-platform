"use client";
import { useState, useCallback, type CSSProperties, type DragEvent, type ChangeEvent } from "react";
import Link from "next/link";
import type { MassarData, DailyAttendanceConfig } from "../types";
import { parseMassarFile } from "../../grading-sheet/parser";

const NAVY = "#1A3055";
const NAVY_DEEP = "#0F1E35";
const GOLD = "#C8960C";

export function DailyAttendanceTool() {
  const [classes, setClasses] = useState<MassarData[]>([]);
  const [config, setConfig] = useState<DailyAttendanceConfig>({
    academy: "", directorate: "", school: "", teacher: "", level: "", coverVariant: "male",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => /\.(xlsx|xls)$/i.test(f.name));
    if (arr.length === 0) { setError("الملفات يجب أن تكون بصيغة Excel (.xlsx أو .xls)"); return; }
    setLoading(true); setError(null);
    try {
      const parsed = await Promise.all(arr.map(f => parseMassarFile(f)));
      setClasses(prev => {
        const seen = new Set(prev.map(c => c.meta.className));
        const merged = [...prev, ...parsed.filter(p => !seen.has(p.meta.className))];
        return merged;
      });
      setConfig(c => ({
        ...c,
        teacher: c.teacher || parsed[0]?.meta.teacher || "",
        school: c.school || parsed[0]?.meta.school || "",
        level: c.level || parsed[0]?.meta.level || "",
      }));
    } catch { setError("تعذّر قراءة أحد الملفات. تأكد أنها ملفات مسار صالحة."); }
    finally { setLoading(false); }
  }, []);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) handleFiles(e.target.files); };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); };
  const removeClass = (idx: number) => setClasses(prev => prev.filter((_, i) => i !== idx));

  const handleDownload = async () => {
    if (classes.length === 0) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/unit-plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "daily-attendance", payload: { classes, config } }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `السجل-اليومي-للحضور-والغياب.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setError("حدث خطأ أثناء إنشاء PDF."); }
    finally { setLoading(false); }
  };

  const totalStudents = classes.reduce((s, c) => s + c.students.length, 0);

  return (
    <div style={page}>
      <nav style={nav}>
        <div style={navInner}>
          <Link href="/" style={back}>← الرئيسية</Link>
          <span style={navTitle}>السجل اليومي للحضور والغياب</span>
        </div>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY_DEEP}, ${NAVY}, ${GOLD})` }} />
      </nav>

      <div style={hero}>
        <div style={heroPattern} />
        <div style={heroContent}>
          <span style={pill}>🗓️ التعليم الابتدائي</span>
          <h1 style={h1}>السجل اليومي للحضور والغياب</h1>
          <p style={heroDesc}>ارفع لائحة مسار وأنتج السجل السنوي كاملاً (بالعطل الرسمية) جاهزاً للطباعة</p>
        </div>
      </div>

      <div style={body}>
        <section style={card}>
          <h2 style={secTitle}><span>📂</span> رفع لائحة مسار</h2>
          <label
            style={{ ...drop, ...(dragging ? dropActive : {}) }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input type="file" accept=".xlsx,.xls" multiple style={{ display: "none" }} onChange={onInput} />
            <div style={{ fontSize: 40, marginBottom: 10 }}>📎</div>
            <div style={{ fontWeight: 800, color: NAVY_DEEP, marginBottom: 4, fontSize: 14 }}>اسحب ملف Excel أو اضغط للاختيار</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>يمكن رفع أكثر من قسم دفعة واحدة</div>
          </label>
          {error && <div style={err}>{error}</div>}
        </section>

        {classes.length > 0 && (
          <section style={card}>
            <h2 style={secTitle}><span>📋</span> الأقسام المرفوعة <span style={badge}>{classes.length}</span></h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {classes.map((cls, i) => (
                <div key={i} style={classRow}>
                  <div style={classNum}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: NAVY_DEEP }}>{cls.meta.className || "—"}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{cls.meta.level || "—"} · {cls.students.length} تلميذ</div>
                  </div>
                  <button style={rm} onClick={() => removeClass(i)} title="حذف">✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={card}>
          <h2 style={secTitle}><span>⚙️</span> معلومات السجل</h2>
          <div style={grid}>
            <Field label="الأستاذ(ة)"><input style={inp} value={config.teacher} placeholder="يُملأ تلقائياً" onChange={e => setConfig(c => ({ ...c, teacher: e.target.value }))} /></Field>
            <Field label="المستوى"><input style={inp} value={config.level} placeholder="مثال: المستوى الرابع" onChange={e => setConfig(c => ({ ...c, level: e.target.value }))} /></Field>
            <Field label="المؤسسة"><input style={inp} value={config.school} onChange={e => setConfig(c => ({ ...c, school: e.target.value }))} /></Field>
            <Field label="المديرية الإقليمية"><input style={inp} value={config.directorate} placeholder="مثال: المديرية الإقليمية لمكناس" onChange={e => setConfig(c => ({ ...c, directorate: e.target.value }))} /></Field>
            <Field label="الأكاديمية الجهوية"><input style={inp} value={config.academy} placeholder="مثال: فاس مكناس" onChange={e => setConfig(c => ({ ...c, academy: e.target.value }))} /></Field>
            <Field label="غلاف السجل">
              <select style={inp} value={config.coverVariant} onChange={e => setConfig(c => ({ ...c, coverVariant: e.target.value as "male" | "female" }))}>
                <option value="male">نسخة أنيقة</option>
                <option value="female">نسخة ناعمة</option>
              </select>
            </Field>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
            📅 التقويم والعطل الرسمية للموسم <b>2026 - 2027</b> مُدمجة تلقائياً في السجل.
          </div>
        </section>

        <button onClick={handleDownload} disabled={classes.length === 0 || loading} style={{ ...dlBtn, opacity: classes.length === 0 || loading ? 0.5 : 1, cursor: classes.length === 0 || loading ? "not-allowed" : "pointer" }}>
          {loading ? "جارٍ الإنشاء…" : `⬇  تحميل السجل PDF${classes.length > 1 ? ` (${classes.length} أقسام · ${totalStudents} تلميذ)` : ""}`}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ flex: 1, minWidth: 200 }}><label style={lbl}>{label}</label>{children}</div>;
}

/* ── styles ── */
const page: CSSProperties = { minHeight: "100vh", background: "#F7F8FC", fontFamily: "Cairo, sans-serif" };
const nav: CSSProperties = { position: "sticky", top: 0, zIndex: 10, background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" };
const navInner: CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const back: CSSProperties = { color: NAVY, fontWeight: 700, fontSize: 14, textDecoration: "none" };
const navTitle: CSSProperties = { fontWeight: 900, color: NAVY_DEEP, fontSize: 15 };
const hero: CSSProperties = { position: "relative", background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, overflow: "hidden" };
const heroPattern: CSSProperties = { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "22px 22px" };
const heroContent: CSSProperties = { position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px", textAlign: "center" };
const pill: CSSProperties = { display: "inline-block", background: "rgba(200,150,12,0.2)", color: "#F5E6C0", fontWeight: 700, fontSize: 13, padding: "5px 14px", borderRadius: 999, marginBottom: 12 };
const h1: CSSProperties = { color: "#fff", fontSize: 30, fontWeight: 900, margin: 0 };
const heroDesc: CSSProperties = { color: "#B9C6D8", fontSize: 14, marginTop: 8 };
const body: CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "24px 20px 60px", display: "flex", flexDirection: "column", gap: 16 };
const card: CSSProperties = { background: "#fff", borderRadius: 18, padding: "22px 24px", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };
const secTitle: CSSProperties = { fontSize: 16, fontWeight: 900, color: NAVY, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 };
const drop: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", border: `2px dashed ${GOLD}`, borderRadius: 14, background: "#FFFDF7", cursor: "pointer", textAlign: "center" };
const dropActive: CSSProperties = { background: "#FEF6E0", borderColor: NAVY };
const err: CSSProperties = { marginTop: 12, background: "#FEF2F2", color: "#B91C1C", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700 };
const badge: CSSProperties = { background: NAVY, color: "#fff", fontSize: 12, fontWeight: 800, borderRadius: 999, padding: "2px 10px" };
const classRow: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" };
const classNum: CSSProperties = { width: 30, height: 30, borderRadius: 8, background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 };
const rm: CSSProperties = { border: "none", background: "#FEE2E2", color: "#B91C1C", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontWeight: 900 };
const grid: CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const lbl: CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 };
const inp: CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "Cairo, sans-serif", fontWeight: 600, color: "#0F172A", outline: "none", background: "#FAFBFC" };
const dlBtn: CSSProperties = { width: "100%", padding: "16px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})`, color: "#fff", fontSize: 16, fontWeight: 900, fontFamily: "Cairo, sans-serif", boxShadow: "0 6px 20px rgba(26,48,85,0.3)" };
