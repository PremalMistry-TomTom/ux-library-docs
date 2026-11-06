/**
 * Resume: a route on the ground from a start puck, round three corners, to a
 * map pin at the destination, and a bookmark standing on the route where the
 * trip was paused: a ribbon plate with a notch cut in its foot, facing the
 * viewer, held up on a short stem. The pointer takes the bookmark: it lifts
 * on its stem, rides along the route to the pointer's nearest point on a
 * spring, and the route behind it, from the start to the bookmark, lights;
 * the way still ahead stays dashed. Let go, it settles back down where it
 * was saved. At rest it stands a little past halfway. The slider is how
 * high the bookmark lifts when held.
 *
 * The pattern: scrub. A spring for where the bookmark is, a tween for held
 * or set down. The hit test is the ground plane, which never moves: the
 * pointer is taken to the nearest point of the route, at rest.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, unproj,
  spring, stepS, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const RAW = [[-24, 70], [-24, 22], [30, 22], [30, -30], [-12, -30], [-12, -66]], HW = 6, PKR = 12;
const PIN_R = 12, PIN_H = 40, PIN_T = 4, SQ = Math.SQRT1_2, REST = 0.56, BW = 7, BH = 24, STEM = 6;

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
function outline() {
  const n = MID.length, side = (sg) => MID.map((p, k) => {
    const a = MID[Math.max(0, k - 1)], b = MID[Math.min(n - 1, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    return [p[0] - (sg * HW * dy) / l, p[1] + (sg * HW * dx) / l];
  });
  const shape = side(1).concat(side(-1).reverse());
  return fillet(shape, shape.map(() => 2), 2);
}
/** The pin's outline in its own upright plane: a round head tangent down to a point. */
function pinShape() {
  const cy = PIN_H - PIN_R, a0 = Math.acos(PIN_R / cy), pts = [];
  for (let k = 0; k <= 24; k++) { const a = a0 + (k / 24) * (2 * Math.PI - 2 * a0); pts.push([PIN_R * Math.sin(a), cy - PIN_R * Math.cos(a)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, k) => (k === pts.length - 1 ? 2 : 0.4)), 3);
}
// the bookmark's ribbon in its own plane: a tall plate, a notch cut up into its foot
const RIB = fillet([[-BW, 0], [0, 6], [BW, 0], [BW, BH], [-BW, BH]], [0.8, 0.8, 0.8, 1.6, 1.6], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.1);
  const E = RAW[RAW.length - 1];
  fit(C, [[RAW[0][0] - PKR, RAW[0][1] + PKR, 0], [RAW[0][0] + PKR, RAW[0][1] + PKR, 0], [E[0], E[1], PIN_H + 2],
    ...MID.map((p) => [p[0] + HW, p[1] + HW, 0]), ...MID.map((p) => [p[0], p[1], STEM + 14 + BH])], 200, 166);
  const P = proj(C), front = facing(C), at = (p, z = 0) => P(p[0], p[1], z);
  const g = mk("g", {}, svg);
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  // a point in an upright plane facing the viewer, standing at c: across it t, up it s, through it d
  const up = (c, t, s, d) => P(c[0] + (t + d) * SQ, c[1] + (d - t) * SQ, s);

  // the road, the way ahead dashed along it, the way already driven bright over it
  mk("path", { class: "sil", d: poly(outline().map((p) => at(p))) }, g);
  const ahead = mk("path", { class: "dash nf" }, g), done = mk("path", { class: "nf hi" }, g);

  // the destination: a pin standing on the route's end, a hole in its head, the farthest thing, painted first
  const pin = pinShape(), pinG = mk("g", {}, g), pe = poly(hull(pin.map((p) => up(E, p[0], p[1], -PIN_T)).concat(pin.map((p) => up(E, p[0], p[1], 0)))));
  put(solid(pinG), { sil: pe, crease: poly(pin.map((p) => up(E, p[0], p[1], 0))) });
  mk("path", { class: "nf sil", d: pe }, pinG);
  mk("path", { class: "nf sil", d: poly(circ(4.4, 20).map((q) => up(E, q.u, PIN_H - PIN_R + q.v, 0))) }, pinG);

  // the bookmark: a stem, the ribbon plate on it (its back face a second line for its thickness, the notch left open), a dot where it is pinned
  const bm = mk("g", {}, g), stem = solid(bm), back = mk("path", { class: "sil" }, bm), rib = mk("path", { class: "sil" }, bm), pinDot = flatDot(bm, C, 1.4, "dot m");
  const sr = circ(1.4, 12), si = circ(0.8, 12);

  // the start: a round puck with a dot, the nearest thing, painted last
  const pk = mk("g", {}, g);
  const O = RAW[0];
  put(solid(pk), prism(P, front, sh(circ(PKR, 40), O[0], O[1]), sh(circ(PKR - 2, 40), O[0], O[1]), 0, 5));
  place(flatDot(pk, C, 3, "dot m"), at(O, 5));

  const sp = spring(REST), held = tween(0);
  let drawn = "";
  function draw(f, h) {
    const key = f + "," + h;
    if (key === drawn) return;
    drawn = key;
    // the bookmark keeps clear of the puck and of the pin's foot
    const k = 0.1 + f * 0.8, cut = Math.round(k * 80), pts = Array.from({ length: 81 }, (_, i) => along(i / 80)), c = along(k);
    done.setAttribute("d", open(pts.slice(0, cut + 1).map((p) => at(p)).concat([at(c)])));
    ahead.setAttribute("d", open([at(c)].concat(pts.slice(cut + 1).map((p) => at(p)))));
    const z = STEM + h * lift;
    put(stem, prism(P, front, sh(sr, c[0], c[1]), sh(si, c[0], c[1]), 0, z));
    back.setAttribute("d", poly(RIB.map((p) => up(c, p[0] + 0.6, z + p[1] + 0.8, -2.4))));
    rib.setAttribute("d", poly(RIB.map((p) => up(c, p[0], z + p[1], 0))));
    place(pinDot, up(c, 0, z + BH - 6, 0.2));
  }

  const B = register(stage, (dt, now) => { const m = stepS(sp, dt); draw(sp.x, tval(held, now)); return m || !tdone(held, now); });
  bag.add(B.unregister);

  /** On the ground plane: the nearest point of the route, when the pointer is near it. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), n = nearest(x, y), on = n.d < 30;
    sp.t = on ? clamp((n.f - 0.1) / 0.8, 0, 1) : REST;
    tset(held, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "saved" : "rest";
    B.wake();
  }
  const leave = () => { sp.t = REST; tset(held, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); };
  read.textContent = "rest";

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 4, 14); drawn = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "resume",
  means: "A bookmark standing on a route: the pointer carries it along, and the way already driven, behind it, lights.",
  rules: [1, 4, 5, 8],
  range: [4, 9, 14],
  tour: [[130, 200], [210, 170], [270, 150], null],
  mount,
});
