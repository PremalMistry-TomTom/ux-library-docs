/**
 * Mic Ribbon: speech to text. A small microphone stands on a desk plate, a
 * round foot, a thin stem and a capsule head with its grille bands. Out of
 * its head runs a sound wave that falls and straightens as it goes until it
 * lies flat on a ribbon of tape beside the microphone, where it has become
 * text: six words, each a group of dashes. No letters. At rest the wave
 * carries the bright edge. The pointer along the ribbon reads the text so
 * far: every word up to the one under it lights and stands up a little,
 * staggered out from the pointer, and the wave gives up the bright edge. The
 * slider is the stagger, in ms.
 *
 * The pattern: one of many, as a prefix. A tween per word, delay by
 * distance, and a hit test on the ribbon's rest top, whose words never move
 * along it.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, run, seg, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const SLAB = [-104, -30, 104, 30], ST = 4;
const M = [-80, 2], FR = 14, FH = 4, SR = 2.2, H0 = 24, H1 = 56, HR = 9;
const RX0 = -22, RX1 = 100, RW = 9, RZ = 38, RT = 2.5, REST = 2;
const WORDS = [3, 2, 4, 1, 3, 2], DL = 4.6, DG = 1.9, WG = 6.5;
const W0 = M[0] + HR + 2, ZW = (H0 + H1) / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[SLAB[0], SLAB[1], -ST], [SLAB[2], SLAB[3], -ST], [SLAB[2], SLAB[1], 0], [SLAB[0], SLAB[3], -ST], [M[0], M[1], H1 + 2], [M[0] - HR, M[1] + HR, H1]], 200, 166);
  const P = proj(C), front = facing(C);
  const at = (r, x, y, z) => ringAt(P, r.map((q) => ({ ...q, u: q.u + x, v: q.v + y })), z);
  const g = mk("g", {}, svg);

  // the desk plate
  put(solid(g), prism(P, front, ...rings(SLAB[0], SLAB[1], SLAB[2], SLAB[3], 9, 2), -ST, 0));

  // the microphone: a round foot, a stem, a capsule head
  const foot = circ(FR, 40).map((q) => ({ ...q, u: q.u + M[0], v: q.v + M[1] }));
  const footIn = circ(FR - 1.6, 40).map((q) => ({ ...q, u: q.u + M[0], v: q.v + M[1] }));
  put(solid(g), prism(P, front, foot, footIn, 0, FH));
  const stem = circ(SR, 16).map((q) => ({ ...q, u: q.u + M[0], v: q.v + M[1] }));
  put(solid(g), prism(P, front, stem, stem, FH, H0 + 4));
  const head = solid(g), pts = [];
  for (let k = 0; k <= 16; k++) {
    const z = H0 + ((H1 - H0) * k) / 16, lo = H0 + HR, hi = H1 - HR;
    const r = z < lo ? Math.sqrt(Math.max(0, HR * HR - (lo - z) ** 2)) : z > hi ? Math.sqrt(Math.max(0, HR * HR - (z - hi) ** 2)) : HR;
    if (r > 0.3) pts.push(...at(circ(r, 32), M[0], M[1], z));
    else pts.push(P(M[0], M[1], z));
  }
  const band = (z, r) => open(at(run(circ(r, 40), front), M[0], M[1], z));
  put(head, { sil: poly(hull(pts)), crease: band(H0 + HR, HR - 0.4) + band(H1 - HR, HR - 0.4) });
  mk("path", { class: "nf lo", d: [0.33, 0.67].map((f) => band(H0 + HR + (H1 - H0 - 2 * HR) * f, HR - 0.4)).join("") }, g);

  // the wave: out of the head, falling and flattening onto the ribbon's start
  const wave = [];
  for (let k = 0; k <= 80; k++) {
    const t = k / 80, x = W0 + (RX0 + 3 - W0) * t, e = t * t * (3 - 2 * t);
    wave.push(P(x, M[1], ZW + (RZ + RT - ZW) * e + 10 * (1 - t) ** 1.1 * Math.sin(t * Math.PI * 10)));
  }
  const waveEl = mk("path", { class: "nf hi", d: open(wave) }, g);

  // the ribbon: a strip held level with the voice, its drops to the plate dashed behind it
  mk("path", { class: "dash nf", d: [[RX0 + 2, RW - 2], [RX1 - 2, RW - 2], [RX1 - 2, -RW + 2]].map(([x, y]) => seg(P(x, y, 0), P(x, y, RZ))).join("") }, g);
  put(solid(g), prism(P, front, ...rings(RX0, -RW, RX1, RW, 2.5, 1), RZ, RZ + RT));

  // the words: groups of dashes along the ribbon, each with its span for the hit test
  let x = RX0 + 8, words0 = 0;
  const words = WORDS.map((n) => {
    const xs = [];
    for (let k = 0; k < n; k++) { xs.push(x); x += DL + DG; }
    const span = [xs[0] - WG / 2, xs[n - 1] + DL + WG / 2];
    x += WG - DG;
    return { xs, span, el: mk("path", { class: "nf lo" }, g), k: tween(words0++ < REST ? 1 : 0), drawn: NaN };
  });

  function draw(w) {
    const k = tval(w.k, performance.now()), z = RZ + RT + 0.2;
    if (k === w.drawn) return;
    w.drawn = k;
    // a word types in dash by dash, left to right
    const n = w.xs.length;
    w.el.setAttribute("d", k < 0.02 ? "" : w.xs.map((x0, j) => { const f = clamp(k * n - j, 0, 1); return f < 0.05 ? "" : seg(P(x0, 0, z), P(x0 + DL * f, 0, z)); }).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    words.forEach((w) => { draw(w); if (!tdone(w.k, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    words.forEach((w, i) => {
      const on = a >= 0 && i <= a, shown = a < 0 ? i < REST : on;
      tset(w.k, shown ? 1 : 0, now, Math.abs(i - from) * stag);
      w.el.setAttribute("class", on ? "nf hi" : "nf lo");
    });
    waveEl.setAttribute("class", a >= 0 ? "nf sil" : "nf hi");
    read.textContent = a < 0 ? "rest" : `word ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On the ribbon's rest top: the word whose span holds the pointer's x, past the end the last. */
  function hit(p) {
    const [hx, hy] = unproj(C, p[0], p[1], RZ + RT);
    if (Math.abs(hy) > RW + 14 || hx < RX0 - 4 || hx > RX1 + 6) return -1;
    let a = 0;
    words.forEach((w, i) => { if (hx >= w.span[0]) a = i; });
    return a;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = clamp(v, 20, 80); }, destroy: bag.dispose };
}

hairline({
  name: "speech-to-text",
  means: "A microphone's sound wave flattens into a ribbon of dashed words: the pointer along it lights the words so far.",
  rules: [1, 2, 4, 10],
  range: [20, 45, 80],
  tour: [[190, 150], [235, 175], [280, 200], null],
  mount,
});
