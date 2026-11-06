/**
 * Générateur de motif POINTILLÉ en SVG pour les lettres françaises — MONO-TRAIT.
 * ------------------------------------------------------------------------------
 * Chaque lettre est tracée par UN SEUL trait central (la ligne médiane), comme
 * l'écriture à la main dans le cahier — et non par le contour (deux lignes).
 *
 * Principe (précis, sans courbes dessinées à la main) :
 *   1. Les tracés viennent des polices HERSHEY (domaine public), où chaque
 *      glyphe est déjà une suite de polylignes = le geste de la plume.
 *      Voir `hershey-data.ts` (données exactes issues des fichiers .jhf).
 *   2. On assemble ces polylignes en chemins SVG `<path>`.
 *   3. On transforme chaque trait continu en pointillés avec `stroke-dasharray`
 *      combiné à `stroke-linecap:round` : un tiret de longueur ~0 sous une
 *      terminaison ronde devient un point rond de diamètre = `stroke-width`.
 *
 * Le pas des points (distance centre-à-centre le long du trait) est piloté au
 * pixel près par `dottedDashArray`, isolée et testable.
 */

import {
  HERSHEY_FONTS,
  HERSHEY_BASELINE,
  ACCENTS,
  DECOMPOSITION,
  MAX_ACCENT_H,
  type HersheyFontKey,
} from "./hershey-data";
import { MARELLE } from "./marelle-data";

/* ─────────────────────────── Conversion stroke-dasharray ─────────────────── */

export interface DashArray {
  /** Longueur du tiret « allumé » — quasi nulle : produit un point rond. */
  dash: number;
  /** Longueur du vide entre deux points. */
  gap: number;
  /** Chaîne prête pour la propriété CSS / l'attribut `stroke-dasharray`. */
  value: string;
}

/**
 * Convertit un diamètre de point + un espacement en une valeur `stroke-dasharray`.
 *
 * La période du motif (distance centre-à-centre) vaut exactement `spacingPx` :
 *     période = dash + gap = spacingPx
 * Le tiret vaut une infime valeur epsilon (pas 0, pour un rendu fiable partout) ;
 * avec `stroke-linecap:round`, chaque tiret devient un disque plein de diamètre
 * `dotDiameterPx` (= la valeur de `stroke-width`).
 *
 * @param dotDiameterPx  Diamètre visuel de chaque point (= stroke-width).
 * @param spacingPx      Distance centre-à-centre entre deux points consécutifs.
 */
export function dottedDashArray(dotDiameterPx: number, spacingPx: number): DashArray {
  if (!(dotDiameterPx > 0)) {
    throw new RangeError(`dotDiameterPx doit être > 0 (reçu : ${dotDiameterPx})`);
  }
  if (!(spacingPx > 0)) {
    throw new RangeError(`spacingPx doit être > 0 (reçu : ${spacingPx})`);
  }
  const dash = Math.max(0.01, dotDiameterPx * 0.001);
  const gap = Math.max(0.01, spacingPx - dash);
  return { dash: round(dash), gap: round(gap), value: `${round(dash)} ${round(gap)}` };
}

/* ─────────────────────────────── Générateur SVG ─────────────────────────── */

export interface DottedStrokeOptions {
  /** Le texte (lettres/mot) à rendre en pointillés mono-trait. */
  text: string;
  /** Style d'écriture. "script" = bâton détaché ; "cursive"/"cursiveRound" = attachée. Défaut : "script". */
  font?: HersheyFontKey;
  /** Taille : pixels par unité de glyphe (facteur d'échelle). Défaut : 6 (≈ 126 px de hauteur de capitale). */
  unitPx?: number;
  /** Diamètre de chaque point (= stroke-width) en px. Défaut : proportionnel (≈ unitPx × 0.3). */
  dotDiameterPx?: number;
  /** Distance centre-à-centre entre points en px. Défaut : proportionnel (≈ unitPx × 0.62). */
  dotSpacingPx?: number;
  /** Couleur des points. Défaut : "#9AA3AF" (gris doux, discret à tracer). */
  color?: string;
  /**
   * Espacement supplémentaire entre lettres, en unités de glyphe.
   * Défaut : 3 pour "script", 0 pour les cursives (pour que les lettres se lient).
   */
  letterSpacingUnits?: number;
  /** Largeur d'une espace, en unités de glyphe. Défaut : 10. */
  wordSpacingUnits?: number;
  /** Afficher les lignes-guides d'écriture (interligne). Défaut : true. */
  showGuides?: boolean;
  /** Marge intérieure gauche/droite (px). Défaut : 30. */
  paddingXPx?: number;
  /** Marge intérieure haut/bas (px). Défaut : 24. */
  paddingYPx?: number;
}

export interface DottedStrokeResult {
  /** Fragment SVG complet. */
  svg: string;
  /** La valeur `stroke-dasharray` appliquée. */
  dashArray: DashArray;
  /** Largeur totale du cadre SVG (px). */
  widthPx: number;
  /** Hauteur totale du cadre SVG (px). */
  heightPx: number;
  /** Ordonnée de la ligne de base (px). */
  baselineY: number;
  /** Nombre de caractères ignorés (absents de la police). */
  skipped: number;
}

/* Repère vertical Hershey (unités glyphe, y vers le bas), voir hershey-data.ts. */
const CAP_TOP_G = -12;   // haut des capitales / hampes
const X_TOP_G = -5;      // haut de la hauteur d'x
const DESC_BOTTOM_G = 16; // bas des jambages
const ACCENT_GAP_G = 1;  // espace entre le sommet de la lettre et l'accent
// Zone réservée au-dessus de la ligne des capitales pour loger un accent
// (même sur une MAJUSCULE accentuée : É, Ê…), afin de ne rien rogner.
const ACCENT_ZONE_G = ACCENT_GAP_G + MAX_ACCENT_H + 0.6;
const TOP_EXTENT_G = CAP_TOP_G - ACCENT_ZONE_G;

// Densité des points par défaut, en fraction de la taille de lettre (unitPx).
// ≈ calé sur unitPx 11 → diamètre 3.2 px, espacement 7 px (rendu dense lisible).
const DOT_DIAMETER_RATIO = 0.3;
const DOT_SPACING_RATIO = 0.62;

/**
 * Construit un fragment SVG où `text` apparaît en lettres MONO-TRAIT pointillées,
 * posées sur une ligne d'écriture, prêtes à être tracées par l'enfant.
 */
export function buildDottedStrokeSvg(options: DottedStrokeOptions): DottedStrokeResult {
  const font = options.font ?? "script";
  const unit = options.unitPx ?? 6;
  // Diamètre et espacement des points PROPORTIONNELS à la taille des lettres :
  // la densité (points par longueur de trait) reste constante à toute échelle.
  // Sinon, à petite taille, les courbes cursives se lisent comme des « traits
  // cassés » faute de points. Facteurs calés sur un rendu dense et lisible.
  const dotDiameterPx = options.dotDiameterPx ?? round(unit * DOT_DIAMETER_RATIO);
  const dotSpacingPx = options.dotSpacingPx ?? round(unit * DOT_SPACING_RATIO);
  const color = options.color ?? "#9AA3AF";
  const letterSpacingUnits =
    options.letterSpacingUnits ?? (font === "script" ? 3 : 0);
  const wordSpacingUnits = options.wordSpacingUnits ?? 10;
  const showGuides = options.showGuides ?? true;
  const padX = options.paddingXPx ?? 30;
  const padY = options.paddingYPx ?? 24;

  const glyphs = HERSHEY_FONTS[font];
  if (!glyphs) throw new RangeError(`Police inconnue : ${font}`);

  const dashArray = dottedDashArray(dotDiameterPx, dotSpacingPx);

  // Métriques verticales en pixels. On réserve la zone des accents au-dessus
  // de la ligne des capitales pour que É/Ê… ne soient jamais rognés.
  const ascPx = (HERSHEY_BASELINE - TOP_EXTENT_G) * unit;   // au-dessus de la base
  const descPx = (DESC_BOTTOM_G - HERSHEY_BASELINE) * unit; // sous la base
  const baselineY = padY + ascPx;
  const heightPx = Math.round(baselineY + descPx + padY);

  // Conversion (unités glyphe) -> pixels.
  const toY = (yg: number) => baselineY + (yg - HERSHEY_BASELINE) * unit;

  const subpaths: string[] = [];
  let penX = padX;
  let skipped = 0;

  const pushStroke = (pts: Array<[number, number]>) => {
    if (pts.length === 0) return;
    subpaths.push(strokeToSmoothPath(pts));
  };

  for (const ch of Array.from(options.text)) {
    if (ch === " ") {
      penX += wordSpacingUnits * unit;
      continue;
    }

    const decomp = DECOMPOSITION[ch];
    const baseChar = decomp ? decomp[0] : ch;
    const glyph = glyphs[baseChar.charCodeAt(0)];

    if (!glyph) {
      skipped++;
      continue;
    }

    // Origine telle que la borne gauche du glyphe tombe sur penX.
    const originX = penX - glyph.l * unit;

    // Sur i/j accentués, on retire le point du glyphe (le « titre ») : il
    // ferait doublon avec l'accent (î, ï). Le titre est le trait entièrement
    // situé au-dessus de la hauteur d'x.
    const dropTittle =
      !!decomp && (baseChar === "i" || baseChar === "j");

    // Traits du glyphe de base.
    let glyphTopG = Infinity;
    for (const stroke of glyph.s) {
      if (dropTittle && stroke.every(([, yg]) => yg < X_TOP_G)) continue;
      const pts: Array<[number, number]> = [];
      for (const [xg, yg] of stroke) {
        if (yg < glyphTopG) glyphTopG = yg;
        pts.push([originX + xg * unit, toY(yg)]);
      }
      pushStroke(pts);
    }
    if (!isFinite(glyphTopG)) glyphTopG = X_TOP_G;

    // Accent éventuel, centré sur le glyphe, posé au-dessus (ou cédille dessous).
    if (decomp) {
      const kind = decomp[1];
      const centerX = originX + ((glyph.l + glyph.r) / 2) * unit;
      const topPx = toY(glyphTopG - ACCENT_GAP_G);
      for (const stroke of ACCENTS[kind]) {
        const pts: Array<[number, number]> = stroke.map(([ax, ay]) =>
          kind === "cedilla"
            ? [centerX + ax * unit, baselineY + ay * unit]
            : [centerX + ax * unit, topPx + ay * unit]
        );
        pushStroke(pts);
      }
    }

    penX += (glyph.r - glyph.l) * unit + letterSpacingUnits * unit;
  }

  const widthPx = Math.round(penX + padX);

  // Lignes-guides d'écriture (cahier) : haut / médiane / base / bas.
  let guides = "";
  if (showGuides) {
    const x1 = padX;
    const x2 = widthPx - padX;
    const line = (y: number, strong: boolean, dashed: boolean) =>
      `<line x1="${x1}" y1="${round(y)}" x2="${x2}" y2="${round(y)}" ` +
      `stroke="${strong ? "#C7CDD6" : "#E3E7ED"}" stroke-width="${strong ? 1.2 : 1}"` +
      (dashed ? ` stroke-dasharray="4 5"` : "") + ` />`;
    guides =
      `<g class="guides">` +
      line(toY(CAP_TOP_G), false, true) +
      line(toY(X_TOP_G), false, true) +
      line(toY(HERSHEY_BASELINE), true, false) +
      line(toY(DESC_BOTTOM_G), false, true) +
      `</g>`;
  }

  const path =
    `<path d="${subpaths.join(" ")}" fill="none" stroke="${escapeXml(color)}" ` +
    `stroke-width="${dotDiameterPx}" stroke-linecap="round" stroke-linejoin="round" ` +
    `stroke-dasharray="${dashArray.value}" />`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}" ` +
    `viewBox="0 0 ${widthPx} ${heightPx}" role="img" ` +
    `aria-label="Lettres à tracer : ${escapeXml(options.text)}">` +
    guides +
    path +
    `</svg>`;

  return { svg, dashArray, widthPx, heightPx, baselineY, skipped };
}

/* ───────────────────── Cursive authentique (police Marelle) ──────────────────
 * Rend le texte en écriture cursive scolaire française AUTHENTIQUE, à partir des
 * axes médians extraits de la police Marelle (SIL OFL) — voir marelle-data.ts.
 * Un seul trait central par lettre, liaisons cursives d'origine, puis pointillés.
 */

export interface DottedCursiveOptions {
  /** Le texte à rendre en cursive pointillée. */
  text: string;
  /** Hauteur d'x en pixels (pilote la taille globale). Défaut : 60. */
  xHeightPx?: number;
  /** Diamètre de chaque point (px). Défaut : proportionnel (≈ xHeight × 0.06). */
  dotDiameterPx?: number;
  /** Espacement centre-à-centre des points (px). Défaut : proportionnel (≈ xHeight × 0.12). */
  dotSpacingPx?: number;
  /** Couleur des points. Défaut : "#9AA3AF". */
  color?: string;
  /** Largeur d'une espace, en cadratins (× em). Défaut : 0.32. */
  wordSpacingEm?: number;
  /** Afficher les lignes-guides (cahier). Défaut : true. */
  showGuides?: boolean;
  /** Marge horizontale (px). Défaut : 30. */
  paddingXPx?: number;
  /** Marge verticale (px). Défaut : 24. */
  paddingYPx?: number;
}

export interface DottedCursiveResult {
  svg: string;
  dashArray: DashArray;
  widthPx: number;
  heightPx: number;
  baselineY: number;
  /** Caractères absents de la police. */
  skipped: number;
}

/**
 * Construit un fragment SVG où `text` apparaît en CURSIVE scolaire française
 * (police Marelle), en un seul trait central pointillé, prêt à tracer.
 */
export function buildDottedCursiveSvg(options: DottedCursiveOptions): DottedCursiveResult {
  const xHeightPx = options.xHeightPx ?? 60;
  const color = options.color ?? "#9AA3AF";
  const wordSpacingEm = options.wordSpacingEm ?? 0.32;
  const showGuides = options.showGuides ?? true;
  const padX = options.paddingXPx ?? 30;
  const padY = options.paddingYPx ?? 24;
  const dotDiameterPx = options.dotDiameterPx ?? round(xHeightPx * 0.06);
  const dotSpacingPx = options.dotSpacingPx ?? round(xHeightPx * 0.12);

  const { metrics, glyphs, unitsPerEm } = MARELLE;
  // Échelle : la hauteur d'x (|xTop|) occupe xHeightPx.
  const scale = xHeightPx / Math.abs(metrics.xTop);
  const dashArray = dottedDashArray(dotDiameterPx, dotSpacingPx);

  const topExtent = -Math.min(metrics.capTop, metrics.ascTop); // magnitude au-dessus de la base
  const baselineY = padY + topExtent * scale;
  const heightPx = Math.round(baselineY + metrics.descBottom * scale + padY);
  const toY = (y: number) => baselineY + y * scale;

  const subpaths: string[] = [];
  let penX = padX;
  let skipped = 0;

  for (const ch of Array.from(options.text)) {
    if (ch === " ") { penX += wordSpacingEm * unitsPerEm * scale; continue; }
    const glyph = glyphs[ch.charCodeAt(0)];
    if (!glyph) { skipped++; continue; }
    for (const stroke of glyph.s) {
      const pts: Array<[number, number]> = stroke.map(([x, y]) => [penX + x * scale, toY(y)]);
      if (pts.length) subpaths.push(strokeToSmoothPath(pts));
    }
    penX += glyph.adv * scale;
  }

  const widthPx = Math.round(penX + padX);

  let guides = "";
  if (showGuides) {
    const x1 = padX, x2 = widthPx - padX;
    const line = (y: number, strong: boolean, dashed: boolean) =>
      `<line x1="${x1}" y1="${round(y)}" x2="${x2}" y2="${round(y)}" ` +
      `stroke="${strong ? "#C7CDD6" : "#E3E7ED"}" stroke-width="${strong ? 1.2 : 1}"` +
      (dashed ? ` stroke-dasharray="4 5"` : "") + ` />`;
    guides =
      `<g class="guides">` +
      line(toY(metrics.capTop), false, true) +
      line(toY(metrics.xTop), false, true) +
      line(toY(metrics.baseline), true, false) +
      line(toY(metrics.descBottom), false, true) +
      `</g>`;
  }

  const path =
    `<path d="${subpaths.join(" ")}" fill="none" stroke="${escapeXml(color)}" ` +
    `stroke-width="${dotDiameterPx}" stroke-linecap="round" stroke-linejoin="round" ` +
    `stroke-dasharray="${dashArray.value}" />`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}" ` +
    `viewBox="0 0 ${widthPx} ${heightPx}" role="img" ` +
    `aria-label="Écriture cursive à tracer : ${escapeXml(options.text)}">` +
    guides + path + `</svg>`;

  return { svg, dashArray, widthPx, heightPx, baselineY, skipped };
}

/* ────────────────────────── Lissage des tracés ──────────────────────────────
 * Les glyphes Hershey sont des POLYLIGNES (petits segments droits) qui
 * approximent les courbes -> à l'œil, les lettres paraissent « facettées ».
 * On convertit chaque polyligne en une COURBE LISSE (spline de Catmull-Rom
 * transformée en Béziers cubiques) passant exactement par tous les points,
 * tout en PRÉSERVANT les angles vraiment aigus (sommets de M, N, V, W, z,
 * chapeau du circonflexe…). Les points pointillés se posent ensuite sur cette
 * courbe lisse, d'où un unique trait courbe et non des segments droits.
 */

type Pt = [number, number];

/** En dessous de cet angle intérieur (degrés), un sommet est un angle « dur ». */
const CORNER_ANGLE_DEG = 100;

function strokeToSmoothPath(pts: Pt[]): string {
  const n = pts.length;
  if (n === 1) {
    const [x, y] = pts[0];
    // Un trait de longueur nulle -> un point (linecap round).
    return `M${round(x)},${round(y)}L${round(x)},${round(y)}`;
  }
  if (n === 2) {
    return `M${round(pts[0][0])},${round(pts[0][1])}L${round(pts[1][0])},${round(pts[1][1])}`;
  }

  // Tracé fermé ? (premier point ≈ dernier)
  const closed = dist(pts[0], pts[n - 1]) < 0.01;
  const P: Pt[] = closed ? pts.slice(0, n - 1) : pts;
  const m = P.length;

  const at = (i: number): Pt => {
    if (closed) return P[((i % m) + m) % m];
    return P[Math.max(0, Math.min(m - 1, i))];
  };

  const isCorner = (i: number): boolean => {
    if (!closed && (i <= 0 || i >= m - 1)) return false; // extrémités d'un trait ouvert
    const a = sub(at(i - 1), at(i));
    const b = sub(at(i + 1), at(i));
    return angleDeg(a, b) < CORNER_ANGLE_DEG;
  };

  let d = `M${round(at(0)[0])},${round(at(0)[1])}`;
  const segCount = closed ? m : m - 1;
  for (let i = 0; i < segCount; i++) {
    const p0 = at(i);
    const p1 = at(i + 1);
    const pPrev = at(i - 1);
    const pNext = at(i + 2);
    // Tangentes de Catmull-Rom (tension 0.5 -> facteur 1/6).
    let c1: Pt = [p0[0] + (p1[0] - pPrev[0]) / 6, p0[1] + (p1[1] - pPrev[1]) / 6];
    let c2: Pt = [p1[0] - (pNext[0] - p0[0]) / 6, p1[1] - (pNext[1] - p0[1]) / 6];
    // Angle dur : on n'arrondit pas de part et d'autre du sommet.
    if (isCorner(i)) c1 = p0;
    if (isCorner(i + 1)) c2 = p1;
    d += `C${round(c1[0])},${round(c1[1])} ${round(c2[0])},${round(c2[1])} ${round(p1[0])},${round(p1[1])}`;
  }
  if (closed) d += "Z";
  return d;
}

function sub(a: Pt, b: Pt): Pt {
  return [a[0] - b[0], a[1] - b[1]];
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/** Angle (en degrés, 0–180) entre deux vecteurs partant d'un même sommet. */
function angleDeg(a: Pt, b: Pt): number {
  const la = Math.hypot(a[0], a[1]);
  const lb = Math.hypot(b[0], b[1]);
  if (la === 0 || lb === 0) return 180;
  let c = (a[0] * b[0] + a[1] * b[1]) / (la * lb);
  c = Math.max(-1, Math.min(1, c));
  return (Math.acos(c) * 180) / Math.PI;
}

/* ─────────────────────────────── Utilitaires ────────────────────────────── */

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;"
    : c === "<" ? "&lt;"
    : c === ">" ? "&gt;"
    : c === '"' ? "&quot;"
    : "&apos;"
  );
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
