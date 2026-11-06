/**
 * Simulate: a car on a rolling road. It stands on a short belt that runs round
 * two rollers, a roller at each end, the belt's marks across it; the car is
 * strapped down to the floor behind, a cooling fan blowing at its nose, so it stays put while the road
 * runs under it, its wheels turning. The road never stops: at rest it creeps,
 * and the rollers' ends carry the bright edge. The pointer's x over the
 * figure sets the speed, slow on the left, fast on the right: the marks run
 * faster under the car, the rollers and wheels turn with them, the fan's air reaches farther. The slider is
 * the top speed.
 *
 * The pattern: dilate time. The world keeps moving; a spring on the rate,
 * its target where the pointer is. The hit test is the figure's rest box on
 * screen, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, ringAt, rings, rrect, run, spring, stepS,
  reducedMotion, disposer, mk, pointer, put, register, solid,
} = HL;

// the belt: rollers of radius RR at ±RX, BW its half width; the floor under it
const RX = 30, RR = 5, BW = 16, TOP = 2 * RR, FLOOR = [-48, -26, 48, 28];
// the car: along x, its front at +x, CW its half width; wheels of radius WR at ±WX, standing on the belt
const CW = 11, WR = 5.5, WX = 17, ZB = TOP + 4, ZM = TOP + 13, ZR = TOP + 21;
const MARK = 7.5, BASE = 16, REST = 0.45;
// the cooling fan in front of the car, on a stand, blowing as hard as the road runs
const FX = 43, FZ = 15, FR = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.6);
  const [F0, G0, F1, G1] = FLOOR;
  fit(C, [[F0, G0, 0], [F1, G1, -3], [F1, G0, 0], [F0, G1, 0], [-15, -CW, ZR], [6, -CW, ZR], [FX, -FR, FZ + FR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the floor
  put(solid(g), prism(P, front, ...rings(F0, G0, F1, G1, 7, 1.8), -3, 0));

  // the belt: a stadium round the two rollers, stood across y; its near end's top run and front arc the crease
  const arc = (cx, a0, a1, n, r = RR) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + ((a1 - a0) * k) / n; return [cx + r * Math.cos(a), RR + r * Math.sin(a)]; });
  const stadium = [...arc(RX, -Math.PI / 2, Math.PI / 2, 10), ...arc(-RX, Math.PI / 2, 1.5 * Math.PI, 10)];
  const at = (y) => ([x, z]) => P(x, y, z);
  put(solid(g), { sil: poly(hull(stadium.map(at(-BW)).concat(stadium.map(at(BW))))), crease: open([P(-RX, BW, TOP), ...arc(RX, Math.PI / 2, 0, 5).map(at(BW))]) });
  const marks = mk("path", { class: "nf lo" }, g);
  // the rollers' ends on the near side, the bright edge, each with its spoke turning
  mk("path", { class: "nf hi", d: [-RX, RX].map((cx) => poly(arc(cx, 0, 2 * Math.PI, 28, RR - 1.5).slice(0, -1).map(at(BW + 0.01)))).join("") }, g);
  const spokes = mk("path", { class: "nf lo" }, g);

  // the wheels, each a tyre and a hub, a spoke turning in it
  const wheel = (y) => {
    const ring = (x, r) => poly(arc(x, 0, 2 * Math.PI, 22, r).slice(0, -1).map(([u, v]) => P(u, y, v - RR + TOP + WR)));
    [-WX, WX].forEach((x) => { mk("path", { class: "sil", d: ring(x, WR) }, g); mk("path", { class: "nf lo", d: ring(x, 2) }, g); });
    return mk("path", { class: "nf lo" }, g);
  };
  const farSpokes = wheel(-CW - 0.4);
  // the car: the body up to the waist, the glasshouse narrowing to the roof; a window and the waist on the near side
  const car = [[rrect(-27, -CW, 27, CW, 5, 6), ZB], [rrect(-26.5, -CW, 26.5, CW, 5, 6), ZM], [rrect(-15, -CW + 1.5, 6, CW - 1.5, 3.5, 6), ZR]];
  const roofIn = rrect(-13.8, -CW + 2.8, 4.8, CW - 2.8, 2.4, 6);
  put(solid(g), { sil: poly(hull(car.flatMap(([r, z]) => ringAt(P, r, z)))), crease: open(ringAt(P, run(roofIn, front), ZR)) });
  const side = CW - 0.6, fx = (z) => lerp(26.5, 6, (z - ZM) / (ZR - ZM)), rx = (z) => lerp(-26.5, -15, (z - ZM) / (ZR - ZM));
  mk("path", { class: "nf lo", d: open([P(-22, CW, ZM), P(22, CW, ZM)]) }, g);
  mk("path", { class: "nf", d: poly([[rx(ZM + 1.5) + 2.5, ZM + 1.5], [fx(ZM + 1.5) - 2.5, ZM + 1.5], [fx(ZR - 1.5) - 1.5, ZR - 1.5], [rx(ZR - 1.5) + 1.5, ZR - 1.5]].map(([x, z]) => P(x, side + 0.6, z))) }, g);
  mk("path", { class: "nf lo", d: open([P(-2, CW, ZM + 1.5), P(-2, CW, ZR - 1.5)]) }, g);
  const nearSpokes = wheel(CW + 0.4);
  // the air from the fan, dashed, its reach the road's speed; then the fan: a stand, its cage, its blades turning
  const air = mk("path", { class: "nf dash" }, g);
  const yz = (r, n = 28) => Array.from({ length: n }, (_, k) => { const a = (2 * Math.PI * k) / n; return [r * Math.cos(a), FZ + r * Math.sin(a)]; });
  mk("path", { class: "nf lo", d: open([P(FX + 1, 0, FZ - FR), P(FX + 1, 0, 0)]) + open([P(FX + 1, -5, 0), P(FX + 1, 5, 0)]) }, g);
  put(solid(g), { sil: poly(hull(yz(FR).map(([y, z]) => P(FX, y, z)).concat(yz(FR).map(([y, z]) => P(FX + 2.4, y, z))))), crease: poly(yz(FR - 1.2).map(([y, z]) => P(FX, y, z))) });
  const blades = mk("path", { class: "nf lo" }, g);
  // the strap, from the body's tail down to the floor behind the belt
  mk("path", { class: "nf lo", d: open([P(-27, CW - 2, ZB + 2), P(-44, CW + 3, 0)]) }, g);

  let ph = 0, drawn = NaN;
  const rate = spring(REST);
  function draw() {
    if (ph === drawn) return;
    drawn = ph;
    // the marks ride the top run toward the back, -x; the rollers and the wheels turn with them
    const L = 2 * RX, d = [];
    for (let k = 0; k < L / MARK; k++) {
      const x = -RX + ((((k * MARK - ph) % L) + L) % L);
      d.push(open([P(x, -BW + 1.5, TOP), P(x, BW - 1.5, TOP)]));
    }
    marks.setAttribute("d", d.join(""));
    const spoke = (cx, cz, r, a, y) => open([P(cx - r * Math.cos(a), y, cz - r * Math.sin(a)), P(cx + r * Math.cos(a), y, cz + r * Math.sin(a))]);
    spokes.setAttribute("d", [-RX, RX].map((cx) => spoke(cx, RR, RR - 2, -ph / RR, BW + 0.01)).join(""));
    const wa = ph / WR, wz = TOP + WR;
    farSpokes.setAttribute("d", [-WX, WX].map((cx) => spoke(cx, wz, WR - 1.4, wa, -CW - 0.4)).join(""));
    nearSpokes.setAttribute("d", [-WX, WX].map((cx) => spoke(cx, wz, WR - 1.4, wa, CW + 0.4)).join(""));
    blades.setAttribute("d", [0, 1, 2].map((k) => { const a = ph / 3 + (k * 2 * Math.PI) / 3; return open([P(FX, 0, FZ), P(FX, (FR - 1.6) * Math.cos(a), FZ + (FR - 1.6) * Math.sin(a))]); }).join(""));
    const len = clamp(1 + 2.4 * rate.x, 1, 14);
    air.setAttribute("d", [[0, FZ + 1], [-5, FZ - 3], [5, FZ - 3], [-3, FZ + 5], [3, FZ + 5]].map(([y, z]) => open([P(FX - 2, y, z), P(FX - 2 - len, y, z)])).join(""));
  }
  draw();

  const B = register(stage, (dt) => {
    if (reducedMotion()) return false;
    stepS(rate, dt);
    ph = (ph + rate.x * BASE * dt) % 6000;
    draw();
    return true;
  });
  bag.add(B.unregister);

  // the rest box on screen: the floor's corners and the roof
  const box = [[F0, G0, 0], [F1, G1, 0], [F1, G0, 0], [F0, G1, 0], [0, 0, ZR]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const X0 = Math.min(...xs), X1 = Math.max(...xs), Y0 = Math.min(...ys), Y1 = Math.max(...ys);
  let on = -1;
  function move([x, y]) {
    if (x < X0 || x > X1 || y < Y0 || y > Y1) return leave();
    const f = clamp((x - X0) / (X1 - X0), 0, 1), s = 1 + Math.floor(f * 3.999);
    rate.t = lerp(1, top, f);
    if (s !== on) { on = s; read.textContent = `speed ${s}`; }
    B.wake();
  }
  function leave() { rate.t = REST; on = -1; read.textContent = "rest"; B.wake(); }
  leave();

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { top = clamp(v, 2, 6); }, destroy: bag.dispose };
}

hairline({
  name: "simulate",
  means: "A car strapped to a rolling road: it stays put while the belt runs under it, and the pointer's x sets how fast.",
  rules: [1, 7, 8, 10],
  range: [2.5, 4, 6],
  tour: [[120, 200], [215, 200], [305, 200], null],
  mount,
});
