/**
 * Measured Car: a car standing on the ground, framed by three dashed
 * dimension guides, each with a short tick at both ends: its length along the
 * near side, its width across the front, its height stood up at the back,
 * from the ground to the roof's line. At rest the guides stand off the car by
 * different amounts and the length carries the bright edge. The pointer picks
 * a guide: it lights and steps a little farther out, the others settle back,
 * staggered out from it. The read-out names the dimension. The slider is how
 * far the chosen guide steps out.
 *
 * The pattern: one of many. Tweens for which guide; the hit test is each
 * guide's rest middle on screen, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, ringAt, rrect, run,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

// the car, as Simulate's: along x, its front at +x, CW its half width; wheels of radius WR at ±WX
const CW = 11, WR = 5.5, WX = 17, ZB = 4, ZM = 13, ZR = 21, L = 27;
// the guides: where each stands off the car at rest, and which way it steps out
const NAMES = ["length", "width", "height"], REST = [12, 10, 9], TICK = 2.6, STEP = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-L, CW + 24, 0], [L + 24, -CW, 0], [L + 24, CW, 0], [-L - 22, CW, ZR], [-L - 22, CW, 0], [L, -CW, ZR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A guide from a to b (world), its ticks across along t, as one path; d its step out. */
  const GUIDES = [
    (d) => ({ a: [-L, CW + d, 0], b: [L, CW + d, 0], t: [0, 1, 0] }),
    (d) => ({ a: [L + d, -CW, 0], b: [L + d, CW, 0], t: [1, 0, 0] }),
    (d) => ({ a: [-L - d, CW, 0], b: [-L - d, CW, ZR], t: [1, 0, 0] }),
  ];
  const tick = (p, t) => open([P(p[0] - t[0] * TICK, p[1] - t[1] * TICK, p[2]), P(p[0] + t[0] * TICK, p[1] + t[1] * TICK, p[2])]);
  // the height guide stands behind the car, so it is drawn first; the other two lie in front of it
  const mkGuide = () => ({ line: mk("path", { class: "nf dash" }, g), ticks: mk("path", { class: "nf" }, g), ext: mk("path", { class: "nf lo" }, g) });
  const guides = [];
  guides[2] = mkGuide();

  // the car: far wheels, the body to the waist and the glasshouse to the roof, a window and the waist, near wheels
  const arc = (x, r, y, zc) => poly(Array.from({ length: 22 }, (_, k) => { const a = (2 * Math.PI * k) / 22; return P(x + r * Math.cos(a), y, zc + r * Math.sin(a)); }));
  const wheels = (y) => [-WX, WX].forEach((x) => { mk("path", { class: "sil", d: arc(x, WR, y, WR) }, g); mk("path", { class: "nf lo", d: arc(x, 2, y, WR) }, g); });
  wheels(-CW - 0.4);
  const car = [[rrect(-L, -CW, L, CW, 5, 6), ZB], [rrect(-L + 0.5, -CW, L - 0.5, CW, 5, 6), ZM], [rrect(-15, -CW + 1.5, 6, CW - 1.5, 3.5, 6), ZR]];
  const roofIn = rrect(-13.8, -CW + 2.8, 4.8, CW - 2.8, 2.4, 6);
  put(solid(g), { sil: poly(hull(car.flatMap(([r, z]) => ringAt(P, r, z)))), crease: open(ringAt(P, run(roofIn, front), ZR)) });
  const side = CW - 0.6, fx = (z) => lerp(L - 0.5, 6, (z - ZM) / (ZR - ZM)), rx = (z) => lerp(-L + 0.5, -15, (z - ZM) / (ZR - ZM));
  mk("path", { class: "nf lo", d: open([P(-22, CW, ZM), P(22, CW, ZM)]) }, g);
  mk("path", { class: "nf", d: poly([[rx(ZM + 1.5) + 2.5, ZM + 1.5], [fx(ZM + 1.5) - 2.5, ZM + 1.5], [fx(ZR - 1.5) - 1.5, ZR - 1.5], [rx(ZR - 1.5) + 1.5, ZR - 1.5]].map(([x, z]) => P(x, side + 0.6, z))) }, g);
  mk("path", { class: "nf lo", d: open([P(-2, CW, ZM + 1.5), P(-2, CW, ZR - 1.5)]) }, g);
  wheels(CW + 0.4);
  guides[0] = mkGuide();
  guides[1] = mkGuide();

  guides.forEach((gd, i) => { gd.d = tween(REST[i]); gd.drawn = NaN; });
  function draw(i, d) {
    const gd = guides[i];
    if (d === gd.drawn) return;
    gd.drawn = d;
    const { a, b, t } = GUIDES[i](d);
    gd.line.setAttribute("d", open([P(...a), P(...b)]));
    gd.ticks.setAttribute("d", tick(a, t) + tick(b, t));
    // the height guide's top reaches over to the roof's line, a short dim extension
    gd.ext.setAttribute("d", i === 2 ? open([P(b[0] + TICK + 1, CW, ZR), P(-15, CW - 1.5, ZR)]) : "");
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    guides.forEach((gd, i) => { draw(i, tval(gd.d, now)); if (!tdone(gd.d, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function pick(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), on = a < 0 ? 0 : a;
    guides.forEach((gd, i) => {
      const lit = i === on;
      tset(gd.d, a < 0 ? REST[i] : lit ? REST[i] + out : REST[i] - 3, now, a < 0 ? 0 : Math.abs(i - a) * STEP);
      gd.line.setAttribute("class", lit ? "nf dash hi" : "nf dash");
      gd.ticks.setAttribute("class", lit ? "nf hi" : "nf");
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  pick(-1);

  // each guide's middle at rest, on screen: the pointer picks the nearest
  const mids = GUIDES.map((f, i) => { const { a, b } = f(REST[i]); return P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); });
  function hit([x, y]) {
    let best = -1, bd = 70;
    mids.forEach((m, i) => { const dd = Math.hypot(x - m[0], y - m[1]); if (dd < bd) { bd = dd; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => pick(hit(p)), leave: () => pick(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { out = clamp(v, 2, 12); if (act >= 0) pick(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "vehicle-profile",
  means: "A car framed by dashed guides for its length, width and height: the pointer picks one, and that guide lights and steps out.",
  rules: [1, 2, 4, 10],
  range: [3, 6, 10],
  tour: [[150, 210], [290, 228], [80, 122], null],
  mount,
});
