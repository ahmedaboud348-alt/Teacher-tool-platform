import type { MassarData, MassarMeta, GradingSheetConfig } from "../types";

/**
 * Shared HTML building blocks for the grading-sheet ("ورقة التنقيط") layout.
 * Reused by both the standalone grading-sheet PDF and the grade-book PDF
 * (which stacks one sheet per class behind a cover page).
 *
 * Values are interpolated as-is: the /api PDF route HTML-escapes every
 * user-supplied string before the builder runs.
 */

export type SheetConfig = Pick<
  GradingSheetConfig,
  "evalCount" | "showActivites" | "showObservation"
>;

/** Crisp vector science emblem — no external asset, prints sharp in B&W. */
export const ATOM_SVG = `
<svg viewBox="0 0 48 48" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="22.5" fill="#FFFFFF" stroke="#C8960C" stroke-width="2"/>
  <g fill="none" stroke="#1A3055" stroke-width="1.6">
    <ellipse cx="24" cy="24" rx="14" ry="6"/>
    <ellipse cx="24" cy="24" rx="14" ry="6" transform="rotate(60 24 24)"/>
    <ellipse cx="24" cy="24" rx="14" ry="6" transform="rotate(120 24 24)"/>
  </g>
  <circle cx="24" cy="24" r="3.4" fill="#1A3055"/>
</svg>`;

/** Color scheme for the sheet. All schemes keep dark headers + light rows so
 *  the table stays clearly legible when printed in black & white. */
export type SheetScheme = {
  ink: string;      // primary dark (table header, banner)
  ink2: string;     // secondary dark (sub-header row)
  line: string;     // accent line / label / dot
  row: string;      // even-row tint
  subTxt: string;   // sub-header text on ink2
  goldLt: string;   // light accent (banner Arabic)
  bannerSub: string;
};

export const NAVY_SCHEME: SheetScheme = {
  ink: "#1A3055", ink2: "#234D7A", line: "#2E6DA4",
  row: "#EEF3F8", subTxt: "#C8DDEF", goldLt: "#F5E6C0", bannerSub: "#93B8D8",
};

/** Feminine rose/plum scheme — dark plum headers still print well in B&W. */
export const ROSE_SCHEME: SheetScheme = {
  ink: "#6A4351", ink2: "#815566", line: "#9B6576",
  row: "#F7EEF1", subTxt: "#E7CFD7", goldLt: "#F3E3D8", bannerSub: "#C9A2AE",
};

export function sheetCss(s: SheetScheme = NAVY_SCHEME): string {
  return `
  .sheet-official {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px;
  }
  .sheet-official .side { width: 38%; text-align: center; line-height: 1.45; }
  .sheet-official .emblem { width: 46px; height: 46px; }
  .sheet-official .ar { font-size: 8.5px; color: #3D5A6E; }
  .sheet-official .ar-b { font-size: 9px; font-weight: 700; color: ${s.ink}; }
  .sheet-official .fr { font-size: 8.5px; color: #3D5A6E; }
  .sheet-official .fr-b { font-size: 9px; font-weight: 700; color: ${s.ink}; }

  .sheet-banner {
    background: ${s.ink}; border-radius: 5px; padding: 8px 6px;
    text-align: center; margin-bottom: 0;
  }
  .sheet-banner .b-fr { font-size: 16px; font-weight: 900; color: #FFFFFF; letter-spacing: .5px; }
  .sheet-banner .b-ar { font-size: 14px; font-weight: 700; color: ${s.goldLt}; }
  .sheet-banner .b-sub { font-size: 8px; color: ${s.bannerSub}; margin-top: 1px; }
  .sheet-goldbar { height: 3px; background: #C8960C; margin-bottom: 8px; }

  .sheet-info {
    display: flex; border: 1px solid #8FA8BB; border-radius: 4px;
    margin-bottom: 8px; overflow: hidden;
  }
  .sheet-info .cell {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 6px 9px; border-left: 1px solid #AABDCC;
  }
  .sheet-info .cell:first-child { border-left: none; }
  .sheet-info .lbl { font-size: 9px; font-weight: 700; color: ${s.line}; }
  .sheet-info .val { font-size: 9.5px; font-weight: 700; color: #0D1117; }

  table.sheet-tbl {
    width: 100%; border-collapse: collapse; table-layout: fixed;
    border: 1px solid #8FA8BB;
  }
  table.sheet-tbl col.c-num   { width: 30px; }
  table.sheet-tbl col.c-act   { width: 38px; }
  table.sheet-tbl col.c-total { width: 48px; }
  table.sheet-tbl col.c-eval  { width: 52px; }
  table.sheet-tbl col.c-obs   { width: 130px; }

  table.sheet-tbl thead { display: table-header-group; }
  table.sheet-tbl th {
    background: ${s.ink}; color: #FFFFFF; font-weight: 900; font-size: 9.5px;
    text-align: center; padding: 4px 2px; border: 0.75px solid ${s.line};
    line-height: 1.2;
  }
  table.sheet-tbl th.sub { background: ${s.ink2}; color: ${s.subTxt}; font-weight: 700; font-size: 8px; }
  table.sheet-tbl th.h-total { color: #C8960C; border-left: 1.5px solid #C8960C; border-right: 1.5px solid #C8960C; }

  table.sheet-tbl td {
    border: 0.75px solid #AABDCC; height: 22px; font-size: 9px;
    padding: 0 4px;
  }
  table.sheet-tbl td.t-num  { text-align: center; color: #3D5A6E; font-weight: 700; }
  table.sheet-tbl td.t-name { text-align: right; direction: rtl; color: #0D1117; font-weight: 700; font-size: 11px; }
  table.sheet-tbl td.t-total { background: #FFF8E6; border-left: 1.5px solid #C8960C; border-right: 1.5px solid #C8960C; }
  table.sheet-tbl tbody tr:nth-child(even) td { background: ${s.row}; }
  table.sheet-tbl tbody tr:nth-child(even) td.t-total { background: #FBEFC9; }
  table.sheet-tbl tbody tr { page-break-inside: avoid; }

  /* keep the legend glued to the last table rows — never orphan it on its own page */
  .sheet-legend { margin-top: 8px; display: flex; gap: 16px; flex-wrap: wrap;
    break-before: avoid; page-break-before: avoid; break-inside: avoid; }
  .sheet-legend .item { display: flex; align-items: center; gap: 4px; }
  .sheet-legend .dot { width: 5px; height: 5px; border-radius: 2px; background: ${s.line}; }
  .sheet-legend .b { font-size: 8.5px; font-weight: 700; color: ${s.ink}; }
  .sheet-legend .t { font-size: 8.5px; color: #3D5A6E; }
`;
}

export function officialHeaderHtml(meta: MassarMeta): string {
  const arExtra = [
    meta.academy ? `<div class="ar">${meta.academy}</div>` : "",
    meta.school ? `<div class="ar-b">${meta.school}</div>` : "",
  ].join("");
  const frExtra = [
    meta.term ? `<div class="fr">Période : ${meta.term}</div>` : "",
    meta.subject ? `<div class="fr-b">${meta.subject}</div>` : "",
  ].join("");
  return `
  <div class="sheet-official">
    <div class="side">
      <div class="ar-b">المملكة المغربية</div>
      <div class="ar">وزارة التربية الوطنية</div>
      <div class="ar">والتعليم الأولي والرياضة</div>
      ${arExtra}
    </div>
    <div class="emblem">${ATOM_SVG}</div>
    <div class="side">
      <div class="fr-b">Royaume du Maroc</div>
      <div class="fr">Ministère de l'Éducation</div>
      <div class="fr">Nationale et du Préscolaire</div>
      ${frExtra}
    </div>
  </div>`;
}

export function bannerHtml(): string {
  return `
  <div class="sheet-banner">
    <div class="b-fr">FEUILLE DE NOTES</div>
    <div class="b-ar">ورقة التنقيط</div>
    <div class="b-sub">Contrôle Continu — Activités Intégrées</div>
  </div>
  <div class="sheet-goldbar"></div>`;
}

export function infoStripHtml(o: { prof: string; classe: string; niveau: string; annee: string }): string {
  return `
  <div class="sheet-info">
    <div class="cell"><span class="lbl">Prof :</span><span class="val">${o.prof || "-"}</span></div>
    <div class="cell"><span class="lbl">Classe :</span><span class="val">${o.classe || "-"}</span></div>
    <div class="cell"><span class="lbl">Niveau :</span><span class="val">${o.niveau || "-"}</span></div>
    <div class="cell"><span class="lbl">Année :</span><span class="val">${o.annee || "-"}</span></div>
  </div>`;
}

export function sheetTableHtml(students: MassarData["students"], config: SheetConfig): string {
  const { evalCount, showActivites, showObservation } = config;

  const cols = [
    `<col class="c-num"/>`,
    `<col/>`, // name — absorbs remaining width
    ...(showActivites ? Array(4).fill(`<col class="c-act"/>`) : []),
    `<col class="c-total"/>`,
    ...Array(evalCount).fill(`<col class="c-eval"/>`),
    ...(showObservation ? [`<col class="c-obs"/>`] : []),
  ].join("");

  const actGroupHead = showActivites
    ? `<th colspan="4">Activités Intégrées /20</th>`
    : "";
  const evalGroupHead = `<th colspan="${evalCount}">Évaluations /20</th>`;
  const obsHead = showObservation ? `<th rowspan="2">Observation</th>` : "";

  const actSubHead = showActivites
    ? `<th class="sub">Part.<br/>/5</th><th class="sub">T.H.C<br/>/5</th><th class="sub">Cahier<br/>/5</th><th class="sub">Disc.<br/>/5</th>`
    : "";
  const evalSubHead = Array.from({ length: evalCount }, (_, i) => `<th class="sub">CC ${i + 1}</th>`).join("");

  const head = `
    <thead>
      <tr>
        <th rowspan="2">N°</th>
        <th rowspan="2">Nom et Prénom</th>
        ${actGroupHead}
        <th rowspan="2" class="h-total">Total<br/>/20</th>
        ${evalGroupHead}
        ${obsHead}
      </tr>
      <tr>
        ${actSubHead}
        ${evalSubHead}
      </tr>
    </thead>`;

  const actCells = showActivites ? `<td></td><td></td><td></td><td></td>` : "";
  const evalCells = Array(evalCount).fill(`<td></td>`).join("");
  const obsCell = showObservation ? `<td></td>` : "";

  const rows = students
    .map(
      (st) => `
      <tr>
        <td class="t-num">${st.index}</td>
        <td class="t-name">${st.name}</td>
        ${actCells}
        <td class="t-total"></td>
        ${evalCells}
        ${obsCell}
      </tr>`
    )
    .join("");

  return `<table class="sheet-tbl"><colgroup>${cols}</colgroup>${head}<tbody>${rows}</tbody></table>`;
}

export function legendHtml(config: SheetConfig): string {
  if (!config.showActivites) return "";
  return `
  <div class="sheet-legend">
    <div class="item"><span class="dot"></span><span class="b">Part. :</span><span class="t">Participation</span></div>
    <div class="item"><span class="dot"></span><span class="b">T.H.C :</span><span class="t">Travaux Hors Classe</span></div>
    <div class="item"><span class="dot"></span><span class="b">Disc. :</span><span class="t">Discipline / Comportement</span></div>
  </div>`;
}
