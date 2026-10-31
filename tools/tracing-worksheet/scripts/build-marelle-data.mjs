/**
 * Génère `lib/marelle-data.ts` : les CENTERLINES (axes médians) des glyphes de la
 * police Marelle (écriture cursive scolaire française, SIL OFL — voir
 * fonts/Marelle-OFL-LICENSE.txt), extraites par squelettisation.
 *
 * Pipeline (JS pur, hors-ligne, exécuté une seule fois) :
 *   police outline -> rastérisation -> amincissement Zhang-Suen -> tracé du
 *   squelette -> simplification -> coordonnées en unités-em (y vers le bas,
 *   ligne de base = 0). Le rendu pointillé se fait ensuite dans dotted-svg.ts.
 *
 * Dépendance de build uniquement : `npm i opentype.js`.
 * Usage : node build-marelle-data.mjs <chemin Marelle-Regular.ttf> <sortie .ts>
 *
 * NB licence OFL : les données ci-dessous DÉRIVENT de « Marelle » (nom réservé) ;
 * on conserve l'attribution et la licence, et on n'en fait pas une police au même
 * nom réservé — ce sont des données de tracé, créditées.
 */
import { loadFont, pathToContours, rasterize, thin, traceSkeleton, simplify } from "./skeleton.mjs";
import { writeFileSync } from "fs";

const RASTER_FONT_SIZE = 300; // résolution de squelettisation (px)
const SIMPLIFY_EPS = 1.2;     // Douglas-Peucker en px
const PRUNE_MIN_PX = 11;      // supprime les débris de jonction plus courts que ça

const [, , TTF, OUT] = process.argv;
const font = loadFont(TTF);
const upm = font.unitsPerEm;
const K = upm / RASTER_FONT_SIZE; // px -> unités em

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const plen = (p) => { let s = 0; for (let i = 0; i + 1 < p.length; i++) s += dist(p[i], p[i + 1]); return s; };

function glyphCenterlines(ch) {
  const g = font.charToGlyph(ch);
  const adv = Math.round(g.advanceWidth);
  const path = g.getPath(0, 0, RASTER_FONT_SIZE); // baseline à y=0, y vers le bas
  const contours = pathToContours(path, 14);
  if (contours.length === 0) return { adv, s: [] };

  const { grid, W, H } = rasterize(contours, RASTER_FONT_SIZE, 6);
  // transformée utilisée par rasterize (pour revenir aux coords du chemin)
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const c of contours) for (const [x, y] of c) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const scale = RASTER_FONT_SIZE / (maxY - minY), pad = 6;

  const sk = thin(grid, W, H);
  let polys = traceSkeleton(sk, W, H)
    .map((p) => p.map(([x, y]) => [(x - pad) / scale + minX, (y - pad) / scale + minY]))
    .map((p) => simplify(p, SIMPLIFY_EPS))
    .filter((p) => plen(p) > PRUNE_MIN_PX);

  // -> unités em, y vers le bas, ligne de base = 0 (déjà le cas), arrondi entier
  const s = polys.map((p) => p.map(([x, y]) => [Math.round(x * K), Math.round(y * K)]));
  return { adv, s };
}

function topUnits(ch) { const b = font.charToGlyph(ch).getBoundingBox(); return -b.y2; } // y-down
function botUnits(ch) { const b = font.charToGlyph(ch).getBoundingBox(); return -b.y1; }

const metrics = {
  baseline: 0,
  xTop: Math.round(topUnits("x")),
  capTop: Math.round(topUnits("H")),
  ascTop: Math.round(topUnits("l")),
  descBottom: Math.round(botUnits("g")),
};

const CHARS =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  "àâäçéèêëîïôöùûüÿœæ" +
  "ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŒÆ" +
  ".,;:!?'-()";

const glyphs = {};
let missing = [];
for (const ch of CHARS) {
  const g = font.charToGlyph(ch);
  if (!g || g.index === 0) { missing.push(ch); continue; }
  glyphs[ch.charCodeAt(0)] = glyphCenterlines(ch);
}

const body = JSON.stringify({ unitsPerEm: upm, metrics, glyphs });

const ts = `/**
 * Centerlines (axes médians) de la police MARELLE — écriture cursive scolaire
 * française. Généré par scripts/build-marelle-data.mjs (squelettisation).
 * NE PAS ÉDITER À LA MAIN.
 *
 * Source : police « Marelle » v1.005, © 2026 Ministère de l'Éducation nationale
 * (France), Laurent Bourcellier, Jonathan Fabreguettes, Rosalie Wagner —
 * SIL Open Font License 1.1 (voir fonts/Marelle-OFL-LICENSE.txt).
 * Ces données sont une ŒUVRE DÉRIVÉE (axes extraits) et ne constituent pas la
 * police « Marelle » (nom réservé) ; l'attribution et la licence sont conservées.
 *
 * Coordonnées : unités-em (unitsPerEm=${upm}), y vers le BAS, ligne de base = 0.
 * Chaque glyphe : { adv, s } — adv = chasse ; s = traits (polylignes [x,y]).
 */

export interface MarelleGlyph {
  /** Chasse (avance horizontale) en unités-em, joints cursifs inclus. */
  adv: number;
  /** Traits : chaque trait est une polyligne de points [x, y] (axe médian). */
  s: number[][][];
}

export interface MarelleMetrics {
  baseline: number;
  /** Haut de la hauteur d'x (y négatif). */
  xTop: number;
  /** Haut des capitales. */
  capTop: number;
  /** Haut des hampes (ascendantes). */
  ascTop: number;
  /** Bas des jambages (descendantes). */
  descBottom: number;
}

export interface MarelleData {
  unitsPerEm: number;
  metrics: MarelleMetrics;
  glyphs: Record<number, MarelleGlyph>;
}

export const MARELLE: MarelleData = ${body} as unknown as MarelleData;
`;

writeFileSync(OUT, ts);
console.log("wrote", OUT, ts.length, "bytes; glyphs:", Object.keys(glyphs).length, "; missing:", missing.join("") || "(none)");
console.log("metrics:", JSON.stringify(metrics));
