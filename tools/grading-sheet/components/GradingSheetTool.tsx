"use client";

import { useState, useCallback, type CSSProperties, type DragEvent, type ChangeEvent } from "react";
import type { MassarData, GradingSheetConfig } from "../types";
import { parseMassarFile } from "../parser";
import { ds } from "../../exam-sheet/ui/design-system";

type Step = "upload" | "config" | "done";

export function GradingSheetTool() {
  const [step, setStep]       = useState<Step>("upload");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<MassarData | null>(null);
  const [exporting, setExporting] = useState(false);

  const [config, setConfig] = useState<GradingSheetConfig>({
    prof: "",
    annee: "",
    classe: "",
    evalCount: 3,
    showActivites: true,
    showObservation: true,
  });

  const patch = <K extends keyof GradingSheetConfig>(k: K, v: GradingSheetConfig[K]) =>
    setConfig(c => ({ ...c, [k]: v }));

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("الملف يجب أن يكون بصيغة Excel (.xlsx أو .xls)");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const parsed = await parseMassarFile(file);
      setData(parsed);
      setConfig(c => ({
        ...c,
        prof:    parsed.meta.teacher || c.prof,
        annee:   parsed.meta.year    || c.annee,
        classe:  parsed.meta.className || c.classe,
      }));
      setStep("config");
    } catch (e) {
      setError("تعذر قراءة الملف. تأكد أنه ملف Excel صادر من منظومة مسار.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!data) return;
    setExporting(true);
    try {
      const { downloadGradingSheetPdf } = await import("../pdf/render-grading-sheet-pdf");
      await downloadGradingSheetPdf(data, config);
    } catch (e) {
      setError("حدث خطأ أثناء إنشاء PDF.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>

      {/* ── App Bar ── */}
      <nav style={appBarStyle}>
        <div style={appBarInnerStyle}>
          <div style={brandWrapStyle}>
            <div style={logoMarkStyle}>م</div>
            <div>
              <div style={brandNameStyle}>منصة الأدوات التربوية</div>
              <div style={brandSubStyle}>ورقة التنقيط</div>
            </div>
          </div>
          {step === "config" && data && (
            <div style={stepBadgesStyle}>
              <span style={metaBadgeStyle}>{data.meta.className}</span>
              <span style={metaBadgeStyle}>{data.students.length} تلميذ</span>
              <button style={resetBtnStyle} onClick={() => { setStep("upload"); setData(null); }}>
                ← تغيير الملف
              </button>
            </div>
          )}
        </div>
        <div style={appBarLineStyle} />
      </nav>

      {/* ── Hero ── */}
      <div style={heroStyle}>
        <div style={heroBgStyle} />
        <div style={heroInnerStyle}>
          <div style={heroEyebrowStyle}>🗂 أداة جديدة</div>
          <h1 style={heroTitleStyle}>ورقة التنقيط</h1>
          <p style={heroDescStyle}>
            ارفع ملف Excel من منظومة مسار وأنتج ورقة التنقيط جاهزة للطباعة
          </p>
        </div>
        <div style={heroCurveStyle} />
      </div>

      <div style={bodyStyle}>
        <div style={contentWrapStyle}>

          {/* ══ STEP 1 — Upload ══ */}
          {step === "upload" && (
            <div
              style={{
                ...dropZoneStyle,
                ...(dragging ? dropZoneActiveStyle : {}),
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div style={dropIconStyle}>📂</div>
              <div style={dropTitleStyle}>
                {loading ? "جارٍ قراءة الملف..." : "أسقط ملف Excel هنا"}
              </div>
              <div style={dropSubStyle}>
                أو اضغط لاختيار الملف من جهازك
              </div>
              <label style={fileBtnStyle}>
                اختر ملف .xlsx
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
              </label>
              <div style={dropHintStyle}>
                ملف Excel صادر من منظومة مسار — لائحة تلاميذ القسم
              </div>
              {error && <div style={errorStyle}>{error}</div>}
            </div>
          )}

          {/* ══ STEP 2 — Config ══ */}
          {step === "config" && data && (
            <div style={configLayoutStyle}>

              {/* Left — config form */}
              <div style={formColStyle}>
                <div style={sectionCardStyle}>
                  <h2 style={sectionTitleStyle}>معلومات رأس الورقة</h2>
                  <div style={fieldGridStyle}>
                    <Field label="الأستاذ / الأستاذة">
                      <input style={inputStyle} value={config.prof}
                        onChange={e => patch("prof", e.target.value)} />
                    </Field>
                    <Field label="السنة الدراسية">
                      <input style={inputStyle} value={config.annee}
                        onChange={e => patch("annee", e.target.value)} />
                    </Field>
                    <Field label="القسم">
                      <input style={inputStyle} value={config.classe}
                        onChange={e => patch("classe", e.target.value)} />
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

                  <div style={checkRowStyle}>
                    <Toggle
                      checked={config.showActivites}
                      onChange={v => patch("showActivites", v)}
                      label="عمود الأنشطة المندمجة (Part / T.H.C / Cahier / Disc)"
                    />
                    <Toggle
                      checked={config.showObservation}
                      onChange={v => patch("showObservation", v)}
                      label="عمود الملاحظة"
                    />
                  </div>
                </div>

                <button
                  style={{ ...exportBtnStyle, ...(exporting ? exportBtnLoadingStyle : {}) }}
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? "⏳ جارٍ الإنشاء..." : "⬇ تحميل ورقة التنقيط PDF"}
                </button>
              </div>

              {/* Right — students preview */}
              <div style={previewColStyle}>
                <div style={sectionCardStyle}>
                  <div style={previewHeaderStyle}>
                    <h2 style={sectionTitleStyle}>قائمة التلاميذ</h2>
                    <span style={countBadgeStyle}>{data.students.length} تلميذ</span>
                  </div>
                  <div style={metaInfoStyle}>
                    <MetaItem label="المؤسسة" value={data.meta.school} />
                    <MetaItem label="المستوى" value={data.meta.level} />
                    <MetaItem label="الدورة"  value={data.meta.term} />
                    <MetaItem label="المادة"  value={data.meta.subject} />
                  </div>
                  <div style={studentListStyle}>
                    {data.students.map(s => (
                      <div key={s.index} style={studentRowStyle}>
                        <span style={studentNumStyle}>{s.index}</span>
                        <span style={studentNameStyle}>{s.name}</span>
                      </div>
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

// ── Small helpers ──────────────────────────────────────────────────────────────
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
      <div
        style={{ ...toggleTrackStyle, ...(checked ? toggleTrackOnStyle : {}) }}
        onClick={() => onChange(!checked)}
      >
        <div style={{ ...toggleThumbStyle, ...(checked ? toggleThumbOnStyle : {}) }} />
      </div>
      <span style={toggleLabelStyle}>{label}</span>
    </label>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={metaItemStyle}>
      <span style={metaLabelStyle}>{label}:</span>
      <span style={metaValueStyle}>{value || "—"}</span>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: ds.colors.bgPage,
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
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
};
const brandWrapStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const logoMarkStyle: CSSProperties = {
  width: 34, height: 34, borderRadius: 9,
  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontWeight: 900, fontSize: 16, flexShrink: 0,
  boxShadow: "0 4px 10px rgba(124,58,237,0.30)",
};
const brandNameStyle: CSSProperties = { fontSize: 13, fontWeight: 800, color: ds.colors.textPrimary, lineHeight: 1.2 };
const brandSubStyle: CSSProperties  = { fontSize: 11, color: ds.colors.textMuted, lineHeight: 1 };
const appBarLineStyle: CSSProperties = {
  height: 2,
  background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, transparent 100%)",
};
const stepBadgesStyle: CSSProperties  = { display: "flex", alignItems: "center", gap: 8 };
const metaBadgeStyle: CSSProperties   = {
  fontSize: 11, fontWeight: 700, color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100, border: `1px solid ${ds.colors.primary200}`,
  borderRadius: 999, padding: "3px 10px",
};
const resetBtnStyle: CSSProperties = {
  fontSize: 12, fontWeight: 700, color: ds.colors.primary600,
  backgroundColor: "transparent", border: "none", cursor: "pointer",
  textDecoration: "underline",
};

// Hero
const heroStyle: CSSProperties = {
  position: "relative", overflow: "hidden",
  background: "linear-gradient(140deg, #3B0764 0%, #6D28D9 55%, #7C3AED 100%)",
  paddingTop: 56, paddingBottom: 100, paddingLeft: 24, paddingRight: 24,
};
const heroBgStyle: CSSProperties = {
  position: "absolute", inset: 0,
  backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "28px 28px", pointerEvents: "none",
};
const heroInnerStyle: CSSProperties = { position: "relative", zIndex: 1, textAlign: "center", maxWidth: 600, margin: "0 auto" };
const heroEyebrowStyle: CSSProperties = {
  display: "inline-block", fontSize: 13, fontWeight: 700,
  color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.20)", borderRadius: 999,
  padding: "6px 18px", marginBottom: 16,
};
const heroTitleStyle: CSSProperties  = { fontSize: 40, fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 };
const heroDescStyle: CSSProperties   = { fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 };
const heroCurveStyle: CSSProperties  = {
  position: "absolute", bottom: -2, left: 0, right: 0, height: 56,
  backgroundColor: ds.colors.bgPage, borderRadius: "60% 60% 0 0 / 100% 100% 0 0",
};

// Body
const bodyStyle: CSSProperties  = { padding: "0 24px 64px", marginTop: -32, position: "relative", zIndex: 2 };
const contentWrapStyle: CSSProperties = { maxWidth: 1100, margin: "0 auto" };

// Drop zone
const dropZoneStyle: CSSProperties = {
  backgroundColor: "#fff",
  border: `2px dashed ${ds.colors.borderStrong}`,
  borderRadius: 20,
  padding: "64px 32px",
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 180ms ease, background-color 180ms ease",
};
const dropZoneActiveStyle: CSSProperties = {
  borderColor: ds.colors.primary500,
  backgroundColor: ds.colors.primary50,
};
const dropIconStyle: CSSProperties  = { fontSize: 52, marginBottom: 16 };
const dropTitleStyle: CSSProperties = { fontSize: 20, fontWeight: 800, color: ds.colors.textPrimary, marginBottom: 8 };
const dropSubStyle: CSSProperties   = { fontSize: 14, color: ds.colors.textMuted, marginBottom: 20 };
const fileBtnStyle: CSSProperties   = {
  display: "inline-block", cursor: "pointer",
  fontSize: 14, fontWeight: 700, color: "#fff",
  backgroundColor: ds.colors.primary500,
  border: "none", borderRadius: 10, padding: "10px 24px",
  marginBottom: 16,
  boxShadow: "0 6px 18px rgba(124,58,237,0.25)",
};
const dropHintStyle: CSSProperties  = { fontSize: 12, color: ds.colors.textMuted };
const errorStyle: CSSProperties     = {
  marginTop: 16, fontSize: 13, color: ds.colors.danger,
  backgroundColor: ds.colors.dangerBg, border: `1px solid ${ds.colors.danger}`,
  borderRadius: 8, padding: "8px 16px",
};

// Config layout
const configLayoutStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 20, alignItems: "start" };
const formColStyle: CSSProperties      = { display: "flex", flexDirection: "column", gap: 16 };
const previewColStyle: CSSProperties   = {};
const sectionCardStyle: CSSProperties  = {
  backgroundColor: "#fff",
  border: `1.5px solid ${ds.colors.borderSoft}`,
  borderInlineStart: `3px solid ${ds.colors.primary500}`,
  borderRadius: 16, padding: 24,
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};
const sectionTitleStyle: CSSProperties = { fontSize: 16, fontWeight: 800, color: ds.colors.textPrimary, margin: 0 };
const fieldGridStyle: CSSProperties    = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 };
const fieldStyle: CSSProperties        = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle: CSSProperties        = { fontSize: 11, fontWeight: 800, color: ds.colors.textSecondary };
const inputStyle: CSSProperties        = {
  width: "100%", minHeight: 40, padding: "8px 12px",
  borderRadius: 10, border: `1px solid ${ds.colors.borderStrong}`,
  backgroundColor: "#fff", fontSize: 13, color: ds.colors.textPrimary,
  outline: "none", boxSizing: "border-box",
};
const selectStyle: CSSProperties = { ...inputStyle, appearance: "none" };
const checkRowStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 };

// Toggle
const toggleRowStyle: CSSProperties  = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" };
const toggleTrackStyle: CSSProperties = {
  width: 38, height: 22, borderRadius: 999,
  backgroundColor: ds.colors.borderStrong,
  position: "relative", flexShrink: 0, transition: "background-color 150ms ease",
  cursor: "pointer",
};
const toggleTrackOnStyle: CSSProperties = { backgroundColor: ds.colors.primary500 };
const toggleThumbStyle: CSSProperties   = {
  position: "absolute", top: 3, right: 3,
  width: 16, height: 16, borderRadius: "50%",
  backgroundColor: "#fff", transition: "right 150ms ease",
  boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
};
const toggleThumbOnStyle: CSSProperties = { right: "calc(100% - 19px)" };
const toggleLabelStyle: CSSProperties   = { fontSize: 12, fontWeight: 600, color: ds.colors.textSecondary };

// Export button
const exportBtnStyle: CSSProperties = {
  width: "100%", minHeight: 48, borderRadius: 12, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  color: "#fff", fontSize: 15, fontWeight: 800,
  boxShadow: "0 8px 20px rgba(124,58,237,0.30)",
  transition: "opacity 150ms ease",
};
const exportBtnLoadingStyle: CSSProperties = { opacity: 0.7, cursor: "not-allowed" };

// Students list
const previewHeaderStyle: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 };
const countBadgeStyle: CSSProperties    = {
  fontSize: 11, fontWeight: 800, color: ds.colors.primary600,
  backgroundColor: ds.colors.primary100, border: `1px solid ${ds.colors.primary200}`,
  borderRadius: 999, padding: "2px 10px",
};
const metaInfoStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14,
};
const metaItemStyle: CSSProperties  = {
  display: "flex", flexDirection: "column", gap: 1,
  backgroundColor: ds.colors.bgSubtle, borderRadius: 8, padding: "6px 10px",
  border: `1px solid ${ds.colors.borderMuted}`,
};
const metaLabelStyle: CSSProperties = { fontSize: 10, fontWeight: 800, color: ds.colors.textMuted };
const metaValueStyle: CSSProperties = { fontSize: 12, fontWeight: 700, color: ds.colors.textPrimary };
const studentListStyle: CSSProperties = {
  maxHeight: 420, overflowY: "auto",
  display: "flex", flexDirection: "column", gap: 2,
};
const studentRowStyle: CSSProperties  = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "6px 10px", borderRadius: 8,
  backgroundColor: ds.colors.bgSubtle, border: `1px solid ${ds.colors.borderMuted}`,
};
const studentNumStyle: CSSProperties  = {
  minWidth: 24, height: 24, borderRadius: "50%",
  backgroundColor: ds.colors.primary100, color: ds.colors.primary600,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 10, fontWeight: 800, flexShrink: 0,
};
const studentNameStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: ds.colors.textPrimary };
