// Extraction de centerline (skeleton) depuis une police outline — JS pur.
import * as ot from "opentype.js";

export function loadFont(path) {
  return ot.loadSync ? ot.loadSync(path) : null;
}

// Flatten une commande de chemin opentype en contours [ [ [x,y], ... ], ... ]
export function pathToContours(path, steps = 16) {
  const contours = [];
  let cur = null;
  let sx = 0, sy = 0, cx = 0, cy = 0;
  const cubic = (x1, y1, x2, y2, x, y) => {
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, mt = 1 - t;
      const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
      cur.push([a * cx + b * x1 + c * x2 + d * x, a * cy + b * y1 + c * y2 + d * y]);
    }
    cx = x; cy = y;
  };
  const quad = (x1, y1, x, y) => {
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, mt = 1 - t;
      const a = mt * mt, b = 2 * mt * t, c = t * t;
      cur.push([a * cx + b * x1 + c * x, a * cy + b * y1 + c * y]);
    }
    cx = x; cy = y;
  };
  for (const cmd of path.commands) {
    if (cmd.type === "M") { cur = [[cmd.x, cmd.y]]; contours.push(cur); sx = cx = cmd.x; sy = cy = cmd.y; }
    else if (cmd.type === "L") { cur.push([cmd.x, cmd.y]); cx = cmd.x; cy = cmd.y; }
    else if (cmd.type === "C") cubic(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    else if (cmd.type === "Q") quad(cmd.x1, cmd.y1, cmd.x, cmd.y);
    else if (cmd.type === "Z") { if (cur && (cur[0][0] !== cx || cur[0][1] !== cy)) cur.push([sx, sy]); }
  }
  return contours;
}

// Rasterise (remplissage non-zero) des contours dans une grille binaire.
// Retourne {grid, W, H, ox, oy, scale} où pixel(px,py)=1 si intérieur.
export function rasterize(contours, targetH = 340, pad = 6) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of contours) for (const [x, y] of c) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const scale = targetH / (maxY - minY);
  const W = Math.ceil((maxX - minX) * scale) + pad * 2;
  const H = Math.ceil((maxY - minY) * scale) + pad * 2;
  const ox = minX, oy = minY;
  const tx = (x) => (x - ox) * scale + pad;
  const ty = (y) => (y - oy) * scale + pad;
  // edges
  const edges = [];
  for (const c of contours) {
    for (let i = 0; i + 1 < c.length; i++) {
      edges.push([tx(c[i][0]), ty(c[i][1]), tx(c[i + 1][0]), ty(c[i + 1][1])]);
    }
  }
  const grid = new Uint8Array(W * H);
  for (let py = 0; py < H; py++) {
    const yc = py + 0.5;
    // intersections with winding direction
    const xs = [];
    for (const [x0, y0, x1, y1] of edges) {
      if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) {
        const t = (yc - y0) / (y1 - y0);
        const x = x0 + t * (x1 - x0);
        xs.push([x, y1 > y0 ? 1 : -1]);
      }
    }
    xs.sort((a, b) => a[0] - b[0]);
    let wind = 0;
    for (let i = 0; i < xs.length - 1; i++) {
      wind += xs[i][1];
      if (wind !== 0) {
        const xa = Math.ceil(xs[i][0] - 0.5);
        const xb = Math.floor(xs[i + 1][0] - 0.5);
        for (let px = Math.max(0, xa); px <= Math.min(W - 1, xb); px++) grid[py * W + px] = 1;
      }
    }
  }
  return { grid, W, H, ox, oy, scale, pad };
}

// Amincissement Zhang-Suen -> squelette 1px.
export function thin(gridIn, W, H) {
  const g = gridIn.slice();
  const idx = (x, y) => y * W + x;
  let changed = true;
  const P = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : g[idx(x, y)]);
  while (changed) {
    changed = false;
    for (let step = 0; step < 2; step++) {
      const del = [];
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        if (!g[idx(x, y)]) continue;
        const p2 = P(x, y - 1), p3 = P(x + 1, y - 1), p4 = P(x + 1, y),
          p5 = P(x + 1, y + 1), p6 = P(x, y + 1), p7 = P(x - 1, y + 1),
          p8 = P(x - 1, y), p9 = P(x - 1, y - 1);
        const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (B < 2 || B > 6) continue;
        const seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        let A = 0; for (let k = 0; k < 8; k++) if (seq[k] === 0 && seq[k + 1] === 1) A++;
        if (A !== 1) continue;
        if (step === 0) { if (p2 * p4 * p6 !== 0) continue; if (p4 * p6 * p8 !== 0) continue; }
        else { if (p2 * p4 * p8 !== 0) continue; if (p2 * p6 * p8 !== 0) continue; }
        del.push(idx(x, y));
      }
      if (del.length) { changed = true; for (const i of del) g[i] = 0; }
    }
  }
  return g;
}

// Trace le squelette en polylignes. Classement des pixels par CROSSING NUMBER
// (nombre de transitions 0->1 autour du pixel) : robuste aux « escaliers » de la
// 8-connexité, contrairement au simple comptage de voisins.
export function traceSkeleton(g, W, H) {
  const idx = (x, y) => y * W + x;
  const ring = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const P = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : g[idx(x, y)]);
  const nbrs = (x, y) => {
    const out = [];
    for (const [dx, dy] of ring) { const nx = x + dx, ny = y + dy; if (P(nx, ny)) out.push([nx, ny]); }
    return out;
  };
  const crossing = (x, y) => {
    let c = 0;
    for (let k = 0; k < 8; k++) {
      const [ax, ay] = ring[k], [bx, by] = ring[(k + 1) % 8];
      if (P(x + ax, y + ay) === 0 && P(x + bx, y + by) === 1) c++;
    }
    return c;
  };
  const pix = [];
  const cn = new Map();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[idx(x, y)]) {
    pix.push([x, y]); cn.set(idx(x, y), crossing(x, y));
  }
  const isNode = (x, y) => cn.get(idx(x, y)) !== 2; // extrémité(1) ou jonction(>=3)

  const usedEdge = new Set();
  const ekey = (a, b) => (a < b ? a + "_" + b : b + "_" + a);
  const polylines = [];

  // Prochain pixel : arête non utilisée, la plus alignée avec la direction courante.
  const pickNext = (x, y, px, py) => {
    const opts = nbrs(x, y).filter(([nx, ny]) => !usedEdge.has(ekey(idx(x, y), idx(nx, ny))));
    if (opts.length === 0) return null;
    if (px === null) return opts[0];
    const dirx = x - px, diry = y - py, dl = Math.hypot(dirx, diry) || 1;
    let best = null, bestScore = -Infinity;
    for (const [nx, ny] of opts) {
      const vx = nx - x, vy = ny - y, vl = Math.hypot(vx, vy) || 1;
      const score = (dirx * vx + diry * vy) / (dl * vl);
      if (score > bestScore) { bestScore = score; best = [nx, ny]; }
    }
    return best;
  };

  // Marche qui TRAVERSE les jonctions en suivant la continuation la plus droite
  // (comme le geste de la plume) ; s'arrête faute d'arête libre.
  const walkFrom = (sx, sy) => {
    let x = sx, y = sy, px = null, py = null;
    const line = [[x, y]];
    while (true) {
      const nxt = pickNext(x, y, px, py);
      if (!nxt) break;
      const [nx, ny] = nxt;
      usedEdge.add(ekey(idx(x, y), idx(nx, ny)));
      line.push([nx, ny]);
      px = x; py = y; x = nx; y = ny;
    }
    return line;
  };
  const hasFreeEdge = (x, y) => nbrs(x, y).some(([nx, ny]) => !usedEdge.has(ekey(idx(x, y), idx(nx, ny))));

  // 1) Depuis les extrémités (crossing == 1) : donne les longs traits continus.
  for (const [x, y] of pix) {
    if (cn.get(idx(x, y)) !== 1) continue;
    if (hasFreeEdge(x, y)) { const l = walkFrom(x, y); if (l.length > 1) polylines.push(l); }
  }
  // 2) Depuis les jonctions restantes (crossing >= 3).
  for (const [x, y] of pix) {
    if (cn.get(idx(x, y)) < 3) continue;
    while (hasFreeEdge(x, y)) { const l = walkFrom(x, y); if (l.length > 1) polylines.push(l); }
  }
  // 3) Boucles pures (aucune extrémité ni jonction, ex. « o ») : refermer.
  for (const [x, y] of pix) {
    if (hasFreeEdge(x, y)) { const l = walkFrom(x, y); if (l.length > 1) { l.push([x, y]); polylines.push(l); } }
  }
  return polylines;
}

// Simplification Douglas-Peucker.
export function simplify(points, eps = 1.2) {
  if (points.length < 3) return points;
  const d2 = (p, a, b) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
    const dx = x2 - x1, dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return (x - x1) ** 2 + (y - y1) ** 2;
    let t = ((x - x1) * dx + (y - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + t * dx, py = y1 + t * dy;
    return (x - px) ** 2 + (y - py) ** 2;
  };
  const rec = (pts, s, e, out) => {
    let maxD = 0, idx = -1;
    for (let i = s + 1; i < e; i++) { const d = d2(pts[i], pts[s], pts[e]); if (d > maxD) { maxD = d; idx = i; } }
    if (maxD > eps * eps) { rec(pts, s, idx, out); out.push(pts[idx]); rec(pts, idx, e, out); }
  };
  const out = [points[0]];
  rec(points, 0, points.length - 1, out);
  out.push(points[points.length - 1]);
  return out;
}
