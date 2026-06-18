"use client";
import { useState, useCallback, type CSSProperties, type DragEvent, type ChangeEvent } from "react";
import type { MassarData } from "../../grading-sheet/types";
import type { AttendanceConfig } from "../types";
import { parseMassarFile } from "../../grading-sheet/parser";
import { downloadAttendancePdf } from "../pdf/render-attendance-pdf";

const ACCENT       = "#0891B2";
const ACCENT_LIGHT = "#ECFEFF";
const ACCENT_BORDER= "#A5F3FC";

export function AttendanceSheetTool() {
  const [classes,  setClasses]  = useState<MassarData[]>([]);
  const [config,   setConfig]   = useState<AttendanceConfig>({ prof: "", annee: "", sessionsPerWeek: 2 });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.name.match(/\.(xlsx|xls)$/i));
    if (arr.length === 0) {
      setError("الملفات يجب أن تكون بصيغة Excel (.xlsx أو .xls)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const parsed = await Promise.all(arr.map(f => parseMassarFile(f)));
      setClasses(prev => {
        const existing = new Set(prev.map(c => c.meta.className));
        const newOnes  = parsed.filter(p => !existing.has(p.meta.className));
        const merged   = [...prev, ...newOnes];
        if (merged.length !== prev.length + parsed.length) {
          setError("بعض الأقسام موجودة مسبقاً — تم تخطيها");
        }
        return merged;
      });
      setConfig(c => ({
        ...c,
        prof:  c.prof  || parsed[0]?.meta.teacher || "",
        annee: c.annee || parsed[0]?.meta.year    || "",
      }));
    } catch {
      setError("تعذّر قراءة أحد الملفات. تأكد أنها ملفات مسار صالحة.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeClass = (idx: number) =>
    setClasses(prev => prev.filter((_, i) => i !== idx));

  const handleDownload = async () => {
    if (classes.length === 0) return;
    setLoading(true);
    try {
      await downloadAttendancePdf(classes, config);
    } finally {
      setLoading(false);
    }
  };

  const totalSessions = config.sessionsPerWeek * 18;

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={{ ...accentBarStyle, backgroundColor: ACCENT }} />
          <div style={headerContentStyle}>
            <div style={iconBoxStyle}>📅</div>
            <div>
              <h1 style={titleStyle}>سجل الغياب</h1>
              <p style={subtitleStyle}>Registre des Absences — جميع الأقسام في ملف واحد</p>
            </div>
          </div>
        </div>
      </div>

      <div style={bodyStyle}>

        {/* Upload zone */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>① رفع ملفات مسار</h2>
          <label
            style={{ ...dropZoneStyle, ...(dragging ? dropZoneActiveStyle : {}) }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              multiple
              style={{ display: "none" }}
              onChange={onInput}
            />
            <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
            <div style={{ fontWeight: 700, color: "#1A3055", marginBottom: 4 }}>
              اسحب ملفات Excel أو اضغط للاختيار
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              يمكن رفع أقسام متعددة دفعة واحدة — ملفات مسار (.xlsx / .xls)
            </div>
          </label>
          {error && <div style={errorStyle}>{error}</div>}
        </div>

        {/* Classes list */}
        {classes.length > 0 && (
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              {"الأقسام المرفوعة "}
              <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>
                ({classes.length})
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {classes.map((cls, i) => (
                <div key={i} style={classRowStyle}>
                  <div style={classNumStyle}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                      {cls.meta.className || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                      {cls.meta.level || "—"} · {cls.students.length} تلميذ
                    </div>
                  </div>
                  <button
                    style={removeBtn}
                    onClick={() => removeClass(i)}
                    title="حذف القسم"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Config */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>② الإعدادات</h2>

          <div style={formRowStyle}>
            <label style={labelStyle}>اسم الأستاذ / الأستاذة</label>
            <input
              style={inputStyle}
              value={config.prof}
              onChange={e => setConfig(c => ({ ...c, prof: e.target.value }))}
              placeholder="يُملأ تلقائياً من الملف"
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>السنة الدراسية</label>
            <input
              style={inputStyle}
              value={config.annee}
              onChange={e => setConfig(c => ({ ...c, annee: e.target.value }))}
              placeholder="مثال: 2025/2026"
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>عدد الحصص في الأسبوع</label>
            <div style={radioGroupStyle}>
              {([1, 2, 3] as const).map(n => (
                <button
                  key={n}
                  style={{
                    ...radioBtn,
                    ...(config.sessionsPerWeek === n ? radioBtnActive : {}),
                  }}
                  onClick={() => setConfig(c => ({ ...c, sessionsPerWeek: n }))}
                >
                  <span style={{ fontSize: 18, fontWeight: 900 }}>{n}</span>
                  <span style={{ fontSize: 11, color: config.sessionsPerWeek === n ? ACCENT : "#64748B" }}>
                    {n === 1 ? "حصة" : n === 2 ? "حصتان" : "حصص"}
                  </span>
                  <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                    {n * 18} حصة/دورة
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        {classes.length > 0 && (
          <div style={summaryStyle}>
            <SummaryItem label="عدد الأقسام"   value={String(classes.length)} />
            <SummaryItem label="إجمالي التلاميذ" value={String(classes.reduce((s, c) => s + c.students.length, 0))} />
            <SummaryItem label="حصص/دورة"       value={String(totalSessions)} />
          </div>
        )}

        {/* Download */}
        <button
          style={{
            ...downloadBtnStyle,
            backgroundColor: classes.length > 0 && !loading ? ACCENT : "#CBD5E1",
            cursor: classes.length > 0 && !loading ? "pointer" : "not-allowed",
          }}
          disabled={classes.length === 0 || loading}
          onClick={handleDownload}
        >
          {loading ? "جارٍ الإنشاء..." : "⬇  تحميل PDF سجل الغياب"}
        </button>

      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryItemStyle}>
      <span style={summaryLabelStyle}>{label}</span>
      <span style={summaryValueStyle}>{value}</span>
    </div>
  );
}

/* ── Styles ── */
const pageStyle: CSSProperties = {
  minHeight: "100vh", backgroundColor: "#F7F6FB",
  fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl",
};
const headerStyle: CSSProperties = {
  backgroundColor: "#fff",
  boxShadow: "0 1px 0 rgba(8,145,178,0.08), 0 4px 16px rgba(0,0,0,0.04)",
};
const headerInnerStyle: CSSProperties = {
  maxWidth: 760, margin: "0 auto", padding: "0 24px",
};
const accentBarStyle: CSSProperties = { height: 3, borderRadius: "0 0 3px 3px" };
const headerContentStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 16, padding: "20px 0",
};
const iconBoxStyle: CSSProperties = {
  width: 52, height: 52, borderRadius: 14,
  backgroundColor: ACCENT_LIGHT, border: `1.5px solid ${ACCENT_BORDER}`,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 26, flexShrink: 0,
};
const titleStyle: CSSProperties = {
  fontSize: 22, fontWeight: 900, color: "#0F172A", margin: 0, lineHeight: 1.2,
};
const subtitleStyle: CSSProperties = { fontSize: 13, color: "#64748B", margin: "4px 0 0" };

const bodyStyle: CSSProperties = {
  maxWidth: 760, margin: "0 auto", padding: "28px 24px 64px",
  display: "flex", flexDirection: "column", gap: 20,
};
const cardStyle: CSSProperties = {
  backgroundColor: "#fff", borderRadius: 16,
  border: "1.5px solid #E2E8F0", padding: "20px 24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};
const sectionTitleStyle: CSSProperties = {
  fontSize: 15, fontWeight: 800, color: "#0F172A",
  margin: "0 0 16px", paddingBottom: 10,
  borderBottom: "1.5px solid #F1F5F9",
};

const dropZoneStyle: CSSProperties = {
  border: "2px dashed #CBD5E1", borderRadius: 12,
  padding: "32px 24px", textAlign: "center",
  cursor: "pointer", display: "block",
  transition: "border-color 150ms",
};
const dropZoneActiveStyle: CSSProperties = {
  borderColor: ACCENT, backgroundColor: ACCENT_LIGHT,
};
const errorStyle: CSSProperties = {
  marginTop: 12, padding: "10px 14px", borderRadius: 8,
  backgroundColor: "#FEF2F2", color: "#DC2626",
  fontSize: 13, fontWeight: 600,
};

const classRowStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "10px 14px", borderRadius: 10,
  backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
};
const classNumStyle: CSSProperties = {
  width: 28, height: 28, borderRadius: 8,
  backgroundColor: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}`,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontWeight: 900, fontSize: 13, color: ACCENT, flexShrink: 0,
};
const removeBtn: CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  border: "1px solid #FCA5A5", backgroundColor: "#FEF2F2",
  color: "#DC2626", cursor: "pointer", fontSize: 12,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "system-ui", flexShrink: 0,
};

const formRowStyle: CSSProperties = { marginBottom: 16 };
const labelStyle: CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 700,
  color: "#334155", marginBottom: 6,
};
const inputStyle: CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1.5px solid #E2E8F0", fontSize: 14,
  fontFamily: "Cairo, sans-serif", direction: "rtl",
  outline: "none", boxSizing: "border-box", color: "#0F172A",
};

const radioGroupStyle: CSSProperties = { display: "flex", gap: 12 };
const radioBtn: CSSProperties = {
  flex: 1, padding: "12px 8px", borderRadius: 10,
  border: "1.5px solid #E2E8F0", backgroundColor: "#F8FAFC",
  cursor: "pointer", display: "flex", flexDirection: "column",
  alignItems: "center", gap: 2, fontFamily: "Cairo, sans-serif",
  color: "#0F172A", transition: "all 150ms",
};
const radioBtnActive: CSSProperties = {
  border: `1.5px solid ${ACCENT}`, backgroundColor: ACCENT_LIGHT, color: ACCENT,
};

const summaryStyle: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
};
const summaryItemStyle: CSSProperties = {
  backgroundColor: "#fff", borderRadius: 12,
  border: "1.5px solid #E2E8F0", padding: "14px 16px",
  display: "flex", flexDirection: "column", gap: 4,
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
};
const summaryLabelStyle: CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#64748B",
};
const summaryValueStyle: CSSProperties = {
  fontSize: 22, fontWeight: 900, color: ACCENT,
};

const downloadBtnStyle: CSSProperties = {
  width: "100%", padding: "15px", borderRadius: 12,
  border: "none", color: "#fff",
  fontSize: 16, fontWeight: 800,
  fontFamily: "Cairo, sans-serif",
  transition: "background-color 150ms",
  boxShadow: "0 4px 14px rgba(8,145,178,0.25)",
};
