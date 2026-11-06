/**
 * Offline routing: the drawer from Saved Region, open at the top, a finger
 * pull on its front, holding one map tile, the region saved. The tile is a
 * thin plate with its streets on it and the main road crossing it on the
 * diagonal. At rest the tile lies half in the drawer and the route has only
 * started: a start dot and a short bright stub. The pointer over the drawer
 * lifts the tile to the rim and the route draws on across it, along the
 * streets, turn by turn, to the destination dot, bright: a route found with
 * nothing but what is in the drawer. Let go, the tile settles back and the
 * route winds back to its stub. The slider is the lift.
 *
 * The pattern: one of many, with one: a tween for the lift and one for the
 * route, the route drawing after the lift. The hit test is the drawer's rim
 * plane, which never moves, so the tile rising under the pointer cannot flip it.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the tile, T across, TT thick; the drawer round it, WH deep, its floor FL up
const T = 58, E = T / 2, TT = 1.8, M = 2.4, WT = 2.6, WH = 11, FL = 1.5, X0 = -E - M - WT, X1 = E + M + WT, WR = 7;
const REST = WH - 4, STUB = 0.24;
// the streets, in the tile's own plane: [x0, y0, x1, y1]
const STREETS = [[-E, -16, E, -16], [-E, 4, E, 4], [-E, 19, E, 19], [-18, -E, -18, E], [0, -E, 0, E], [16, -E, 16, E]];
// the main road, two kerbs across the tile on the diagonal
const ROAD = [-3.5, 3.5].map((c) => [-E - 20, c + E + 20, c + E + 20, -E - 20]);
// the route, along the streets: from the near corner, stepping up across the road, to the far one
const ROUTE = [[16, 23], [16, 4], [0, 4], [0, -16], [-18, -16], [-18, -23]];

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

/** The route rounded at its turns, with its running length. */
function middle(raw) {
  const pts = fillet(raw, raw.map((_, k) => (k === 0 || k === raw.length - 1 ? 0 : 4)), 5)
    .filter((p, k, a) => k === 0 || p[0] !== a[k - 1][0] || p[1] !== a[k - 1][1]);
  const run = [0];
  for (let k = 1; k < pts.length; k++) run.push(run[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  return { pts, run, total: run[run.length - 1] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[X0, X0, 0], [X1, X1, 0], [X1, X0, 0], [X0, X1, 0], [-E, -E, WH + 12 + TT], [E, -E, WH + 12 + TT], [-E, E, WH + 12 + TT]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, X0, X1, X1, WR, 6), inner = rrect(X0 + WT, X0 + WT, X1 - WT, X1 - WT, WR - WT, 6);

  const g = mk("g", {}, svg);
  // the drawer's far half: its body, the rim's inner edge, the floor seam along the far walls
  mk("path", { class: "sil", d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))) }, g);
  mk("path", { class: "nf", d: poly(ringAt(P, inner, WH)) }, g);
  mk("path", { class: "nf lo", d: open(ringAt(P, run(inner, (q) => !front(q)), FL)) }, g);

  // the tile: its plate, the streets, the road's kerbs, the route and its two ends
  const tg = mk("g", {}, g), el = solid(tg), map = mk("path", { class: "nf lo" }, tg), road = mk("path", { class: "nf" }, tg);
  const line = mk("path", { class: "nf hi" }, tg);
  const dA = flatDot(tg, C, 1.9, "dot"), dB = flatDot(tg, C, 1.9, "dot off");
  const ring = rings(-E, -E, E, E, 3, 1.1), box = [-E + 1.6, -E + 1.6, E - 1.6, E - 1.6];
  const segs = STREETS.map((s) => clip(s, box)).filter(Boolean), kerbs = ROAD.map((s) => clip(s, box)).filter(Boolean);
  const R = middle(ROUTE);

  // the drawer's near half, over the tile in it: one opaque piece from the rim's inner edge down, and a finger pull
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { class: "fo", d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]) }, g);
  mk("path", { class: "nf lo", d: open(oT) }, g);
  mk("path", { class: "nf", d: open(iF) }, g);
  mk("path", { class: "nf sil", d: open([oT[0], ...oB, oT[oT.length - 1]]) }, g);
  const onFront = (r) => r.map((q) => P(q.u, X1, q.v));
  mk("path", { class: "nf", d: poly(onFront(rrect(-11, 3, 11, 8, 2.4, 5))) }, g);
  mk("path", { class: "nf lo", d: poly(onFront(rrect(-9.4, 4.2, 9.4, 6.8, 1.1, 5))) }, g);

  /** The first share k of the route, at height z. */
  const partial = (k, z) => {
    const s = k * R.total, out = [P(R.pts[0][0], R.pts[0][1], z)];
    for (let i = 1; i < R.pts.length; i++) {
      const p = R.pts[i - 1], q = R.pts[i];
      if (R.run[i] <= s) { out.push(P(q[0], q[1], z)); continue; }
      const f = (s - R.run[i - 1]) / (R.run[i] - R.run[i - 1]);
      out.push(P(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, z));
      break;
    }
    return out;
  };

  const zt = tween(REST), kt = tween(STUB);
  let drawn = "";
  function draw(z, k) {
    const key = z + "," + k;
    if (key === drawn) return;
    drawn = key;
    const top = z + TT;
    put(el, prism(P, front, ring[0], ring[1], z, top));
    const lines = (ss) => ss.map((s) => open(s.map(([x, y]) => P(x, y, top)))).join("");
    map.setAttribute("d", lines(segs));
    road.setAttribute("d", lines(kerbs));
    line.setAttribute("d", open(partial(k, top)));
    place(dA, P(ROUTE[0][0], ROUTE[0][1], top));
    const B = ROUTE[ROUTE.length - 1];
    place(dB, P(B[0], B[1], top));
    dB.setAttribute("class", k > 0.98 ? "dot" : "dot off");
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(zt, now), tval(kt, now));
    return !tdone(zt, now) || !tdone(kt, now);
  });
  bag.add(B.unregister);

  let on = null;
  function setOn(o, force) {
    if (o === on && !force) return;
    const now = performance.now();
    on = o;
    // the tile rises first, the route draws on after it; let go, the route winds back at once, the tile after it
    tset(zt, o ? WH + lift : REST, now, o ? 0 : 200);
    tset(kt, o ? 1 : STUB, now, o ? 250 : 0);
    read.textContent = o ? "route" : "rest";
    B.wake();
  }
  setOn(false);

  /** On the drawer's rim plane: anywhere over the drawer. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], WH);
    return x > X0 - 4 && x < X1 + 4 && y > X0 - 4 && y < X1 + 4;
  }

  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 2, 12); if (on) setOn(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "offline-routing",
  means: "One saved map tile in an open drawer: under the pointer it lifts to the rim and a route draws across it, found offline.",
  rules: [1, 4, 5, 8],
  range: [3, 7, 12],
  tour: [[200, 175], [150, 150], [250, 150], null],
  mount,
});
