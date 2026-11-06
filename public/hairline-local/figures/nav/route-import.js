/**
 * Route import: a folder sleeve lying on the desk, a back plate and a front
 * plate with a thumb cut at its mouth, and a thin card half in it, the route
 * file. On the card is a piece of map, two streets, and a route with a start
 * dot and an end dot. At rest the card sits half out, the route's far end in
 * the open with its end dot bright. The pointer over the sleeve pulls the
 * card out of the mouth; once it is out the route draws along it, bright,
 * from start to end: the route imported, ready to change. Let go, the route
 * winds back and the card slides home. The slider is how far it comes out.
 *
 * The pattern: one of many, with one: a tween for the pull and one for the
 * route, the route drawing after the pull. The hit test is the ground plane
 * under the sleeve and the card's way out, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, open, poly, prism, proj, rings, seg, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the sleeve: x from SX0 to its mouth at SX1, SW its half width; the card, CL long and CW half wide
const SX0 = -58, SX1 = 4, SW = 27, CL = 54, CW = 22, NR = 8;
const BZ = [0, 1.4], CZ = [1.6, 2.8], FZ = [3, 4.4], REST = -27;
// the route in the card's own plane, x from 0 at its inner end to CL; the streets under it
const ROUTE = [[8, 15], [8, 4], [24, 4], [24, -9], [46, -9], [46, -15]];
const STREETS = [[[2, 4], [CL - 2, 4]], [[24, -CW + 2], [24, CW - 2]], [[2, -9], [CL - 2, -9]]];

/** The front plate's outline: the sleeve's face, a half-round thumb cut in its mouth, every corner rounded. */
function frontShape() {
  const arc = [];
  for (let k = 0; k <= 12; k++) { const a = -Math.PI / 2 + (k / 12) * Math.PI; arc.push([SX1 - NR * Math.cos(a), NR * Math.sin(a)]); }
  const pts = [[SX0, -SW], [SX1, -SW], ...arc, [SX1, SW], [SX0, SW]];
  return fillet(pts, pts.map((_, k) => (k === 2 || k === 14 ? 1.5 : k > 2 && k < 14 ? 0 : 4)), 8)
    .filter((p, k, a) => k === 0 || Math.hypot(p[0] - a[k - 1][0], p[1] - a[k - 1][1]) > 1e-6);
}

/** The route rounded at its turns, with its running length. */
function middle(raw) {
  const pts = fillet(raw, raw.map((_, k) => (k === 0 || k === raw.length - 1 ? 0 : 3.5)), 5)
    .filter((p, k, a) => k === 0 || p[0] !== a[k - 1][0] || p[1] !== a[k - 1][1]);
  const run = [0];
  for (let k = 1; k < pts.length; k++) run.push(run[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  return { pts, run, total: run[run.length - 1] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[SX0, -SW, 0], [SX0, SW, 0], [SX1, -SW, 0], [REST + 40 + CL, CW, 0], [REST + 40 + CL, -CW, 0], [SX0, -SW, FZ[1]]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the back plate, then the card, then the front plate over it
  put(solid(g), prism(P, front, ...rings(SX0, -SW, SX1, SW, 4, 1.2), ...BZ));
  const cg = mk("g", {}, g), card = solid(cg), map = mk("path", { class: "nf lo" }, cg);
  const base = mk("path", { class: "nf" }, cg), line = mk("path", { class: "nf hi" }, cg);
  const dA = flatDot(cg, C, 1.7, "dot m"), dB = flatDot(cg, C, 1.7, "dot");
  const [cr, ci] = rings(0, -CW, CL, CW, 3, 1);
  const R = middle(ROUTE);

  // the front plate, drawn by hand for its thumb cut: its foot, its face, and the face's edge, bright where it is
  // the silhouette and dim where it is the crease over the plate's thickness
  const fs = frontShape();
  const area = fs.reduce((s, p, k) => { const q = fs[(k + 1) % fs.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) > 0 ? 1 : -1;
  const at = (z) => fs.map(([x, y]) => P(x, y, z));
  mk("path", { class: "sil", d: poly(at(FZ[0])) }, g);
  mk("path", { class: "fo", d: poly(at(FZ[1])) }, g);
  let silD = "", loD = "";
  fs.forEach((p, k) => {
    const q = fs[(k + 1) % fs.length], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1;
    const s = seg(P(p[0], p[1], FZ[1]), P(q[0], q[1], FZ[1]));
    if (front({ u: p[0], v: p[1], nu: (area * dy) / l, nv: (-area * dx) / l })) loD += s; else silD += s;
  });
  mk("path", { class: "nf lo", d: loD }, g);
  mk("path", { class: "nf sil", d: silD }, g);
  // the welded seam round the three closed sides, the mark of a sleeve
  const W = 3.2;
  mk("path", { class: "nf lo", d: open([[SX1 - 6, -SW + W], [SX0 + W + 2, -SW + W], [SX0 + W, -SW + W + 2], [SX0 + W, SW - W - 2], [SX0 + W + 2, SW - W], [SX1 - 6, SW - W]].map(([x, y]) => P(x, y, FZ[1]))) }, g);

  /** The first share k of the route on the card at x0, on its top. */
  const partial = (x0, k) => {
    const z = CZ[1], s = k * R.total, out = [P(x0 + R.pts[0][0], R.pts[0][1], z)];
    for (let i = 1; i < R.pts.length; i++) {
      const p = R.pts[i - 1], q = R.pts[i];
      if (R.run[i] <= s) { out.push(P(x0 + q[0], q[1], z)); continue; }
      const f = (s - R.run[i - 1]) / (R.run[i] - R.run[i - 1]);
      out.push(P(x0 + p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, z));
      break;
    }
    return out;
  };

  const xt = tween(REST), kt = tween(0);
  let drawn = "";
  function draw(x0, k) {
    const key = x0 + "," + k;
    if (key === drawn) return;
    drawn = key;
    const sh = (r) => r.map((q) => ({ ...q, u: q.u + x0 }));
    put(card, prism(P, front, sh(cr), sh(ci), ...CZ));
    const on = (pts) => open(pts.map(([x, y]) => P(x0 + x, y, CZ[1])));
    map.setAttribute("d", STREETS.map(on).join(""));
    base.setAttribute("d", on(R.pts));
    line.setAttribute("d", k < 0.01 ? "" : open(partial(x0, k)));
    place(dA, P(x0 + ROUTE[0][0], ROUTE[0][1], CZ[1]));
    const e = ROUTE[ROUTE.length - 1];
    place(dB, P(x0 + e[0], e[1], CZ[1]));
    dA.setAttribute("class", k > 0.01 ? "dot" : "dot m");
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(xt, now), tval(kt, now));
    return !tdone(xt, now) || !tdone(kt, now);
  });
  bag.add(B.unregister);

  let on = null;
  function setOn(o, force) {
    if (o === on && !force) return;
    const now = performance.now();
    on = o;
    // out first, then the route draws; home, the route winds back first
    tset(xt, o ? REST + pull : REST, now, o ? 0 : 250);
    tset(kt, o ? 1 : 0, now, o ? 450 : 0);
    read.textContent = o ? "out" : "rest";
    B.wake();
  }
  setOn(false);

  /** On the ground: over the sleeve, or over the card's way out. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    return x > SX0 - 4 && x < REST + 40 + CL + 4 && Math.abs(y) < SW + 4;
  }

  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { pull = clamp(v, 20, 40); if (on) setOn(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "route-import",
  means: "A card with a route on it, half in a folder sleeve: the pointer pulls it out and the route on it draws, bright.",
  rules: [1, 4, 6, 8],
  range: [20, 30, 40],
  tour: [[230, 200], [150, 150], [270, 230], null],
  mount,
});
