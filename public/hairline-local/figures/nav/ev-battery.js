/**
 * EV battery: a battery pack lying beside a road, a rounded box with a terminal
 * nub on its end and five cells standing raised on its top, the full ones high,
 * the spent ones sunk almost flush. The road runs from a start puck, round a
 * bend past a charging post standing to its side, to a pin. The pointer along
 * the road sets how far the car has driven, the car a dot on the road and the
 * way driven drawn behind it: as it goes the cells sink one by one from the
 * nub's end, and once past the charger they rise again, spreading up from the
 * last one left. The cell at the charge level carries the bright edge. At rest
 * the car is a third of the way, three cells of five full. The slider is how
 * much of the charge the drive to the charger uses.
 *
 * The pattern: scrub. A spring for where the car is, a tween per cell for
 * whether it is full, staggered from the level. The hit test is the ground
 * plane, which never moves: the nearest point on the road's middle.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, rrect, unproj,
  spring, stepS, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const ROAD = [[-50, 64], [-50, 6], [-32, -12], [-32, -64]], HW = 6, RT = 2, PKR = 10, PK = 4;
const B = [4, -10, 62, 34], BH = 16, N = 5, FULL = 7, LOW = 1.2;
const CH = [-68, 0], CHH = 24, PIN_R = 9, PIN_H = 26, PIN_T = 4;

/** The road's middle with its running length, and the point at share s along it. */
const LEN = [0];
for (let k = 1; k < ROAD.length; k++) LEN.push(LEN[k - 1] + Math.hypot(ROAD[k][0] - ROAD[k - 1][0], ROAD[k][1] - ROAD[k - 1][1]));
const TOTAL = LEN[LEN.length - 1];
const at = (s) => {
  const d = clamp(s, 0, 1) * TOTAL;
  let i = 1;
  while (i < ROAD.length - 1 && LEN[i] < d) i++;
  const f = (d - LEN[i - 1]) / (LEN[i] - LEN[i - 1]), a = ROAD[i - 1], b = ROAD[i];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, i];
};
/** The share along the road nearest a ground point, and how far it is from the road. */
const near = (x, y) => {
  let best = [0, 1e9];
  for (let i = 1; i < ROAD.length; i++) {
    const a = ROAD[i - 1], b = ROAD[i], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    const f = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / l2, 0, 1), d = Math.hypot(a[0] + dx * f - x, a[1] + dy * f - y);
    if (d < best[1]) best = [(LEN[i - 1] + f * Math.sqrt(l2)) / TOTAL, d];
  }
  return best;
};
const SC = near(CH[0] + 14, CH[1])[0];

/** The road's outline: the middle widened by HW, mitred at the bends, every corner rounded. */
function outline(pts) {
  const n = pts.length, nor = [];
  for (let i = 0; i < n - 1; i++) { const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], l = Math.hypot(dx, dy); nor.push([-dy / l, dx / l]); }
  const side = (s) => pts.map((p, k) => {
    const a = nor[Math.max(0, k - 1)], b = nor[Math.min(n - 2, k)], m = [a[0] + b[0], a[1] + b[1]], q = 1 + a[0] * b[0] + a[1] * b[1];
    return [p[0] + (s * HW * m[0]) / q, p[1] + (s * HW * m[1]) / q];
  });
  const shape = side(1).concat(side(-1).reverse());
  return fillet(shape, shape.map(() => 5));
}
/** The pin's outline in its own upright plane: a round head tangent down to a point. */
function pinShape() {
  const cy = PIN_H - PIN_R, a0 = Math.acos(PIN_R / cy), pts = [];
  for (let k = 0; k <= 24; k++) { const a = a0 + (k / 24) * (2 * Math.PI - 2 * a0); pts.push([PIN_R * Math.sin(a), cy - PIN_R * Math.cos(a)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, k) => (k === pts.length - 1 ? 2 : 0.4)), 3);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drain = value;
  const charge = (s) => (s < SC ? 1 - (drain * s) / SC : 1 - (drain * 0.35 * (s - SC)) / (1 - SC));
  const level = (s) => clamp(Math.round(charge(s) * N), 1, N);
  const restS = () => (0.4 * SC) / drain;

  const C = Cam(45, 0.5, 2);
  const [x0, y0, x1, y1] = B, shape = outline(ROAD), D = ROAD[ROAD.length - 1];
  fit(C, [...shape.map((p) => [p[0], p[1], 0]), [x1 + 8, (y0 + y1) / 2, 0], [x0, y1, 0], [x1, y0, BH + FULL], [CH[0], CH[1], CHH], [D[0], D[1], PIN_H + RT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the road: its underside dim, its top a plate; the way driven drawn along its middle, the car a dot on it
  mk("path", { class: "lo", d: poly(shape.map((p) => P(p[0], p[1], 0))) }, g);
  mk("path", { class: "", d: poly(shape.map((p) => P(p[0], p[1], RT))) }, g);
  const driven = mk("path", { class: "nf sil" }, g);

  // the pin at the far end, facing the viewer, a hole in its head
  const ps = pinShape(), pw = (t, s, d) => P(D[0] + (t + d) * Math.SQRT1_2, D[1] + (d - t) * Math.SQRT1_2, s + RT);
  const pinEdge = poly(hull(ps.map((p) => pw(p[0], p[1], -PIN_T)).concat(ps.map((p) => pw(p[0], p[1], 0)))));
  put(solid(g), { sil: pinEdge, crease: poly(ps.map((p) => pw(p[0], p[1], 0))) });
  mk("path", { class: "nf sil", d: pinEdge }, g);
  mk("path", { class: "nf sil", d: poly(circ(3.4, 20).map((q) => pw(q.u, PIN_H - PIN_R + q.v, 0))) }, g);

  // the charging post beside the bend: a slim pillar, its screen on the side facing the road
  const [cx, cy] = CH;
  put(solid(g), prism(P, front, ...rings(cx - 4.5, cy - 4.5, cx + 4.5, cy + 4.5, 2.2, 1), 0, CHH));
  mk("path", { class: "nf lo", d: poly(rrect(cy - 2.6, CHH - 10, cy + 2.6, CHH - 4, 1, 3).map((q) => P(cx + 4.5, q.u, q.v))) }, g);

  // the start: a puck on the near end of the road, a dot on it
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  put(solid(g), prism(P, front, sh(circ(PKR, 40), ...ROAD[0]), sh(circ(PKR - 1.6, 40), ...ROAD[0]), 0, PK));
  place(flatDot(g, C, 2.6, "dot m"), P(ROAD[0][0], ROAD[0][1], PK));
  const car = flatDot(g, C, 2.4, "dot m");

  const cyB = (y0 + y1) / 2;
  // the battery: a rounded box, the nub on its end, the cells standing on its top
  put(solid(g), prism(P, front, ...rings(x0, y0, x1, y1, 6, 1.8), 0, BH));
  put(solid(g), prism(P, front, ...rings(x1 - 1, cyB - 9, x1 + 8, cyB + 9, 3, 1.2), 3, BH - 3));
  const cw = (x1 - x0 - 10 - (N - 1) * 3) / N;
  const cells = Array.from({ length: N }, (_, i) => {
    const a = x0 + 5 + i * (cw + 3);
    return { el: solid(g), ring: rings(a, y0 + 6, a + cw, y1 - 6, 1.6, 0.9), h: tween(LOW), drawn: NaN };
  });

  let lvl = 0, over = false;
  const sp = spring(restS(), { eps: 0.0005 });
  let carDrawn = NaN;
  function drawCar(s) {
    if (s === carDrawn) return;
    carDrawn = s;
    const [x, y, i] = at(s);
    place(car, P(x, y, RT));
    driven.setAttribute("d", open([...ROAD.slice(0, i), [x, y]].map((p) => P(p[0], p[1], RT))));
  }
  function setLevel(L, now) {
    if (L === lvl) return;
    const from = lvl || L;
    cells.forEach((c, i) => {
      tset(c.h, i < L ? FULL : LOW, now, Math.abs(i + 1 - from) * 45);
      c.el.sil.setAttribute("class", i === L - 1 ? "hi" : i < L ? "sil" : "lo");
    });
    lvl = L;
    read.textContent = over ? `cell ${L}` : "rest";
  }

  const R = register(stage, (dt, now) => {
    let moving = stepS(sp, dt);
    drawCar(sp.x);
    setLevel(level(sp.x), now);
    for (const c of cells) {
      const h = tval(c.h, now);
      if (h !== c.drawn) { c.drawn = h; put(c.el, prism(P, front, ...c.ring, BH, BH + h)); }
      if (!tdone(c.h, now)) moving = true;
    }
    return moving;
  });
  bag.add(R.unregister);

  function aim(s, o) {
    over = o;
    sp.t = s;
    read.textContent = o ? `cell ${level(s)}` : "rest";
    R.wake();
  }
  aim(restS(), false);

  /** On the ground: the nearest point on the road's middle, when the pointer is on or beside the road. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), [s, d] = near(x, y);
    return d < HW + 14 ? s : null;
  }
  const move = (p) => { const s = hit(p); if (s === null) aim(restS(), false); else aim(s, true); };

  bag.add(pointer(stage, { move, leave: () => aim(restS(), false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { drain = clamp(v, 0.65, 0.95); lvl = 0; if (!over) aim(restS(), false); else R.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ev-battery",
  means: "A battery beside a road: the pointer drives the car along it, the cells sinking as it goes and rising again past the charger.",
  rules: [1, 2, 4, 8],
  range: [0.65, 0.8, 0.95],
  tour: [[113, 180], [166, 160], [212, 156], null],
  mount,
});
