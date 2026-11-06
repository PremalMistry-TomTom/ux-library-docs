/**
 * Offline: a map region going into storage. A deep drawer, open at the top,
 * a finger pull on its front; above it a region of the map hangs in the air,
 * cut into nine tiles, each a thin plate with its piece of the streets on it.
 * At rest the region floats, gently uneven, and one tile, the near corner, is
 * already half into the drawer, the first one downloaded, carrying the bright
 * edge. The pointer over the drawer picks a tile by where it is: that tile
 * drops in first and takes the bright edge, and the tiles round it follow,
 * staggered by their distance from it; those beyond the reach stay up. Let
 * go, they rise back to the region. The slider is the reach, in tiles.
 *
 * The pattern: one of many, a spread. A tween per tile, the delay its
 * distance from the chosen one. The hit test is the drawer's rim plane, which
 * never moves, so a tile falling past the pointer cannot change the choice.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

// the tiles: N × N cells of T, a gap between; the drawer round them, WH deep, its floor FL up
const N = 3, T = 24, GAP = 2, E = (N * T + (N - 1) * GAP) / 2, TT = 1.6;
const M = 2, WT = 2.4, WH = 9, FL = 1.5, X0 = -E - M - WT, X1 = E + M + WT, WR = 6;
// the region's rest heights, a shallow swell; the near corner, tile 9, already half in
const UP = [33, 35, 34, 32, 35, 33, 30, 32, WH - 2.5], HALF = N * N - 1, STEP = 50;
// the streets, in the region's own plane: [x0, y0, x1, y1]
const STREETS = [[-E, -25, E, -25], [-E, 3, E, 3], [-E, 28, E, 28], [-27, -E, -27, E], [-3, -E, -3, E], [24, -E, 24, E]];
// the main road, two kerbs running across the region on the diagonal
const ROAD = [-4.5, 4.5].map((c) => [-E - 20, c + E + 20, c + E + 20, -E - 20]);

/** A segment clipped to a box, or null. */
function clip([x0, y0, x1, y1], [a0, b0, a1, b1]) {
  let t0 = 0, t1 = 1;
  const dx = x1 - x0, dy = y1 - y0;
  for (const [p, q] of [[-dx, x0 - a0], [dx, a1 - x0], [-dy, y0 - b0], [dy, b1 - y0]]) {
    if (p === 0) { if (q < 0) return null; continue; }
    const r = q / p;
    if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
  }
  return t0 < t1 ? [[x0 + dx * t0, y0 + dy * t0], [x0 + dx * t1, y0 + dy * t1]] : null;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[X0, X0, 0], [X1, X1, 0], [X1, X0, 0], [X0, X1, 0], [-E, -E, 35 + TT], [E, -E, 35 + TT], [-E, E, 35 + TT]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, X0, X1, X1, WR, 6), inner = rrect(X0 + WT, X0 + WT, X1 - WT, X1 - WT, WR - WT, 6);

  const g = mk("g", {}, svg);
  // the drawer's far half: its body, the rim's inner edge, the floor seam along the far walls
  mk("path", { class: "sil", d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))) }, g);
  mk("path", { class: "nf", d: poly(ringAt(P, inner, WH)) }, g);
  mk("path", { class: "nf lo", d: open(ringAt(P, run(inner, (q) => !front(q)), FL)) }, g);

  // the tiles, far to near by their cells, which never overlap
  const load = mk("g", {}, g);
  const tiles = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x0 = -E + c * (T + GAP), y0 = -E + r * (T + GAP), box = [x0, y0, x0 + T, y0 + T];
    const grp = mk("g", {}, load), el = solid(grp), map = mk("path", { class: "nf lo" }, grp), road = mk("path", { class: "nf" }, grp);
    const cut = (ss) => ss.map((s) => clip(s, [x0 + 1.4, y0 + 1.4, x0 + T - 1.4, y0 + T - 1.4])).filter(Boolean);
    const segs = cut(STREETS), kerbs = cut(ROAD);
    tiles.push({ i: tiles.length, r, c, box, ring: rings(...box, 2, 1), el, map, road, segs, kerbs, z: tween(UP[tiles.length]), drawn: NaN, grp });
  }
  [...tiles].sort((a, b) => a.r + a.c - b.r - b.c).forEach((t) => load.appendChild(t.grp));

  // the drawer's near half, over the tiles in it: one opaque piece from the rim's inner edge down, and a finger pull
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { class: "fo", d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]) }, g);
  mk("path", { class: "nf lo", d: open(oT) }, g);
  mk("path", { class: "nf", d: open(iF) }, g);
  mk("path", { class: "nf sil", d: open([oT[0], ...oB, oT[oT.length - 1]]) }, g);
  const onFront = (ring) => ring.map((q) => P(q.u, X1, q.v));
  mk("path", { class: "nf", d: poly(onFront(rrect(-12, 2.5, 12, 7, 2.2, 5))) }, g);
  mk("path", { class: "nf lo", d: poly(onFront(rrect(-10.4, 3.7, 10.4, 5.8, 1, 5))) }, g);

  function draw(t, z) {
    if (z === t.drawn) return;
    t.drawn = z;
    put(t.el, prism(P, front, t.ring[0], t.ring[1], z, z + TT));
    const lines = (ss) => ss.map((s) => open(s.map(([x, y]) => P(x, y, z + TT)))).join("");
    t.map.setAttribute("d", lines(t.segs));
    t.road.setAttribute("d", lines(t.kerbs));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tiles) { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : HALF;
    act = a;
    const at = tiles[from];
    tiles.forEach((t) => {
      const d = Math.hypot(t.r - at.r, t.c - at.c);
      tset(t.z, a < 0 ? UP[t.i] : d <= reach ? FL : UP[t.i] + 2, now, d * STEP);
      t.el.sil.classList.toggle("hi", t.i === (a < 0 ? HALF : a));
    });
    read.textContent = a < 0 ? "rest" : `tile ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On the drawer's rim plane: the cell under the pointer, or -1 off the drawer. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], WH);
    if (x < X0 || x > X1 || y < X0 || y > X1) return -1;
    const cell = (v) => clamp(Math.floor((v + E + GAP / 2) / (T + GAP)), 0, N - 1);
    return cell(y) * N + cell(x);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 0.5, 3); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "offline",
  means: "A map region over an open drawer: the tile under the pointer drops in first, the ones round it after, staggered by distance.",
  rules: [1, 2, 4, 6],
  range: [0.9, 1.5, 3],
  tour: [[279, 180], [121, 180], [200, 141], null],
  mount,
});
