import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { GradeBookEntry, GradeBookConfig } from "../types";

Font.register({
  family: "Cairo",
  fonts: [
    { src: "/fonts/Cairo-Regular.ttf",   fontWeight: 400 },
    { src: "/fonts/Cairo-Bold.ttf",      fontWeight: 700 },
    { src: "/fonts/Cairo-ExtraBold.ttf", fontWeight: 900 },
  ],
});

const C = {
  navy:      "#1A3055",
  navyMid:   "#234D7A",
  navyLine:  "#2E6DA4",
  gold:      "#C8960C",
  goldLight: "#F5E6C0",
  totalBg:   "#FFF3CD",
  totalBdr:  "#C8960C",
  rowEven:   "#EEF3F8",
  border:    "#8FA8BB",
  borderIn:  "#AABDCC",
  text:      "#0D1117",
  muted:     "#3D5A6E",
  white:     "#FFFFFF",
  bgPage:    "#F7F8FC",
};

const W = { num: 20, name: 148, act: 26, tot: 32, eval: 36, row: 15, h1: 22, h2: 16 };

// ── Shared styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Pages
  coverPage: { fontFamily: "Cairo", fontSize: 9, color: C.text, paddingTop: 0, paddingBottom: 0 },
  sheetPage: { fontFamily: "Cairo", fontSize: 8, color: C.text, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 },

  // ── Cover ──
  coverTop: { backgroundColor: C.navy, paddingTop: 48, paddingBottom: 40, paddingLeft: 40, paddingRight: 40, alignItems: "center" },
  coverLogo: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.white, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  coverLogoTxt: { fontFamily: "Cairo", fontSize: 22, fontWeight: 900, color: C.navy },
  coverTitleAr: { fontFamily: "Cairo", fontSize: 28, fontWeight: 900, color: C.white, textAlign: "center" },
  coverTitleFr: { fontFamily: "Cairo", fontSize: 14, fontWeight: 700, color: C.goldLight, textAlign: "center", marginTop: 4 },
  coverSub: { fontFamily: "Cairo", fontSize: 9, color: "#93B8D8", textAlign: "center", marginTop: 6 },
  goldBar: { height: 4, backgroundColor: C.gold },

  // Cover info box
  coverBody: { paddingTop: 32, paddingBottom: 32, paddingLeft: 40, paddingRight: 40 },
  coverInfoGrid: { flexDirection: "row", marginBottom: 28 },
  coverInfoCol: { flex: 1 },
  coverInfoItem: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  coverInfoLbl: { fontFamily: "Cairo", fontSize: 9, fontWeight: 700, color: C.navyLine, width: 80 },
  coverInfoVal: { fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: C.text, flex: 1 },

  // Classes table on cover
  coverTableTitle: { fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: C.navy, marginBottom: 10, borderBottom: `2 solid ${C.navy}`, paddingBottom: 4 },
  coverTableHdr: { flexDirection: "row", backgroundColor: C.navy, paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, borderRadius: 3 },
  coverTableHdrTxt: { fontFamily: "Cairo", fontSize: 9, fontWeight: 900, color: C.white, textAlign: "center" },
  coverTableRow: { flexDirection: "row", paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, borderBottom: `0.75 solid ${C.borderIn}` },
  coverTableRowEven: { backgroundColor: C.rowEven },
  coverTableCell: { fontFamily: "Cairo", fontSize: 9, fontWeight: 400, color: C.text, textAlign: "center" },
  coverTableCellBold: { fontFamily: "Cairo", fontSize: 9, fontWeight: 700, color: C.text },

  // Cover footer
  coverFooter: { paddingTop: 16, paddingLeft: 40, paddingRight: 40, borderTop: `1 solid ${C.borderIn}`, flexDirection: "row", justifyContent: "space-between" },
  coverFooterTxt: { fontFamily: "Cairo", fontSize: 8, color: C.muted },

  // ── Grading sheet (reused per class) ──
  offRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  offSide: { alignItems: "center", width: 130 },
  offTxt: { fontFamily: "Cairo", fontSize: 7.5, color: C.muted, textAlign: "center" },
  offBold: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navy, textAlign: "center" },
  logo: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.navy, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  logoTxt: { fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: C.white },

  banner: { backgroundColor: C.navy, borderRadius: 4, paddingTop: 7, paddingBottom: 7, alignItems: "center", marginBottom: 6 },
  bannerFr: { fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: C.white, textAlign: "center" },
  bannerAr: { fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: C.goldLight, textAlign: "center" },
  bannerSub: { fontFamily: "Cairo", fontSize: 7, color: "#93B8D8", textAlign: "center", marginTop: 2 },
  goldBarSm: { height: 3, backgroundColor: C.gold, marginBottom: 8 },

  infoRow: { flexDirection: "row", border: `1 solid ${C.border}`, borderRadius: 3, marginBottom: 8 },
  infoCell: { flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8, borderRight: `1 solid ${C.borderIn}` },
  infoCellL: { flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8 },
  infoLbl: { fontFamily: "Cairo", fontSize: 7, fontWeight: 700, color: C.navyLine, marginRight: 4, width: 44 },
  infoVal: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.text, flex: 1 },

  table: { width: "100%", border: `1 solid ${C.border}`, borderRadius: 3 },
  hRow1: { flexDirection: "row", backgroundColor: C.navy, minHeight: W.h1 },
  hRow2: { flexDirection: "row", backgroundColor: C.navyMid, minHeight: W.h2, borderBottom: `1.5 solid ${C.navyLine}` },
  dRow: { flexDirection: "row", minHeight: W.row, borderBottom: `0.75 solid ${C.border}` },

  numC:    { width: W.num,  justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  nameC:   { width: W.name, justifyContent: "center", borderRight: `0.75 solid ${C.borderIn}`, paddingLeft: 5, paddingRight: 5 },
  actC:    { width: W.act,  justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  actLast: { width: W.act,  justifyContent: "center", alignItems: "center", borderRight: `1.5 solid ${C.navyLine}` },
  totC:    { width: W.tot,  justifyContent: "center", alignItems: "center", backgroundColor: C.totalBg, borderRight: `1.5 solid ${C.totalBdr}` },
  evalC:   { width: W.eval, justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  obsC:    { flex: 1, justifyContent: "center", paddingLeft: 4, paddingRight: 4 },

  hLg:    { fontFamily: "Cairo", fontSize: 8,   fontWeight: 900, color: C.white,   textAlign: "center" },
  hSm:    { fontFamily: "Cairo", fontSize: 7.5, fontWeight: 700, color: "#C8DDEF", textAlign: "center" },
  hTot:   { fontFamily: "Cairo", fontSize: 8,   fontWeight: 900, color: C.gold,    textAlign: "center" },
  numTx:  { fontFamily: "Cairo", fontSize: 8,   fontWeight: 700, color: C.muted,   textAlign: "center" },
  nameTx: { fontFamily: "Cairo", fontSize: 8.5, fontWeight: 700, color: C.text,    textAlign: "right", direction: "rtl" },

  footer: { marginTop: 8, flexDirection: "row", justifyContent: "space-between" },
  legItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  legDot:  { width: 5, height: 5, borderRadius: 2, backgroundColor: C.navyLine, marginRight: 3 },
  legBold: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navy },
  legTxt:  { fontFamily: "Cairo", fontSize: 8, color: C.muted },
  pgNum:   { fontFamily: "Cairo", fontSize: 8, color: C.muted, textAlign: "right" },
});

// ── Cover Page ────────────────────────────────────────────────────────────────

function CoverPage({ entries, config }: { entries: GradeBookEntry[]; config: GradeBookConfig }) {
  const first = entries[0]?.data.meta;
  const totalStudents = entries.reduce((acc, e) => acc + e.data.students.length, 0);

  return (
    <Page size="A4" style={s.coverPage} orientation="portrait">
      {/* Top band */}
      <View style={s.coverTop}>
        <View style={s.coverLogo}><Text style={s.coverLogoTxt}>م</Text></View>
        <Text style={s.coverTitleAr}>دفتر التنقيط</Text>
        <Text style={s.coverTitleFr}>CARNET DE NOTES</Text>
        <Text style={s.coverSub}>{"Controle Continu - Activites Integrees"}</Text>
      </View>
      <View style={s.goldBar} />

      {/* Info */}
      <View style={s.coverBody}>
        <View style={s.coverInfoGrid}>
          <View style={s.coverInfoCol}>
            {[
              ["الأستاذ", config.prof || "-"],
              ["المادة",  first?.subject || "-"],
              ["الأكاديمية", first?.academy || "-"],
            ].map(([lbl, val]) => (
              <View key={lbl} style={s.coverInfoItem}>
                <Text style={s.coverInfoLbl}>{lbl} :</Text>
                <Text style={s.coverInfoVal}>{val}</Text>
              </View>
            ))}
          </View>
          <View style={s.coverInfoCol}>
            {[
              ["السنة الدراسية", config.annee || "-"],
              ["المؤسسة",        first?.school || "-"],
              ["مجموع التلاميذ", String(totalStudents) + " تلميذ"],
            ].map(([lbl, val]) => (
              <View key={lbl} style={s.coverInfoItem}>
                <Text style={s.coverInfoLbl}>{lbl} :</Text>
                <Text style={s.coverInfoVal}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Classes list */}
        <Text style={s.coverTableTitle}>{"قائمة الأقسام — " + entries.length + " قسم"}</Text>
        <View style={s.coverTableHdr}>
          <View style={{ width: 30 }}><Text style={s.coverTableHdrTxt}>{"#"}</Text></View>
          <View style={{ flex: 1 }}><Text style={s.coverTableHdrTxt}>القسم</Text></View>
          <View style={{ width: 80 }}><Text style={s.coverTableHdrTxt}>المستوى</Text></View>
          <View style={{ width: 60, textAlign: "center" }}><Text style={s.coverTableHdrTxt}>التلاميذ</Text></View>
          <View style={{ width: 80 }}><Text style={s.coverTableHdrTxt}>الدورة</Text></View>
        </View>
        {entries.map((entry, i) => (
          <View key={entry.id} style={[s.coverTableRow, i % 2 !== 0 ? s.coverTableRowEven : {}]}>
            <View style={{ width: 30 }}><Text style={s.coverTableCell}>{String(i + 1)}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.coverTableCellBold}>{entry.data.meta.className || entry.filename}</Text></View>
            <View style={{ width: 80 }}><Text style={s.coverTableCell}>{entry.data.meta.level || "-"}</Text></View>
            <View style={{ width: 60 }}><Text style={s.coverTableCell}>{String(entry.data.students.length)}</Text></View>
            <View style={{ width: 80 }}><Text style={s.coverTableCell}>{entry.data.meta.term || "-"}</Text></View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={s.coverFooter}>
        <Text style={s.coverFooterTxt}>{"Genere par : adat-aloustadh.ma"}</Text>
        <Text style={s.coverFooterTxt}>{config.annee}</Text>
      </View>
    </Page>
  );
}

// ── Grading Sheet Header (first page of each class only) ──────────────────────

function ClassHeader({ entry }: { entry: GradeBookEntry }) {
  const m = entry.data.meta;
  return (
    <View style={s.offRow}>
      <View style={s.offSide}>
        <Text style={s.offBold}>المملكة المغربية</Text>
        <Text style={s.offTxt}>وزارة التربية الوطنية</Text>
        <Text style={s.offTxt}>والتعليم الأولي والرياضة</Text>
        {m.academy !== "" && <Text style={s.offTxt}>{m.academy}</Text>}
        {m.school  !== "" && <Text style={s.offBold}>{m.school}</Text>}
      </View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <View style={s.logo}><Text style={s.logoTxt}>م</Text></View>
        <Text style={s.offBold}>أداة الأستاذ</Text>
        <Text style={s.offTxt}>Teacher Tools Platform</Text>
      </View>
      <View style={s.offSide}>
        <Text style={s.offBold}>Royaume du Maroc</Text>
        <Text style={s.offTxt}>{"Ministere de l'Education"}</Text>
        <Text style={s.offTxt}>Nationale et du Prescolaire</Text>
        {m.term    !== "" && <Text style={s.offTxt}>{"Periode : " + m.term}</Text>}
        {m.subject !== "" && <Text style={s.offBold}>{m.subject}</Text>}
      </View>
    </View>
  );
}

function InfoStrip({ entry, config }: { entry: GradeBookEntry; config: GradeBookConfig }) {
  const m = entry.data.meta;
  return (
    <View style={s.infoRow}>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Prof :</Text>
        <Text style={s.infoVal}>{config.prof || m.teacher || "-"}</Text>
      </View>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Classe :</Text>
        <Text style={s.infoVal}>{m.className || "-"}</Text>
      </View>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Niveau :</Text>
        <Text style={s.infoVal}>{m.level || "-"}</Text>
      </View>
      <View style={s.infoCellL}>
        <Text style={s.infoLbl}>{"Annee :"}</Text>
        <Text style={s.infoVal}>{config.annee || m.year || "-"}</Text>
      </View>
    </View>
  );
}

function TableHeader({ config }: { config: GradeBookConfig }) {
  const { evalCount, showActivites, showObservation } = config;
  return (
    <>
      <View style={s.hRow1}>
        <View style={[s.numC,  { justifyContent: "center" }]}><Text style={s.hLg}>{"N°"}</Text></View>
        <View style={[s.nameC, { justifyContent: "center" }]}><Text style={s.hLg}>Nom et Prenom</Text></View>
        {showActivites
          ? <View style={{ width: W.act * 4, justifyContent: "center", alignItems: "center", borderRight: `1.5 solid ${C.navyLine}` }}>
              <Text style={s.hLg}>{"Activites Integrees /20"}</Text>
            </View>
          : null}
        <View style={[s.totC, { justifyContent: "center" }]}><Text style={s.hTot}>{"Total\n/20"}</Text></View>
        <View style={{ width: evalCount * W.eval, justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` }}>
          <Text style={s.hLg}>{"Evaluations /20"}</Text>
        </View>
        {showObservation
          ? <View style={[s.obsC, { justifyContent: "center" }]}><Text style={s.hLg}>Observation</Text></View>
          : null}
      </View>
      <View style={s.hRow2}>
        <View style={s.numC} />
        <View style={s.nameC} />
        {showActivites
          ? <>
              <View style={s.actC}><Text style={s.hSm}>{"Part.\n/5"}</Text></View>
              <View style={s.actC}><Text style={s.hSm}>{"T.H.C\n/5"}</Text></View>
              <View style={s.actC}><Text style={s.hSm}>{"Cahier\n/5"}</Text></View>
              <View style={s.actLast}><Text style={s.hSm}>{"Disc.\n/5"}</Text></View>
            </>
          : null}
        <View style={s.totC} />
        {Array.from({ length: evalCount }, (_, i) => (
          <View key={i} style={s.evalC}><Text style={s.hSm}>{"CC " + (i + 1)}</Text></View>
        ))}
        {showObservation ? <View style={s.obsC} /> : null}
      </View>
    </>
  );
}

function StudentRow({ student, even, config }: { student: { index: number; name: string }; even: boolean; config: GradeBookConfig }) {
  const { evalCount, showActivites, showObservation } = config;
  const bg = even ? C.rowEven : C.white;
  return (
    <View style={[s.dRow, { backgroundColor: bg }]}>
      <View style={s.numC}><Text style={s.numTx}>{String(student.index)}</Text></View>
      <View style={s.nameC}><Text style={s.nameTx}>{student.name}</Text></View>
      {showActivites
        ? <><View style={s.actC} /><View style={s.actC} /><View style={s.actC} /><View style={s.actLast} /></>
        : null}
      <View style={s.totC} />
      {Array.from({ length: evalCount }, (_, i) => <View key={i} style={s.evalC} />)}
      {showObservation ? <View style={s.obsC} /> : null}
    </View>
  );
}

// ── Class Pages ───────────────────────────────────────────────────────────────

function ClassPages({ entry, config, globalPageOffset, totalPages }: {
  entry: GradeBookEntry;
  config: GradeBookConfig;
  globalPageOffset: number;
  totalPages: number;
}) {
  const PAGE_SIZE = 30;
  const pagedStudents: (typeof entry.data.students)[] = [];
  for (let i = 0; i < entry.data.students.length; i += PAGE_SIZE) {
    pagedStudents.push(entry.data.students.slice(i, i + PAGE_SIZE));
  }

  return (
    <>
      {pagedStudents.map((pageStudents, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.sheetPage} orientation="portrait">
          {pageIdx === 0 ? <ClassHeader entry={entry} /> : null}

          <View style={s.banner}>
            <Text style={s.bannerFr}>FEUILLE DE NOTES</Text>
            <Text style={s.bannerAr}>ورقة التنقيط</Text>
            <Text style={s.bannerSub}>{"Controle Continu - Activites Integrees"}</Text>
          </View>
          <View style={s.goldBarSm} />

          <InfoStrip entry={entry} config={config} />

          <View style={s.table}>
            <TableHeader config={config} />
            {pageStudents.map((student, i) => (
              <StudentRow key={student.index} student={student} even={i % 2 === 0} config={config} />
            ))}
          </View>

          <View style={s.footer}>
            {config.showActivites
              ? <View style={{ flexDirection: "row" }}>
                  <View style={s.legItem}><View style={s.legDot} /><Text style={s.legBold}>{"Part. : "}</Text><Text style={s.legTxt}>Participation</Text></View>
                  <View style={s.legItem}><View style={s.legDot} /><Text style={s.legBold}>{"T.H.C : "}</Text><Text style={s.legTxt}>Travaux Hors Classe</Text></View>
                  <View style={s.legItem}><View style={s.legDot} /><Text style={s.legBold}>{"Disc. : "}</Text><Text style={s.legTxt}>Discipline / Comportement</Text></View>
                </View>
              : <View />}
            <Text style={s.pgNum}>
              {(globalPageOffset + pageIdx + 1) + " / " + totalPages}
            </Text>
          </View>
        </Page>
      ))}
    </>
  );
}

// ── Main Document ─────────────────────────────────────────────────────────────

function GradeBookDocument({ entries, config }: { entries: GradeBookEntry[]; config: GradeBookConfig }) {
  const classPagesCount = entries.map(e => Math.ceil(e.data.students.length / 30));
  const totalPages      = 1 + classPagesCount.reduce((a, b) => a + b, 0);

  let offset = 1; // cover is page 1
  const offsets: number[] = [];
  for (const count of classPagesCount) {
    offsets.push(offset);
    offset += count;
  }

  return (
    <Document title="Carnet de Notes">
      <CoverPage entries={entries} config={config} />
      {entries.map((entry, i) => (
        <ClassPages
          key={entry.id}
          entry={entry}
          config={config}
          globalPageOffset={offsets[i]}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export async function downloadGradeBookPdf(
  entries: GradeBookEntry[],
  config: GradeBookConfig
): Promise<void> {
  const doc = <GradeBookDocument entries={entries} config={config} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "carnet-de-notes-" + (config.prof || "prof") + "-" + (config.annee || "annee") + ".pdf";
  a.click();
  URL.revokeObjectURL(url);
}
