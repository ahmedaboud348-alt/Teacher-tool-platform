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
import type { MassarData, GradingSheetConfig } from "../types";

// ── Fonts ─────────────────────────────────────────────────────────────────────
Font.register({
  family: "Cairo",
  fonts: [
    { src: "/fonts/Cairo-Regular.ttf",   fontWeight: 400 },
    { src: "/fonts/Cairo-Bold.ttf",      fontWeight: 700 },
    { src: "/fonts/Cairo-ExtraBold.ttf", fontWeight: 900 },
  ],
});

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  navy:       "#1A3055",
  navyMid:    "#234D7A",
  navyLine:   "#2E6DA4",
  gold:       "#C8960C",
  goldLight:  "#F5E6C0",
  totalBg:    "#FFF3CD",
  totalBdr:   "#C8960C",
  rowEven:    "#EEF3F8",
  border:     "#8FA8BB",
  borderIn:   "#AABDCC",
  text:       "#0D1117",
  muted:      "#3D5A6E",
  white:      "#FFFFFF",
};

// ── Column widths ──────────────────────────────────────────────────────────────
const W = {
  num:  20,
  name: 148,
  act:  26,
  tot:  32,
  eval: 36,
  row:  15,
  h1:   22,
  h2:   16,
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  page: {
    fontFamily: "Cairo",
    fontSize: 8,
    color: C.text,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },

  /* ─ Official header ─ */
  offRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  offSide: { alignItems: "center", width: 130 },
  offTxt: { fontFamily: "Cairo", fontSize: 7.5, color: C.muted, textAlign: "center" },
  offBold: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navy, textAlign: "center" },
  logo: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.navy, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  logoTxt: { fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: C.white },

  /* ─ Title banner ─ */
  banner: { backgroundColor: C.navy, borderRadius: 4, paddingTop: 7, paddingBottom: 7, alignItems: "center", marginBottom: 6 },
  bannerFr: { fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: C.white, textAlign: "center" },
  bannerAr: { fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: C.goldLight, textAlign: "center" },
  bannerSub: { fontFamily: "Cairo", fontSize: 7, color: "#93B8D8", textAlign: "center", marginTop: 2 },
  goldBar: { height: 3, backgroundColor: C.gold, marginBottom: 8 },

  /* ─ Info strip ─ */
  infoRow: { flexDirection: "row", border: `1 solid ${C.border}`, borderRadius: 3, marginBottom: 8 },
  infoCell: { flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8, borderRight: `1 solid ${C.borderIn}` },
  infoCellL: { flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8 },
  infoLbl: { fontFamily: "Cairo", fontSize: 7, fontWeight: 700, color: C.navyLine, marginRight: 4, width: 44 },
  infoVal: { fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.text, flex: 1 },

  /* ─ Table ─ */
  table: { width: "100%", border: `1 solid ${C.border}`, borderRadius: 3 },
  hRow1: { flexDirection: "row", backgroundColor: C.navy, minHeight: W.h1 },
  hRow2: { flexDirection: "row", backgroundColor: C.navyMid, minHeight: W.h2, borderBottom: `1.5 solid ${C.navyLine}` },
  dRow: { flexDirection: "row", minHeight: W.row, borderBottom: `0.75 solid ${C.border}` },

  /* ─ Cells ─ */
  numC:   { width: W.num,  justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  nameC:  { width: W.name, justifyContent: "center", borderRight: `0.75 solid ${C.borderIn}`, paddingLeft: 5, paddingRight: 5 },
  actC:   { width: W.act,  justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  actLast:{ width: W.act,  justifyContent: "center", alignItems: "center", borderRight: `1.5 solid ${C.navyLine}` },
  totC:   { width: W.tot,  justifyContent: "center", alignItems: "center", backgroundColor: C.totalBg, borderRight: `1.5 solid ${C.totalBdr}` },
  evalC:  { width: W.eval, justifyContent: "center", alignItems: "center", borderRight: `0.75 solid ${C.borderIn}` },
  obsC:   { flex: 1, justifyContent: "center", paddingLeft: 4, paddingRight: 4 },

  /* ─ Text ─ */
  hLg:   { fontFamily: "Cairo", fontSize: 8,   fontWeight: 900, color: C.white,    textAlign: "center" },
  hSm:   { fontFamily: "Cairo", fontSize: 7.5, fontWeight: 700, color: "#C8DDEF",  textAlign: "center" },
  hTot:  { fontFamily: "Cairo", fontSize: 8,   fontWeight: 900, color: C.gold,     textAlign: "center" },
  numTx: { fontFamily: "Cairo", fontSize: 8,   fontWeight: 700, color: C.muted,    textAlign: "center" },
  nameTx:{ fontFamily: "Cairo", fontSize: 8.5, fontWeight: 700, color: C.text,     textAlign: "right",  direction: "rtl" },

  /* ─ Footer ─ */
  footer: { marginTop: 8, flexDirection: "row", justifyContent: "space-between" },
  legItem:{ flexDirection: "row", alignItems: "center", marginRight: 14 },
  legDot: { width: 5, height: 5, borderRadius: 2, backgroundColor: C.navyLine, marginRight: 3 },
  legBold:{ fontFamily: "Cairo", fontSize: 8, fontWeight: 700, color: C.navy },
  legTxt: { fontFamily: "Cairo", fontSize: 8, color: C.muted },
  pgNum:  { fontFamily: "Cairo", fontSize: 8, color: C.muted, textAlign: "right" },
});

// ── Components ────────────────────────────────────────────────────────────────

function OfficialHeader({ data }: { data: MassarData }) {
  return (
    <View style={s.offRow}>
      <View style={s.offSide}>
        <Text style={s.offBold}>المملكة المغربية</Text>
        <Text style={s.offTxt}>وزارة التربية الوطنية</Text>
        <Text style={s.offTxt}>والتعليم الأولي والرياضة</Text>
        {data.meta.academy !== "" && <Text style={s.offTxt}>{data.meta.academy}</Text>}
        {data.meta.school  !== "" && <Text style={s.offBold}>{data.meta.school}</Text>}
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
        {data.meta.term    !== "" && <Text style={s.offTxt}>{"Periode : " + data.meta.term}</Text>}
        {data.meta.subject !== "" && <Text style={s.offBold}>{data.meta.subject}</Text>}
      </View>
    </View>
  );
}

function InfoStrip({ data, config }: { data: MassarData; config: GradingSheetConfig }) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Prof :</Text>
        <Text style={s.infoVal}>{config.prof || data.meta.teacher || "-"}</Text>
      </View>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Classe :</Text>
        <Text style={s.infoVal}>{config.classe || data.meta.className || "-"}</Text>
      </View>
      <View style={s.infoCell}>
        <Text style={s.infoLbl}>Niveau :</Text>
        <Text style={s.infoVal}>{data.meta.level || "-"}</Text>
      </View>
      <View style={s.infoCellL}>
        <Text style={s.infoLbl}>{"Annee :"}</Text>
        <Text style={s.infoVal}>{config.annee || data.meta.year || "-"}</Text>
      </View>
    </View>
  );
}

function TableHeader({ config }: { config: GradingSheetConfig }) {
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

function StudentRow({ student, even, config }: { student: { index: number; name: string }; even: boolean; config: GradingSheetConfig }) {
  const { evalCount, showActivites, showObservation } = config;
  const bg = even ? C.rowEven : C.white;
  return (
    <View style={[s.dRow, { backgroundColor: bg }]}>
      <View style={s.numC}><Text style={s.numTx}>{String(student.index)}</Text></View>
      <View style={s.nameC}><Text style={s.nameTx}>{student.name}</Text></View>
      {showActivites
        ? <>
            <View style={s.actC} />
            <View style={s.actC} />
            <View style={s.actC} />
            <View style={s.actLast} />
          </>
        : null}
      <View style={s.totC} />
      {Array.from({ length: evalCount }, (_, i) => <View key={i} style={s.evalC} />)}
      {showObservation ? <View style={s.obsC} /> : null}
    </View>
  );
}

// ── Document ──────────────────────────────────────────────────────────────────

function GradingSheetDocument({ data, config }: { data: MassarData; config: GradingSheetConfig }) {
  const PAGE_SIZE = 30;
  const pages: MassarData["students"][] = [];
  for (let i = 0; i < data.students.length; i += PAGE_SIZE) {
    pages.push(data.students.slice(i, i + PAGE_SIZE));
  }

  return (
    <Document title="Feuille de Notes">
      {pages.map((pageStudents, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.page} orientation="portrait">

          {pageIdx === 0 ? <OfficialHeader data={data} /> : null}

          <View style={s.banner}>
            <Text style={s.bannerFr}>FEUILLE DE NOTES</Text>
            <Text style={s.bannerAr}>ورقة التنقيط</Text>
            <Text style={s.bannerSub}>{"Controle Continu - Activites Integrees"}</Text>
          </View>
          <View style={s.goldBar} />

          <InfoStrip data={data} config={config} />

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
            {pages.length > 1
              ? <Text style={s.pgNum}>{(pageIdx + 1) + " / " + pages.length}</Text>
              : null}
          </View>

        </Page>
      ))}
    </Document>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export async function downloadGradingSheetPdf(
  data: MassarData,
  config: GradingSheetConfig
): Promise<void> {
  const doc = <GradingSheetDocument data={data} config={config} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "feuille-de-notes-" + (config.classe || data.meta.className || "classe") + ".pdf";
  a.click();
  URL.revokeObjectURL(url);
}
