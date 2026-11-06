/**
 * Speed alert: a big round limit sign on a post at the roadside, facing the
 * viewer: a thick plate, a broad ring round its face, a blank middle, no
 * digits. The road runs past it, away from the viewer, and a round puck on
 * the road is the car. The pointer's place along the road is where the car
 * is: it rides there on a spring, and the nearer it comes to the sign the
 * more of the ring's rim lights, an arc rising from the foot of the ring up
 * both sides until it closes at the top when the car is alongside. At rest
 * the car is still some way off and a short arc is lit at the bottom. The
 * slider is how far ahead the alert starts.
 *
 * The pattern: scrub. One spring for where the car is; the arc follows it.
 * The hit test is the road's top plane, which never moves, and the read-out
 * reads the spring's target.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const Y0 = -96, Y1 = 96, RW = 15, TH = 3, PR = 9, PH = 5, LANE = 5;
const S0 = [-28, -12], R = 29, SH = 112, ST = 3, BAND = 9.5, SQ = Math.SQRT1_2;
const REST = 60, CY0 = -48, CY1 = 88;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ahead = value;
  const C = Cam(45, 0.5, 1.6);
  const W = (t, s, d) => [S0[0] + (t + d) * SQ, S0[1] + (d - t) * SQ, s];
  fit(C, [[-RW, Y0, 0], [RW, Y1, 0], [RW, Y0, 0], [-RW, Y1, 0], W(-R, SH, -ST), W(R, SH, 0), W(0, SH + R, 0), W(0, 0, 0)], 200, 166);
  const P = proj(C), front = facing(C), pw = (t, s, d) => P(...W(t, s, d));
  const g = mk("g", {}, svg);
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  // the road, running away from the viewer past the sign, a centre line of short dashes
  put(solid(g), prism(P, front, ...rings(-RW, Y0, RW, Y1, 6, 1.6), 0, TH));
  let cl = "";
  for (let y = Y0 + 8; y < Y1 - 12; y += 14) cl += seg(P(-1, y, TH), P(-1, y + 7, TH));
  mk("path", { class: "nf lo", d: cl }, g);

  // the car: a round puck in the near lane, a dot on its top
  const carG = mk("g", {}, g), car = solid(carG), dot = flatDot(carG, C, 2.4, "dot m");
  const cr = circ(PR, 40), ci = circ(PR - 1.6, 40);

  // the sign: a post, then a thick round plate facing the viewer, a broad ring round its face
  const px = S0[0] - ST * SQ * 0.5, py = S0[1] - ST * SQ * 0.5;
  put(solid(g), prism(P, front, sh(circ(6, 24), px, py), sh(circ(4.8, 24), px, py), 0, 1.6));
  put(solid(g), prism(P, front, sh(circ(2.8, 16), px, py), sh(circ(2, 16), px, py), 1.6, SH - R + 4));
  const ring = (r, d, n = 72) => circ(r, n).map((q) => pw(q.u, SH + q.v, d));
  put(solid(g), { sil: poly(hull(ring(R, 0).concat(ring(R, -ST)))), crease: poly(ring(R - 1.8, 0.1)) });
  mk("path", { class: "nf sil", d: poly(ring(R - BAND, 0.1)) }, g);
  // the lit rim: an arc on the ring's outer edge, rising from its foot up both sides
  const arc = mk("path", { class: "nf hi" }, g);
  const arcAt = (a) => pw((R - 1.8) * Math.sin(a), SH - (R - 1.8) * Math.cos(a), 0.2);

  const sp = spring(REST);
  /** How near the car at y is to the sign, 0 far to 1 alongside: the share of the rim that lights. */
  const nearness = (y) => clamp(1 - (y - S0[1] - 6) / ahead, 0.06, 1);
  let drawn = NaN;
  function draw(y) {
    const key = y + "," + ahead;
    if (key === drawn) return;
    drawn = key;
    put(car, prism(P, front, sh(cr, LANE, y), sh(ci, LANE, y), TH, TH + PH));
    place(dot, P(LANE, y, TH + PH));
    const k = nearness(y), n = Math.max(2, Math.round(36 * k)), pts = [];
    for (let i = -n; i <= n; i++) pts.push(arcAt((i / n) * Math.PI * k));
    arc.setAttribute("d", open(pts));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let over = false;
  const say = () => { read.textContent = !over ? "rest" : nearness(sp.t) >= 0.7 ? "near" : "far"; };
  /** On the road's top plane: near the road, the pointer's place along it is where the car goes. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], TH);
    over = Math.abs(x) < RW + 24 && y > Y0 - 6 && y < Y1 + 6;
    sp.t = over ? clamp(y, CY0, CY1) : REST;
    say(); B.wake();
  }
  say();

  bag.add(pointer(stage, { move, leave: () => { over = false; sp.t = REST; say(); B.wake(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { ahead = clamp(v, 60, 120); say(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "speed-alert",
  means: "A round limit sign by the road: as the car rides to the pointer and nears it, the sign's rim lights, closing when it is alongside.",
  rules: [1, 3, 4, 5],
  range: [60, 90, 120],
  tour: [[140, 250], [215, 200], [260, 165], null],
  mount,
});
