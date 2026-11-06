/**
 * ETA: a short route on the ground, from a start puck on the left, round two
 * corners, to a clock dial standing upright at the destination: a round
 * plate on a slim post, facing the viewer, twelve tick dots round its face,
 * one hand, no digits. A small puck on the route is the car. The pointer's
 * place along the route is where the car is: it slides there on a spring,
 * the part of the route behind it draws bright, the rest stays dashed, and
 * the dial's hand sweeps to match, the ticks it has passed lit. At rest the
 * car is partway down the second leg, the hand a little past four. The
 * slider is how far round the dial the whole trip takes the hand.
 *
 * The pattern: scrub. One spring for where the car is. The hit test is the
 * ground plane, which never moves: the pointer is taken to the nearest point
 * of the route, at rest, and its share of the route is the spring's target.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const RAW = [[-58, 40], [6, 40], [6, -8], [50, -8]], HW = 6, PKR = 12, CAR = 8;
const D = [57, -8], DR = 23, DH = 50, DT = 3.4, POST = 2.6, REST = 0.42;
const SQ = Math.SQRT1_2;

/** The route's middle, smoothed at the corners, with its running length. */
const MID = fillet(RAW, RAW.map((_, k) => (k === 0 || k === RAW.length - 1 ? 0 : 12)), 6).filter((p, k, a) => k === 0 || Math.hypot(p[0] - a[k - 1][0], p[1] - a[k - 1][1]) > 0.01);
const RUN = MID.reduce((a, p, i) => (i ? [...a, a[i - 1] + Math.hypot(p[0] - MID[i - 1][0], p[1] - MID[i - 1][1])] : [0]), []);
const TOTAL = RUN[RUN.length - 1];
/** The point at share f of the route. */
function along(f) {
  const s = clamp(f, 0, 1) * TOTAL;
  for (let i = 1; i < MID.length; i++) if (s <= RUN[i] || i === MID.length - 1) {
    const p = MID[i - 1], q = MID[i], u = clamp((s - RUN[i - 1]) / (RUN[i] - RUN[i - 1] || 1), 0, 1);
    return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
  }
}
/** The nearest point of the route to (x, y): its share and its distance. */
function nearest(x, y) {
  let best = { f: 0, d: Infinity };
  for (let i = 1; i < MID.length; i++) {
    const p = MID[i - 1], q = MID[i], dx = q[0] - p[0], dy = q[1] - p[1], l2 = dx * dx + dy * dy || 1;
    const u = clamp(((x - p[0]) * dx + (y - p[1]) * dy) / l2, 0, 1), d = Math.hypot(x - p[0] - dx * u, y - p[1] - dy * u);
    if (d < best.d) best = { f: (RUN[i - 1] + u * (RUN[i] - RUN[i - 1])) / TOTAL, d };
  }
  return best;
}
/** The road's outline: the middle widened by HW each side, every corner rounded. */
function outline() {
  const n = MID.length, side = (sg) => MID.map((p, k) => {
    const a = MID[Math.max(0, k - 1)], b = MID[Math.min(n - 1, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    return [p[0] - (sg * HW * dy) / l, p[1] + (sg * HW * dx) / l];
  });
  const shape = side(1).concat(side(-1).reverse());
  return fillet(shape, shape.map(() => 2), 2);
}
// where each leg of the raw route ends, as a share of the route
const LEGS = RAW.slice(1).map((q) => nearest(q[0], q[1]).f);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sweep = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[RAW[0][0] - PKR, RAW[0][1] + PKR, 0], [RAW[0][0] - PKR, RAW[0][1] - PKR, 0], [6 + HW, 40 + HW, 0], [D[0], D[1], DH + DR],
    [D[0] - DR * SQ, D[1] + DR * SQ, DH], [D[0] + DR * SQ, D[1] - DR * SQ, DH]], 200, 166);
  const P = proj(C), front = facing(C), at = (p, z = 0) => P(p[0], p[1], z);
  const g = mk("g", {}, svg);
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  // the road, the way ahead dashed along it, the way travelled bright over it
  mk("path", { class: "sil", d: poly(outline().map((p) => at(p))) }, g);
  const ahead = mk("path", { class: "dash nf" }, g), done = mk("path", { class: "nf hi" }, g);

  // the dial at the destination, facing the viewer: across it is world (1, -1), through it (1, 1)
  const dial = mk("g", {}, g);
  const dw = (t, h, d) => P(D[0] + (t + d) * SQ, D[1] + (d - t) * SQ, h);
  put(solid(dial), prism(P, front, sh(circ(POST, 16), D[0], D[1]), sh(circ(POST - 0.8, 16), D[0], D[1]), 0, DH - DR + 2));
  const rim = circ(DR, 56), face = rim.map((q) => dw(q.u, DH + q.v, 0));
  mk("path", { class: "sil", d: poly(hull(face.concat(rim.map((q) => dw(q.u, DH + q.v, -DT))))) }, dial);
  mk("path", { class: "nf lo", d: poly(circ(DR - 2, 56).map((q) => dw(q.u, DH + q.v, 0.1))) }, dial);
  const ticks = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * 2 * Math.PI, el = flatDot(dial, C, k % 3 ? 0.9 : 1.4, "dot off");
    place(el, dw((DR - 6) * Math.sin(a), DH + (DR - 6) * Math.cos(a), 0.2));
    return el;
  });
  const hand = mk("path", { class: "nf sil" }, dial);
  place(flatDot(dial, C, 1.8, "dot m"), dw(0, DH, 0.3));

  // the start, a round puck with a dot; the car, a small puck riding the route
  const O = RAW[0];
  put(solid(g), prism(P, front, sh(circ(PKR, 40), O[0], O[1]), sh(circ(PKR - 2, 40), O[0], O[1]), 0, 5));
  place(flatDot(g, C, 3, "dot m"), at(O, 5));
  const carG = mk("g", {}, g), car = solid(carG), carDot = flatDot(carG, C, 1.8, "dot m");
  const cr = circ(CAR, 32), ci = circ(CAR - 1.4, 32);
  // the dial stands nearest the viewer of anything the car can reach: painted last
  g.appendChild(dial);

  const sp = spring(REST);
  let drawn = NaN;
  function draw(f) {
    const key = f + "," + sweep;
    if (key === drawn) return;
    drawn = key;
    // the car starts just off the start puck and stops short of the dial's foot
    const k = 0.17 + f * 0.75, cut = Math.round(k * 60), pts = Array.from({ length: 61 }, (_, i) => along(i / 60));
    done.setAttribute("d", open(pts.slice(0, cut + 1).map((p) => at(p)).concat([at(along(k))])));
    ahead.setAttribute("d", open([at(along(k))].concat(pts.slice(cut + 1).map((p) => at(p)))));
    const c = along(k);
    put(car, prism(P, front, sh(cr, c[0], c[1]), sh(ci, c[0], c[1]), 0, 4));
    place(carDot, at(c, 4));
    const a = f * sweep * 2 * Math.PI;
    hand.setAttribute("d", open([dw(0, DH, 0.3), dw((DR - 5) * Math.sin(a), DH + (DR - 5) * Math.cos(a), 0.3)]));
    ticks.forEach((t, j) => t.setAttribute("class", j > 0 && j / 12 <= f * sweep + 1e-6 ? "dot m" : "dot off"));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  /** On the ground plane: the nearest point of the route, when the pointer is near it. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), n = nearest(x, y), on = n.d < 34;
    sp.t = on ? n.f : REST;
    read.textContent = on ? `leg ${LEGS.findIndex((e) => n.f <= e + 1e-6) + 1}` : "rest";
    B.wake();
  }
  read.textContent = "rest";

  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { sweep = clamp(v, 0.5, 0.95); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "eta",
  means: "A route to a clock dial at the destination: the car rides to the pointer, the way travelled lights, and the hand sweeps with it.",
  rules: [1, 3, 4, 5],
  range: [0.5, 0.75, 0.95],
  tour: [[116, 199], [212, 204], [280, 212], null],
  mount,
});
