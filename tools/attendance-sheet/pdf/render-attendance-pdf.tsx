import React from "react";
import {
  Document, Page, Text, View, Font, StyleSheet, pdf,
} from "@react-pdf/renderer";
import type { MassarData } from "../../grading-sheet/types";
import type { AttendanceConfig } from "../types";

Font.register({
  family: "Cairo",
  fonts: [
    { src: "/fonts/Cairo-Regular.ttf",   fontWeight: 400 },
    { src: "/fonts/Cairo-Bold.ttf",      fontWeight: 700 },
    { src: "/fonts/Cairo-ExtraBold.ttf", fontWeight: 900 },
  ],
});

const C = {
  navy:     "#1A3055",
  navyLine: "#2E6DA4",
  gold:     "#C8960C",
  goldLight:"#F5E6C0",
  rowEven:  "#EEF3F8",
  border:   "#8FA8BB",
  borderIn: "#AABDCC",
  text:     "#0D1117",
  muted:    "#3D5A6E",
  white:    "#FFFFFF",
};

const WEEKS  = 18;
const PAD    = 12;
const PAGE_W = 842; // A4 landscape
const W_NUM  = 22;
const W_NAME = 150;
const W_TOT  = 35;
const W_SESS = PAGE_W - PAD * 2 - W_NUM - W_NAME - W_TOT;

const H_HDR   = 18;
const H_ROW   = 16;
const H_CLASS = 20;

const ROWS_P1 = 25; // first page of a class (has class header)
const ROWS_PN = 28; // continuation pages

const s = StyleSheet.create({
  page: {
    fontFamily: "Cairo", fontSize: 8, color: C.text,
    paddingTop: PAD, paddingBottom: PAD,
    paddingLeft: PAD, paddingRight: PAD,
  },

  // ── Cover banner ──
  cvBanner:      { backgroundColor: C.navy, paddingTop: 9, paddingBottom: 6, alignItems: "center", marginBottom: 0 },
  cvGoldLine:    { height: 2, backgroundColor: C.gold, marginBottom: 3, marginTop: 3, marginLeft: 60, marginRight: 60 },
  cvBannerFr:    { fontFamily: "Cairo", fontSize: 20, fontWeight: 900, color: C.white, textAlign: "center" },
  cvBannerAr:    { fontFamily: "Cairo", fontSize: 12, fontWeight: 700, color: C.goldLight, textAlign: "center" },
  cvSchoolBar:   { backgroundColor: "#243F63", paddingTop: 5, paddingBottom: 5, alignItems: "center", marginBottom: 0 },
  cvSchoolTxt:   { fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: C.white, textAlign: "center" },
  goldBar:       { height: 3, backgroundColor: C.gold, marginBottom: 7 },

  // ── Cover info cards ──
  cvInfoRow:   { flexDirection: "row", marginBottom: 7 },
  cvCard:      { flex: 1, border: `1 solid ${C.borderIn}`, borderRadius: 4, overflow: "hidden" },
  cvCardTop:   { height: 3, backgroundColor: C.gold },
  cvCardBody:  { paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, alignItems: "center" },
  cvCardLbl:   { fontFamily: "Cairo", fontSize: 7.5, fontWeight: 700, color: C.navyLine, textAlign: "center", marginBottom: 2 },
  cvCardVal:   { fontFamily: "Cairo", fontSize: 10, fontWeight: 900, color: C.navy, textAlign: "center" },

  // ── Cover classes table ──
  cvTblHdr:    { flexDirection: "row-reverse", backgroundColor: C.navy },
  cvTblHdrTxt: { fontFamily: "Cairo", fontSize: 9, fontWeight: 900, color: C.white, textAlign: "center" },
  cvTblRow:    { flexDirection: "row-reverse", borderBottom: `0.75 solid ${C.borderIn}` },
  cvTblTxt:    { fontFamily: "Cairo", fontSize: 9.5, fontWeight: 700, color: C.text, textAlign: "center" },
  cvTblTotRow: { flexDirection: "row-reverse", backgroundColor: C.goldLight, borderTop: `1.5 solid ${C.gold}` },
  cvTblTotTxt: { fontFamily: "Cairo", fontSize: 9.5, fontWeight: 900, color: C.navy, textAlign: "center" },

  // ── Cover summary strip ──
  cvSummary:    { flexDirection: "row", backgroundColor: C.navy, borderRadius: 4, marginTop: 6, paddingTop: 6, paddingBottom: 6 },
  cvSumItem:    { flex: 1, alignItems: "center" },
  cvSumNum:     { fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: C.gold, textAlign: "center" },
  cvSumLbl:     { fontFamily: "Cairo", fontSize: 7.5, fontWeight: 700, color: C.goldLight, textAlign: "center" },
  cvSumDiv:     { width: 1, backgroundColor: "#2E6DA4" },

  // ── Class section header ──
  classHdr:    { flexDirection: "row", backgroundColor: C.navy, minHeight: H_CLASS, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  classHdrTxt: { fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: C.white, textAlign: "center" },
  classHdrSub: { fontFamily: "Cairo", fontSize: 9, fontWeight: 700, color: C.goldLight, textAlign: "center", marginRight: 8 },

  // ── Table rows ──
  hdrRow:  { flexDirection: "row-reverse", backgroundColor: C.navy, minHeight: H_HDR },
  dataRow: { flexDirection: "row-reverse", minHeight: H_ROW, borderBottom: `0.75 solid ${C.borderIn}` },

  // ── Text ──
  hLg:    { fontFamily: "Cairo", fontSize: 8,  fontWeight: 900, color: C.white, textAlign: "center" },
  numTx:  { fontFamily: "Cairo", fontSize: 8,  fontWeight: 700, color: C.muted, textAlign: "center" },
  nameTx: { fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: C.text,  textAlign: "right", direction: "rtl" },

  // ── Footer ──
  footer:     { marginTop: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerInfo: { fontFamily: "Cairo", fontSize: 7.5, color: C.muted },
  pgNum:      { fontFamily: "Cairo", fontSize: 8, color: C.muted },
});

// ── Cover page ────────────────────────────────────────────────────────────────

function CoverPage({ classes, config }: { classes: MassarData[]; config: AttendanceConfig }) {
  const school        = classes[0]?.meta.school || "";
  const teacher       = config.prof || classes[0]?.meta.teacher || "";
  const annee         = config.annee || classes[0]?.meta.year || "";
  const totalSessions = config.sessionsPerWeek * WEEKS;
  const totalStudents = classes.reduce((s, c) => s + c.students.length, 0);

  const bR  = `0.75 solid ${C.borderIn}`;
  const bRS = `1 solid ${C.navyLine}`;

  // تقليص تلقائي عند كثرة الأقسام لضمان بقاء كل شيء في صفحة واحدة
  const n  = classes.length;
  const cp = n > 10 ? 4 : 6;  // cell padding vertical
  const bp = n > 10 ? 6 : 9;  // banner padding

  return (
    <Page size="A4" orientation="landscape" style={s.page}>

      {/* ── Banner ── */}
      <View style={[s.cvBanner, { paddingTop: bp, paddingBottom: bp - 3 }]}>
        <Text style={s.cvBannerFr}>REGISTRE DES ABSENCES</Text>
        <View style={s.cvGoldLine} />
        <Text style={s.cvBannerAr}>سجل الغياب</Text>
      </View>

      {/* ── Gold separator ── */}
      <View style={s.goldBar} />

      {/* ── School name bar ── */}
      <View style={s.cvSchoolBar}>
        <Text style={s.cvSchoolTxt}>{school || "—"}</Text>
      </View>

      {/* ── Gold separator ── */}
      <View style={{ height: 2, backgroundColor: C.gold, marginBottom: 7 }} />

      {/* ── Info cards ── */}
      <View style={s.cvInfoRow}>
        <View style={[s.cvCard, { marginLeft: 4 }]}>
          <View style={s.cvCardTop} />
          <View style={s.cvCardBody}>
            <Text style={s.cvCardLbl}>الأستاذ / الأستاذة</Text>
            <Text style={s.cvCardVal}>{teacher || "—"}</Text>
          </View>
        </View>
        <View style={[s.cvCard, { marginLeft: 4 }]}>
          <View style={s.cvCardTop} />
          <View style={s.cvCardBody}>
            <Text style={s.cvCardLbl}>الحصص في الأسبوع</Text>
            <Text style={s.cvCardVal}>{config.sessionsPerWeek === 1 ? "حصة واحدة" : config.sessionsPerWeek === 2 ? "حصتان" : "3 حصص"}</Text>
          </View>
        </View>
        <View style={s.cvCard}>
          <View style={s.cvCardTop} />
          <View style={s.cvCardBody}>
            <Text style={s.cvCardLbl}>السنة الدراسية</Text>
            <Text style={s.cvCardVal}>{annee || "—"}</Text>
          </View>
        </View>
      </View>

      {/* ── Classes table ── */}
      <View style={{ border: `1 solid ${C.border}`, borderRadius: 3 }}>
        {/* Header */}
        <View style={s.cvTblHdr}>
          <View style={{ flex: 0.35, paddingTop: cp, paddingBottom: cp, alignItems: "center" }}>
            <Text style={s.cvTblHdrTxt}>#</Text>
          </View>
          <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bRS }}>
            <Text style={s.cvTblHdrTxt}>القسم</Text>
          </View>
          <View style={{ flex: 1.5, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bRS }}>
            <Text style={s.cvTblHdrTxt}>المستوى</Text>
          </View>
          <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bRS }}>
            <Text style={s.cvTblHdrTxt}>عدد التلاميذ</Text>
          </View>
        </View>

        {/* Rows */}
        {classes.map((cls, i) => (
          <View key={i} style={[s.cvTblRow, { backgroundColor: i % 2 === 0 ? C.rowEven : C.white }]}>
            <View style={{ flex: 0.35, paddingTop: cp, paddingBottom: cp, alignItems: "center" }}>
              <Text style={s.cvTblTxt}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bR }}>
              <Text style={s.cvTblTxt}>{cls.meta.className || "—"}</Text>
            </View>
            <View style={{ flex: 1.5, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bR }}>
              <Text style={s.cvTblTxt}>{cls.meta.level || "—"}</Text>
            </View>
            <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bR }}>
              <Text style={s.cvTblTxt}>{cls.students.length}</Text>
            </View>
          </View>
        ))}

        {/* Totals row */}
        <View style={s.cvTblTotRow}>
          <View style={{ flex: 0.35, paddingTop: cp, paddingBottom: cp, alignItems: "center" }}>
            <Text style={s.cvTblTotTxt}>—</Text>
          </View>
          <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bRS }}>
            <Text style={s.cvTblTotTxt}>الإجمالي</Text>
          </View>
          <View style={{ flex: 1.5, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bR }}>
            <Text style={s.cvTblTotTxt}>{classes.length} أقسام</Text>
          </View>
          <View style={{ flex: 1, paddingTop: cp, paddingBottom: cp, alignItems: "center", borderLeft: bR }}>
            <Text style={s.cvTblTotTxt}>{totalStudents}</Text>
          </View>
        </View>
      </View>

      {/* ── Summary strip ── */}
      <View style={s.cvSummary}>
        <View style={s.cvSumItem}>
          <Text style={s.cvSumNum}>{classes.length}</Text>
          <Text style={s.cvSumLbl}>عدد الأقسام</Text>
        </View>
        <View style={s.cvSumDiv} />
        <View style={s.cvSumItem}>
          <Text style={s.cvSumNum}>{totalStudents}</Text>
          <Text style={s.cvSumLbl}>إجمالي التلاميذ</Text>
        </View>
        <View style={s.cvSumDiv} />
        <View style={s.cvSumItem}>
          <Text style={s.cvSumNum}>{totalSessions}</Text>
          <Text style={s.cvSumLbl}>حصة في الدورة</Text>
        </View>
        <View style={s.cvSumDiv} />
        <View style={s.cvSumItem}>
          <Text style={s.cvSumNum}>{config.sessionsPerWeek}</Text>
          <Text style={s.cvSumLbl}>حصة واحدة</Text>
        </View>
      </View>

    </Page>
  );
}

// ── Table header row (session numbers) ───────────────────────────────────────

function TableHeader({ totalSessions, colW, sessFz }: {
  totalSessions: number;
  colW: number;
  sessFz: number;
}) {
  const bR  = `0.75 solid ${C.borderIn}`;
  const bRS = `1 solid ${C.navyLine}`;
  return (
    <View style={s.hdrRow}>
      <View style={{ width: W_NUM,  justifyContent: "center", alignItems: "center", borderLeft: bRS }}>
        <Text style={s.hLg}>#</Text>
      </View>
      <View style={{ width: W_NAME, justifyContent: "center", alignItems: "center", borderLeft: bRS }}>
        <Text style={s.hLg}>اسم التلميذ</Text>
      </View>
      {Array.from({ length: totalSessions }, (_, i) => (
        <View key={i} style={{ width: colW, justifyContent: "center", alignItems: "center", borderLeft: bR }}>
          <Text style={[s.hLg, { fontSize: sessFz }]}>{i + 1}</Text>
        </View>
      ))}
      <View style={{ width: W_TOT, justifyContent: "center", alignItems: "center" }}>
        <Text style={[s.hLg, { fontSize: 7.5 }]}>مجموع</Text>
      </View>
    </View>
  );
}

// ── Student row ───────────────────────────────────────────────────────────────

function StudentRow({ student, totalSessions, colW, even }: {
  student: { index: number; name: string };
  totalSessions: number;
  colW: number;
  even: boolean;
}) {
  const bR = `0.75 solid ${C.borderIn}`;
  return (
    <View style={[s.dataRow, { backgroundColor: even ? C.rowEven : C.white }]}>
      <View style={{ width: W_NUM,  justifyContent: "center", alignItems: "center", borderLeft: bR }}>
        <Text style={s.numTx}>{String(student.index)}</Text>
      </View>
      <View style={{ width: W_NAME, justifyContent: "center", paddingLeft: 5, paddingRight: 5, borderLeft: bR }}>
        <Text style={s.nameTx}>{student.name}</Text>
      </View>
      {Array.from({ length: totalSessions }, (_, i) => (
        <View key={i} style={{ width: colW, borderLeft: bR }} />
      ))}
      <View style={{ width: W_TOT }} />
    </View>
  );
}

// ── Per-class pages ───────────────────────────────────────────────────────────

function ClassPages({ data, config, pageOffset, totalPages }: {
  data: MassarData;
  config: AttendanceConfig;
  pageOffset: number;
  totalPages: number;
}) {
  const totalSessions = config.sessionsPerWeek * WEEKS;
  const colW   = W_SESS / totalSessions;
  const sessFz = totalSessions <= 18 ? 8 : 7.5;

  // Paginate students
  const pages: typeof data.students[] = [];
  pages.push(data.students.slice(0, ROWS_P1));
  let idx = ROWS_P1;
  while (idx < data.students.length) {
    pages.push(data.students.slice(idx, idx + ROWS_PN));
    idx += ROWS_PN;
  }

  return (
    <>
      {pages.map((pageStudents, pageIdx) => (
        <Page key={pageIdx} size="A4" orientation="landscape" style={s.page}>

          {/* Class header only on first page of this class */}
          {pageIdx === 0 && (
            <View style={[s.classHdr, { marginBottom: 0 }]}>
              <Text style={s.classHdrSub}>{data.meta.level || ""}</Text>
              <Text style={s.classHdrTxt}>{" — " + (data.meta.className || "") + " — "}</Text>
              <Text style={[s.classHdrSub, { marginRight: 0, marginLeft: 8 }]}>
                {(config.annee || data.meta.year || "")}
              </Text>
            </View>
          )}

          <View style={{ border: `1 solid ${C.border}`, borderRadius: pageIdx === 0 ? "0 0 3 3" : 3 }}>
            <TableHeader totalSessions={totalSessions} colW={colW} sessFz={sessFz} />
            {pageStudents.map((student, i) => (
              <StudentRow
                key={student.index}
                student={student}
                totalSessions={totalSessions}
                colW={colW}
                even={i % 2 === 0}
              />
            ))}
          </View>

          <View style={s.footer}>
            <Text style={s.footerInfo}>{data.meta.className || ""}</Text>
            <Text style={s.pgNum}>
              {(pageOffset + pageIdx + 1) + " / " + totalPages}
            </Text>
          </View>

        </Page>
      ))}
    </>
  );
}

// ── Document ──────────────────────────────────────────────────────────────────

function AttendanceDocument({ classes, config }: { classes: MassarData[]; config: AttendanceConfig }) {
  // Calculate page counts per class to compute total pages
  const pagesPerClass = classes.map(cls => {
    const n = cls.students.length;
    if (n <= 0) return 1;
    const remaining = n - ROWS_P1;
    return 1 + (remaining > 0 ? Math.ceil(remaining / ROWS_PN) : 0);
  });

  const totalPages = pagesPerClass.reduce((a, b) => a + b, 0);

  // Compute page offsets (cover page is page 0, not counted in footer)
  const offsets: number[] = [];
  let acc = 0;
  for (const cnt of pagesPerClass) {
    offsets.push(acc);
    acc += cnt;
  }

  return (
    <Document title="Registre des Absences">
      <CoverPage classes={classes} config={config} />
      {classes.map((cls, i) => (
        <ClassPages
          key={i}
          data={cls}
          config={config}
          pageOffset={offsets[i]}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export async function downloadAttendancePdf(
  classes: MassarData[],
  config: AttendanceConfig,
): Promise<void> {
  const doc  = <AttendanceDocument classes={classes} config={config} />;
  const blob = await pdf(doc).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "registre-absences.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
