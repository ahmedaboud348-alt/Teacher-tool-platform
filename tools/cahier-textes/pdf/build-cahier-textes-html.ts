import type { CahierTextesConfig, CTLevel, MassarData } from "../types";
import { COVER_MALE, COVER_FEMALE } from "../../grade-book/pdf/cover-images";
import { COVER_L, pick } from "../../grading-sheet/pdf/labels";
import { HOLIDAYS, YEAR_LABEL } from "../../daily-attendance/calendar";

/**
 * "دفتر النصوص" (Cahier de textes): the official register where the teacher
 * logs what was actually taught each session. A decorative image cover, then
 * the file is split BY LEVEL (usually two); each level carries its classes'
 * student rosters (auto-fillable from Massar) followed by blank lesson-log
 * pages. Fully bilingual — one `lang` flag chosen up front switches everything.
 */

type L = { ar: string; fr: string };
const t = (m: L, lang: "ar" | "fr") => (lang === "fr" ? m.fr : m.ar);

const LB = {
  level:       { ar: "المستوى", fr: "Niveau" },
  classes:     { ar: "الأقسام", fr: "Classes" },
  class:       { ar: "القسم", fr: "Classe" },
  date:        { ar: "التاريخ", fr: "Date" },
  activities:  { ar: "الأنشطة المنجزة", fr: "Activités réalisées" },
  logTitle:    { ar: "سجل الدروس والأنشطة المنجزة", fr: "Journal des séances" },
  dirNotes:    { ar: "ملاحظات السيد المدير", fr: "Observations du Directeur" },
  inspNotes:   { ar: "ملاحظات السيد المفتش", fr: "Observations de l'Inspecteur" },
  // roster
  rNum:        { ar: "ر.ت", fr: "N°" },
  rName:       { ar: "اسم التلميذ", fr: "Nom de l'élève" },
  rBirth:      { ar: "تاريخ الازدياد", fr: "Date de naissance" },
  rPrev:       { ar: "المستوى السابق", fr: "Niveau précédant" },
  rDiag:       { ar: "نقطة التقويم التشخيصي", fr: "Évaluation diagnostique" },
  count:       { ar: "عدد التلاميذ", fr: "Nombre d'élèves" },
  boys:        { ar: "الذكور", fr: "Garçons" },
  girls:       { ar: "الإناث", fr: "Filles" },
  studentsList:{ ar: "لائحة التلاميذ", fr: "Liste des élèves" },
  // cards
  personalCard:{ ar: "البطاقة الشخصية", fr: "Fiche personnelle" },
  proCard:     { ar: "البطاقة المهنية", fr: "Fiche professionnelle" },
  photo:       { ar: "الصورة", fr: "Photo" },
  // holidays
  holTitle:    { ar: "جدول العطل المدرسية والدينية", fr: "Calendrier des vacances et congés" },
  hName:       { ar: "العطلة", fr: "Congé / Vacances" },
  hFrom:       { ar: "من", fr: "Du" },
  hTo:         { ar: "إلى", fr: "Au" },
  hDur:        { ar: "المدة (أيام)", fr: "Durée (jours)" },
  // structure
  structTitle: { ar: "البنية التربوية العامة للمؤسسة", fr: "Structure pédagogique de l'établissement" },
  sLevels:     { ar: "المستويات", fr: "Niveaux" },
  sClasses:    { ar: "عدد الأقسام", fr: "Nb classes" },
  sTotal:      { ar: "المجموع", fr: "Total" },
  assigned:    { ar: "الأقسام المسندة", fr: "Classes assignées" },
  hoursDone:   { ar: "الساعات المنجزة", fr: "Heures effectuées" },
  hoursExtra:  { ar: "الساعات الإضافية", fr: "Heures supplémentaires" },
  timetable:   { ar: "جدول الحصص", fr: "Emploi du temps" },
  daysCol:     { ar: "الأيام", fr: "Jours" },
  sigProf:     { ar: "توقيع الأستاذ(ة)", fr: "Signature de l'enseignant(e)" },
  sigDir:      { ar: "توقيع السيد المدير", fr: "Signature du Directeur" },
  sigInsp:     { ar: "توقيع السيد المفتش", fr: "Signature de l'Inspecteur" },
  // index (sommaire)
  indexTitle:  { ar: "الفهرس", fr: "Sommaire" },
  idxSection:  { ar: "المحتوى", fr: "Section" },
  idxPage:     { ar: "الصفحة", fr: "Page" },
  guideTitle:  { ar: "دليل الأقسام", fr: "Répartition des classes" },
  secCards:    { ar: "البطاقة الشخصية والمهنية", fr: "Fiches personnelle et professionnelle" },
  secHolidays: { ar: "جدول العطل المدرسية والدينية", fr: "Calendrier des vacances et congés" },
  secLeaves:   { ar: "جدول الرخص", fr: "Congés du personnel" },
  secStructure:{ ar: "البنية التربوية وجدول الحصص", fr: "Structure et emploi du temps" },
  secLevel:    { ar: "المستوى", fr: "Niveau" },
  classesCol:  { ar: "الأقسام", fr: "Classes" },
  // leaves
  leaveTitle:  { ar: "جدول الرخص الطبية والشخصية", fr: "Congés médicaux et personnels" },
  leaveType:   { ar: "نوع الرخصة", fr: "Type de congé" },
  obs:         { ar: "ملاحظات", fr: "Observations" },
} as const;

// [ar, fr, wide?] — wide fields span both grid columns.
const PERSONAL: [string, string, boolean?][] = [
  ["الاسم", "Nom"], ["النسب", "Prénom"], ["تاريخ الازدياد", "Date de naissance"],
  ["مكان الازدياد", "Lieu de naissance"],
  ["رقم البطاقة الوطنية", "N° CIN"], ["رقم الهاتف", "Téléphone"],
  ["العنوان", "Adresse", true], ["البريد الإلكتروني", "Email", true],
];
const PRO: [string, string, boolean?][] = [
  ["المهمة", "Fonction"], ["التخصص", "Spécialité"], ["الإطار", "Cadre"],
  ["رقم التأجير", "N° de paie (SOM)"], ["السلم", "Échelle"], ["الدرجة", "Grade"],
  ["الرتبة", "Échelon"], ["مركز التكوين", "Centre de formation", true],
];
const DAYS: [string, string][] = [
  ["الاثنين", "Lundi"], ["الثلاثاء", "Mardi"], ["الأربعاء", "Mercredi"],
  ["الخميس", "Jeudi"], ["الجمعة", "Vendredi"], ["السبت", "Samedi"],
];
const SLOTS = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"];
const HOL_FR: Record<string, string> = {
  "الفترة البينية الأولى": "1ère période intermédiaire", "عيد الوحدة": "Fête de l'Unité",
  "ذكرى المسيرة الخضراء": "Marche Verte", "عيد الاستقلال": "Fête de l'Indépendance",
  "الفترة البينية الثانية": "2ème période intermédiaire", "فاتح السنة الميلادية": "Nouvel An",
  "ذكرى تقديم وثيقة الاستقلال": "Manifeste de l'Indépendance", "رأس السنة الأمازيغية": "Nouvel An Amazigh",
  "عطلة منتصف السنة": "Vacances de mi-année", "عيد الفطر": "Aïd Al-Fitr",
  "الفترة البينية الثالثة": "3ème période intermédiaire", "عيد الشغل": "Fête du Travail",
  "الفترة البينية الرابعة": "4ème période intermédiaire", "عيد الأضحى": "Aïd Al-Adha",
  "فاتح محرم": "1er Moharram",
};

export function buildCahierTextesHtml(config: CahierTextesConfig): string {
  const lang = config.lang;
  const dir = lang === "fr" ? "ltr" : "rtl";
  const coverDir = lang === "fr" ? "ltr" : "rtl";

  const coverImg = config.coverVariant === "female" ? COVER_FEMALE : COVER_MALE;
  const coverBg = coverImg
    ? `background-image:url('${coverImg}');background-size:cover;background-position:center;`
    : "background:#FBF7F2;";
  const theme = config.coverVariant === "female"
    ? { ink: "#6A4351", sub: "#8A6472", accent: "#BE9A55" }
    : { ink: "#1E2A44", sub: "#46587A", accent: "#B0893C" };

  const g = config.coverVariant === "female"
    ? { ink: "#6A4351", ink2: "#815566", line: "#9B6576", row: "#F9F1F4", goldLt: "#F3E3D8" }
    : { ink: "#1A3055", ink2: "#234D7A", line: "#2E6DA4", row: "#F1F6FB", goldLt: "#F5E6C0" };
  // Refined palette for the premium look.
  const isF = config.coverVariant === "female";
  const cardBorder = isF ? "#DBC6CF" : "#BFCDDD";
  const headTint  = isF ? "#F0E1E8" : "#E4EBF4";
  const headText  = g.ink;
  const cellBorder = isF ? "#E4D2DA" : "#CFDBE7";
  const side = lang === "fr" ? "left" : "right";

  const flourish =
    `<svg width="210" height="14" viewBox="0 0 210 14" xmlns="http://www.w3.org/2000/svg">` +
    `<line x1="14" y1="7" x2="86" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<line x1="124" y1="7" x2="196" y2="7" stroke="${theme.accent}" stroke-width="1.3"/>` +
    `<path d="M105 1 L112 7 L105 13 L98 7 Z" fill="${theme.accent}"/>` +
    `<circle cx="14" cy="7" r="1.8" fill="${theme.accent}"/>` +
    `<circle cx="196" cy="7" r="1.8" fill="${theme.accent}"/></svg>`;

  // ── Shared premium UI helpers ──
  const sv = (p: string) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICONS = {
    list: sv(`<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.1" fill="#fff" stroke="none"/><circle cx="4" cy="12" r="1.1" fill="#fff" stroke="none"/><circle cx="4" cy="18" r="1.1" fill="#fff" stroke="none"/>`),
    calendar: sv(`<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>`),
    building: sv(`<path d="M4 21V6l8-3 8 3v15"/><path d="M3 21h18M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10.5 21v-3h3v3"/>`),
    grid: sv(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>`),
    book: sv(`<path d="M5 4a1 1 0 0 1 1-1h13v18H6a1 1 0 0 1-1-1z"/><path d="M8 7h8M8 11h8M8 15h5"/>`),
    leaf: sv(`<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 8v6M9 11h6"/>`),
    journal: sv(`<path d="M4 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M8 8h8M8 12h8M8 16h5"/>`),
  };
  const secHd = (icon: string, title: string) =>
    `<div class="sec-hd"><span class="sec-ic">${icon}</span><span class="sec-tt">${title}</span></div>`;
  const chip = (label: string, value = "") =>
    `<span class="chip"><b>${label}</b>${value ? ` ${value}` : ""}</span>`;

  const directorateLine = config.directorate ? `<div class="r3">${config.directorate}</div>` : "";
  const teacherLabel = config.coverVariant === "female" ? pick(COVER_L.teacherF, lang) : pick(COVER_L.teacherM, lang);
  const teacher = config.prof || "..........................";
  const year = config.annee || "..................";
  const subjectLine = config.subject ? `<div class="layer cv-subject">${config.subject}</div>` : "";
  const teacherTop = config.coverVariant === "female" ? "55%" : "59%";
  const yearTop = config.coverVariant === "female" ? "63%" : "69%";

  // ── Student roster (per class) ──
  const rosterHtml = (cls: MassarData): string => {
    const rows = cls.students
      .map(
        (st) => `
      <tr>
        <td class="r-num">${st.index}</td>
        <td class="r-name">${st.name}</td>
        <td></td>
      </tr>`
      )
      .join("");
    return `
    <div class="ct-page">
      <div class="info-band">
        ${chip(t(LB.class, lang) + ":", cls.meta.className || cls.meta.level || "")}
        ${chip(t(LB.count, lang) + ":", String(cls.students.filter((s) => s.name.trim()).length || ""))}
        ${chip(t(LB.boys, lang) + ":")}
        ${chip(t(LB.girls, lang) + ":")}
      </div>
      <div class="card-wrap">
        ${secHd(ICONS.list, t(LB.studentsList, lang))}
        <table class="roster-tbl">
          <colgroup><col class="c-rn"/><col/><col class="c-rd"/></colgroup>
          <thead><tr>
            <th>${t(LB.rNum, lang)}</th><th>${t(LB.rName, lang)}</th>
            <th>${t(LB.rBirth, lang)}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
  };

  // ── Lesson-log page (blank) ──
  const emptyRows = (n: number): string =>
    Array.from({ length: n }, () => `<tr><td class="l-date"></td><td class="l-class"></td><td class="l-act"></td></tr>`).join("");

  const subj = config.subject || "";
  const logPage = (levelName: string, className = ""): string => `
    <div class="ct-page ct-logpage">
      <div class="info-band">
        ${chip(t(LB.level, lang) + ":", levelName || "")}
        ${className ? chip(t(LB.class, lang) + ":", className) : ""}
        ${subj ? chip(pick(COVER_L.subjectLabel, lang) + ":", subj) : ""}
      </div>
      <div class="card-wrap logcard">
        ${secHd(ICONS.journal, t(LB.logTitle, lang))}
        <table class="log-tbl">
          <colgroup><col class="c-date"/><col class="c-cls"/><col/></colgroup>
          <thead><tr>
            <th>${t(LB.date, lang)}</th><th>${t(LB.class, lang)}</th><th>${t(LB.activities, lang)}</th>
          </tr></thead>
          <tbody>${emptyRows(28)}</tbody>
        </table>
      </div>
      <div class="ct-notes">
        <div class="note-box"><div class="note-lbl">${t(LB.dirNotes, lang)}</div></div>
        <div class="note-box"><div class="note-lbl">${t(LB.inspNotes, lang)}</div></div>
      </div>
    </div>`;

  // ── Level divider with a generated decorative background ──
  // A full-page Moroccan-style rosette rendered as vector art (embedded as a
  // data URI), harmonised with the cover theme and varied per level so each
  // level gets a distinct backdrop.
  const dividerSvg = (i: number): string => {
    const petals = [8, 12, 16, 10][i % 4];
    const cx = 105, cy = 118, R = 54;
    let g = "";
    for (let k = 0; k < petals; k++) {
      const a = (360 / petals) * k;
      g += `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="${R}" transform="rotate(${a} ${cx} ${cy})" fill="none" stroke="${theme.accent}" stroke-width="0.5" opacity="0.4"/>`;
    }
    const rings = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${theme.ink}" stroke-width="0.6" opacity="0.22"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="none" stroke="${theme.accent}" stroke-width="0.4" opacity="0.35"/>`
      + `<circle cx="${cx}" cy="${cy}" r="15" fill="none" stroke="${theme.accent}" stroke-width="0.9" opacity="0.5"/>`
      + `<circle cx="${cx}" cy="${cy}" r="4" fill="${theme.accent}" opacity="0.5"/>`;
    const corner = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 22 Q0 0 22 0" fill="none" stroke="${theme.accent}" stroke-width="0.9" opacity="0.6"/><path d="M0 15 Q0 6 9 6 Q0 6 0 15" fill="${theme.accent}" opacity="0.3"/></g>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297">`
      + `<rect width="210" height="297" fill="#FCFBF8"/>`
      + `<rect x="9" y="9" width="192" height="279" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6"/>`
      + `<rect x="12" y="12" width="186" height="273" fill="none" stroke="${theme.accent}" stroke-width="0.4" opacity="0.45"/>`
      + g + rings
      + corner(18, 18, 0) + corner(192, 18, 90) + corner(192, 279, 180) + corner(18, 279, 270)
      + `</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  };
  const makeDivider = (kicker: string, title: string, i: number): string => `
    <div class="ct-divider" style="background-image:url('${dividerSvg(i)}')">
      <div class="dv-flourish">${flourish}</div>
      ${kicker ? `<div class="dv-title">${kicker}</div>` : ""}
      <div class="dv-name">${title}</div>
      <div class="dv-flourish">${flourish}</div>
    </div>`;
  const levelDivider = (lv: CTLevel, i: number): string => makeDivider(t(LB.level, lang), lv.name || "", i);
  // Section separator page (decorative, matches the level dividers).
  let secDivN = 0;
  const secDiv = (enabled: boolean, title: string): string =>
    enabled && config.showSectionDividers ? makeDivider("", title, secDivN++) : "";

  // ── Personal + professional cards ──
  const ICON_PERSON = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>`;
  const ICON_BRIEF = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>`;
  const fieldCell = ([ar, fr, wide]: [string, string, boolean?]): string =>
    `<div class="fld2${wide ? " wide" : ""}"><span class="lb">${t({ ar, fr }, lang)}</span><span class="vl"></span></div>`;
  const cardBlock = (title: string, icon: string, fields: [string, string, boolean?][], withPhoto: boolean): string => `
    <div class="card2">
      <div class="card2-head">${icon}<span class="tt">${title}</span></div>
      <div class="card2-goldbar"></div>
      <div class="card2-wrap">
        ${withPhoto ? `<div class="photo"><span>${t(LB.photo, lang)}</span></div>` : ""}
        <div class="card2-grid">${fields.map(fieldCell).join("")}</div>
      </div>
    </div>`;
  const cardsPage = config.showCards ? `
    <div class="ct-page">
      ${cardBlock(t(LB.personalCard, lang), ICON_PERSON, PERSONAL, true)}
      <div style="height:16px"></div>
      ${cardBlock(t(LB.proCard, lang), ICON_BRIEF, PRO, false)}
    </div>` : "";

  // ── Holidays table (auto-filled from the shared school calendar) ──
  const fmtDate = (iso: string): string => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
  const durDays = (a: string, b: string): number => Math.round((Date.parse(b) - Date.parse(a)) / 86400000) + 1;
  const holRows = HOLIDAYS.map(([name, from, to]) => {
    const nm = lang === "fr" ? (HOL_FR[name] || name) : name;
    return `<tr><td class="h-nm">${nm}</td><td class="h-dt">${fmtDate(from)}</td><td class="h-dt">${fmtDate(to)}</td><td class="h-du">${durDays(from, to)}</td></tr>`;
  }).join("");
  const holidaysPage = config.showHolidays ? `
    <div class="ct-page ct-fillpage">
      <div class="card-wrap fillcard">
        ${secHd(ICONS.calendar, `${t(LB.holTitle, lang)} — <span style="direction:ltr;unicode-bidi:isolate">${YEAR_LABEL}</span>`)}
        <table class="grid-tbl fill-tbl">
          <colgroup><col/><col class="c-hd"/><col class="c-hd"/><col class="c-hu"/></colgroup>
          <thead><tr><th>${t(LB.hName, lang)}</th><th>${t(LB.hFrom, lang)}</th><th>${t(LB.hTo, lang)}</th><th>${t(LB.hDur, lang)}</th></tr></thead>
          <tbody>${holRows}</tbody>
        </table>
      </div>
    </div>` : "";

  // ── School structure + timetable + signatures ──
  const structRows = config.levels.map((lv) =>
    `<tr><td class="s-lv">${lv.name || ""}</td><td>${lv.classes.length || ""}</td><td></td><td></td><td></td><td></td></tr>`
  ).join("");
  const allClasses = config.levels.flatMap((lv) => lv.classes.map((c) => c.meta.className || lv.name));
  const assignedRows = (allClasses.length ? allClasses : [""]).map((cn) =>
    `<tr><td class="s-lv">${cn}</td><td></td><td></td><td></td><td></td></tr>`
  ).join("");
  const slotHead = SLOTS.map((s) => `<th class="tt-slot">${s}</th>`).join("");
  const ttRows = DAYS.map(([ar, fr]) =>
    `<tr><td class="tt-day">${lang === "fr" ? fr : ar}</td>${SLOTS.map(() => `<td></td>`).join("")}</tr>`
  ).join("");
  const structurePage = config.showStructure ? `
    <div class="ct-page">
      <div class="card-wrap" style="margin-bottom:13px">
        ${secHd(ICONS.building, t(LB.structTitle, lang))}
        <table class="grid-tbl">
          <thead><tr>
            <th>${t(LB.sLevels, lang)}</th><th>${t(LB.sClasses, lang)}</th><th>${t(LB.count, lang)}</th>
            <th>${t(LB.boys, lang)}</th><th>${t(LB.girls, lang)}</th><th>${t(LB.sTotal, lang)}</th>
          </tr></thead>
          <tbody>${structRows}</tbody>
        </table>
      </div>
      <div class="card-wrap" style="margin-bottom:13px">
        ${secHd(ICONS.list, t(LB.assigned, lang))}
        <table class="grid-tbl">
          <thead><tr>
            <th>${t(LB.assigned, lang)}</th><th>${t(LB.count, lang)}</th><th>${t(LB.hoursDone, lang)}</th>
            <th>${t(LB.hoursExtra, lang)}</th><th>${t(LB.sTotal, lang)}</th>
          </tr></thead>
          <tbody>${assignedRows}</tbody>
        </table>
      </div>
      <div class="card-wrap">
        ${secHd(ICONS.grid, t(LB.timetable, lang))}
        <table class="grid-tbl tt-tbl">
          <thead><tr><th class="tt-day">${t(LB.daysCol, lang)}</th>${slotHead}</tr></thead>
          <tbody>${ttRows}</tbody>
        </table>
      </div>
      <div class="sig-row">
        <div class="sig-box"><div class="sig-lbl">${t(LB.sigProf, lang)}</div></div>
        <div class="sig-box"><div class="sig-lbl">${t(LB.sigDir, lang)}</div></div>
        <div class="sig-box"><div class="sig-lbl">${t(LB.sigInsp, lang)}</div></div>
      </div>
    </div>` : "";

  // ── Index / Sommaire + classes guide ──
  const idxRows: string[] = [];
  if (config.showCards) idxRows.push(t(LB.secCards, lang));
  if (config.showHolidays) idxRows.push(t(LB.secHolidays, lang));
  if (config.showLeaves) idxRows.push(t(LB.secLeaves, lang));
  if (config.showStructure) idxRows.push(t(LB.secStructure, lang));
  config.levels.forEach((lv) => idxRows.push(`${t(LB.secLevel, lang)} : ${lv.name || ""}`));
  const sommaireRows = idxRows.map((name, i) =>
    `<tr><td class="idx-n">${i + 1}</td><td class="idx-name">${name}</td><td class="idx-pg"></td></tr>`
  ).join("");
  const guideRows = config.levels.map((lv) => {
    const names = lv.classes.map((c) => c.meta.className || "").filter(Boolean).join("، ") || "—";
    // Count only real (named) students — stays empty in the blank version.
    const count = lv.classes.reduce((sm, c) => sm + c.students.filter((s) => s.name.trim()).length, 0);
    return `<tr><td class="s-lv">${lv.name || ""}</td><td>${lv.classes.length}</td><td>${names}</td><td>${count || ""}</td></tr>`;
  }).join("");
  const indexPage = config.showIndex ? `
    <div class="ct-page">
      <div class="card-wrap" style="margin-bottom:16px">
        ${secHd(ICONS.book, t(LB.indexTitle, lang))}
        <table class="grid-tbl idx-tbl">
          <colgroup><col class="c-idxn"/><col/><col class="c-idxp"/></colgroup>
          <thead><tr><th>#</th><th>${t(LB.idxSection, lang)}</th><th>${t(LB.idxPage, lang)}</th></tr></thead>
          <tbody>${sommaireRows}</tbody>
        </table>
      </div>
      <div class="card-wrap">
        ${secHd(ICONS.list, t(LB.guideTitle, lang))}
        <table class="grid-tbl">
          <thead><tr><th>${t(LB.sLevels, lang)}</th><th>${t(LB.sClasses, lang)}</th><th>${t(LB.classesCol, lang)}</th><th>${t(LB.count, lang)}</th></tr></thead>
          <tbody>${guideRows}</tbody>
        </table>
      </div>
    </div>` : "";

  // ── Leaves table (medical & personal) — fills the page ──
  const leaveEmptyRows = Array.from({ length: 13 }, () =>
    `<tr><td></td><td class="h-dt"></td><td class="h-dt"></td><td class="h-du"></td><td></td></tr>`
  ).join("");
  const leavesPage = config.showLeaves ? `
    <div class="ct-page ct-fillpage">
      <div class="card-wrap fillcard">
        ${secHd(ICONS.leaf, t(LB.leaveTitle, lang))}
        <table class="grid-tbl fill-tbl">
          <colgroup><col class="c-lt"/><col class="c-hd"/><col class="c-hd"/><col class="c-hu"/><col/></colgroup>
          <thead><tr><th>${t(LB.leaveType, lang)}</th><th>${t(LB.hFrom, lang)}</th><th>${t(LB.hTo, lang)}</th><th>${t(LB.hDur, lang)}</th><th>${t(LB.obs, lang)}</th></tr></thead>
          <tbody>${leaveEmptyRows}</tbody>
        </table>
      </div>
    </div>` : "";

  const frontMatter = indexPage
    + secDiv(config.showCards, t(LB.secCards, lang)) + cardsPage
    + secDiv(config.showHolidays, t(LB.secHolidays, lang)) + holidaysPage
    + secDiv(config.showLeaves, t(LB.secLeaves, lang)) + leavesPage
    + secDiv(config.showStructure, t(LB.secStructure, lang)) + structurePage;

  const levelsHtml = config.levels
    .map((lv) => {
      const divider = levelDivider(lv, config.levels.indexOf(lv));
      const rosters = config.showStudentLists ? lv.classes.map(rosterHtml).join("") : "";
      const pages = Math.max(1, lv.logPagesPerClass);
      // "level" → one running log for the whole level (class noted per row);
      // "class" → a dedicated log block per class.
      const logs = config.logSplit === "class" && lv.classes.length > 0
        ? lv.classes.map((c) => Array.from({ length: pages }, () => logPage(lv.name, c.meta.className || "")).join("")).join("")
        : Array.from({ length: pages }, () => logPage(lv.name)).join("");
      return divider + rosters + logs;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 portrait; margin: 0; }
  @page sheet { size: A4 portrait; margin: 10mm 9mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Cairo', sans-serif; color: #0D1117; direction: ${dir};
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ── Cover ── */
  .ct-cover { position: relative; width: 210mm; height: 297mm; overflow: hidden; ${coverBg} }
  .ct-cover .layer { position: absolute; left: 0; right: 0; text-align: center; direction: ${coverDir}; }
  .cv-header { top: 6.5%; }
  .cv-header .r1 { font-size: 18px; font-weight: 800; color: ${theme.ink}; margin-bottom: 6px; }
  .cv-header .r2 { font-size: 12.5px; font-weight: 600; color: ${theme.ink}; margin-bottom: 4px; }
  .cv-header .r3 { font-size: 11px; font-weight: 500; color: ${theme.sub}; }
  .cv-frame { position: absolute; top: 28%; bottom: 46%; left: ${lang === "fr" ? "15%" : "20%"}; right: ${lang === "fr" ? "15%" : "20%"};
    border: 1.4px solid ${theme.accent}; border-radius: 3px; }
  .cv-frame::after { content: ''; position: absolute; inset: 4px; border: 0.7px solid ${theme.accent}; border-radius: 2px; }
  .cv-title { top: 32%; font-family: 'Amiri', serif; font-size: ${lang === "fr" ? "52px" : "62px"}; font-weight: 700;
    color: ${theme.ink}; text-shadow: 0 2px 4px rgba(0,0,0,0.12); }
  .cv-flourish { top: 43.5%; }
  .cv-subject { top: 49%; font-size: 16px; font-weight: 800; color: ${theme.ink}; }
  .cv-teacher { top: ${teacherTop}; }
  .cv-year    { top: ${yearTop}; }
  .cv-teacher .lbl, .cv-year .lbl { font-weight: 600; color: ${theme.sub}; }
  .cv-teacher .lbl { font-size: 17px; }
  .cv-year .lbl { font-size: 16px; }
  .cv-teacher .val, .cv-year .val { font-weight: 800; color: ${theme.ink}; border-bottom: 1.5px solid ${theme.accent}; padding: 0 8px 4px; }
  .cv-teacher .val { font-size: 22px; }
  .cv-year .val { font-size: 20px; direction: ltr; unicode-bidi: isolate; }

  /* ── Inner pages ── */
  .ct-page { page: sheet; page-break-before: always; }

  /* Info chips band (level / subject / class …) */
  .info-band { display: flex; gap: 9px; margin-bottom: 11px; }
  .chip { flex: 1; position: relative; background: #fff; border: 1.2px solid ${cardBorder};
    border-radius: 8px; padding: 9px 13px; padding-${side}: 18px; font-size: 12px; color: ${g.ink}; font-weight: 700; }
  .chip::before { content: ''; position: absolute; ${side}: 0; top: 4px; bottom: 4px; width: 4px;
    background: ${theme.accent}; border-radius: 3px; }
  .chip b { color: ${g.line}; font-weight: 800; }

  /* Section card = dark title band (+gold underline) over a bordered table */
  .card-wrap { border: 1.3px solid ${cardBorder}; border-radius: 10px; overflow: hidden; background: #fff; }
  .sec-hd { position: relative; background: linear-gradient(105deg, ${g.ink} 0%, ${g.ink2} 100%);
    color: #fff; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 11px 14px 13px; }
  .sec-hd::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: ${theme.accent}; }
  .sec-ic { display: flex; align-items: center; }
  .sec-tt { font-size: 14px; font-weight: 900; letter-spacing: .4px; }

  /* Fill pages: the card + its table stretch to fill the sheet */
  .ct-logpage, .ct-fillpage { display: flex; flex-direction: column; height: 277mm; overflow: hidden; }
  .ct-logpage .info-band { flex: 0 0 auto; }
  .ct-logpage .logcard, .ct-fillpage .fillcard { flex: 1 1 auto; display: flex; flex-direction: column; min-height: 0; }
  .ct-logpage .log-tbl, .ct-fillpage .fill-tbl { flex: 1 1 auto; height: 100%; }
  .ct-logpage .ct-notes { flex: 0 0 auto; }

  /* Shared table skeleton */
  table.log-tbl, table.roster-tbl, table.grid-tbl { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.log-tbl thead, table.roster-tbl thead, table.grid-tbl thead { display: table-header-group; }
  table.log-tbl th, table.roster-tbl th, table.grid-tbl th {
    background: ${headTint}; color: ${headText}; font-weight: 800; font-size: 11.5px; text-align: center;
    padding: 8px 3px; border: 0.6px solid ${cellBorder}; border-bottom: 2px solid ${theme.accent}; }
  table.log-tbl td, table.roster-tbl td, table.grid-tbl td {
    border: 0.6px solid ${cellBorder}; text-align: center; vertical-align: middle; }
  table.log-tbl tbody tr:nth-child(even) td, table.roster-tbl tbody tr:nth-child(even) td,
  table.grid-tbl tbody tr:nth-child(even) td { background: ${g.row}; }
  table.log-tbl tbody tr, table.roster-tbl tbody tr, table.grid-tbl tbody tr { page-break-inside: avoid; }

  /* Log columns */
  col.c-date { width: 82px; } col.c-cls { width: 60px; }
  td.l-date, td.l-class, td.l-act { height: 30px; }

  /* Roster */
  col.c-rn { width: 36px; } col.c-rd { width: 112px; }
  table.roster-tbl td { height: 25px; font-size: 10px; }
  td.r-num { text-align: center; color: ${g.line}; font-weight: 700; font-size: 11px; }
  td.r-name { text-align: ${side}; direction: ${dir}; padding: 0 9px; font-weight: 700; font-size: 12px; }

  /* Notes (director / inspector) */
  .ct-notes { display: flex; gap: 11px; margin-top: 10px; break-inside: avoid; page-break-inside: avoid; }
  .ct-notes .note-box { flex: 1; border: 1.2px solid ${cardBorder}; border-radius: 9px; overflow: hidden; min-height: 62px; background: #fff; }
  .ct-notes .note-lbl { background: ${headTint}; color: ${g.ink}; font-weight: 800; font-size: 10.5px;
    text-align: center; padding: 6px; border-bottom: 2px solid ${theme.accent}; }

  /* ── Cards ── */
  .card2 { border: 1.3px solid ${cardBorder}; border-radius: 11px; overflow: hidden; margin: 0 2mm; }
  .card2-head { position: relative; background: linear-gradient(105deg, ${g.ink} 0%, ${g.ink2} 100%); color: #fff;
    display: flex; align-items: center; gap: 9px; padding: 11px 16px 13px; }
  .card2-head .tt { font-size: 14.5px; font-weight: 900; letter-spacing: .3px; }
  .card2-head svg { flex-shrink: 0; }
  .card2-head::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: ${theme.accent}; }
  .card2-goldbar { display: none; }
  .card2-wrap { display: flex; gap: 16px; padding: 18px 20px; align-items: flex-start; }
  .photo { width: 26mm; height: 33mm; border: 1.5px dashed ${theme.accent}; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; text-align: center;
    font-size: 10px; font-weight: 700; color: ${theme.sub}; background: ${g.row}; flex-shrink: 0; }
  .card2-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px 22px; align-content: start; }
  .fld2 { display: flex; flex-direction: column; gap: 6px; }
  .fld2.wide { grid-column: 1 / -1; }
  .fld2 .lb { font-size: 12px; font-weight: 800; color: ${g.ink}; }
  .fld2 .vl { border-bottom: 1.2px dotted #A9B8C6; height: 17px; }

  /* ── Generic grid tables (holidays, structure, timetable, index) ── */
  table.grid-tbl td { height: 26px; font-size: 12px; padding: 0 4px; }
  td.h-nm, td.s-lv { text-align: ${side}; padding: 0 10px; font-weight: 700; font-size: 12.5px; }
  /* index (sommaire) */
  col.c-idxn { width: 36px; } col.c-idxp { width: 92px; } col.c-lt { width: 26%; }
  table.idx-tbl td { height: 30px; }
  td.idx-n { text-align: center; font-weight: 700; color: ${g.line}; font-size: 12px; }
  td.idx-name { text-align: ${side}; padding: 0 14px; font-weight: 700; font-size: 13px; }
  td.idx-pg { border-bottom: 0.75px dotted ${g.line}; }
  td.h-dt { direction: ltr; unicode-bidi: isolate; font-size: 12.5px; } td.h-du { font-weight: 800; color: ${g.line}; font-size: 13px; }
  col.c-hd { width: 92px; } col.c-hu { width: 78px; }
  table.tt-tbl td { height: 34px; } th.tt-slot { font-size: 9px; direction: ltr; unicode-bidi: isolate; }
  td.tt-day { font-weight: 800; background: ${headTint}; color: ${g.ink}; width: 72px; font-size: 11px; }

  .sig-row { display: flex; gap: 11px; margin-top: 15px; }
  .sig-box { flex: 1; border: 1.2px solid ${cardBorder}; border-radius: 9px; overflow: hidden; min-height: 74px; background: #fff; }
  .sig-lbl { background: ${headTint}; color: ${g.ink}; font-weight: 800; font-size: 11px; text-align: center; padding: 7px; border-bottom: 2px solid ${theme.accent}; }

  /* ── Level divider (full-bleed, generated background) ── */
  .ct-divider { page-break-before: always; width: 210mm; height: 297mm; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; background-size: cover; background-position: center; direction: ${dir}; }
  .dv-flourish { margin: 16px 0; }
  .dv-title { font-size: 22px; font-weight: 700; color: ${theme.sub}; margin-bottom: 8px; letter-spacing: 1px; }
  .dv-name { font-family: 'Amiri', serif; font-size: 52px; font-weight: 700; color: ${theme.ink};
    text-shadow: 0 1px 3px rgba(0,0,0,0.1); }
</style>
</head>
<body>

  <div class="ct-cover">
    <div class="cv-frame"></div>
    <div class="layer cv-header">
      <div class="r1">${pick(COVER_L.kingdom, lang)}</div>
      <div class="r2">${pick(COVER_L.ministry, lang)}</div>
      ${directorateLine}
    </div>
    <div class="layer cv-title">${pick(COVER_L.cahierTitle, lang)}</div>
    <div class="layer cv-flourish">${flourish}</div>
    ${subjectLine}
    <div class="layer cv-teacher"><span class="lbl">${teacherLabel}: </span><span class="val">${teacher}</span></div>
    <div class="layer cv-year"><span class="lbl">${pick(COVER_L.yearLabel, lang)}: </span><span class="val">${year}</span></div>
  </div>

  ${frontMatter}
  ${levelsHtml}

</body>
</html>`;
}
