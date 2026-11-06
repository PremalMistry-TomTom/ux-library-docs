/**
 * Nearby: a position puck on the ground with a ring round it, and eight map
 * pins scattered about, each a thick teardrop with a hole through its head,
 * standing over its own spot. The pointer's distance from the puck sets the
 * search radius: the ring follows it on a spring, and every pin inside the
 * ring rises off its spot on a dashed drop, staggered from the ring's edge
 * inwards; the pins outside sink back and dim. At rest the ring holds three
 * pins up and the puck carries the bright edge; when the pointer sets the
 * radius the ring takes it. The slider is how high a pin found rises.
 *
 * The pattern: a field read as a choice. The ring's radius is a spring; which
 * pins are inside reads the spring's target, on the ground plane.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, unproj,
  spring, stepS, tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PK = 13, PKH = 6, RMIN = 20, RMAX = 86, REST = 44, LMAX = 20, STEP = 45;
const RP = 8, HC = 18, PT = 5;
const SPOTS = [[-30, -12], [24, -30], [42, 12], [-16, 46], [-62, 26], [62, -34], [-6, -76], [56, 52]];

/** The pin's outline in its own upright plane, a across and h up from the tip: a circle and the two tangents to the tip. */
const PIN = (() => {
  const g = Math.acos(RP / HC), pts = [];
  for (let k = 0; k <= 24; k++) { const t = g + ((2 * Math.PI - 2 * g) * k) / 24; pts.push([RP * Math.sin(t), HC - RP * Math.cos(t)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, i) => (i === pts.length - 1 ? 2.5 : 0.01)));
})();

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-RMAX, 0, 0], [RMAX, 0, 0], [0, RMAX, 0], [0, -RMAX, 0], [-6, -76, LMAX + HC + RP], [62, -34, LMAX + HC + RP]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const ring = mk("path", { class: "nf" }, g);

  // pins and the puck, painted back to front by x + y
  const pins = SPOTS.map(([x, y]) => ({ x, y, d: Math.hypot(x, y), f: tween(0), drawn: NaN }));
  const items = pins.map((p) => ({ k: p.x + p.y, p })).concat([{ k: 0, puck: true }]).sort((a, b) => a.k - b.k);
  let puck = null;
  for (const it of items) {
    const grp = mk("g", {}, g);
    if (it.puck) {
      puck = solid(grp);
      put(puck, prism(P, front, circ(PK, 40), circ(PK - 1.8, 40), 0, PKH));
      place(flatDot(grp, C, 3.2, "dot"), P(0, 0, PKH));
      continue;
    }
    const p = it.p;
    place(flatDot(grp, C, 1.8, "dot off"), P(p.x, p.y, 0));
    p.drop = mk("path", { class: "dash" }, grp);
    p.sil = mk("path", { class: "lo" }, grp);
    p.cr = mk("path", { class: "nf lo" }, grp);
    p.hole = mk("ellipse", { rx: RP * 0.42 * C.S, ry: RP * 0.42 * C.S * 0.866, class: "nf" }, grp);
  }

  /** a point of a pin's plane, which faces the camera: a across the screen, h up, w toward the viewer */
  const pinAt = (p, a, h, w, z) => P(p.x + (a + w) / Math.SQRT2, p.y + (w - a) / Math.SQRT2, z + h);
  function drawPin(p, f) {
    if (f === p.drawn) return;
    p.drawn = f;
    const z = 1 + f * lift;
    const F = PIN.map(([a, h]) => pinAt(p, a, h, PT / 2, z)), Bk = PIN.map(([a, h]) => pinAt(p, a, h, -PT / 2, z));
    p.sil.setAttribute("d", poly(hull(F.concat(Bk))));
    p.cr.setAttribute("d", open(F.slice(30, 95)));
    const [hx, hy] = pinAt(p, 0, HC, PT / 2, z);
    p.hole.setAttribute("cx", hx);
    p.hole.setAttribute("cy", hy);
    p.drop.setAttribute("d", z > 2 ? open([P(p.x, p.y, 0), pinAt(p, 0, 0, 0, z)]) : "");
  }

  const R = spring(REST, { eps: 0.05 });
  let lastR = NaN;
  const B = register(stage, (dt, now) => {
    let m = stepS(R, dt);
    if (R.x !== lastR) { lastR = R.x; ring.setAttribute("d", poly(circ(R.x, 72).map((q) => P(q.u, q.v, 0)))); }
    for (const p of pins) { drawPin(p, tval(p.f, now)); if (!tdone(p.f, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  pins.sort((a, b) => a.d - b.d);
  let live = null;
  function settle(target, on, force) {
    R.t = target;
    const now = performance.now(), n = pins.filter((p) => p.d <= target).length;
    pins.forEach((p, i) => {
      const inn = p.d <= target;
      tset(p.f, inn ? 1 : 0, now, Math.abs(i - (n - 1)) * STEP);
      p.sil.setAttribute("class", inn ? "sil" : "lo");
      if (force) p.drawn = NaN;
    });
    if (on !== live) { live = on; ring.classList.toggle("hi", on); puck.sil.classList.toggle("hi", !on); }
    read.textContent = on ? `${n} inside` : "rest";
    B.wake();
  }
  settle(REST, false);

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); settle(clamp(Math.hypot(x, y), RMIN, RMAX), true); },
    leave: () => settle(REST, false),
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 0, LMAX); settle(R.t, live, true); }, destroy: bag.dispose };
}

hairline({
  name: "nearby",
  means: "A position puck with a search ring round it: the pointer sets the radius, and the pins inside it rise.",
  rules: [1, 2, 3, 4],
  range: [8, 14, 20],
  tour: [[243, 199], [101, 199], [206, 266], null],
  mount,
});
