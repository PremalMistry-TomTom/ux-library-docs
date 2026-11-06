/**
 * Two Voices: conversation personality. Two chat bubbles stand upright on a
 * slab, turned a little towards each other as if talking: one round, its tail
 * curling down on the left, and one squared, its tail a short notch down on
 * the right. Each is a thick plate, a back face and a front face, with two
 * lines of its message on the front. At rest the round one stands a little
 * raised, its tail bright. The pointer picks a bubble: it lifts off the slab
 * and its tail takes the bright edge; the other settles. The slider is the
 * lift.
 *
 * The pattern: one of many, two of them. A tween per bubble for its lift, and
 * a hit test on the bubbles' rest centres along the row on screen, which
 * never move.
 */
const {
  Cam, clamp, fillet, fit, poly, open, proj, prism, rings, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const BT = 6, SL = [-62, -50, 66, 54], ST = 5, SQ = Math.SQRT1_2;

/** The round bubble in its own plane (t across, s up): a disc on a tail curling down to the left. */
function roundShape() {
  const R = 27, cy = 36, pts = [];
  for (let k = 0; k <= 30; k++) { const a = rad2(-122 + (k / 30) * 336); pts.push([R * Math.cos(a), cy + R * Math.sin(a)]); }
  pts.push([-27, 0]);
  return { pts: fillet(pts, pts.map((_, k) => (k === pts.length - 1 ? 2 : k === 0 || k === pts.length - 2 ? 3 : 0.4)), 3) };
}
/** The squared bubble: a rounded block on a short notch of a tail down on the right. */
function squareShape() {
  const raw = [[-30, 14], [12, 14], [24, 0], [22, 14], [30, 14], [30, 60], [-30, 60]];
  return { pts: fillet(raw, [7, 2, 1.6, 2, 7, 7, 7], 4) };
}
const rad2 = (d) => (d * Math.PI) / 180;

const BUB = [
  { at: [-16, 30], turn: -14, ...roundShape(), lines: [[-14, 42, 14], [-14, 32, 6]] },
  { at: [36, -4], turn: 14, ...squareShape(), lines: [[-20, 46, 20], [-20, 36, 8], [-20, 26, 14]] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.9);
  /** A point of bubble b's plane, lifted z: across t, up s, d towards the viewer. */
  const W = (b, t, s, d, z) => {
    const th = rad2(b.turn), ct = Math.cos(th), st = Math.sin(th);
    const ax = (SQ * ct - SQ * st), ay = (-SQ * ct - SQ * st), nx = (SQ * st + SQ * ct), ny = (SQ * ct - SQ * st);
    return [b.at[0] + t * ax + d * nx, b.at[1] + t * ay + d * ny, s + z];
  };
  const ext = [[SL[0], SL[1], -ST], [SL[2], SL[3], -ST], [SL[2], SL[1], 0], [SL[0], SL[3], -ST]];
  BUB.forEach((b) => b.pts.forEach(([t, s]) => ext.push(W(b, t, s, 0, 18), W(b, t, s, -BT, 0))));
  fit(C, ext, 200, 166);
  const P = proj(C), at = (b, t, s, d, z) => P(...W(b, t, s, d, z));
  const g = mk("g", {}, svg);

  // the slab
  put(solid(g), prism(P, HL.facing(C), ...rings(SL[0], SL[1], SL[2], SL[3], 12, 2), -ST, 0));

  // the bubbles, far to near
  const order = BUB.map((b, i) => i).sort((i, j) => BUB[i].at[0] + BUB[i].at[1] - (BUB[j].at[0] + BUB[j].at[1]));
  const els = [];
  order.forEach((i) => {
    const grp = mk("g", {}, g);
    els[i] = {
      back: mk("path", { class: "lo" }, grp), face: mk("path", { class: "sil" }, grp),
      lines: mk("path", { class: "nf lo" }, grp), tail: mk("path", { class: "nf sil" }, grp),
      z: tween(i === 0 ? 4 : 0), drawn: NaN,
    };
  });

  function draw(i, z) {
    const b = BUB[i], e = els[i];
    if (z === e.drawn) return;
    e.drawn = z;
    e.back.setAttribute("d", poly(b.pts.map(([t, s]) => at(b, t, s, -BT, z))));
    e.face.setAttribute("d", poly(b.pts.map(([t, s]) => at(b, t, s, 0, z))));
    e.lines.setAttribute("d", b.lines.map(([t, s, w]) => seg(at(b, t, s, 0, z), at(b, t + w, s, 0, z))).join(""));
    // the tail: the stretch of the face's outline round its tip
    const tipAt = b.pts.reduce((m, p, k) => (p[1] < b.pts[m][1] ? k : m), 0), n = b.pts.length, span = [];
    for (let k = -6; k <= 6; k++) span.push(b.pts[(tipAt + k + n) % n]);
    e.tail.setAttribute("d", open(span.map(([t, s]) => at(b, t, s, 0, z))));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    els.forEach((e, i) => { draw(i, tval(e.z, now)); if (!tdone(e.z, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now();
    els.forEach((e, i) => {
      tset(e.z, a < 0 ? (i === 0 ? 4 : 0) : i === a ? lift : 0, now, 0);
      e.tail.setAttribute("class", i === (a < 0 ? 0 : a) ? "nf hi" : "nf sil");
    });
    read.textContent = a < 0 ? "rest" : `voice ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  // hit: inside the slab's and bubbles' rest box on screen, the bubble whose rest centre is nearer in x
  const cx = BUB.map((b) => at(b, 0, 36, 0, 0)[0]);
  const box = ext.map((p) => P(...p));
  const [x0, x1] = [Math.min(...box.map((p) => p[0])), Math.max(...box.map((p) => p[0]))];
  const [y0, y1] = [Math.min(...box.map((p) => p[1])), Math.max(...box.map((p) => p[1]))];
  const hit = ([x, y]) => (x < x0 || x > x1 || y < y0 || y > y1 ? -1 : Math.abs(x - cx[0]) < Math.abs(x - cx[1]) ? 0 : 1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 6, 18); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "personality",
  means: "Two chat bubbles, one round and one squared, stand on a slab: the one under the pointer lifts and its tail lights.",
  rules: [1, 4, 5, 8],
  range: [6, 12, 18],
  tour: [[150, 150], [260, 140], null],
  mount,
});
