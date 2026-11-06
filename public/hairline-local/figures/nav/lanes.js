/**
 * Lanes: a straight three-lane road, its lanes split by dashed lines and
 * edged by solid ones, and over it a sign gantry: two posts on the shoulders
 * and a beam across, one panel hanging from the beam over each lane on two
 * short hangers. Each lane has a guidance stripe painted down it ahead of
 * the gantry. The pointer over a lane, or over its panel, picks it: that
 * panel swings its foot out toward the viewer and takes the bright edge, and
 * the stripe in its lane lights; the panels beside it swing a little after
 * it, staggered by distance. At rest the middle lane is the one chosen. The
 * slider is how far the chosen panel swings, in degrees.
 *
 * The pattern: one of many. Tweens for which lane, a stagger by distance,
 * and a hit test on what never moves: the panels' rest faces on their own
 * upright plane first, then the road's ground plane.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rad, rings, rrect, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, hull,
} = HL;

// the road along x, the traffic coming toward -x; lanes LW wide, y across; the plate TT thick
const X0 = -60, X1 = 80, LW = 22, TY = 47, TT = 3;
// the gantry at XG: posts at ±PY, GH tall; the beam BH deep; panels PW wide, PH tall, TK thick, hung HG below the beam
const XG = -14, PY = 41, GH = 56, BH = 5, PW = 19, PH = 21, TK = 1.4, HG = 2.5, HZ = GH - BH - HG;
// the lanes from the driver's left (+y) to right; how much of the swing each neighbour takes; the stagger in ms
const LY = [LW, 0, -LW], FALL = [1, 0.22, 0.08], STEP = 50, REST = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 1.8);
  const footOut = PH * Math.sin(rad(40));
  fit(C, [[X0, -TY, -TT], [X1, TY, -TT], [X1, -TY, -TT], [X0, TY, -TT], [XG, -PY, GH], [XG + footOut, LW, HZ - PH]], 200, 166);
  const P = proj(C), front = facing(C), at = (x, y) => P(x, y, 0);
  const g = mk("g", {}, svg);

  // the road: its plate, the edge lines, the dashed lane lines, and a guidance stripe down each lane
  put(solid(g), prism(P, front, ...rings(X0, -TY, X1, TY, 9, 1.8), -TT, 0));
  mk("path", { class: "nf lo", d: [-1.5 * LW, 1.5 * LW].map((y) => open([at(X0 + 8, y), at(X1 - 8, y)])).join("") }, g);
  mk("path", { class: "nf dash", d: [-LW / 2, LW / 2].map((y) => open([at(X0 + 8, y), at(X1 - 8, y)])).join("") }, g);
  const stripes = LY.map((y) => mk("path", { class: "nf lo", d: open([at(XG + 26, y), at(X1 - 12, y)]) }, g));

  // the gantry: the far post, the beam, the panels far to near, the near post
  const post = (y) => put(solid(g), prism(P, front, ...rings(XG - 2.5, y - 2.5, XG + 2.5, y + 2.5, 1.6, 0.7), 0, GH - BH));
  post(-PY);
  put(solid(g), prism(P, front, ...rings(XG - 2.6, -PY - 3, XG + 2.6, PY + 3, 1.8, 0.8), GH - BH, GH));
  const face = rrect(-PW / 2, 0, PW / 2, PH, 1.6, 4), inset = rrect(-PW / 2 + 1.8, 1.8, PW / 2 - 1.8, PH - 1.8, 0.8, 4);
  const panels = [2, 1, 0].map((i) => {
    const grp = mk("g", {}, g), el = solid(grp);
    mk("path", { class: "nf lo", d: [-PW / 4, PW / 4].map((t) => open([P(XG, LY[i] + t, GH - BH), P(XG, LY[i] + t, HZ)])).join("") }, grp);
    return { i, el, a: tween(0), drawn: NaN };
  }).sort((p, q) => p.i - q.i);
  post(PY);

  /** Panel p swung a degrees, its foot out toward +x: a silhouette of both faces, the inset border as its crease. */
  function draw(p, a) {
    if (a === p.drawn) return;
    p.drawn = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), y = LY[p.i];
    const w = (q, k) => P(XG + q.v * s + k * c, y + q.u, HZ - q.v * c + k * s);
    const front = face.map((q) => w(q, TK / 2)), back = face.map((q) => w(q, -TK / 2));
    put(p.el, { sil: poly(hull(front.concat(back))), crease: poly(inset.map((q) => w(q, TK / 2))) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of panels) { draw(p, tval(p.a, now)); if (!tdone(p.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Picks lane a (-1 is rest, the middle one chosen); the swing spreads out from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), on = a < 0 ? REST : a, from = act === null || act < 0 ? REST : act;
    act = a;
    panels.forEach((p) => {
      tset(p.a, clamp(swing * FALL[Math.abs(p.i - on)], 0, 40), now, force ? 0 : Math.abs(p.i - (a < 0 ? from : on)) * STEP);
      p.el.sil.classList.toggle("hi", p.i === on);
      stripes[p.i].setAttribute("class", p.i === on ? "nf hi" : "nf lo");
    });
    read.textContent = a < 0 ? "rest" : `lane ${a + 1}`;
    B.wake();
  }
  setActive(-1, true);

  // the panels' upright plane at rest, x = XG: screen = O + y·ey + z·ez, solved for (y, z)
  const O = P(XG, 0, 0), ey = P(XG, 1, 0).map((v, k) => v - O[k]), ez = P(XG, 0, 1).map((v, k) => v - O[k]);
  const det = ey[0] * ez[1] - ey[1] * ez[0];
  const lane = (y) => (y > LW / 2 ? 0 : y < -LW / 2 ? 2 : 1);
  /** The panel whose rest face holds the point, else the lane under it on the road. */
  function hit(p) {
    const qx = p[0] - O[0], qy = p[1] - O[1], y = (qx * ez[1] - qy * ez[0]) / det, z = (ey[0] * qy - ey[1] * qx) / det;
    if (z > HZ - PH - 2 && z < GH && Math.abs(y) < 1.5 * LW) return lane(y);
    const [x, yy] = unproj(C, p[0], p[1], 0);
    if (x < X0 || x > X1 || Math.abs(yy) > 1.5 * LW + 3) return -1;
    return lane(yy);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { swing = clamp(v, 10, 40); if (act !== null) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "lanes",
  means: "A sign gantry over a three-lane road: the lane under the pointer lights, and its panel swings out to face you.",
  rules: [1, 2, 4, 5],
  range: [18, 28, 38],
  tour: [[197, 217], [253, 189], [141, 121], null],
  mount,
});
