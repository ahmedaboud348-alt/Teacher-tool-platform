"use client";

import { useState, useCallback, useRef, type CSSProperties, type DragEvent, type ChangeEvent } from "react";
import type { GradeBookEntry, GradeBookConfig } from "../types";
import { parseMassarFile } from "../../grading-sheet/parser";
import { ds } from "../../exam-sheet/ui/design-system";

// Sort class names ascending (1APIC-1 < 1APIC-2 < 2ASCG-1 …)
function sortEntries(entries: GradeBookEntry[]): GradeBookEntry[] {
  return [...entries].sort((a, b) => {
    const nameA = (a.data.meta.className || a.filename).toLowerCase();
    const nameB = (b.data.meta.className || b.filename).toLowerCase();
    return nameA.localeCompare(nameB, "fr", { numeric: true });
  });
}

export function GradeBookTool() {
  const [entries,   setEntries]   = useState<GradeBookEntry[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<GradeBookConfig>({
    prof:            "",
    annee:           "",
    evalCount:       3,
    showActivites:   true,
    showObservation: true,
  });
  const patch = <K extends keyof GradeBookConfig>(k: K, v: GradeBookConfig[K]) =>
    setConfig(c => ({ ...c, [k]: v }));

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFiles = useCallback(async (files: File[]) => {
    const xlsFiles = files.filter(f => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"));
    if (xlsFiles.length === 0) {
      setError("الملفات يجب أن تكون بصيغة Excel (.xlsx أو .xls)");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const parsed = await Promise.all(
        xlsFiles.map(async (file) => {
          const data = await parseMassarFile(file);
          const entry: GradeBookEntry = {
            id: file.name + "-" + Date.now() + "-" + Math.random(),
            filename: file.name,
            data,
          };
          return entry;
        })
      );
      setEntries(prev => {
        const merged = [...prev, ...parsed];
        // auto-fill prof/annee from first file if empty
        if (!config.prof && parsed[0]?.data.meta.teacher) {
          setConfig(c => ({ ...c, prof: parsed[0].data.meta.teacher }));
        }
        if (!config.annee && parsed[0]?.data.meta.year) {
          setConfig(c => ({ ...c, annee: parsed[0].data.meta.year }));
        }
        return sortEntries(merged);
      });
    } catch (e) {
      setError("تعذر قراءة أحد الملفات. تأكد أنها ملفات Excel صادرة من منظومة مسار.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [config.prof, config.annee]);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
    e.target.value = "";
  }, [handleFiles]);

  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const clearAll    = () => setEntries([]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (entries.length === 0) return;
    setExporting(true);
    setError(null);
    try {
      const { downloadGradeBookPdf } = await import("../pdf/render-grade-book-pdf");
      await downloadGradeBookPdf(entries, config);
    } catch (e) {
      setError("حدث خطأ أثناء إنشاء PDF.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const totalStudents = entries.reduce((acc, e) => acc + e.data.students.length, 0);
  const hasEntries    = entries.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>

      {/* App Bar */}
      <nav style={appBarStyle}>
        <div style={appBarInnerStyle}>
          <div style={brandWrapStyle}>
            <div style={logoMarkStyle}>م</div>
            <div>
              <div style={brandNameStyle}>منصة الأدوات التربوية</div>
              <div style={brandSubStyle}>دفتر التنقيط</div>
            </div>
          </div>
          {hasEntries && (
            <div style={badgesRowStyle}>
              <span style={badgeStyle}>{entries.length} قسم</span>
              <span style={badgeStyle}>{totalStudents} تلميذ</span>
              <button style={clearBtnStyle} onClick={clearAll}>مسح الكل ×</button>
            </div>
          )}
        </div>
        <div style={appBarLineStyle} />
      </nav>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroBgStyle} />
        <div style={heroInnerStyle}>
          <div style={heroEyebrowStyle}>📚 أداة جديدة</div>
          <h1 style={heroTitleStyle}>دفتر التنقيط</h1>
          <p style={heroDescStyle}>
            ارفع ملفات Excel لجميع أقسامك دفعة واحدة وأنتج دفتر تنقيط كامل جاهز للطباعة
          </p>
        </div>
        <div style={heroCurveStyle} />
      </div>

      <div style={bodyStyle}>
        <div style={contentWrapStyle}>

          {/* ── Drop zone (always visible) ── */}
          <div
            style={{ ...dropZoneStyle, ...(dragging ? dropZoneActiveStyle : {}) }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div style={dropIconStyle}>{loading ? "⏳" : hasEntries ? "➕" : "📂"}</div>
            <div style={dropTitleStyle}>
              {loading ? "جارٍ قراءة الملفات..." : hasEntries ? "أضف المزيد من الأقسام" : "أسقط ملفات Excel هنا"}
            </div>
            <div style={dropSubStyle}>
              {hasEntries ? "يمكنك إضافة ملفات أقسام إضافية" : "ملفات Excel صادرة من منظومة مسار — يمكن رفع عدة ملفات دفعة واحدة"}
            </div>
            <label style={fileBtnStyle}>
              {hasEntries ? "إضافة ملفات" : "اختر ملفات .xlsx"}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                multiple
                style={{ display: "none" }}
                onChange={onFileChange}
              />
            </label>
            {error && <div style={errorStyle}>{error}</div>}
          </div>

          {/* ── Main layout (visible after upload) ── */}
          {hasEntries && (
            <div style={mainLayoutStyle}>

              {/* Left — config */}
              <div style={leftColStyle}>
                <div style={sectionCardStyle}>
                  <h2 style={sectionTitleStyle}>إعدادات الدفتر</h2>
                  <div style={fieldGridStyle}>
                    <Field label="الأستاذ / الأستاذة">
                      <input style={inputStyle} value={config.prof}
                        onChange={e => patch("prof", e.target.value)} />
                    </Field>
                    <Field label="السنة الدراسية">
                      <input style={inputStyle} value={config.annee}
                        onChange={e => patch("annee", e.target.value)} />
                    </Field>
                    <Field label="عدد تقييمات الفرض">
                      <select style={selectStyle} value={config.evalCount}
                        onChange={e => patch("evalCount", Number(e.target.value) as 1|2|3)}>
                        <option value={1}>1 — فرض واحد</option>
                        <option value={2}>2 — فرضان</option>
                        <option value={3}>3 — ثلاثة فروض</option>
                      </select>
                    </Field>
                  </div>
                  <div style={togglesStyle}>
                    <Toggle checked={config.showActivites}   onChange={v => patch("showActivites", v)}   label="عمود الأنشطة المندمجة" />
                    <Toggle checked={config.showObservation} onChange={v => patch("showObservation", v)} label="عمود الملاحظة" />
                  </div>
                </div>

                <button
                  style={{ ...exportBtnStyle, ...(exporting ? exportBtnDisabledStyle : {}) }}
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? "⏳ جارٍ الإنشاء..." : "⬇ تحميل دفتر التنقيط PDF"}
                </button>

                <div style={summaryCardStyle}>
                  <div style={summaryRowStyle}>
                    <span style={summaryLabelStyle}>إجمالي الأقسام</span>
                    <span style={summaryValueStyle}>{entries.length}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={summaryLabelStyle}>إجمالي التلاميذ</span>
                    <span style={summaryValueStyle}>{totalStudents}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={summaryLabelStyle}>عدد الصفحات (تقريبي)</span>
                    <span style={summaryValueStyle}>
                      {1 + entries.reduce((acc, e) => acc + Math.ceil(e.data.students.length / 30), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — classes list */}
              <div style={rightColStyle}>
                <div style={sectionCardStyle}>
                  <div style={listHeaderStyle}>
                    <h2 style={sectionTitleStyle}>الأقسام المحملة</h2>
                    <span style={badgeStyle}>{entries.length} قسم • مرتبة تصاعدياً</span>
                  </div>
                  <div style={classListStyle}>
                    {entries.map((entry, idx) => (
                      <ClassCard key={entry.id} entry={entry} idx={idx} onRemove={removeEntry} />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ClassCard({ entry, idx, onRemove }: { entry: GradeBookEntry; idx: number; onRemove: (id: string) => void }) {
  const m = entry.data.meta;
  return (
    <div style={classCardStyle}>
      <div style={classCardNumStyle}>{idx + 1}</div>
      <div style={classCardBodyStyle}>
        <div style={classCardNameStyle}>{m.className || entry.filename}</div>
        <div style={classCardMetaStyle}>
          {m.level && <span style={classMetaChipStyle}>{m.level}</span>}
          {m.subject && <span style={classMetaChipStyle}>{m.subject}</span>}
          <span style={classMetaChipStyle}>{entry.data.students.length} تلميذ</span>
        </div>
      </div>
      <button style={removeBtnStyle} onClick={() => onRemove(entry.id)} title="حذف هذا القسم">×</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={toggleRowStyle}>
      <div style={{ ...trackStyle, ...(checked ? trackOnStyle : {}) }} onClick={() => onChange(!checked)}>
        <div style={{ ...thumbStyle, ...(checked ? thumbOnStyle : {}) }} />
      </div>
      <span style={toggleLabelStyle}>{label}</span>
    </label>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const pageStyle: CSSProperties = { minHeight: "100vh", backgroundColor: ds.colors.bgPage, fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" };

const appBarStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 4px 16px rgba(0,0,0,0.04)" };
const appBarInnerStyle: CSSProperties = { maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 };
const brandWrapStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const logoMarkStyle: CSSProperties = { width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16, flexShrink: 0, boxShadow: "0 4px 10px rgba(124,58,237,0.30)" };
const brandNameStyle: CSSProperties = { fontSize: 13, fontWeight: 800, color: ds.colors.textPrimary, lineHeight: "1.2" };
const brandSubStyle: CSSProperties  = { fontSize: 11, color: ds.colors.textMuted, lineHeight: "1" };
const appBarLineStyle: CSSProperties = { height: 2, background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, transparent 100%)" };
const badgesRowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const badgeStyle: CSSProperties = { fontSize: 11, fontWeight: 700, color: ds.colors.primary600, backgroundColor: ds.colors.primary100, border: `1px solid ${ds.colors.primary200}`, borderRadius: 999, padding: "3px 10px" };
const clearBtnStyle: CSSProperties = { fontSize: 12, fontWeight: 700, color: "#DC2626", backgroundColor: "transparent", border: "none", cursor: "pointer" };

const heroStyle: CSSProperties = { position: "relative", overflow: "hidden", background: "linear-gradient(140deg, #3B0764 0%, #6D28D9 55%, #7C3AED 100%)", paddingTop: 56, paddingBottom: 100, paddingLeft: 24, paddingRight: 24 };
const heroBgStyle: CSSProperties = { position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" };
const heroInnerStyle: CSSProperties = { position: "relative", zIndex: 1, textAlign: "center", maxWidth: 600, margin: "0 auto" };
const heroEyebrowStyle: CSSProperties = { display: "inline-block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 999, padding: "6px 18px", marginBottom: 16 };
const heroTitleStyle: CSSProperties  = { fontSize: 40, fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: "1.15" };
const heroDescStyle: CSSProperties   = { fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: "1.7", margin: 0 };
const heroCurveStyle: CSSProperties  = { position: "absolute", bottom: -2, left: 0, right: 0, height: 56, backgroundColor: ds.colors.bgPage, borderRadius: "60% 60% 0 0 / 100% 100% 0 0" };

const bodyStyle: CSSProperties = { padding: "0 24px 64px", marginTop: -32, position: "relative", zIndex: 2 };
const contentWrapStyle: CSSProperties = { maxWidth: 1200, margin: "0 auto" };

const dropZoneStyle: CSSProperties = { backgroundColor: "#fff", border: `2px dashed ${ds.colors.borderStrong}`, borderRadius: 20, padding: "48px 32px", textAlign: "center", cursor: "pointer", transition: "border-color 180ms, background-color 180ms", marginBottom: 24 };
const dropZoneActiveStyle: CSSProperties = { borderColor: ds.colors.primary500, backgroundColor: ds.colors.primary50 };
const dropIconStyle: CSSProperties  = { fontSize: 44, marginBottom: 12 };
const dropTitleStyle: CSSProperties = { fontSize: 18, fontWeight: 800, color: ds.colors.textPrimary, marginBottom: 6 };
const dropSubStyle: CSSProperties   = { fontSize: 13, color: ds.colors.textMuted, marginBottom: 16 };
const fileBtnStyle: CSSProperties   = { display: "inline-block", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", backgroundColor: ds.colors.primary500, border: "none", borderRadius: 10, padding: "10px 24px", marginBottom: 12, boxShadow: "0 6px 18px rgba(124,58,237,0.25)" };
const errorStyle: CSSProperties     = { marginTop: 12, fontSize: 13, color: ds.colors.danger, backgroundColor: ds.colors.dangerBg, border: `1px solid ${ds.colors.danger}`, borderRadius: 8, padding: "8px 16px" };

const mainLayoutStyle: CSSProperties   = { display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" };
const leftColStyle: CSSProperties      = { display: "flex", flexDirection: "column", gap: 16 };
const rightColStyle: CSSProperties     = {};
const sectionCardStyle: CSSProperties  = { backgroundColor: "#fff", border: `1.5px solid ${ds.colors.borderSoft}`, borderInlineStart: `3px solid ${ds.colors.primary500}`, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };
const sectionTitleStyle: CSSProperties = { fontSize: 16, fontWeight: 800, color: ds.colors.textPrimary, margin: 0 };
const fieldGridStyle: CSSProperties    = { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 };
const fieldStyle: CSSProperties        = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle: CSSProperties        = { fontSize: 11, fontWeight: 800, color: ds.colors.textSecondary };
const inputStyle: CSSProperties        = { width: "100%", minHeight: 40, padding: "8px 12px", borderRadius: 10, border: `1px solid ${ds.colors.borderStrong}`, backgroundColor: "#fff", fontSize: 13, color: ds.colors.textPrimary, outline: "none", boxSizing: "border-box" };
const selectStyle: CSSProperties       = { ...inputStyle, appearance: "none" };
const togglesStyle: CSSProperties      = { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 };
const toggleRowStyle: CSSProperties    = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" };
const trackStyle: CSSProperties        = { width: 38, height: 22, borderRadius: 999, backgroundColor: ds.colors.borderStrong, position: "relative", flexShrink: 0, transition: "background-color 150ms", cursor: "pointer" };
const trackOnStyle: CSSProperties      = { backgroundColor: ds.colors.primary500 };
const thumbStyle: CSSProperties        = { position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff", transition: "right 150ms", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" };
const thumbOnStyle: CSSProperties      = { right: "calc(100% - 19px)" };
const toggleLabelStyle: CSSProperties  = { fontSize: 12, fontWeight: 600, color: ds.colors.textSecondary };

const exportBtnStyle: CSSProperties        = { width: "100%", minHeight: 48, borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", color: "#fff", fontSize: 15, fontWeight: 800, boxShadow: "0 8px 20px rgba(124,58,237,0.30)", transition: "opacity 150ms" };
const exportBtnDisabledStyle: CSSProperties = { opacity: 0.7, cursor: "not-allowed" };

const summaryCardStyle: CSSProperties = { backgroundColor: ds.colors.bgSubtle, border: `1px solid ${ds.colors.borderMuted}`, borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 };
const summaryRowStyle: CSSProperties  = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const summaryLabelStyle: CSSProperties = { fontSize: 12, color: ds.colors.textMuted };
const summaryValueStyle: CSSProperties = { fontSize: 14, fontWeight: 800, color: ds.colors.textPrimary };

const listHeaderStyle: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 };
const classListStyle: CSSProperties  = { display: "flex", flexDirection: "column", gap: 8 };
const classCardStyle: CSSProperties  = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, backgroundColor: ds.colors.bgSubtle, border: `1px solid ${ds.colors.borderMuted}`, transition: "box-shadow 150ms" };
const classCardNumStyle: CSSProperties = { minWidth: 28, height: 28, borderRadius: "50%", backgroundColor: ds.colors.primary100, color: ds.colors.primary600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 };
const classCardBodyStyle: CSSProperties = { flex: 1, minWidth: 0 };
const classCardNameStyle: CSSProperties = { fontSize: 14, fontWeight: 800, color: ds.colors.textPrimary, marginBottom: 4 };
const classCardMetaStyle: CSSProperties = { display: "flex", gap: 6, flexWrap: "wrap" };
const classMetaChipStyle: CSSProperties = { fontSize: 10, fontWeight: 700, color: ds.colors.textMuted, backgroundColor: "#fff", border: `1px solid ${ds.colors.borderMuted}`, borderRadius: 999, padding: "1px 8px" };
const removeBtnStyle: CSSProperties     = { width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "#FEE2E2", color: "#DC2626", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
