import React from "react";
import { Document, Page, Text, View, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { ExamData, ExamStats } from "../types";
import { computeExamStats } from "../stats";

Font.register({
  family: "Cairo",
  fonts: [
    { src: "/fonts/Cairo-Regular.ttf",   fontWeight: 400 },
    { src: "/fonts/Cairo-Bold.ttf",      fontWeight: 700 },
    { src: "/fonts/Cairo-ExtraBold.ttf", fontWeight: 900 },
  ],
});

// Print-optimised palette — all colors dark enough to survive low-quality printers
const C = {
  navy:      "#1A3055",
  navyDark:  "#0F1E35",
  gold:      "#B8860B",   // darker gold
  accent:    "#0369A1",   // darker sky-blue
  green:     "#047857",   // darker emerald
  red:       "#B91C1C",   // darker red
  purple:    "#6D28D9",   // darker purple
  orange:    "#B45309",   // darker amber
  text:      "#0D1117",
  textMid:   "#1E293B",
  muted:     "#374151",
  border:    "#6B7280",   // visible border on white paper
  borderLt:  "#94A3B8",
  rowEven:   "#E8EEF4",   // clearly visible against white
  white:     "#FFFFFF",
  band0:     "#C41A1A",   // darker red band
  band1:     "#C2570A",   // darker orange band
  band2:     "#1D6FBF",   // darker blue band
  band3:     "#065F46",   // darker green band
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Cairo",
    fontSize: 10,
    color: C.text,
    paddingTop: 18,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    direction: "rtl",
  },

  // ── Header banner ──
  headerBanner: {
    backgroundColor: C.navyDark,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 18,
    paddingRight: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.navy,
  },
  headerTitle: {
    fontFamily: "Cairo", fontSize: 17, fontWeight: 900,
    color: C.white, textAlign: "center", marginBottom: 7,
  },
  headerGoldLine: {
    height: 2.5, backgroundColor: C.gold,
    marginLeft: 30, marginRight: 30, marginBottom: 8,
  },
  headerMetaRow: {
    flexDirection: "row", justifyContent: "center", flexWrap: "wrap",
  },
  headerMeta: {
    fontFamily: "Cairo", fontSize: 8.5, fontWeight: 900,
    color: "#BAE6FD", textAlign: "center",
  },
  headerMetaSep: {
    fontFamily: "Cairo", fontSize: 8.5, color: "#7ABFDC",
    marginLeft: 6, marginRight: 6,
  },

  // ── Exam section title ──
  examTitle: {
    fontFamily: "Cairo", fontSize: 15, fontWeight: 900,
    color: C.navy, textAlign: "center", marginBottom: 6,
  },
  examLine: {
    height: 4, backgroundColor: C.accent,
    marginBottom: 12,
  },

  // ── KPI cards ──
  kpiRow: { flexDirection: "row", marginBottom: 8 },
  kpiCard: {
    flex: 1,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: "center",
  },
  kpiLabel: {
    fontFamily: "Cairo", fontSize: 8.5, fontWeight: 900,
    color: C.muted, textAlign: "center", marginBottom: 3,
  },
  kpiVal: {
    fontFamily: "Cairo", fontSize: 20, fontWeight: 900,
    textAlign: "center",
  },
  kpiUnit: {
    fontFamily: "Cairo", fontSize: 8, fontWeight: 900,
    color: C.muted, textAlign: "center",
  },

  // ── Pass rate box ──
  passBox: {
    backgroundColor: C.navyDark,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.accent,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  passNum: {
    fontFamily: "Cairo", fontSize: 28, fontWeight: 900, color: "#7DD3FC",
  },
  passSlash: {
    fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: "#94A3B8",
    marginLeft: 5,
  },
  passLabel: {
    flex: 1,
    fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: "#CBD5E1",
    textAlign: "center",
  },
  passPct: {
    fontFamily: "Cairo", fontSize: 28, fontWeight: 900, color: "#6EE7B7",
  },

  // ── Distribution title ──
  distTitle: {
    fontFamily: "Cairo", fontSize: 11, fontWeight: 900,
    color: C.navy, marginBottom: 8,
    borderBottomWidth: 1.5, borderBottomColor: C.accent, paddingBottom: 3,
  },

  // ── Table ──
  distRow: { flexDirection: "row-reverse" },
  distTh: {
    fontFamily: "Cairo", fontSize: 9.5, fontWeight: 900,
    color: C.white, backgroundColor: C.navy,
    textAlign: "center",
    paddingTop: 6, paddingBottom: 6,
    borderWidth: 1, borderColor: C.navyDark,
  },
  distTd: {
    fontFamily: "Cairo", fontSize: 10, fontWeight: 900,
    textAlign: "center",
    paddingTop: 6, paddingBottom: 6,
    borderWidth: 1, borderColor: C.border,
    color: C.textMid,
  },

  // ── Bar chart ──
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  barLabel: {
    fontFamily: "Cairo", fontSize: 8.5, fontWeight: 900, color: C.textMid,
    width: 60, textAlign: "left",
  },
  barTrack: {
    flex: 1, height: 18,
    backgroundColor: "#E5E7EB",
    borderWidth: 1, borderColor: C.borderLt,
    borderRadius: 3, overflow: "hidden",
  },
  barCount: {
    fontFamily: "Cairo", fontSize: 11, fontWeight: 900,
    color: C.text, width: 24, textAlign: "right",
  },

  // ── Footer ──
  footer: {
    position: "absolute", bottom: 10, left: 20, right: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderTopWidth: 1.5, borderTopColor: C.border, paddingTop: 5,
  },
  footerText: {
    fontFamily: "Cairo", fontSize: 7.5, fontWeight: 900, color: C.muted,
  },
});

// Print-safe band colors (darker = better on paper)
const BAND_COLORS = [C.band0, C.band1, C.band2, C.band3];
const KPI_COLORS  = [C.accent, C.purple, "#0369A1", C.green, C.red, C.orange];

function fmt(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "") || "0";
}

function KpiCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  return (
    <View style={[s.kpiCard, { borderTopWidth: 4, borderTopColor: color }]}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={[s.kpiVal, { color }]}>{value}</Text>
      {unit && <Text style={s.kpiUnit}>{unit}</Text>}
    </View>
  );
}

function KpiSpacer() {
  return <View style={{ width: 6 }} />;
}

function ExamSection({ stats, maxBarCount }: { stats: ExamStats; maxBarCount: number }) {
  // A4 usable width: 595 - 40 padding = 555pt
  const colW = { label: 180, range: 120, count: 80, pct: 175 };

  return (
    <View>
      <Text style={s.examTitle}>{stats.examLabel}</Text>
      <View style={s.examLine} />

      {/* KPI row 1 */}
      <View style={s.kpiRow}>
        <KpiCard label="المعدل العام"      value={fmt(stats.avg)}    unit="/20" color={KPI_COLORS[0]} />
        <KpiSpacer />
        <KpiCard label="الوسيط"            value={fmt(stats.median)} unit="/20" color={KPI_COLORS[1]} />
        <KpiSpacer />
        <KpiCard label="الانحراف المعياري" value={fmt(stats.stdDev)} unit=""    color={KPI_COLORS[2]} />
      </View>

      {/* KPI row 2 */}
      <View style={[s.kpiRow, { marginBottom: 14 }]}>
        <KpiCard label="افضل نقطة"    value={fmt(stats.max)}            unit="/20"                       color={KPI_COLORS[3]} />
        <KpiSpacer />
        <KpiCard label="اضعف نقطة"    value={fmt(stats.min)}            unit="/20"                       color={KPI_COLORS[4]} />
        <KpiSpacer />
        <KpiCard label="عدد الغائبين" value={String(stats.absentCount)} unit={`/ ${stats.total} تلميذ`} color={KPI_COLORS[5]} />
      </View>

      {/* Pass rate */}
      <View style={s.passBox}>
        <Text style={s.passNum}>{stats.passingCount}</Text>
        <Text style={s.passSlash}>/ {stats.presentCount} تلميذ</Text>
        <Text style={s.passLabel}>حصلوا بالمعدل فما فوق</Text>
        <Text style={s.passPct}>{stats.passRate.toFixed(1)}%</Text>
      </View>

      {/* Distribution title */}
      <Text style={s.distTitle}>{"توزيع النقط - الشرائح"}</Text>

      {/* Table — full width, RTL */}
      <View style={{ marginBottom: 16, width: 555 }}>
        <View style={s.distRow}>
          <Text style={[s.distTh, { width: colW.label }]}>الشريحة</Text>
          <Text style={[s.distTh, { width: colW.range }]}>النطاق</Text>
          <Text style={[s.distTh, { width: colW.count }]}>العدد</Text>
          <Text style={[s.distTh, { width: colW.pct }]}>النسبة</Text>
        </View>
        {stats.bands.map((b, i) => (
          <View key={i} style={[s.distRow, { backgroundColor: i % 2 === 0 ? C.rowEven : C.white }]}>
            <Text style={[s.distTd, { width: colW.label, color: BAND_COLORS[i], fontWeight: 900 }]}>{b.label}</Text>
            <Text style={[s.distTd, { width: colW.range }]}>{b.range}</Text>
            <Text style={[s.distTd, { width: colW.count, color: C.accent, fontWeight: 900 }]}>{b.count}</Text>
            <Text style={[s.distTd, { width: colW.pct }]}>
              {stats.presentCount > 0 ? ((b.count / stats.presentCount) * 100).toFixed(1) : "0.0"}%
            </Text>
          </View>
        ))}
      </View>

      {/* Bar chart */}
      <View>
        {stats.bands.map((b, i) => {
          const pct = maxBarCount > 0 ? (b.count / maxBarCount) * 100 : 0;
          return (
            <View key={i} style={s.barRow}>
              <Text style={s.barLabel}>{b.range}</Text>
              <View style={s.barTrack}>
                <View style={{ width: `${pct}%`, height: 18, backgroundColor: BAND_COLORS[i] }} />
              </View>
              <Text style={s.barCount}>{b.count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StatsDocument({ data, examIndices }: { data: ExamData; examIndices: (0 | 1 | 2)[] }) {
  const statsList = examIndices.map(i => computeExamStats(data.students, i));
  const { meta } = data;

  return (
    <Document>
      {statsList.map((stats, pi) => {
        const maxBandCount = Math.max(...stats.bands.map(b => b.count), 1);
        return (
          <Page key={pi} size="A4" orientation="portrait" style={s.page}>
            <View style={s.headerBanner}>
              <Text style={s.headerTitle}>{"احصائيات الامتحان — " + stats.examLabel}</Text>
              <View style={s.headerGoldLine} />
              <View style={s.headerMetaRow}>
                <Text style={s.headerMeta}>{meta.teacher}</Text>
                <Text style={s.headerMetaSep}>·</Text>
                <Text style={s.headerMeta}>{meta.school}</Text>
                <Text style={s.headerMetaSep}>·</Text>
                <Text style={s.headerMeta}>{meta.level}</Text>
                <Text style={s.headerMetaSep}>·</Text>
                <Text style={s.headerMeta}>{meta.className}</Text>
                <Text style={s.headerMetaSep}>·</Text>
                <Text style={s.headerMeta}>{meta.subject}</Text>
                {meta.term ? <><Text style={s.headerMetaSep}>·</Text><Text style={s.headerMeta}>{meta.term}</Text></> : null}
                <Text style={s.headerMetaSep}>·</Text>
                <Text style={s.headerMeta}>{meta.year}</Text>
              </View>
            </View>

            <ExamSection stats={stats} maxBarCount={maxBandCount} />

            <View style={s.footer} fixed>
              <Text style={s.footerText}>{"منصة الادوات التربوية"}</Text>
              <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export async function downloadExamStatsPdf(data: ExamData, examIndices: (0 | 1 | 2)[]) {
  const blob = await pdf(<StatsDocument data={data} examIndices={examIndices} />).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `احصائيات_${data.meta.className}_${data.meta.year}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
