/**
 * Along route: a road with one bend, a thin plate with its route drawn down
 * the middle, and a dashed corridor round it, the search's buffer. Map pins,
 * each a thick teardrop with a hole through its head over its own spot, stand
 * inside the corridor and outside it. The pointer runs along the road: the
 * pins in the corridor rise by how near along the route they are to it, the
 * nearest takes the bright edge and its number goes to the read-out; the
 * pins outside the corridor never answer and stay dim. At rest the route is
 * the bright line and the corridor's pins stand a little up, unevenly. The
 * slider is the reach along the route.
 *
 * The pattern: a field along a line. A spring per pin; the pointer is read on
 * the ground plane and measured along the road, and the bright pin is chosen
 * from the springs' targets.
 */
const {
  Cam, circ, clamp, fillet, fit, hull, open, poly, proj, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, register,
} = HL;

const ROAD = [[-104, -32], [-30, -32], [22, 20], [104, 20]], HW = 6.5, TH = 2.5, CW = 26, LIFT = 22;
const RP = 7, HC = 16, PT = 4.5;
const SPOTS = [[-74, -48], [-2, -25], [40, 4], [90, 5], [-58, 10], [-14, -72], [44, -30], [10, 60]];
const REST = [5, 9, 3, 2];

/** The pin's outline in its own upright plane, a across and h up from the tip. */
const PIN = (() => {
  const g = Math.acos(RP / HC), pts = [];
  for (let k = 0; k <= 24; k++) { const t = g + ((2 * Math.PI - 2 * g) * k) / 24; pts.push([RP * Math.sin(t), HC - RP * Math.cos(t)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, i) => (i === pts.length - 1 ? 2.2 : 0.01)));
})();

/** The road widened by w each side, mitred at the bends, every corner rounded: a closed outline. */
function widen(raw, w, r) {
  const n = raw.length, nor = [];
  for (let i = 0; i < n - 1; i++) { const dx = raw[i + 1][0] - raw[i][0], dy = raw[i + 1][1] - raw[i][1], l = Math.hypot(dx, dy); nor.push([-dy / l, dx / l]); }
  const side = (s) => raw.map((p, k) => {
    const a = nor[Math.max(0, k - 1)], b = nor[Math.min(n - 2, k)], m = [a[0] + b[0], a[1] + b[1]], q = 1 + a[0] * b[0] + a[1] * b[1];
    return [p[0] + (s * w * m[0]) / q, p[1] + (s * w * m[1]) / q];
  });
  const shape = side(1).concat(side(-1).reverse());
  return fillet(shape, shape.map(() => r), 6);
}

/** An open polyline with each bend rounded over r either side. */
function bend(pts, r) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]], la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const p0 = [b[0] + ((a[0] - b[0]) * r) / la, b[1] + ((a[1] - b[1]) * r) / la], p1 = [b[0] + ((c[0] - b[0]) * r) / lc, b[1] + ((c[1] - b[1]) * r) / lc];
    for (let k = 0; k <= 6; k++) { const t = k / 6, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * b[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * b[1] + t * t * p1[1]]); }
  }
  return out.concat([pts[pts.length - 1]]);
}

/** Where a ground point lies along the road: s, its running length, and d, how far off the road it is. */
function along(q) {
  let best = { s: 0, d: Infinity }, run = 0;
  for (let i = 0; i < ROAD.length - 1; i++) {
    const a = ROAD[i], b = ROAD[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    const t = clamp(((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (l * l), 0, 1);
    const d = Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
    if (d < best.d) best = { s: run + t * l, d };
    run += l;
  }
  return best;
}

/** The share of the full lift at u reaches along the route: 1 to 30%, .25 at 80%, 0 from 120%. */
const falloff = (u) => (u <= 0.3 ? 1 : u <= 0.8 ? 1 - ((u - 0.3) / 0.5) * 0.75 : u <= 1.2 ? 0.25 - ((u - 0.8) / 0.4) * 0.25 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.6);
  const lane = widen(ROAD, CW, 16), road = widen(ROAD, HW, 5);
  fit(C, [...lane.map((p) => [p[0], p[1], 0]), [-14, -72, LIFT + HC + RP], [6, -10, LIFT + HC + RP]], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  mk("path", { class: "dash nf", d: poly(lane.map((p) => P(p[0], p[1], 0))) }, g);
  mk("path", { class: "lo", d: poly(road.map((p) => P(p[0], p[1], 0))) }, g);
  mk("path", { class: "sil", d: poly(road.map((p) => P(p[0], p[1], TH))) }, g);
  const route = mk("path", { class: "nf", d: open(bend(ROAD, 12).map((p) => P(p[0], p[1], TH))) }, g);

  // the pins: the first four in the corridor, numbered along the road; the rest outside it
  const pins = SPOTS.map(([x, y], i) => ({ x, y, ...along([x, y]), on: i < REST.length }));
  const stops = pins.filter((p) => p.on).sort((a, b) => a.s - b.s);
  stops.forEach((p, k) => { p.n = k + 1; p.sp = spring(REST[k], { eps: 0.03 }); });
  for (const p of pins.slice().sort((a, b) => a.x + a.y - (b.x + b.y))) {
    const grp = mk("g", {}, g);
    place(flatDot(grp, C, 1.6, "dot off"), P(p.x, p.y, 0));
    p.drop = mk("path", { class: "dash" }, grp);
    p.sil = mk("path", { class: p.on ? "sil" : "lo" }, grp);
    p.cr = mk("path", { class: "nf lo" }, grp);
    p.hole = mk("ellipse", { rx: RP * 0.42 * C.S, ry: RP * 0.42 * C.S * 0.866, class: "nf" }, grp);
    p.drawn = NaN;
  }

  const pinAt = (p, a, h, w, z) => P(p.x + (a + w) / Math.SQRT2, p.y + (w - a) / Math.SQRT2, z + h);
  function drawPin(p, z) {
    if (z === p.drawn) return;
    p.drawn = z;
    const F = PIN.map(([a, h]) => pinAt(p, a, h, PT / 2, z)), Bk = PIN.map(([a, h]) => pinAt(p, a, h, -PT / 2, z));
    p.sil.setAttribute("d", poly(hull(F.concat(Bk))));
    p.cr.setAttribute("d", open(F.slice(30, 95)));
    const [hx, hy] = pinAt(p, 0, HC, PT / 2, z);
    p.hole.setAttribute("cx", hx);
    p.hole.setAttribute("cy", hy);
    p.drop.setAttribute("d", z > 2 ? open([P(p.x, p.y, 0), pinAt(p, 0, 0, 0, z)]) : "");
  }
  pins.forEach((p) => drawPin(p, p.on ? p.sp.x : 0.5));

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of stops) { if (stepS(p.sp, dt)) m = true; drawPin(p, p.sp.x); }
    return m;
  });
  bag.add(B.unregister);

  let lit = undefined;
  function retarget() {
    const a = over ? along(over) : null, live = a && a.d < CW + 30;
    let best = null, bc = 0.5;
    stops.forEach((p, k) => {
      const c = live ? falloff(Math.abs(a.s - p.s) / reach) : 0;
      p.sp.t = live ? 1 + c * LIFT : REST[k];
      if (c >= bc) { bc = c; best = p; }
    });
    if (best !== lit) {
      lit = best;
      stops.forEach((p) => p.sil.classList.toggle("hi", p === best));
      route.classList.toggle("hi", !best);
    }
    read.textContent = best ? `stop ${best.n}` : "rest";
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 20, 120); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "along-route",
  means: "A road with a dashed corridor round it: the pins inside the corridor rise as the pointer passes them, the ones outside stay put.",
  rules: [1, 3, 4, 6],
  range: [30, 50, 80],
  tour: [[146, 121], [216, 215], [195, 167], null],
  mount,
});
