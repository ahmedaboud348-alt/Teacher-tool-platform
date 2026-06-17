import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { createElement } from "react";
import { ExamSheetDocumentModel } from "../../../../tools/exam-sheet/types/exam-sheet-document";

function ar(text: string | undefined | null): string {
  return text || "—";
}

// ─── Font Registration ────────────────────────────────────────────────────────

Font.register({
  family: "Cairo",
  fonts: [
    { src: "/fonts/Cairo-Variable.ttf", fontWeight: 400 },
    { src: "/fonts/Cairo-Variable.ttf", fontWeight: 700 },
    { src: "/fonts/Cairo-Variable.ttf", fontWeight: 800 },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  primary500: "#0F766E",
  primary600: "#0C625C",
  primary700: "#0A524D",
  primary50:  "#F0FDF9",
  primary100: "#CCFBF1",
  primary200: "#99F6E4",

  bgWhite:  "#FFFFFF",
  bgSubtle: "#F8FDFB",
  bgMuted:  "#F0FAF7",

  borderLight:  "#D1FAE5",
  borderMedium: "#A7F3D0",

  textPrimary:   "#0F172A",
  textSecondary: "#334155",
  textMuted:     "#64748B",
  textWhite:     "#FFFFFF",

  success: "#15803D",
  danger:  "#B91C1C",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({

  page: {
    fontFamily: "Cairo",
    backgroundColor: C.bgWhite,
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 0,
    direction: "rtl",
  },

  pageHeaderBand: {
    backgroundColor: C.primary600,
    paddingVertical: 20,
    paddingHorizontal: 36,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },

  pageHeaderLeft: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  pageHeaderEyebrow: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94A3B8",
    marginBottom: 4,
  },

  pageHeaderTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: C.textWhite,
    textAlign: "right",
    lineHeight: 1.25,
    maxWidth: 340,
  },

  pageHeaderBadge: {
    backgroundColor: C.primary500,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  pageHeaderBadgeLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#93C5FD",
    marginBottom: 2,
    textAlign: "center",
  },

  pageHeaderBadgeValue: {
    fontSize: 13,
    fontWeight: 800,
    color: C.textWhite,
    textAlign: "center",
  },

  accentStripe: {
    height: 4,
    backgroundColor: C.primary500,
    marginBottom: 24,
  },

  body: {
    paddingHorizontal: 36,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 7,
    borderBottom: `1.5pt solid ${C.primary200}`,
  },

  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary500,
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: C.primary600,
    textAlign: "right",
  },

  metaGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },

  metaItem: {
    width: "48.5%",
    backgroundColor: C.bgSubtle,
    border: `1pt solid ${C.borderLight}`,
    borderRadius: 7,
    padding: "7pt 10pt",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },

  metaLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: C.textMuted,
    textAlign: "right",
  },

  metaValue: {
    fontSize: 12,
    fontWeight: 700,
    color: C.textPrimary,
    textAlign: "right",
  },

  lessonsList: {
    flexDirection: "column",
    gap: 7,
  },

  lessonCard: {
    border: `1pt solid ${C.borderLight}`,
    borderRadius: 8,
    overflow: "hidden",
  },

  lessonCardTop: {
    flexDirection: "row-reverse",
    alignItems: "stretch",
  },

  lessonNumberStrip: {
    width: 28,
    backgroundColor: C.primary100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  lessonNumber: {
    fontSize: 12,
    fontWeight: 800,
    color: C.primary600,
  },

  lessonInfo: {
    flex: 1,
    padding: "8pt 10pt",
    backgroundColor: C.bgWhite,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  lessonTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: C.textPrimary,
    textAlign: "right",
    lineHeight: 1.4,
  },

  lessonDuration: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textMuted,
    textAlign: "right",
    marginTop: 2,
  },

  objectivesArea: {
    backgroundColor: C.bgSubtle,
    borderTop: `1pt solid ${C.borderLight}`,
    padding: "7pt 10pt",
  },

  objectivesTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: C.textMuted,
    textAlign: "right",
    marginBottom: 5,
  },

  objectiveRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 3,
  },

  objectiveBullet: {
    fontSize: 11,
    fontWeight: 800,
    color: C.primary500,
    marginTop: 1,
    minWidth: 8,
  },

  objectiveText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 400,
    color: C.textSecondary,
    textAlign: "right",
    lineHeight: 1.6,
  },

  objectivesEmpty: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "right",
  },

  tableOuter: {
    border: `1pt solid ${C.borderMedium}`,
    borderRadius: 8,
    overflow: "hidden",
  },

  tableHeadRow: {
    flexDirection: "row-reverse",
    backgroundColor: C.primary600,
  },

  thLesson: {
    flex: 3,
    padding: "8pt 10pt",
    alignItems: "flex-end",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.primary500}`,
  },

  th: {
    flex: 1,
    padding: "7pt 4pt",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.primary500}`,
  },

  thText: {
    fontSize: 11,
    fontWeight: 800,
    color: C.textWhite,
    textAlign: "center",
    lineHeight: 1.3,
  },

  thSubText: {
    fontSize: 10,
    fontWeight: 600,
    color: "#93C5FD",
    textAlign: "center",
    marginTop: 2,
  },

  tdRowEven: {
    flexDirection: "row-reverse",
    backgroundColor: C.bgWhite,
    borderBottom: `1pt solid ${C.borderLight}`,
  },

  tdRowOdd: {
    flexDirection: "row-reverse",
    backgroundColor: C.bgSubtle,
    borderBottom: `1pt solid ${C.borderLight}`,
  },

  tdLesson: {
    flex: 3,
    padding: "8pt 10pt",
    alignItems: "flex-end",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.borderLight}`,
  },

  td: {
    flex: 1,
    padding: "7pt 4pt",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.borderLight}`,
  },

  tdLessonText: {
    fontSize: 11,
    fontWeight: 700,
    color: C.textPrimary,
    textAlign: "right",
    lineHeight: 1.35,
  },

  tdText: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textPrimary,
    textAlign: "center",
  },

  tdAdj: {
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    marginTop: 1,
  },

  tfRow: {
    flexDirection: "row-reverse",
    backgroundColor: C.primary600,
  },

  tfLesson: {
    flex: 3,
    padding: "8pt 10pt",
    alignItems: "flex-end",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.primary500}`,
  },

  tf: {
    flex: 1,
    padding: "8pt 4pt",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `1pt solid ${C.primary500}`,
  },

  tfText: {
    fontSize: 12,
    fontWeight: 800,
    color: C.textWhite,
    textAlign: "center",
  },

  skillsRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },

  skillCard: {
    flex: 1,
    backgroundColor: C.bgSubtle,
    border: `1pt solid ${C.borderLight}`,
    borderRadius: 8,
    padding: "10pt 12pt",
    alignItems: "flex-end",
  },

  skillCardTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },

  skillCardLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: C.textSecondary,
    textAlign: "right",
  },

  skillCardPct: {
    fontSize: 10,
    fontWeight: 700,
    color: C.textMuted,
    backgroundColor: C.primary100,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },

  skillCardValue: {
    fontSize: 26,
    fontWeight: 800,
    color: C.primary500,
    textAlign: "right",
    lineHeight: 1,
  },

  skillCardUnit: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textMuted,
    textAlign: "right",
    marginTop: 2,
  },

  pageFooter: {
    position: "absolute",
    bottom: 14,
    left: 36,
    right: 36,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footerLeft: {
    fontSize: 10,
    fontWeight: 600,
    color: C.textMuted,
  },

  footerRight: {
    fontSize: 10,
    fontWeight: 800,
    color: C.primary500,
  },

  footerDivider: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderLight,
    marginHorizontal: 10,
  },

  pageTopStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: C.primary500,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function fmtAdj(value: number): string {
  return `${value > 0 ? "+" : "-"}${fmt(Math.abs(value))}`;
}

// ✅ الرقم أولاً ثم الوحدة — يعمل بشكل صحيح مع Cairo و RTL
function fmtDuration(hours: number): string {
  return `${fmt(hours)} س`;
}

function fmtTerm(term: "first" | "second"): string {
  return term === "second" ? "الدورة الثانية" : "الدورة الأولى";
}

function getLevelLabel(levelId: string): string {
  switch (levelId) {
    case "1ac": return "الأولى إعدادي";
    case "2ac": return "الثانية إعدادي";
    case "3ac": return "الثالثة إعدادي";
    default:    return levelId;
  }
}

function getTrackLabel(track: "general" | "international"): string {
  return track === "general" ? "العام" : "الدولي";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return createElement(
    View,
    { style: s.sectionHeader },
    createElement(View, { style: s.sectionDot }),
    createElement(Text, { style: s.sectionTitle }, ar(title))
  );
}

function MetadataSection({ doc }: { doc: ExamSheetDocumentModel }) {
  const { meta } = doc;
  const items = [
    { label: ar("المؤسسة"),      value: ar(meta.institutionName) },
    { label: ar("الأستاذ"),      value: ar(meta.teacherName) },
    { label: ar("المادة"),       value: ar(meta.subjectLabel) },
    { label: ar("المستوى"),      value: ar(meta.levelLabel || getLevelLabel("")) },
    { label: ar("الدورة"),       value: ar(fmtTerm(meta.term)) },
    { label: ar("مدة الفرض"),    value: fmtDuration(meta.examDurationHours) },
    { label: ar("نقطة الفرض"),   value: fmt(meta.totalPoints) },
  ];

  return createElement(
    View,
    { style: s.section },
    createElement(SectionHeader, { title: "المعطيات الأساسية" }),
    createElement(
      View,
      { style: s.metaGrid },
      ...items.map(({ label, value }) =>
        createElement(
          View,
          { key: label, style: s.metaItem },
          createElement(Text, { style: s.metaLabel }, label),
          createElement(Text, { style: s.metaValue }, value || "—")
        )
      )
    )
  );
}

function LessonsSection({ doc }: { doc: ExamSheetDocumentModel }) {
  const lessons = (doc.lessons || []).filter(Boolean);
  return createElement(
    View,
    { style: s.section },
    createElement(SectionHeader, { title: "الدروس المعتمدة" }),
    createElement(
      View,
      { style: s.lessonsList },
      ...lessons.map((lesson, index) =>
        createElement(
          View,
          { key: lesson.id, style: s.lessonCard, wrap: false },
          createElement(
            View,
            { style: s.lessonCardTop },
            createElement(
              View,
              { style: s.lessonNumberStrip },
              createElement(Text, { style: s.lessonNumber }, String(index + 1))
            ),
            createElement(
              View,
              { style: s.lessonInfo },
              createElement(Text, { style: s.lessonTitle }, ar(lesson.label || `درس ${index + 1}`)),
              createElement(Text, { style: s.lessonDuration }, ar(`المدة: ${fmtDuration(lesson.hours)}`))
            )
          ),
          createElement(
            View,
            { style: s.objectivesArea },
            createElement(Text, { style: s.objectivesTitle }, ar("الأهداف")),
            (lesson.objectives || []).filter(Boolean).length > 0
              ? createElement(
                  View,
                  null,
                  ...(lesson.objectives || []).filter(Boolean).map((obj) =>
                    createElement(
                      View,
                      { key: obj.id, style: s.objectiveRow, wrap: false },
                      createElement(Text, { style: s.objectiveBullet }, "•"),
                      createElement(Text, { style: s.objectiveText }, ar(obj.text || "—"))
                    )
                  )
                )
              : createElement(Text, { style: s.objectivesEmpty }, ar("لا توجد أهداف لهذا الدرس."))
          )
        )
      )
    )
  );
}

const SITUATION_LABELS = ["الوضعية المشكلة", "Situation-problème"];

function isSituationSkill(label: string): boolean {
  return SITUATION_LABELS.includes(label);
}

function AllocationTableSection({ doc }: { doc: ExamSheetDocumentModel }) {
  const { columns, rows, footer } = doc.allocation.table;
  const safeColumns = (columns || []).filter(Boolean);
  const safeRows    = (rows || []).filter(Boolean);
  const safeFooter  = footer || { skillTotals: [], grandTotal: 0 };

  return createElement(
    View,
    { style: s.section, wrap: false },
    createElement(SectionHeader, { title: "جدول التخصيص" }),
    createElement(
      View,
      { style: s.tableOuter },
      createElement(
        View,
        { style: s.tableHeadRow },
        createElement(View, { style: s.thLesson }, createElement(Text, { style: { ...s.thText, textAlign: "right" } }, ar("الدرس"))),
        createElement(View, { style: s.th }, createElement(Text, { style: s.thText }, ar("النسبة %"))),
        createElement(View, { style: s.th }, createElement(Text, { style: s.thText }, ar("النقطة"))),
        ...safeColumns.map((col) =>
          createElement(
            View,
            { key: col.skillId, style: s.th },
            createElement(Text, { style: s.thText }, ar(col.skillLabel)),
            createElement(Text, { style: s.thSubText }, `${fmt(col.percentage)}%`)
          )
        )
      ),
      ...safeRows.map((row, i) =>
        createElement(
          View,
          { key: row.lessonId, style: i % 2 === 0 ? s.tdRowEven : s.tdRowOdd, wrap: false },
          createElement(View, { style: s.tdLesson }, createElement(Text, { style: s.tdLessonText }, ar(row.lessonLabel))),
          createElement(View, { style: s.td }, createElement(Text, { style: s.tdText }, `${fmt(row.lessonPercentage)}%`)),
          createElement(
            View,
            { style: s.td },
            createElement(Text, { style: s.tdText }, fmt(row.lessonPoints)),
            row.lessonAdjustment !== 0
              ? createElement(Text, { style: { ...s.tdAdj, color: row.lessonAdjustment > 0 ? C.success : C.danger } }, fmtAdj(row.lessonAdjustment))
              : null
          ),
          ...(row.skillCells || []).filter(Boolean).map((cell, ci) => {
            const colLabel = safeColumns[ci]?.skillLabel ?? "";
            const isSituation = isSituationSkill(colLabel);
            return createElement(
              View,
              { key: `${row.lessonId}-${cell.skillId}`, style: s.td },
              createElement(Text, { style: s.tdText }, isSituation ? "—" : fmt(cell.value)),
              (!isSituation && cell.adjustment !== 0)
                ? createElement(Text, { style: { ...s.tdAdj, color: cell.adjustment > 0 ? C.success : C.danger } }, fmtAdj(cell.adjustment))
                : null
            );
          })
        )
      ),
      createElement(
        View,
        { style: s.tfRow, wrap: false },
        createElement(View, { style: s.tfLesson }, createElement(Text, { style: { ...s.tfText, textAlign: "right" } }, ar("المجموع"))),
        createElement(View, { style: s.tf }, createElement(Text, { style: s.tfText }, "100%")),
        createElement(View, { style: s.tf }, createElement(Text, { style: s.tfText }, fmt(safeFooter.grandTotal))),
        ...(safeFooter.skillTotals || []).map((val, i) =>
          createElement(View, { key: `fs-${i}`, style: s.tf }, createElement(Text, { style: s.tfText }, fmt(val)))
        )
      )
    )
  );
}

function SkillsSummarySection({ doc }: { doc: ExamSheetDocumentModel }) {
  const skillTotals = (doc.allocation.skillTotals || []).filter(Boolean);
  return createElement(
    View,
    { style: s.section, wrap: false },
    createElement(SectionHeader, { title: "مجاميع المهارات" }),
    createElement(
      View,
      { style: s.skillsRow },
      ...skillTotals.map((skill) =>
        createElement(
          View,
          { key: skill.skillId, style: s.skillCard, wrap: false },
          createElement(
            View,
            { style: s.skillCardTop },
            createElement(Text, { style: s.skillCardLabel }, ar(skill.skillLabel)),
            createElement(Text, { style: s.skillCardPct }, `${fmt(skill.percentage)}%`)
          ),
          createElement(Text, { style: s.skillCardValue }, fmt(skill.value)),
          createElement(Text, { style: s.skillCardUnit }, ar("نقطة"))
        )
      )
    )
  );
}

function ExamSheetPdfDocument({ doc }: { doc: ExamSheetDocumentModel }) {
  const isRtl      = doc.meta.track === "general";
  const direction  = isRtl ? "rtl" : "ltr";
  const levelLabel = doc.meta.levelLabel || getLevelLabel("");

  const sectionMap: Record<string, () => ReturnType<typeof createElement>> = {
    "metadata":         () => createElement(MetadataSection,        { doc }),
    "lessons":          () => createElement(LessonsSection,         { doc }),
    "allocation-table": () => createElement(AllocationTableSection, { doc }),
    "skills-summary":   () => createElement(SkillsSummarySection,   { doc }),
  };

  return createElement(
    Document,
    {
      title:    doc.meta.title || "جذاذة الفرض المحروس",
      author:   doc.meta.teacherName,
      subject:  doc.meta.subjectLabel,
      language: isRtl ? "ar" : "fr",
    },
    createElement(
      Page,
      { size: "A4", style: { ...s.page, direction } },

      createElement(View, { style: s.pageTopStripe, fixed: true }),

      createElement(
        View,
        { style: s.pageHeaderBand },
        createElement(
          View,
          { style: s.pageHeaderLeft },
          createElement(Text, { style: s.pageHeaderEyebrow }, ar("جذاذة الفرض المحروس")),
          createElement(Text, { style: s.pageHeaderTitle }, ar(doc.meta.title || "جذاذة الفرض المحروس"))
        ),
        createElement(
          View,
          { style: s.pageHeaderBadge },
          createElement(Text, { style: s.pageHeaderBadgeLabel }, ar("المسار / المستوى")),
          createElement(Text, { style: s.pageHeaderBadgeValue }, ar(`${getTrackLabel(doc.meta.track)} — ${levelLabel}`))
        )
      ),

      createElement(View, { style: s.accentStripe }),

      createElement(
        View,
        { style: s.body },
        ...doc.sections
          .filter((sec) => sectionMap[sec])
          .map((sec) => sectionMap[sec]())
      ),

      createElement(
        View,
        { style: s.pageFooter, fixed: true },
        createElement(Text, { style: s.footerLeft }, ar(`${doc.meta.institutionName || "—"} — ${doc.meta.subjectLabel}`)),
        createElement(View, { style: s.footerDivider }),
        createElement(
          Text,
          {
            style: s.footerRight,
            render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
              `${pageNumber} / ${totalPages}`,
          },
          ""
        )
      )
    )
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function renderExamSheetPdf(
  doc: ExamSheetDocumentModel
): Promise<Blob> {
  const element  = createElement(ExamSheetPdfDocument, { doc });
  const instance = pdf(element as any);
  return await instance.toBlob();
}