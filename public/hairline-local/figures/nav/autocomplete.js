/**
 * Autocomplete: a search bar and its suggestions, stood up like a screen. The
 * bar is a thick pill-ended plate with a typed word, a caret after it and a
 * round search button at its end; under it hang three suggestion chips, thin
 * plates each with a place dot and two dashes of text, a title and a line
 * under it. At rest the chips fan forward, the first the most, and the bar and
 * its caret carry the bright edge: the field has focus. The chip under the
 * pointer slides out toward the viewer and takes the bright edge and its dot;
 * the others settle back flush, staggered outwards from it. The slider is the
 * pull.
 *
 * The pattern: one of many. Tweens for which chip, and a hit test on each
 * chip's rest face, so a chip sliding out from under the pointer cannot flip it.
 */
const {
  Cam, circ, clamp, fit, hull, open, poly, proj, rrect, run, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, register, solid,
} = HL;

const W = 150, BT = 9, CT = 3.5, BH0 = 82, BH1 = 108, CHH = 20, GAP = 6, N = 3, U0 = 6, U1 = W - 6, STEP = 45, LMAX = 18;
const H0 = (i) => BH0 - GAP - CHH - i * (CHH + GAP);
const REST = [8, 4.5, 1.5];
// the text on each chip: where the title and the line under it end, so no two chips read alike
const TEXT = [[104, 76], [86, 112], [118, 66]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, -BT, BH1], [W, -BT, BH1], [0, LMAX + CT, H0(N - 1)], [W, LMAX + CT, H0(N - 1)], [W, 0, BH1], [0, LMAX + CT, BH0]], 200, 166);
  const P = proj(C), o = P(0, 0, 0), ex = P(1, 0, 0), ey = P(0, 1, 0), ez = P(0, 0, 1);
  const X = [ex[0] - o[0], ex[1] - o[1]], Y = [ey[0] - o[0], ey[1] - o[1]], Z = [ez[0] - o[0], ez[1] - o[1]];
  /** A point on an upright plate's plane: u across, h up, y its depth. */
  const at = (u, h, y) => P(u, y, h);
  /** Which outline samples face the plate's back, which shows up and to the right of its front: the crease's run. */
  const toBack = (q) => (q.nu * X[0] + q.nv * Z[0]) * -Y[0] + (q.nu * X[1] + q.nv * Z[1]) * -Y[1] > 0;

  /** An upright plate of outline `ring`, its front at y and its back t behind: {sil, crease} as prism gives. */
  const plate = (ring, y, t) => {
    const F = ring.map((q) => at(q.u, q.v, y)), Bk = ring.map((q) => at(q.u, q.v, y - t));
    return { sil: poly(hull(F.concat(Bk))), crease: open(run(ring, toBack).map((q) => at(q.u, q.v, y))) };
  };
  const draw2 = (s, p) => { s.sil.setAttribute("d", p.sil); s.cr.setAttribute("d", p.crease); };

  const g = mk("g", {}, svg);
  // the bar: a pill, its ends fully round, with a typed word, the caret and a round button on its face
  const bar = solid(g), hm = (BH0 + BH1) / 2, br = (BH1 - BH0) / 2;
  draw2(bar, plate(rrect(0, BH0, W, BH1, br, 12), 0, BT));
  mk("path", { class: "nf lo", d: seg(at(16, hm, 0), at(44, hm, 0)) + seg(at(50, hm, 0), at(64, hm, 0)) }, g);
  const caret = mk("path", { class: "nf", d: seg(at(70, hm - 7, 0), at(70, hm + 7, 0)) }, g);
  mk("path", { class: "nf", d: poly(circ(7.5, 24).map((q) => at(W - br + q.u, hm + q.v, 0))) }, g);

  const chips = [];
  for (let i = 0; i < N; i++) {
    const h0 = H0(i), hc = h0 + CHH / 2, grp = mk("g", {}, g);
    const s = solid(grp), ttl = mk("path", { class: "nf" }, grp), txt = mk("path", { class: "nf lo" }, grp), dot = mk("path", { class: "dot off" }, grp);
    chips.push({ hc, grp, s, ttl, txt, dot, ring: rrect(U0, h0, U1, h0 + CHH, 5, 6), z: tween(REST[i]), drawn: NaN });
  }

  function draw(ch, i, y) {
    if (y === ch.drawn) return;
    ch.drawn = y;
    const [a, b] = TEXT[i];
    draw2(ch.s, plate(ch.ring, y, CT));
    ch.ttl.setAttribute("d", seg(at(28, ch.hc + 3, y), at(a, ch.hc + 3, y)));
    ch.txt.setAttribute("d", seg(at(28, ch.hc - 3.5, y), at(b, ch.hc - 3.5, y)));
    ch.dot.setAttribute("d", poly(circ(2.6, 14).map((q) => at(17 + q.u, ch.hc + q.v, y))));
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    const ys = chips.map((ch, i) => { const y = tval(ch.z, now); draw(ch, i, y); if (!tdone(ch.z, now)) moving = true; return y; });
    // nearer plates paint later: order the chips by how far out they stand
    const ord = chips.map((_, i) => i).sort((a, b) => ys[a] - ys[b]);
    if (ord.join() !== order) { order = ord.join(); ord.forEach((i) => g.appendChild(chips[i].grp)); }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : 0;
    act = a;
    chips.forEach((ch, i) => {
      tset(ch.z, a < 0 ? REST[i] : i === a ? lift : 0, now, Math.abs(i - from) * STEP);
      ch.s.sil.classList.toggle("hi", i === a);
      ch.dot.setAttribute("class", i === a ? "dot" : "dot off");
    });
    bar.sil.classList.toggle("hi", a < 0);
    caret.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : `pick ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** The pointer on each chip's rest plane, solved for (u, h): the chip whose middle it lands nearest. */
  function hit(p) {
    let best = -1, bd = CHH / 2 + GAP / 2 + 1;
    const det = X[0] * Z[1] - X[1] * Z[0];
    chips.forEach((ch, i) => {
      const q = at(0, 0, REST[i]), dx = p[0] - q[0], dy = p[1] - q[1];
      const u = (dx * Z[1] - dy * Z[0]) / det, h = (X[0] * dy - X[1] * dx) / det, d = Math.abs(h - ch.hc);
      if (u > U0 - 8 && u < U1 + 8 && d < bd) { bd = d; best = i; }
    });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 0, LMAX); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "autocomplete",
  means: "A search bar with three suggestions under it: the one under the pointer slides out and lights, and the others settle back.",
  rules: [1, 2, 4, 8],
  range: [6, 12, 18],
  tour: [[202, 186], [198, 154], [205, 218], null],
  mount,
});
