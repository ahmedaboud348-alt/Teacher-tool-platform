import type { CSSProperties } from "react";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";
import { getUILabels, getTrackLabelI18n, formatTermI18n, formatDurationI18n } from "../i18n";

const NAVY = "#1A3055";
const NAVY_DEEP = "#0F1E35";
const GOLD = "#C8960C";

type Props = {
  documentModel: ExamSheetDocumentModel | null;
};

export function PreviewPanel({ documentModel }: Props) {
  if (!documentModel) {
    return (
      <aside dir="rtl" style={shellStyle}>
        <div style={emptyStyle}>
          <span style={{ fontSize: 40, marginBottom: 12 }}>📄</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>معاينة الوثيقة</span>
          <span style={{ fontSize: 12, color: "#64748B" }}>أدخل المعطيات لرؤية المعاينة</span>
        </div>
      </aside>
    );
  }

  const track = documentModel.meta.track;
  const isRtl = track === "general";
  const L = getUILabels(track);

  return (
    <aside dir={isRtl ? "rtl" : "ltr"} style={{ ...shellStyle, textAlign: isRtl ? "right" : "left" }}>
      <article style={docStyle}>

        {/* ── Header ── */}
        <header style={headerStyle}>
          <div style={eyebrowStyle}>المملكة المغربية — وزارة التربية الوطنية</div>
          <h3 style={titleStyle}>{documentModel.meta.title || L.previewDefault}</h3>
          <div style={subtitleStyle}>
            {documentModel.meta.levelLabel || "—"} — {getTrackLabelI18n(track)} — {formatTermI18n(documentModel.meta.term, track)}
          </div>
          <div style={goldLineStyle} />
        </header>

        {/* ── Meta ── */}
        {documentModel.sections.includes("metadata") && (
          <section style={sectionStyle}>
            <table style={metaTableStyle}>
              <tbody>
                <tr>
                  <td style={mlStyle}>{L.metaInstitution}</td>
                  <td style={mvStyle}>{documentModel.meta.institutionName || "—"}</td>
                  <td style={mlStyle}>{L.metaSubject}</td>
                  <td style={mvStyle}>{documentModel.meta.subjectLabel || "—"}</td>
                </tr>
                <tr>
                  <td style={mlStyle}>{L.metaTeacher}</td>
                  <td style={mvStyle}>{documentModel.meta.teacherName || "—"}</td>
                  <td style={mlStyle}>{L.metaLevel}</td>
                  <td style={mvStyle}>{documentModel.meta.levelLabel || "—"}</td>
                </tr>
                <tr>
                  <td style={mlStyle}>{L.metaTerm}</td>
                  <td style={mvStyle}>{formatTermI18n(documentModel.meta.term, track)}</td>
                  <td style={mlStyle}>{L.metaDuration}</td>
                  <td style={mvStyle}>{formatDurationI18n(documentModel.meta.examDurationHours, track)}</td>
                </tr>
                <tr>
                  <td style={mlStyle}>المسار</td>
                  <td style={mvStyle}>{getTrackLabelI18n(track)}</td>
                  <td style={mlStyle}>{L.metaTotal}</td>
                  <td style={mvStyle}>{fmt(documentModel.meta.totalPoints)} نقطة</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* ── Lessons ── */}
        {documentModel.sections.includes("lessons") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.previewLessons} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {documentModel.lessons.map((lesson, i) => (
                <div key={lesson.id} style={lessonCardStyle}>
                  <div style={lessonHeaderStyle}>
                    <div style={lessonNumStyle}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={lessonNameStyle}>{lesson.label}</div>
                      <div style={lessonDurStyle}>{L.lessonDurationPrefix} {formatDurationI18n(lesson.hours, track)}</div>
                    </div>
                  </div>
                  {lesson.objectives.length > 0 && (
                    <div style={objAreaStyle}>
                      <ul style={objListStyle}>
                        {lesson.objectives.map(o => (
                          <li key={o.id} style={objItemStyle}>
                            <span style={objBulletStyle}>●</span>
                            <span>{o.text || "—"}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Allocation Table ── */}
        {documentModel.sections.includes("allocation-table") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.tableSection} />
            <div style={tableWrapStyle}>
              <table style={allocTableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, minWidth: 100, textAlign: isRtl ? "right" : "left" }}>{L.thLesson}</th>
                    <th style={thStyle}>{L.thPercent}</th>
                    <th style={thStyle}>{L.thNote}</th>
                    {documentModel.allocation.table.columns.map(col => (
                      <th key={col.skillId} style={thStyle}>
                        <div>{col.skillLabel}</div>
                        <div style={thPctStyle}>{fmt(col.percentage)}%</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentModel.allocation.table.rows.map((row, ri) => (
                    <tr key={row.lessonId} style={{ backgroundColor: ri % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                      <td style={{ ...tdStyle, fontWeight: 800, textAlign: isRtl ? "right" : "left", color: NAVY }}>{row.lessonLabel}</td>
                      <td style={tdCenterStyle}>{fmt(row.lessonPercentage)}%</td>
                      <td style={tdCenterStyle}>
                        <CellVal value={row.lessonPoints} adj={row.lessonAdjustment} />
                      </td>
                      {row.skillCells.map((cell, ci) => {
                        const isSit = ["الوضعية المشكلة", "Situation-problème"].includes(documentModel.allocation.table.columns[ci]?.skillLabel ?? "");
                        return (
                          <td key={`${row.lessonId}-${cell.skillId}`} style={tdCenterStyle}>
                            {isSit ? "—" : <CellVal value={cell.value} adj={cell.adjustment} />}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={tfStyle}>{L.tfTotal}</td>
                    <td style={tfStyle}>100%</td>
                    <td style={tfStyle}>{fmt(documentModel.allocation.table.footer.grandTotal)}</td>
                    {documentModel.allocation.table.footer.skillTotals.map((v, i) => (
                      <td key={i} style={tfStyle}>{fmt(v)}</td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}

        {/* ── Skills Summary ── */}
        {documentModel.sections.includes("skills-summary") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.skillsPreviewSection} />
            <div style={skillsRowStyle}>
              {documentModel.allocation.skillTotals.map(sk => (
                <div key={sk.skillId} style={skillCardStyle}>
                  <div style={skillNameStyle}>{sk.skillLabel}</div>
                  <div style={skillNumStyle}>{fmt(sk.value)}</div>
                  <div style={skillMetaStyle}>{fmt(sk.percentage)}%</div>
                </div>
              ))}
            </div>
          </section>
        )}

      </article>
    </aside>
  );
}

/* ── Helpers ── */

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={secHeadStyle}>
      <div style={secBarStyle} />
      <h4 style={secTitleStyle}>{title}</h4>
    </div>
  );
}

function CellVal({ value, adj }: { value: number; adj: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <span style={{ fontWeight: 700 }}>{fmt(value)}</span>
      {adj !== 0 && (
        <span style={{ fontSize: 10, fontWeight: 800, color: adj > 0 ? "#15803D" : "#B91C1C" }}>
          {adj > 0 ? "+" : ""}{fmt(adj)}
        </span>
      )}
    </div>
  );
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const r = Math.round(v * 100) / 100;
  return r.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

/* ── Styles ── */

const shellStyle: CSSProperties = { width: "100%" };

const emptyStyle: CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  padding: "60px 24px", backgroundColor: "#F8FAFC",
  border: "2px dashed #CBD5E1", borderRadius: 12, gap: 4,
};

const docStyle: CSSProperties = {
  width: "100%", maxWidth: 780, margin: "0 auto",
  backgroundColor: "#fff", borderWidth: 1, borderStyle: "solid", borderColor: "#D1D5DB",
  borderRadius: 4, padding: "28px 24px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};

// Header
const headerStyle: CSSProperties = {
  textAlign: "center", paddingBottom: 16, marginBottom: 18,
  borderBottomWidth: 3, borderBottomStyle: "double", borderBottomColor: NAVY,
};
const eyebrowStyle: CSSProperties = { fontSize: 10, fontWeight: 700, color: "#64748B", marginBottom: 6 };
const titleStyle: CSSProperties = { fontSize: 22, fontWeight: 900, color: NAVY, lineHeight: 1.3, margin: "0 0 4px" };
const subtitleStyle: CSSProperties = { fontSize: 11, fontWeight: 700, color: GOLD };
const goldLineStyle: CSSProperties = { width: 60, height: 3, background: GOLD, margin: "8px auto 0", borderRadius: 2 };

// Sections
const sectionStyle: CSSProperties = { marginBottom: 18 };
const secHeadStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  marginBottom: 8, paddingBottom: 4,
  borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: NAVY,
};
const secBarStyle: CSSProperties = { width: 4, height: 16, background: GOLD, borderRadius: 1, flexShrink: 0 };
const secTitleStyle: CSSProperties = { fontSize: 13, fontWeight: 900, color: NAVY, margin: 0 };

// Meta table
const metaTableStyle: CSSProperties = {
  width: "100%", borderCollapse: "collapse",
  borderWidth: 2, borderStyle: "solid", borderColor: NAVY, fontSize: 11,
};
const mlStyle: CSSProperties = {
  background: NAVY, color: "#fff", fontWeight: 800, fontSize: 11,
  padding: "6px 10px", textAlign: "center", whiteSpace: "nowrap",
  borderWidth: 1, borderStyle: "solid", borderColor: "#CBD5E1", width: "12%",
};
const mvStyle: CSSProperties = {
  fontWeight: 700, color: "#1E293B", fontSize: 12,
  padding: "6px 10px", background: "#fff",
  borderWidth: 1, borderStyle: "solid", borderColor: "#CBD5E1", width: "38%",
};

// Lessons
const lessonCardStyle: CSSProperties = {
  borderWidth: 2, borderStyle: "solid", borderColor: "#D1D5DB",
  overflow: "hidden",
};
const lessonHeaderStyle: CSSProperties = {
  display: "flex", alignItems: "stretch",
};
const lessonNumStyle: CSSProperties = {
  width: 32, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 14, fontWeight: 900, color: GOLD, flexShrink: 0,
};
const lessonNameStyle: CSSProperties = {
  fontSize: 12, fontWeight: 900, color: NAVY, padding: "6px 10px 0",
};
const lessonDurStyle: CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "#64748B", padding: "0 10px 6px",
};
const objAreaStyle: CSSProperties = {
  borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "#E2E8F0",
  padding: "6px 10px",
};
const objListStyle: CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const objItemStyle: CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: 6,
  fontSize: 11, fontWeight: 600, color: "#334155", lineHeight: 1.7,
};
const objBulletStyle: CSSProperties = { color: GOLD, fontSize: 8, marginTop: 5 };

// Allocation table
const tableWrapStyle: CSSProperties = {
  borderWidth: 2, borderStyle: "solid", borderColor: NAVY, overflow: "hidden",
};
const allocTableStyle: CSSProperties = {
  width: "100%", borderCollapse: "collapse", fontSize: 11,
};
const thStyle: CSSProperties = {
  background: NAVY, color: "#fff", fontWeight: 800, fontSize: 11,
  padding: "8px 6px", textAlign: "center",
  borderWidth: 1, borderStyle: "solid", borderColor: NAVY_DEEP,
};
const thPctStyle: CSSProperties = { fontSize: 9, fontWeight: 600, color: "#FEF3C7", marginTop: 2 };
const tdStyle: CSSProperties = {
  padding: "6px 6px", borderWidth: 1, borderStyle: "solid", borderColor: "#D1D5DB",
  fontSize: 12, fontWeight: 600,
};
const tdCenterStyle: CSSProperties = { ...tdStyle, textAlign: "center" };
const tfStyle: CSSProperties = {
  background: NAVY, color: "#fff", fontWeight: 900, fontSize: 12,
  padding: "8px 6px", textAlign: "center",
  borderWidth: 1, borderStyle: "solid", borderColor: NAVY_DEEP,
};

// Skills
const skillsRowStyle: CSSProperties = { display: "flex", gap: 8 };
const skillCardStyle: CSSProperties = {
  flex: 1, borderWidth: 2, borderStyle: "solid", borderColor: "#D1D5DB",
  borderTopWidth: 4, borderTopColor: GOLD,
  padding: "10px 12px", textAlign: "center", background: "#F8FAFC",
};
const skillNameStyle: CSSProperties = { fontSize: 11, fontWeight: 900, color: NAVY, marginBottom: 4 };
const skillNumStyle: CSSProperties = { fontSize: 22, fontWeight: 900, color: NAVY, lineHeight: 1 };
const skillMetaStyle: CSSProperties = { fontSize: 10, fontWeight: 700, color: "#64748B", marginTop: 3 };
