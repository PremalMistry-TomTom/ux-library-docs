/**
 * POI photos: a small shop, a flat-roofed block with a window and a door in
 * its front under a short awning, and beside it a rack of four photo cards
 * standing in a low stand, fanned back unevenly. Each card is a print: a
 * thin plate with a frame inset round its edge and a tiny scene in line, a
 * row of shopfronts, a tree, a house's roofline, hills under a sun. At rest
 * the front card carries the bright edge. The card under the pointer stands
 * up out of the stand and takes the bright edge; the ones in front lean
 * forward and the ones behind lean back, staggered outwards from it. The
 * slider is the stagger, in ms.
 *
 * The pattern: one of many, as Riffle. Tweens, a stagger by distance, and a
 * hit test on static bands along the cards' nominal resting top edges.
 */
const {
  Cam, circ, clamp, fillet, fit, hull, open, poly, prism, proj, rad, rings, rrect, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, facing,
} = HL;

const N = 4, W = 50, H = 38, G = 12, TK = 1.3, BZ = 6, LIFT = 14;
const REST = [-24, -17, -11, -7], BACK = -26, FWD = 16, NOM = -14;
// the shop: x0..x1 along x, y0..y1 along y, its front at y1, BH tall
const SX0 = -86, SX1 = -26, SY0 = -30, SY1 = 14, BH = 46;

/** A card's scene, in its own plane (u across, v up): the lines a print of it would show. */
const SCENES = [
  // a row of shopfronts, their rooflines stepping
  { lines: [[[6, 6], [6, 22], [16, 22], [16, 27], [28, 27], [28, 19], [38, 19], [38, 24], [44, 24], [44, 6]], [[10, 6], [10, 13], [24, 13], [24, 6]]] },
  // a tree: a round crown on a trunk, and a smaller one behind
  { lines: [[[20, 6], [20, 13]], [[36, 6], [36, 10]]], crowns: [[20, 20, 8], [36, 15, 5]] },
  // a house: walls, a pitched roof, a door; a sun
  { lines: [[[12, 6], [12, 18], [21, 26], [30, 18], [30, 6]], [[18, 6], [18, 12], [23, 12], [23, 6]]], sun: [40, 28, 3.2] },
  // hills under a sun
  { lines: [[[5, 8], [15, 19], [22, 12], [32, 24], [45, 8]]], sun: [14, 28, 3] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[SX0, SY0, 0], [SX1, SY1, 0], [SX0, SY1, 0], [SX0, SY0, BH], [-6, -8, 0], [W + 6, (N - 1) * G + 8, 0], [W, 0, BZ + H + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the shop: a block, a window and a door in its front, an awning over the window
  const [sr, si] = rings(SX0, SY0, SX1, SY1, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, BH));
  const onFront = (u0, v0, u1, v1, r) => poly(rrect(u0, v0, u1, v1, r, 5).map((q) => P(q.u, SY1, q.v)));
  mk("path", { class: "nf", d: onFront(SX0 + 8, 8, SX0 + 34, 28, 2.5) }, g);
  mk("path", { class: "nf lo", d: onFront(SX0 + 10.5, 10.5, SX0 + 31.5, 25.5, 1.2) }, g);
  mk("path", { class: "nf", d: onFront(SX0 + 41, 0.5, SX0 + 53, 30, 2.5) }, g);
  const aw = (z, e) => poly(fillet([P(SX0 + 5, SY1, z + 5), P(SX0 + 37, SY1, z + 5), P(SX0 + 37, SY1 + e, z), P(SX0 + 5, SY1 + e, z)], [1.5, 1.5, 2, 2]));
  mk("path", { class: "lo", d: aw(31, 9) }, g);
  mk("path", { class: "sil", d: aw(33, 9) }, g);

  // the stand the cards stand in: a low block with a slot line for each card
  const [br, bi] = rings(-6, -8, W + 6, (N - 1) * G + 8, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { class: "nf lo", d: Array.from({ length: N }, (_, i) => seg(P(2, i * G, BZ), P(W - 2, i * G, BZ))).join("") }, g);

  const shape = fillet([[0, 0], [W, 0], [W, H], [0, H]], [1.5, 1.5, 2.5, 2.5]);
  const frame = fillet([[3, 3], [W - 3, 3], [W - 3, H - 3], [3, H - 3]], [1, 1, 1.5, 1.5]);
  const cards = REST.map((r0, i) => {
    const grp = mk("g", {}, g);
    return {
      back: mk("path", { class: "lo" }, grp), face: mk("path", { class: "sil" }, grp),
      frame: mk("path", { class: "nf lo" }, grp), scene: mk("path", { class: "nf" }, grp),
      a: tween(r0), z: tween(0), drawn: "",
    };
  });

  /** Card i leaning th degrees (negative leans back), lifted by `lift`, standing in its slot. */
  function draw(i, th, lift) {
    const cd = cards[i], key = th + "," + lift;
    if (key === cd.drawn) return;
    cd.drawn = key;
    const yb = i * G, s = Math.sin(rad(th)), c = Math.cos(rad(th)), z0 = BZ + lift;
    const w = (u, v) => P(u, yb + v * s, z0 + v * c);
    const wb = (u, v) => P(u, yb + v * s - TK * c, z0 + v * c + TK * s);
    cd.back.setAttribute("d", poly(shape.map((p) => wb(p[0], p[1]))));
    cd.face.setAttribute("d", poly(shape.map((p) => w(p[0], p[1]))));
    cd.frame.setAttribute("d", poly(frame.map((p) => w(p[0], p[1]))));
    const sc = SCENES[i];
    let d = sc.lines.map((l) => open(l.map(([u, v]) => w(u, v)))).join("");
    if (sc.sun) d += poly(circ(sc.sun[2], 16).map((q) => w(sc.sun[0] + q.u, sc.sun[1] + q.v)));
    for (const [u, v, r] of sc.crowns || []) d += poly(circ(r, 20).map((q) => w(u + q.u, v + q.v)));
    cd.scene.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((cd, i) => { draw(i, tval(cd.a, now), tval(cd.z, now)); if (!tdone(cd.a, now) || !tdone(cd.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // hit bands: oblique strips along the nominal resting top edges; they never move, and nothing draws them
  const top = (i) => P(W / 2, i * G + H * Math.sin(rad(NOM)), BZ + H * Math.cos(rad(NOM)));
  const c0 = top(0), c1 = top(1), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const px0 = P(0, 0, 0), px1 = P(1, 0, 0), ex = [px1[0] - px0[0], px1[1] - px0[1]];
  const HALF = W / 2 + 4, det = d[0] * ex[1] - d[1] * ex[0];
  function hit([x, y]) {
    const qx = x - c0[0], qy = y - c0[1];
    const s = (qx * ex[1] - qy * ex[0]) / det, r = (d[0] * qy - d[1] * qx) / det;
    if (Math.abs(r) > HALF || s < -0.6 || s > N + 1.2) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  let act = null;
  /** Stands card a up (-1 puts them all back to the fan); the front card carries the bright edge at rest. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? N - 1;
    act = a;
    cards.forEach((cd, i) => {
      const delay = Math.abs(i - from) * stag;
      const th = a < 0 ? REST[i] : i < a ? BACK : i > a ? FWD : 0;
      tset(cd.a, th, now, delay); tset(cd.z, a === i ? LIFT : 0, now, delay);
      cd.face.classList.toggle("hi", i === (a < 0 ? N - 1 : a));
    });
    read.textContent = a < 0 ? "rest" : `photo ${N - a}`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "poi-photos",
  means: "A shop with a stand of photo cards beside it: the photo under the pointer stands up, its neighbours leaning away in turn.",
  rules: [1, 2, 5, 10],
  range: [0, 40, 90],
  tour: [[231, 175], [261, 158], [250, 140], null],
  mount,
});
