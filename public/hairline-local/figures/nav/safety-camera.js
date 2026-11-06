/**
 * Safety camera: a straight stretch of road, a speed camera on a post at the
 * far end of it, beside the road: a slim post, a box housing on top, a round
 * lens on the housing's face looking back down the road at the traffic. On
 * the road before the camera lies the enforcement zone, a strip marked out
 * across the carriageway with bars across it. A round puck on the road is the
 * car. The pointer's place along the road is where the car is: it slides
 * there on a spring, and when it is inside the strip the strip's edge lights
 * and the lens gives the bright up. At rest the car is well short of the
 * zone and the lens holds the bright: the camera is watching. The slider is
 * the zone's length.
 *
 * The pattern: scrub. One spring for where the car is. The hit test is the
 * road's top plane, which never moves; the read-out reads the spring's target.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X0 = -92, X1 = 92, RW = 15, TH = 3, PR = 9, PH = 5;
const ZE = -50, CAM = [-64, -38], HB = [-70, -58, -45, -31, 40, 62];
const REST = 56, CX0 = -46, CX1 = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[X0, -RW, 0], [X1, RW, 0], [X0, RW, 0], [X1, -RW, 0], [HB[0], HB[2], HB[5] + 2], [HB[1], HB[3], HB[5] + 2], [CAM[0], CAM[1], 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  // the road: a long low slab, its top edge the crease
  put(solid(g), prism(P, front, ...rings(X0, -RW, X1, RW, 6, 1.6), 0, TH));

  // the zone: a strip across the carriageway, bars across it; its outline is what lights
  const zone = mk("g", {}, g), edge = mk("path", { class: "nf sil" }, zone), bars = mk("path", { class: "nf lo" }, zone);
  function drawZone() {
    const x1 = ZE + len;
    edge.setAttribute("d", poly(rrect(ZE, -RW + 3, x1, RW - 3, 3, 4).map((q) => P(q.u, q.v, TH))));
    let d = "";
    for (let x = ZE + 6; x < x1 - 3; x += 7) d += seg(P(x, -RW + 6, TH), P(x, RW - 6, TH));
    bars.setAttribute("d", d);
  }
  drawZone();
  // the centre line: short painted dashes, stopping short of the zone
  let cl = "";
  for (let x = X0 + 8; x < X1 - 8; x += 13) if (x + 7 < ZE - 2 || x > ZE + 46) cl += seg(P(x, -3.5, TH), P(x + 7, -3.5, TH));
  mk("path", { class: "nf lo", d: cl }, g);

  // the camera: a slim post, a box housing on top, a round lens on its face down the road, a hood over it
  put(solid(g), prism(P, front, sh(circ(2.4, 16), CAM[0], CAM[1]), sh(circ(1.6, 16), CAM[0], CAM[1]), 0, HB[4]));
  put(solid(g), prism(P, front, ...rings(HB[0], HB[2], HB[1], HB[3], 2.4, 1), HB[4], HB[5]));
  const lw = (r, z, dx) => circ(r, 32).map((q) => P(HB[1] + dx, (HB[2] + HB[3]) / 2 + q.u, z + q.v));
  const lens = mk("path", { class: "nf sil", d: poly(lw(5, 47, 0.2)) }, g);
  mk("path", { class: "nf lo", d: poly(lw(2.4, 47, 0.3)) }, g);
  // the flash window above the lens
  mk("path", { class: "nf lo", d: poly(rrect(HB[2] + 3, 54, HB[3] - 3, 58.5, 1.2, 3).map((q) => P(HB[1] + 0.2, q.u, q.v))) }, g);
  put(solid(g), prism(P, front, ...rings(HB[0] + 2, HB[2] - 1, HB[1] + 3, HB[3] + 1, 1.6, 0.7), HB[5], HB[5] + 2));

  // the car: a round puck on the road, a dot on its top
  const carG = mk("g", {}, g), car = solid(carG), dot = flatDot(carG, C, 2.4, "dot m");
  const cr = circ(PR, 40), ci = circ(PR - 1.6, 40), sp = spring(REST);
  let drawn = NaN, inside = null;
  function draw(x) {
    if (x === drawn) return;
    drawn = x;
    put(car, prism(P, front, sh(cr, x, 4), sh(ci, x, 4), TH, TH + PH));
    place(dot, P(x, 4, TH + PH));
    // the bright goes to the zone while the car is in it, and back to the lens when it leaves
    const on = x >= ZE && x <= ZE + len;
    if (on !== inside) { inside = on; edge.classList.toggle("hi", on); lens.classList.toggle("hi", !on); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let over = false;
  const say = () => { read.textContent = !over ? "rest" : sp.t >= ZE && sp.t <= ZE + len ? "in zone" : "clear"; };
  /** On the road's top plane: near the road, the pointer's place along it is where the car goes. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], TH);
    over = x > X0 - 6 && x < X1 + 6 && Math.abs(y) < RW + 22;
    sp.t = over ? clamp(x, CX0, CX1) : REST;
    say(); B.wake();
  }
  say();

  bag.add(pointer(stage, { move, leave: () => { over = false; sp.t = REST; say(); B.wake(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { len = clamp(v, 24, 44); drawZone(); drawn = NaN; inside = null; say(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "safety-camera",
  means: "A speed camera at the end of a road: the car rides to the pointer, and the zone before the camera lights as it enters.",
  rules: [1, 4, 5, 8],
  range: [24, 34, 44],
  tour: [[250, 200], [160, 150], [215, 175], null],
  mount,
});
