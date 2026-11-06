/**
 * Batch: a deck of route cards standing in a tray, a request sent as a batch.
 * Each card is a thin rounded sheet with a route drawn on it, a line with two
 * turns or more from a start dot to an end dot, a different route on every
 * card. The card under the pointer stands up and lifts, its route bright; the
 * ones in front lean forward and the ones behind lean back, staggered outwards
 * from it on the 700ms lift curve. At rest the deck leans back and the front
 * card's route is bright. The slider is the stagger, in ms.
 *
 * The pattern: riffle's. Tweens, a stagger by distance, and a hit test on
 * static bands along the resting top edges.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, proj, rad, ringAt, rrect, run, seg,
  tdone, tset, tval, tween, disposer, mk, place, pointer, reflect, register,
} = HL;

const N = 6, W = 84, H = 54, G = 15, TH = 0, TK = 1.4;
const ROUTES = [
  [[10, 12], [30, 12], [30, 30], [56, 30], [56, 42], [74, 42]],
  [[10, 42], [24, 42], [24, 18], [48, 18], [48, 10], [74, 10]],
  [[10, 24], [40, 24], [40, 42], [62, 42], [62, 16], [74, 16]],
  [[10, 10], [18, 10], [18, 34], [52, 34], [52, 22], [74, 22]],
  [[10, 30], [34, 30], [34, 10], [60, 10], [60, 38], [74, 38]],
  [[10, 18], [26, 18], [26, 44], [44, 44], [44, 26], [74, 26]],
].map((r) => fillet(r, r.map((_, k) => (k === 0 || k === r.length - 1 ? 0 : 4)), 4));
const REST = -12, BACK = -24, FWD = 20, LIFT = 16;
const X0 = -5, X1 = W + 5, Y0 = -9, Y1 = (N - 1) * G + 9, WH = 20, WR = 6, WT = 2.4;

/** A run of points ordered left to right on screen. */
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** The tray, which never moves: `far` is painted before the cards, `near` after them; each entry is [d, class]. */
function tray(P, front, outer, inner) {
  // far half: body, the rim's inner edge, and the floor seam along the far walls
  const far = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), "sil"],
    [poly(ringAt(P, inner, WH)), "nf"],
    [open(ringAt(P, run(inner, (q) => !front(q)), 2.5)), "nf lo"],
  ];
  // near half: one opaque piece from the rim's inner edge down to the floor
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  // a finger pull, set into the front
  const hx = (X0 + X1) / 2, onFront = (ring) => ring.map((q) => P(q.u, Y1, q.v));
  const near = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
    [open(oT), "nf lo"],
    [open(iF), "nf"],
    [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
    [poly(onFront(rrect(hx - 11, 6.5, hx + 11, 12.5, 3, 5))), "nf"],
    [poly(onFront(rrect(hx - 9.4, 8, hx + 9.4, 11, 1.5, 5))), "nf lo"],
  ];
  return { far, near };
}

/** Card i, back to front: its number (6 at the back) and its rounded outline, upright in its own plane. */
const SHAPE = fillet([[0, 0], [W, 0], [W, H], [0, H]], [3.2, 3.2, 3.2, 3.2]);
const card = (i) => ({ n: N - i, shape: SHAPE });

/** Card i leaning th degrees (negative leans back) and lifted by `lift`: its paths, and where its route's ends sit. */
function pose(P, i, shape, th, lift) {
  const yb = i * G, s = Math.sin(rad(th)), c = Math.cos(rad(th));
  const w = (u, v) => P(u, yb + v * s, v * c + lift);
  const wb = (u, v) => P(u, yb + v * s - TK * c, v * c + TK * s + lift);
  const r = ROUTES[N - 1 - i];
  return {
    back: poly(shape.map((p) => wb(p[0], p[1]))),
    face: poly(shape.map((p) => w(p[0], p[1]))),
    route: open(r.map((p) => w(p[0], p[1]))),
    ends: [w(...r[0]), w(...r[r.length - 1])],
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // The camera is fitted to the tray with a card lifted, so nothing leaves the frame in any pose.
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[X0, Y0, 0], [X1, Y1, -8], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, H], [X1, Y0, H + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const paths = tray(P, front, outer, inner);

  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, 0, 14);
  for (const [d, cls] of paths.far) mk("path", { d, class: cls }, g);

  const cards = [];
  for (let i = 0; i < N; i++) {
    const { n, shape } = card(i);
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const route = mk("path", { class: "nf lo" }, grp);
    const ends = [mk("circle", { r: 1.6, class: "dot off" }, grp), mk("circle", { r: 1.6, class: "dot off" }, grp)];
    cards.push({ n, shape, back, face, route, ends, a: tween(REST), z: tween(0) });
  }

  for (const [d, cls] of paths.near) mk("path", { d, class: cls }, g);

  // hit bands: oblique strips along the RESTING top edges. They never move, and nothing draws them.
  const top = (i) => P(W / 2, i * G + H * Math.sin(rad(REST)), H * Math.cos(rad(REST)));
  const c0 = top(0), c1 = top(1), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const px0 = P(0, 0, 0), px1 = P(1, 0, 0), ex = [px1[0] - px0[0], px1[1] - px0[1]];
  const HALF = W / 2 + 6, det = d[0] * ex[1] - d[1] * ex[0];

  /** The card whose band holds the point, in the band's own (s, r) coordinates; -1 outside. */
  function hit([x, y]) {
    const qx = x - c0[0], qy = y - c0[1];
    const s = (qx * ex[1] - qy * ex[0]) / det, r = (d[0] * qy - d[1] * qx) / det;
    if (Math.abs(r) > HALF || s < -0.5 || s > N + 1) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  function draw(i, th, lift) {
    const cd = cards[i];
    if (cd.drawn === th + "," + lift) return;
    cd.drawn = th + "," + lift;
    const q = pose(P, i, cd.shape, th, lift);
    cd.back.setAttribute("d", q.back);
    cd.face.setAttribute("d", q.face);
    cd.route.setAttribute("d", q.route);
    cd.ends.forEach((el, k) => place(el, q.ends[k]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((cd, i) => { draw(i, tval(cd.a, now), tval(cd.z, now)); if (!tdone(cd.a, now) || !tdone(cd.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const caption = (a) => (a < 0 ? "rest" : `route ${N - a}`);
  /** The bright route: the chosen card's, or at rest the front card's. */
  const paint = (a) => cards.forEach((cd, i) => {
    const on = i === (a < 0 ? N - 1 : a);
    cd.route.setAttribute("class", on ? "nf hi" : "nf lo");
    cd.face.classList.toggle("hi", i === a);
    cd.ends[1].setAttribute("class", on ? "dot" : "dot off");
  });
  paint(-1);
  /** Pulls card a (-1 puts them all back). The stagger spreads out from the card pulled, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cards.forEach((cd, i) => {
      const delay = Math.abs(i - from) * stag;
      const th = a < 0 ? REST : i < a ? BACK : i > a ? FWD : 0;
      tset(cd.a, th, now, delay); tset(cd.z, a === i ? LIFT : 0, now, delay);
    });
    paint(a);
    read.textContent = caption(a);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "batch",
  means: "A deck of route cards in a tray: the one under the pointer stands up, its route bright, and its neighbours lean away in turn.",
  rules: [1, 2, 8, 10],
  range: [0, 40, 90],
  tour: [[170, 150], [210, 120], [260, 110], null],
  mount,
});
