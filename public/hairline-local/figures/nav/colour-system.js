/**
 * Swatch Fan: the colour system's tokens. Six swatch cards lie fanned out on
 * the desk, stacked, all pinned at one end by a rivet. Each card carries its
 * swatch, a patch at its far end, told apart by pattern, never by colour:
 * plain, sparse dots, diagonal hatch, rules, cross-hatch, dense dots. At rest
 * the fan is spread a little unevenly and the rivet is the bright mark. The
 * pointer picks a card by its angle round the rivet: the cards on either side
 * swing away from it, staggered outwards from it on the lift curve, so it
 * stands alone in the fan, and its edge takes the bright stroke. The slider
 * is the stagger, in ms.
 *
 * The pattern: one of many, riffle-like. A tween per card for its angle, a
 * stagger by distance, and a hit test on the cards' rest angles round the
 * rivet, on the ground plane, which never move.
 */
const {
  Cam, circ, clamp, facing, fit, poly, proj, prism, rad, rrect, seg, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 6, L = 112, WD = 24, CT = 2, GAP = 13, PV = [-58, 46];
const REST = [-104, -86, -70, -52, -36, -18];
const PU0 = L - 42, PU1 = L - 7, PV0 = -WD / 2 + 4, PV1 = WD / 2 - 4;

/** The swatch's pattern, in the card's own (u along, v across): [segments, dots]. */
function pattern(k) {
  const S = [], D = [];
  const grid = (nu, nv) => { for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) D.push([PU0 + ((i + 0.5) * (PU1 - PU0)) / nu, PV0 + ((j + 0.5) * (PV1 - PV0)) / nv]); };
  const hatch = (sg) => { for (let t = -16; t < PU1 - PU0 + 16; t += 5) {
    const a = [PU0 + t, PV0], b = [PU0 + t + sg * (PV1 - PV0), PV1];
    const cl = (p, q) => { const f0 = clamp((PU0 - p[0]) / (q[0] - p[0]), 0, 1), f1 = clamp((PU1 - p[0]) / (q[0] - p[0]), 0, 1); const [lo, hi] = [Math.min(f0, f1), Math.max(f0, f1)]; return hi - lo < 0.05 ? null : [[p[0] + (q[0] - p[0]) * lo, p[1] + (q[1] - p[1]) * lo], [p[0] + (q[0] - p[0]) * hi, p[1] + (q[1] - p[1]) * hi]]; };
    const s = cl(a, b); if (s) S.push(s);
  } };
  if (k === 1) grid(5, 2);
  if (k === 2) hatch(1);
  if (k === 3) for (let u = PU0 + 4; u < PU1; u += 5) S.push([[u, PV0], [u, PV1]]);
  if (k === 4) { hatch(1); hatch(-1); }
  if (k === 5) grid(9, 4);
  return [S, D];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const pt = (th, u, v, z) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [PV[0] + u * c - v * s, PV[1] + u * s + v * c, z]; };
  const ext = [];
  for (const th of [REST[0] - GAP, REST[N - 1] + GAP, -45]) for (const [u, v] of [[L, -WD / 2], [L, WD / 2], [-14, -WD / 2], [-14, WD / 2]]) ext.push(pt(th, u, v, 0), pt(th, u, v, N * CT));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A card's footprint turned th degrees about the rivet, normals turned with it. */
  const turn = (ring, th) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return ring.map((q) => ({ u: PV[0] + q.u * c - q.v * s, v: PV[1] + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  const outer = rrect(-14, -WD / 2, L, WD / 2, 7, 6), inner = rrect(-12.8, -WD / 2 + 1.2, L - 1.2, WD / 2 - 1.2, 5.8, 6), patch = rrect(PU0, PV0, PU1, PV1, 2, 4);

  const cards = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g), s = solid(grp);
    const pa = mk("path", { class: "nf lo" }, grp), hs = mk("path", { class: "nf lo" }, grp);
    const [S, D] = pattern(i);
    const dots = D.map((d) => ({ d, el: flatDot(grp, C, 0.85, "dot off") }));
    cards.push({ s, pa, hs, S, dots, a: tween(REST[i]), drawn: NaN });
  }
  // the rivet through every card, on top of the stack
  const rz = N * CT;
  put(solid(g), prism(P, front, turn(circ(5, 24), 0), turn(circ(4, 24), 0), rz, rz + 1.6));
  const rivet = mk("path", { class: "nf hi", d: poly(turn(circ(5, 24), 0).map((q) => P(q.u, q.v, rz + 1.6))) }, g);
  place(flatDot(g, C, 1.4, "dot m"), P(PV[0], PV[1], rz + 1.6));

  function draw(i, th) {
    const cd = cards[i];
    if (th === cd.drawn) return;
    cd.drawn = th;
    const z0 = i * CT, z1 = z0 + CT, w = (u, v) => P(...pt(th, u, v, z1));
    put(cd.s, prism(P, front, turn(outer, th), turn(inner, th), z0, z1));
    cd.pa.setAttribute("d", poly(patch.map((q) => w(q.u, q.v))));
    cd.hs.setAttribute("d", cd.S.map(([a, b]) => seg(w(...a), w(...b))).join(""));
    cd.dots.forEach((o) => place(o.el, w(...o.d)));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    cards.forEach((cd, i) => { draw(i, tval(cd.a, now)); if (!tdone(cd.a, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    cards.forEach((cd, i) => {
      const th = REST[i] + (a < 0 || i === a ? 0 : i < a ? -GAP : GAP);
      tset(cd.a, th, now, Math.abs(i - from) * stag);
      cd.s.sil.classList.toggle("hi", i === a);
    });
    rivet.setAttribute("class", a < 0 ? "nf hi" : "nf lo");
    read.textContent = a < 0 ? "rest" : `swatch ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On the ground, round the rivet: the card whose rest angle is nearest the pointer's. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], rz / 2), dx = x - PV[0], dy = y - PV[1], r = Math.hypot(dx, dy);
    if (r < 14 || r > L + 10) return -1;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (ang < REST[0] - 14 || ang > REST[N - 1] + 14) return -1;
    let best = 0;
    REST.forEach((t, i) => { if (Math.abs(ang - t) < Math.abs(ang - REST[best])) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "colour-system",
  means: "A fan of swatch cards pinned by a rivet, told apart by pattern: the card under the pointer swings clear of the others.",
  rules: [1, 2, 8, 10],
  range: [0, 40, 90],
  tour: [[190, 110], [250, 150], [280, 200], null],
  mount,
});
