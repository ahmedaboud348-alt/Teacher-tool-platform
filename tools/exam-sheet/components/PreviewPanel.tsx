import type { CSSProperties } from "react";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";
import { ds } from "../ui/design-system";
import { getUILabels, getTrackLabelI18n, formatTermI18n, formatDurationI18n } from "../i18n";

type Props = {
  documentModel: ExamSheetDocumentModel | null;
};

export function PreviewPanel({ documentModel }: Props) {
  if (!documentModel) {
    return (
      <aside dir="rtl" style={previewShellStyle}>
        <div style={documentSheetStyle}>
          <div style={documentHeaderStyle}>
            <div>
              <div style={documentEyebrowStyle}>معاينة الوثيقة</div>
              <h3 style={documentTitleStyle}>جذاذة الفرض المحروس</h3>
            </div>
          </div>
          <div style={emptyStateStyle}>
            تعذر بناء المعاينة من المعطيات الحالية.
          </div>
        </div>
      </aside>
    );
  }

  const track = documentModel.meta.track;
  const isRtl = track === "general";
  const L = getUILabels(track);

  return (
    <aside
      dir={isRtl ? "rtl" : "ltr"}
      style={{ ...previewShellStyle, textAlign: isRtl ? "right" : "left" }}
    >
      <article style={documentSheetStyle}>
        <header style={documentHeaderStyle}>
          <div>
            <div style={documentEyebrowStyle}>{L.previewEyebrow}</div>
            <h3 style={documentTitleStyle}>
              {documentModel.meta.title || L.previewDefault}
            </h3>
          </div>

          <div style={documentMetaBadgeStyle}>
            <span>{L.previewTrackLabel}</span>
            <strong>{getTrackLabelI18n(track)}</strong>
          </div>
        </header>

        {documentModel.sections.includes("metadata") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.metaSection} />

            <div style={metadataGridStyle}>
              <MetadataItem label={L.metaInstitution} value={documentModel.meta.institutionName} />
              <MetadataItem label={L.metaTeacher} value={documentModel.meta.teacherName} />
              <MetadataItem label={L.metaSubject} value={documentModel.meta.subjectLabel} />
              <MetadataItem label={L.metaLevel} value={documentModel.meta.levelLabel} />
              <MetadataItem label={L.metaTerm} value={formatTermI18n(documentModel.meta.term, track)} />
              <MetadataItem
                label={L.metaDuration}
                value={formatDurationI18n(documentModel.meta.examDurationHours, track)}
              />
              <MetadataItem
                label={L.metaTotal}
                value={formatNumber(documentModel.meta.totalPoints)}
              />
            </div>
          </section>
        )}

        {documentModel.sections.includes("lessons") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.previewLessons} />

            <div style={lessonsListStyle}>
              {documentModel.lessons.map((lesson, index) => (
                <div key={lesson.id} style={lessonCardStyle}>
                  <div style={lessonHeaderStyle}>
                    <div style={lessonTitleWrapStyle}>
                      <div style={lessonIndexStyle}>{index + 1}</div>
                      <div>
                        <div style={lessonTitleStyle}>{lesson.label}</div>
                        <div style={lessonMetaStyle}>
                          {L.lessonDurationPrefix} {formatDurationI18n(lesson.hours, track)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={objectivesBlockStyle}>
                    <div style={objectivesTitleStyle}>{L.objectivesTitlePrev}</div>

                    {lesson.objectives.length > 0 ? (
                      <ul style={objectivesListStyle}>
                        {lesson.objectives.map((objective) => (
                          <li key={objective.id} style={objectiveItemStyle}>
                            <span style={objectiveBulletStyle}>•</span>
                            <span style={objectiveTextStyle}>
                              {objective.text || "—"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={objectivesEmptyStyle}>{L.objectivesEmptyPrev}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {documentModel.sections.includes("allocation-table") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.tableSection} />

            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...headerCellStyle, ...lessonColumnStyle }}>{L.thLesson}</th>
                    <th style={headerCellStyle}>{L.thPercent}</th>
                    <th style={headerCellStyle}>{L.thNote}</th>

                    {documentModel.allocation.table.columns.map((column) => (
                      <th key={column.skillId} style={headerCellStyle}>
                        <div style={skillHeaderLabelStyle}>{column.skillLabel}</div>
                        <div style={skillHeaderPercentageStyle}>
                          {formatNumber(column.percentage)}%
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {documentModel.allocation.table.rows.map((row) => (
                    <tr key={row.lessonId}>
                      <td style={{ ...bodyCellStyle, ...lessonNameCellStyle }}>
                        {row.lessonLabel}
                      </td>

                      <td style={numericBodyCellStyle}>
                        {formatNumber(row.lessonPercentage)}%
                      </td>

                      <td style={numericBodyCellStyle}>
                        <CellValueWithAdjustment
                          value={row.lessonPoints}
                          adjustment={row.lessonAdjustment}
                        />
                      </td>

                      {row.skillCells.map((cell) => (
                        <td
                          key={`${row.lessonId}-${cell.skillId}`}
                          style={numericBodyCellStyle}
                        >
                          <CellValueWithAdjustment
                            value={cell.value}
                            adjustment={cell.adjustment}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td style={{ ...footerCellStyle, ...lessonNameCellStyle }}>{L.tfTotal}</td>
                    <td style={footerCellStyle}>100%</td>
                    <td style={footerCellStyle}>
                      {formatNumber(documentModel.allocation.table.footer.grandTotal)}
                    </td>

                    {documentModel.allocation.table.footer.skillTotals.map((value, index) => (
                      <td key={`footer-skill-${index}`} style={footerCellStyle}>
                        {formatNumber(value)}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}

        {documentModel.sections.includes("skills-summary") && (
          <section style={sectionStyle}>
            <SectionTitle title={L.skillsPreviewSection} />

            <div style={skillTotalsListStyle}>
              {documentModel.allocation.skillTotals.map((skillTotal) => (
                <div key={skillTotal.skillId} style={skillTotalCardStyle}>
                  <div style={skillTotalTextWrapStyle}>
                    <div style={skillTotalLabelStyle}>{skillTotal.skillLabel}</div>
                    <div style={skillTotalPercentageStyle}>
                      {formatNumber(skillTotal.percentage)}%
                    </div>
                  </div>

                  <div style={skillTotalValueStyle}>
                    {formatNumber(skillTotal.value)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </aside>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={sectionHeaderWrapStyle}>
      <h4 style={sectionTitleStyle}>{title}</h4>
    </div>
  );
}

function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <div style={metadataItemStyle}>
      <div style={metadataLabelStyle}>{label}</div>
      <div style={metadataValueStyle}>{displayValue}</div>
    </div>
  );
}

function CellValueWithAdjustment({
  value,
  adjustment,
}: {
  value: number;
  adjustment: number;
}) {
  return (
    <div style={cellStackStyle}>
      <div style={cellMainValueStyle}>{formatNumber(value)}</div>
      <AdjustmentText value={adjustment} />
    </div>
  );
}

function AdjustmentText({ value }: { value: number }) {
  if (value === 0) {
    return null;
  }

  return (
    <div
      style={{
        ...adjustmentTextStyle,
        color: value > 0 ? ds.colors.success : ds.colors.danger,
      }}
    >
      {formatAdjustment(value)}
    </div>
  );
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const rounded = Math.round(value * 100) / 100;
  const fixed = rounded.toFixed(2);

  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function formatAdjustment(value: number): string {
  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatNumber(Math.abs(value))}`;
}


const previewShellStyle: CSSProperties = {
  alignSelf: "start",
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const documentSheetStyle: CSSProperties = {
  width: "100%",
  maxWidth: 780,
  backgroundColor: "#ffffff",
  border: `1px solid ${ds.colors.borderSoft}`,
  borderRadius: ds.radius.xl,
  padding: ds.spacing[6],
  boxShadow: ds.shadow.md,
  boxSizing: "border-box",
};

const documentHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[4],
  paddingBottom: ds.spacing[4],
  marginBottom: ds.spacing[5],
  borderBottom: `2px solid ${ds.colors.borderSoft}`,
};

const documentEyebrowStyle: CSSProperties = {
  ...ds.typography.meta,
  color: ds.colors.textMuted,
  marginBottom: ds.spacing[1],
};

const documentTitleStyle: CSSProperties = {
  fontSize: 32,
  lineHeight: 1.25,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  margin: 0,
};

const documentMetaBadgeStyle: CSSProperties = {
  minWidth: 110,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "9px 11px",
  borderRadius: ds.radius.md,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderSoft}`,
  ...ds.typography.meta,
  color: ds.colors.textSecondary,
};

const sectionStyle: CSSProperties = {
  marginBottom: ds.spacing[5],
};

const sectionHeaderWrapStyle: CSSProperties = {
  marginBottom: ds.spacing[3],
  paddingBottom: ds.spacing[2],
  borderBottom: `1px solid ${ds.colors.borderStrong}`,
};

const sectionTitleStyle: CSSProperties = {
  ...ds.typography.section,
  color: ds.colors.textPrimary,
  margin: 0,
};

const metadataGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(240px, 1fr))",
  gap: ds.spacing[2],
};

const metadataItemStyle: CSSProperties = {
  border: `1px solid ${ds.colors.borderMuted}`,
  borderRadius: ds.radius.md,
  padding: "10px 12px",
  backgroundColor: ds.colors.bgSubtle,
};

const metadataLabelStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textMuted,
  marginBottom: 2,
};

const metadataValueStyle: CSSProperties = {
  ...ds.typography.body,
  fontWeight: 600,
  color: ds.colors.textPrimary,
  lineHeight: 1.55,
  wordBreak: "break-word",
};

const lessonsListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: ds.spacing[2],
};

const lessonCardStyle: CSSProperties = {
  padding: ds.spacing[2],
  borderRadius: ds.radius.lg,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderMuted}`,
};

const lessonHeaderStyle: CSSProperties = {
  marginBottom: ds.spacing[2],
};

const lessonTitleWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: ds.spacing[2],
};

const lessonIndexStyle: CSSProperties = {
  minWidth: 26,
  height: 26,
  borderRadius: ds.radius.pill,
  backgroundColor: ds.colors.bgMuted,
  color: ds.colors.textSecondary,
  border: `1px solid ${ds.colors.borderStrong}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 800,
};

const lessonTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  lineHeight: 1.55,
};

const lessonMetaStyle: CSSProperties = {
  marginTop: 2,
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const objectivesBlockStyle: CSSProperties = {
  borderTop: `1px solid ${ds.colors.borderMuted}`,
  paddingTop: ds.spacing[2],
};

const objectivesTitleStyle: CSSProperties = {
  ...ds.typography.label,
  color: ds.colors.textSecondary,
  marginBottom: ds.spacing[1],
};

const objectivesListStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const objectiveItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: ds.spacing[2],
  ...ds.typography.body,
  color: ds.colors.textSecondary,
  lineHeight: 1.6,
};

const objectiveBulletStyle: CSSProperties = {
  color: ds.colors.textMuted,
  fontWeight: 800,
  lineHeight: 1.6,
};

const objectiveTextStyle: CSSProperties = {
  flex: 1,
};

const objectivesEmptyStyle: CSSProperties = {
  ...ds.typography.body,
  color: ds.colors.textMuted,
  backgroundColor: ds.colors.bgMuted,
  borderRadius: ds.radius.md,
  padding: "10px 12px",
};

const tableWrapperStyle: CSSProperties = {
  overflowX: "auto",
  border: `1px solid ${ds.colors.borderStrong}`,
  borderRadius: ds.radius.lg,
  backgroundColor: "#ffffff",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: 13,
};

const headerCellStyle: CSSProperties = {
  padding: "12px 10px",
  borderBottom: `2px solid ${ds.colors.borderStrong}`,
  borderInlineStart: `1px solid ${ds.colors.borderSoft}`,
  backgroundColor: ds.colors.bgMuted,
  color: ds.colors.textSecondary,
  fontWeight: 800,
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const bodyCellStyle: CSSProperties = {
  padding: "10px 10px",
  borderBottom: `1px solid ${ds.colors.borderMuted}`,
  borderInlineStart: `1px solid ${ds.colors.borderMuted}`,
  textAlign: "center",
  verticalAlign: "top",
  color: ds.colors.textPrimary,
  backgroundColor: "#ffffff",
};

const numericBodyCellStyle: CSSProperties = {
  ...bodyCellStyle,
  fontVariantNumeric: "tabular-nums",
};

const footerCellStyle: CSSProperties = {
  padding: "11px 10px",
  borderTop: `2px solid ${ds.colors.borderStrong}`,
  borderInlineStart: `1px solid ${ds.colors.borderSoft}`,
  backgroundColor: ds.colors.bgMuted,
  color: ds.colors.textPrimary,
  fontWeight: 800,
  textAlign: "center",
  verticalAlign: "middle",
  fontVariantNumeric: "tabular-nums",
};

const lessonColumnStyle: CSSProperties = {
  minWidth: 260,
  borderInlineStart: "none",
};

const lessonNameCellStyle: CSSProperties = {
  textAlign: "right",
  minWidth: 260,
  fontWeight: 700,
  lineHeight: 1.55,
  borderInlineStart: "none",
};

const skillHeaderLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.35,
};

const skillHeaderPercentageStyle: CSSProperties = {
  ...ds.typography.small,
  color: ds.colors.textMuted,
  marginTop: 3,
};

const cellStackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
};

const cellMainValueStyle: CSSProperties = {
  fontWeight: 600,
  color: ds.colors.textPrimary,
  fontVariantNumeric: "tabular-nums",
};

const adjustmentTextStyle: CSSProperties = {
  ...ds.typography.small,
  fontVariantNumeric: "tabular-nums",
};

const skillTotalsListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: ds.spacing[2],
};

const skillTotalCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: ds.spacing[2],
  padding: "10px 12px",
  borderRadius: ds.radius.md,
  backgroundColor: ds.colors.bgSubtle,
  border: `1px solid ${ds.colors.borderMuted}`,
  minHeight: 60,
};

const skillTotalTextWrapStyle: CSSProperties = {
  minWidth: 0,
};

const skillTotalLabelStyle: CSSProperties = {
  ...ds.typography.body,
  fontWeight: 700,
  color: ds.colors.textPrimary,
  lineHeight: 1.35,
};

const skillTotalPercentageStyle: CSSProperties = {
  marginTop: 2,
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};

const skillTotalValueStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: ds.colors.textPrimary,
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};

const emptyStateStyle: CSSProperties = {
  borderRadius: ds.radius.md,
  padding: ds.spacing[4],
  backgroundColor: ds.colors.bgSubtle,
  color: ds.colors.textMuted,
  ...ds.typography.body,
};