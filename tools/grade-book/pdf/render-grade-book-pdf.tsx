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

  // ── Cover: top ministry bar ──
  ministryBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F0F4F8", paddingTop: 10, paddingBottom: 10, paddingLeft: 28, paddingRight: 28, borderBottom: `1 solid ${C.borderIn}` },
  ministryTxt: { fontFamily: "Cairo", fontSize: 7.5, color: C.muted, textAlign: "center" },
  ministryBold: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navy, textAlign: "center" },
  ministrySide: { width: 160, alignItems: "center" },

  // ── Cover: hero band ──
  coverHero: { backgroundColor: C.navy, paddingTop: 36, paddingBottom: 0, paddingLeft: 40, paddingRight: 40, alignItems: "center" },
  coverHeroLogo: { width: 62, height: 62, borderRadius: 31, backgroundColor: C.gold, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  coverHeroLogoTxt: { fontFamily: "Cairo", fontSize: 26, fontWeight: 900, color: C.white },
  coverHeroTitleAr: { fontFamily: "Cairo", fontSize: 32, fontWeight: 900, color: C.white, textAlign: "center" },
  coverHeroTitleFr: { fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: C.goldLight, textAlign: "center", marginTop: 5 },
  coverHeroSub: { fontFamily: "Cairo", fontSize: 8.5, color: "#7BAFD4", textAlign: "center", marginTop: 5, marginBottom: 28 },
  coverGoldBar: { height: 5, backgroundColor: C.gold, width: "100%" },
  coverGoldBarThin: { height: 2, backgroundColor: C.gold, marginBottom: 20 },

  // ── Cover: info panel ──
  coverBody: { paddingTop: 24, paddingBottom: 20, paddingLeft: 28, paddingRight: 28 },
  coverInfoPanel: { flexDirection: "row", border: `1.5 solid ${C.border}`, borderRadius: 4, marginBottom: 22 },
  coverInfoBlock: { flex: 1, paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, borderRight: `1 solid ${C.borderIn}` },
  coverInfoBlockLast: { flex: 1, paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16 },
  coverInfoLbl: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navyLine, marginBottom: 3 },
  coverInfoVal: { fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: C.text },
  coverInfoValSm: { fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: C.text },

  // ── Cover: stats row ──
  coverStats: { flexDirection: "row", marginBottom: 22 },
  coverStatBox: { flex: 1, backgroundColor: C.rowEven, borderRadius: 4, paddingTop: 10, paddingBottom: 10, alignItems: "center", marginRight: 8, border: `1 solid ${C.borderIn}` },
  coverStatBoxLast: { flex: 1, backgroundColor: C.rowEven, borderRadius: 4, paddingTop: 10, paddingBottom: 10, alignItems: "center", border: `1 solid ${C.borderIn}` },
  coverStatNum: { fontFamily: "Cairo", fontSize: 20, fontWeight: 900, color: C.navy },
  coverStatLbl: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.muted, marginTop: 2 },

  // ── Cover: classes table ──
  coverSectionTitle: { fontFamily: "Cairo", fontSize: 11, fontWeight: 900, color: C.navy, marginBottom: 8 },
  coverSectionLine: { height: 2, backgroundColor: C.navy, marginBottom: 10 },
  coverTblHdr: { flexDirection: "row", backgroundColor: C.navy, paddingTop: 8, paddingBottom: 8 },
  coverTblHdrTxt: { fontFamily: "Cairo", fontSize: 9, fontWeight: 900, color: C.white, textAlign: "center" },
  coverTblRow: { flexDirection: "row", borderBottom: `0.75 solid ${C.borderIn}` },
  coverTblRowEven: { backgroundColor: C.rowEven },
  coverTblCell: { fontFamily: "Cairo", fontSize: 9.5, fontWeight: 400, color: C.text, textAlign: "center", paddingTop: 7, paddingBottom: 7 },
  coverTblCellBold: { fontFamily: "Cairo", fontSize: 9.5, fontWeight: 700, color: C.navy, paddingTop: 7, paddingBottom: 7 },
  coverTblCellAr: { fontFamily: "Cairo", fontSize: 9.5, fontWeight: 700, color: C.text, textAlign: "right", paddingTop: 7, paddingBottom: 7, direction: "rtl" },

  // ── Cover: footer ──
  coverFooter: { backgroundColor: C.navy, paddingTop: 12, paddingBottom: 12, paddingLeft: 28, paddingRight: 28, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  coverFooterTxt: { fontFamily: "Cairo", fontSize: 8, color: "#7BAFD4" },
  coverFooterBold: { fontFamily: "Cairo", fontSize: 9, fontWeight: 700, color: C.goldLight },

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
  const totalPages    = 1 + entries.reduce((acc, e) => acc + Math.ceil(e.data.students.length / 30), 0);

  return (
    <Page size="A4" style={s.coverPage} orientation="portrait">

      {/* ── Ministry bar ── */}
      <View style={s.ministryBar}>
        <View style={s.ministrySide}>
          <Text style={s.ministryBold}>المملكة المغربية</Text>
          <Text style={s.ministryTxt}>وزارة التربية الوطنية</Text>
          <Text style={s.ministryTxt}>والتعليم الأولي والرياضة</Text>
          {first?.academy !== "" && first?.academy
            ? <Text style={s.ministryTxt}>{first.academy}</Text>
            : null}
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={[s.ministryBold, { fontSize: 9 }]}>أداة الأستاذ</Text>
          <Text style={[s.ministryTxt, { fontSize: 7 }]}>Teacher Tools Platform</Text>
        </View>
        <View style={s.ministrySide}>
          <Text style={s.ministryBold}>Royaume du Maroc</Text>
          <Text style={s.ministryTxt}>{"Ministere de l'Education"}</Text>
          <Text style={s.ministryTxt}>Nationale et du Prescolaire</Text>
          {first?.school !== "" && first?.school
            ? <Text style={s.ministryBold}>{first.school}</Text>
            : null}
        </View>
      </View>

      {/* ── Hero band ── */}
      <View style={s.coverHero}>
        <View style={s.coverHeroLogo}>
          <Text style={s.coverHeroLogoTxt}>م</Text>
        </View>
        <Text style={s.coverHeroTitleAr}>دفتر التنقيط</Text>
        <Text style={s.coverHeroTitleFr}>CARNET DE NOTES</Text>
        <Text style={s.coverHeroSub}>{"Controle Continu — Activites Integrees"}</Text>
      </View>
      <View style={s.coverGoldBar} />

      {/* ── Body ── */}
      <View style={s.coverBody}>

        {/* Info panel */}
        <View style={s.coverInfoPanel}>
          <View style={s.coverInfoBlock}>
            <Text style={s.coverInfoLbl}>الأستاذ / الأستاذة</Text>
            <Text style={s.coverInfoVal}>{config.prof || "-"}</Text>
          </View>
          <View style={s.coverInfoBlock}>
            <Text style={s.coverInfoLbl}>المادة الدراسية</Text>
            <Text style={s.coverInfoVal}>{first?.subject || "-"}</Text>
          </View>
          <View style={s.coverInfoBlock}>
            <Text style={s.coverInfoLbl}>السنة الدراسية</Text>
            <Text style={s.coverInfoVal}>{config.annee || "-"}</Text>
          </View>
          <View style={s.coverInfoBlockLast}>
            <Text style={s.coverInfoLbl}>الدورة</Text>
            <Text style={s.coverInfoVal}>{first?.term || "-"}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={s.coverStats}>
          <View style={s.coverStatBox}>
            <Text style={s.coverStatNum}>{String(entries.length)}</Text>
            <Text style={s.coverStatLbl}>قسم</Text>
          </View>
          <View style={s.coverStatBox}>
            <Text style={s.coverStatNum}>{String(totalStudents)}</Text>
            <Text style={s.coverStatLbl}>تلميذ</Text>
          </View>
          <View style={s.coverStatBox}>
            <Text style={s.coverStatNum}>{String(totalPages)}</Text>
            <Text style={s.coverStatLbl}>صفحة</Text>
          </View>
          <View style={s.coverStatBoxLast}>
            <Text style={s.coverStatNum}>{first?.year || config.annee || "-"}</Text>
            <Text style={s.coverStatLbl}>السنة</Text>
          </View>
        </View>

        {/* Classes table */}
        <Text style={s.coverSectionTitle}>{"قائمة الأقسام"}</Text>
        <View style={s.coverSectionLine} />

        <View style={s.coverTblHdr}>
          <View style={{ width: 28 }}><Text style={s.coverTblHdrTxt}>{"#"}</Text></View>
          <View style={{ flex: 1, paddingLeft: 8 }}><Text style={s.coverTblHdrTxt}>القسم</Text></View>
          <View style={{ width: 100 }}><Text style={s.coverTblHdrTxt}>المستوى</Text></View>
          <View style={{ width: 60 }}><Text style={s.coverTblHdrTxt}>التلاميذ</Text></View>
          <View style={{ width: 70 }}><Text style={s.coverTblHdrTxt}>الدورة</Text></View>
          <View style={{ width: 80 }}><Text style={s.coverTblHdrTxt}>المادة</Text></View>
        </View>

        {entries.map((entry, i) => {
          const m = entry.data.meta;
          return (
            <View key={entry.id} style={[s.coverTblRow, i % 2 !== 0 ? s.coverTblRowEven : {}]}>
              <View style={{ width: 28, alignItems: "center" }}>
                <Text style={s.coverTblCell}>{String(i + 1)}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={s.coverTblCellBold}>{m.className || entry.filename}</Text>
              </View>
              <View style={{ width: 100 }}>
                <Text style={s.coverTblCellAr}>{m.level || "-"}</Text>
              </View>
              <View style={{ width: 60, alignItems: "center" }}>
                <Text style={s.coverTblCell}>{String(entry.data.students.length)}</Text>
              </View>
              <View style={{ width: 70, alignItems: "center" }}>
                <Text style={s.coverTblCell}>{m.term || "-"}</Text>
              </View>
              <View style={{ width: 80 }}>
                <Text style={s.coverTblCellAr}>{m.subject || "-"}</Text>
              </View>
            </View>
          );
        })}

      </View>

      {/* ── Footer ── */}
      <View style={s.coverFooter}>
        <Text style={s.coverFooterTxt}>{"adat-aloustadh.ma"}</Text>
        <Text style={s.coverFooterBold}>{config.annee}</Text>
        <Text style={s.coverFooterTxt}>{"Page 1 / " + String(totalPages)}</Text>
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
