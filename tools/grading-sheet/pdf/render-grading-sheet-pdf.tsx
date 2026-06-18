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

// ── Font ──────────────────────────────────────────────────────────────────────
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
  headerBg:   "#4CAF50",   // green header (like the image)
  headerText: "#FFFFFF",
  totalBg:    "#FF5722",   // orange total column
  evalBg:     "#FFD700",   // yellow evaluation columns
  rowOdd:     "#FFFFFF",
  rowEven:    "#F9F9F9",
  border:     "#CCCCCC",
  text:       "#1A1A1A",
  muted:      "#666666",
  infoBorder: "#4CAF50",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Cairo",
    fontSize: 8,
    color: C.text,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 14,
    paddingRight: 14,
    direction: "ltr",
  },

  // Title section
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleLeft: { flex: 1 },
  mainTitle: {
    fontFamily: "Cairo",
    fontSize: 18,
    fontWeight: 900,
    color: C.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "Cairo",
    fontSize: 9,
    color: C.muted,
  },
  infoBox: {
    width: 160,
    border: `1.5 solid ${C.infoBorder}`,
    borderRadius: 3,
    padding: "6 10",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    fontFamily: "Cairo",
    fontSize: 8,
    fontWeight: 700,
    width: 70,
    color: C.muted,
  },
  infoValue: {
    fontFamily: "Cairo",
    fontSize: 8,
    fontWeight: 700,
    flex: 1,
    color: C.text,
  },

  // Table
  table: { width: "100%" },

  // Header rows
  headerRow1: {
    flexDirection: "row",
    backgroundColor: C.headerBg,
    minHeight: 22,
  },
  headerRow2: {
    flexDirection: "row",
    backgroundColor: C.headerBg,
    minHeight: 16,
  },
  headerRow3: {
    flexDirection: "row",
    backgroundColor: C.headerBg,
    minHeight: 14,
    borderBottom: `1.5 solid ${C.border}`,
  },

  // Data rows
  dataRow: {
    flexDirection: "row",
    minHeight: 16,
    borderBottom: `0.5 solid ${C.border}`,
  },

  // Cells
  numCell: {
    width: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRight: `0.5 solid ${C.border}`,
    paddingVertical: 2,
  },
  nameCell: {
    flex: 1,
    justifyContent: "center",
    borderRight: `0.5 solid ${C.border}`,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actCell: {
    width: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRight: `0.5 solid ${C.border}`,
    paddingVertical: 2,
  },
  totalCell: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRight: `0.5 solid ${C.border}`,
    paddingVertical: 2,
    backgroundColor: "#FFF3E0",
  },
  evalCell: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRight: `0.5 solid ${C.border}`,
    paddingVertical: 2,
  },
  obsCell: {
    width: 55,
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 2,
  },

  // Text variants
  headerText: {
    fontFamily: "Cairo",
    fontSize: 7.5,
    fontWeight: 900,
    color: C.headerText,
    textAlign: "center",
  },
  headerTextSmall: {
    fontFamily: "Cairo",
    fontSize: 6.5,
    fontWeight: 700,
    color: C.headerText,
    textAlign: "center",
  },
  cellText: {
    fontFamily: "Cairo",
    fontSize: 7.5,
    textAlign: "center",
    color: C.text,
  },
  nameText: {
    fontFamily: "Cairo",
    fontSize: 7.5,
    textAlign: "right",
    color: C.text,
    direction: "rtl",
  },
  numText: {
    fontFamily: "Cairo",
    fontSize: 7.5,
    fontWeight: 700,
    textAlign: "center",
    color: C.muted,
  },

  // Footer
  footer: {
    marginTop: 8,
    flexDirection: "row",
    gap: 16,
  },
  footerText: {
    fontFamily: "Cairo",
    fontSize: 7,
    color: C.muted,
  },
  footerBold: {
    fontFamily: "Cairo",
    fontSize: 7,
    fontWeight: 700,
    color: C.text,
  },
});

// ── Components ────────────────────────────────────────────────────────────────

function InfoBox({ config }: { config: GradingSheetConfig }) {
  return (
    <View style={s.infoBox}>
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>Prof :</Text>
        <Text style={s.infoValue}>{config.prof || "—"}</Text>
      </View>
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>Année Scolaire :</Text>
        <Text style={s.infoValue}>{config.annee || "—"}</Text>
      </View>
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>Classe :</Text>
        <Text style={s.infoValue}>{config.classe || "—"}</Text>
      </View>
    </View>
  );
}

function TableHeader({ config }: { config: GradingSheetConfig }) {
  const { evalCount, showActivites, showObservation } = config;
  return (
    <>
      {/* Row 1 — main column labels */}
      <View style={s.headerRow1}>
        <View style={[s.numCell, { justifyContent: "center" }]}>
          <Text style={s.headerText}>N°</Text>
        </View>
        <View style={[s.nameCell, { justifyContent: "center" }]}>
          <Text style={s.headerText}>Nom et Prénom</Text>
        </View>
        {showActivites && (
          <View style={{ width: 112, justifyContent: "center", alignItems: "center", borderRight: `0.5 solid ${C.border}` }}>
            <Text style={s.headerText}>Activités intégrées /20</Text>
          </View>
        )}
        <View style={[s.totalCell, { justifyContent: "center" }]}>
          <Text style={[s.headerText, { color: "#FF5722" }]}>Total</Text>
        </View>
        <View style={{ width: evalCount * 30, justifyContent: "center", alignItems: "center", borderRight: `0.5 solid ${C.border}` }}>
          <Text style={s.headerText}>Évaluation</Text>
        </View>
        {showObservation && (
          <View style={[s.obsCell, { justifyContent: "center" }]}>
            <Text style={s.headerText}>Observation</Text>
          </View>
        )}
      </View>

      {/* Row 2 — sub-labels */}
      <View style={s.headerRow2}>
        <View style={s.numCell} />
        <View style={s.nameCell} />
        {showActivites && (
          <>
            <View style={s.actCell}><Text style={s.headerTextSmall}>Part.{"\n"}/5</Text></View>
            <View style={s.actCell}><Text style={s.headerTextSmall}>T.H.C{"\n"}/5</Text></View>
            <View style={s.actCell}><Text style={s.headerTextSmall}>Cahier{"\n"}/5</Text></View>
            <View style={s.actCell}><Text style={s.headerTextSmall}>Disc.{"\n"}/5</Text></View>
          </>
        )}
        <View style={s.totalCell} />
        {Array.from({ length: evalCount }, (_, i) => (
          <View key={i} style={s.evalCell}>
            <Text style={s.headerTextSmall}>N°{i + 1}</Text>
          </View>
        ))}
        {showObservation && <View style={s.obsCell} />}
      </View>
    </>
  );
}

function StudentRow({
  student,
  even,
  config,
}: {
  student: { index: number; name: string };
  even: boolean;
  config: GradingSheetConfig;
}) {
  const { evalCount, showActivites, showObservation } = config;
  const bg = even ? C.rowEven : C.rowOdd;
  return (
    <View style={[s.dataRow, { backgroundColor: bg }]}>
      <View style={s.numCell}>
        <Text style={s.numText}>{student.index}</Text>
      </View>
      <View style={s.nameCell}>
        <Text style={s.nameText}>{student.name}</Text>
      </View>
      {showActivites && (
        <>
          <View style={s.actCell} />
          <View style={s.actCell} />
          <View style={s.actCell} />
          <View style={s.actCell} />
        </>
      )}
      <View style={s.totalCell} />
      {Array.from({ length: evalCount }, (_, i) => (
        <View key={i} style={s.evalCell} />
      ))}
      {showObservation && <View style={s.obsCell} />}
    </View>
  );
}

// ── Main Document ─────────────────────────────────────────────────────────────

function GradingSheetDocument({
  data,
  config,
}: {
  data: MassarData;
  config: GradingSheetConfig;
}) {
  // Split students into pages of 30
  const PAGE_SIZE = 30;
  const pages: MassarData["students"][] = [];
  for (let i = 0; i < data.students.length; i += PAGE_SIZE) {
    pages.push(data.students.slice(i, i + PAGE_SIZE));
  }

  return (
    <Document title="Feuille de Notes">
      {pages.map((pageStudents, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.page} orientation="portrait">
          {/* Title area */}
          <View style={s.titleRow}>
            <View style={s.titleLeft}>
              <Text style={s.mainTitle}>FEUILLE DE NOTES</Text>
              <Text style={s.subtitle}>Contrôle Continu &amp; Activités Intégrées</Text>
            </View>
            <InfoBox config={config} />
          </View>

          {/* Table */}
          <View style={s.table}>
            <TableHeader config={config} />
            {pageStudents.map((student, i) => (
              <StudentRow
                key={student.code || i}
                student={student}
                even={i % 2 === 0}
                config={config}
              />
            ))}
          </View>

          {/* Footer legend */}
          {config.showActivites && (
            <View style={s.footer}>
              <Text style={s.footerText}>
                <Text style={s.footerBold}>Part :</Text> Participation{"   "}
                <Text style={s.footerBold}>T.H.C :</Text> Travaux Hors Classe{"   "}
                <Text style={s.footerBold}>Disc :</Text> Discipline / Comportement
              </Text>
            </View>
          )}

          {/* Page number */}
          {pages.length > 1 && (
            <Text
              style={{ fontSize: 7, color: C.muted, textAlign: "right", marginTop: 4 }}
            >
              Page {pageIdx + 1} / {pages.length}
            </Text>
          )}
        </Page>
      ))}
    </Document>
  );
}

// ── Export function ───────────────────────────────────────────────────────────

export async function downloadGradingSheetPdf(
  data: MassarData,
  config: GradingSheetConfig
): Promise<void> {
  const doc = <GradingSheetDocument data={data} config={config} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `feuille-de-notes-${config.classe || "classe"}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
