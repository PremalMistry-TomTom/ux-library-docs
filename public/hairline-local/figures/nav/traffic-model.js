/**
 * Traffic model: three thin traffic sheets stacked loose, like dated
 * snapshots of the same streets. Each is a plate with a road curving across
 * it and traffic on the road as dashes, bunched where that snapshot had its
 * queues, and an index tab on its near edge, each tab at its own place
 * along the edge and punched with its number in dots. At rest the stack
 * sits a little askew and the top, latest, sheet's tab is bright. The
 * pointer over a tab's band picks that snapshot: it slides out of the stack
 * toward the viewer and its tab lights; its neighbours follow a little,
 * staggered outwards from it. The slider is how far it slides.
 *
 * The pattern: one of many. Tweens for which sheet, and a hit test on one
 * fixed plane through the stack: which tab's band the pointer's y is in.
 */
const {
  Cam, clamp, fillet, fit, open, poly, proj, seg, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, register,
} = HL;

const N = 3, W = 100, TH = 2.6, GAP = 16, R = 6, T = 10, OUTMAX = 58, STEP = 45, HW = 6;
const TY = [80, 50, 20];
const REST = [[0, 0], [4, -9], [9, -17]];
// where the traffic bunches on each sheet's road: dash positions along it, 0 to 1
const TRAFFIC = [
  [0.08, 0.14, 0.2, 0.26, 0.31, 0.36, 0.55, 0.8],
  [0.12, 0.3, 0.46, 0.5, 0.54, 0.58, 0.62, 0.66, 0.88],
  [0.1, 0.28, 0.44, 0.62, 0.7, 0.75, 0.8, 0.85, 0.9],
];

/** The sheet's outline on the ground: a rounded square with a tab on its +x edge at y = ty. */
const outline = (ty) => fillet(
  [[0, 0], [W, 0], [W, ty - 11], [W + T, ty - 8], [W + T, ty + 8], [W, ty + 11], [W, W], [0, W]],
  [R, R, 1.5, 2, 2, 1.5, R, R],
);
/** The road's middle at share t: from the far edge (y 0) to the near one (y W), swinging across. */
const mid = (t) => [W * 0.42 + 20 * Math.sin(t * Math.PI * 1.6 - 0.6), 4 + t * (W - 8)];
const along = (t, s) => {
  const a = mid(Math.max(0, t - 0.01)), b = mid(Math.min(1, t + 0.01)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  const m = mid(t);
  return [m[0] - (s * dy) / l, m[1] + (s * dx) / l];
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;
  const C = Cam(45, 0.5, 1.62);
  const top = (N - 1) * GAP + TH;
  fit(C, [[0, -17, 0], [W + T + OUTMAX + 11, W, 0], [W + T + 11, -17, top], [0, W, 0], [0, -17, top]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const sheets = TY.map((ty, i) => {
    const grp = mk("g", {}, g);
    const shape = outline(ty);
    const dots = [];
    const el = {
      foot: mk("path", { class: "sil" }, grp), face: mk("path", { class: "" }, grp),
      road: mk("path", { class: "nf lo" }, grp), cars: mk("path", { class: "nf" }, grp),
      tab: mk("path", { class: "nf" }, grp),
    };
    for (let k = 0; k <= i; k++) dots.push(flatDot(grp, C, 1.1, "dot off"));
    return { i, ty, shape, el, dots, x: tween(REST[i][0]), y: tween(REST[i][1]), drawn: "" };
  });

  function draw(sh, dx, dy) {
    const key = dx + "," + dy;
    if (key === sh.drawn) return;
    sh.drawn = key;
    const z = sh.i * GAP, at = (p, h) => P(p[0] + dx, p[1] + dy, z + h);
    sh.el.foot.setAttribute("d", poly(sh.shape.map((p) => at(p, 0))));
    sh.el.face.setAttribute("d", poly(sh.shape.map((p) => at(p, TH))));
    const ts = Array.from({ length: 33 }, (_, k) => k / 32);
    sh.el.road.setAttribute("d", open(ts.map((t) => at(along(t, HW), TH))) + open(ts.map((t) => at(along(t, -HW), TH))));
    sh.el.cars.setAttribute("d", TRAFFIC[sh.i].map((t, k) => { const s = k % 2 ? 2.6 : -2.6; return seg(at(along(t - 0.022, s), TH), at(along(t + 0.022, s), TH)); }).join(""));
    sh.el.tab.setAttribute("d", open(sh.shape.slice(10, 30).map((p) => at(p, TH))));
    sh.dots.forEach((d, k) => place(d, at([W + T / 2 - 0.5, sh.ty + (k - sh.i / 2) * 4.2], TH)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sh of sheets) { draw(sh, tval(sh.x, now), tval(sh.y, now)); if (!tdone(sh.x, now) || !tdone(sh.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Slides sheet a out (-1 squares the stack back to rest); the top sheet's tab is bright at rest. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? N - 1;
    act = a;
    sheets.forEach((sh) => {
      const d = Math.abs(sh.i - from), delay = d * STEP;
      const x = a < 0 ? REST[sh.i][0] : sh.i === a ? out : out * (d === 1 ? 0.16 : 0.05);
      tset(sh.x, x, now, delay); tset(sh.y, a < 0 ? REST[sh.i][1] : 0, now, delay);
      const on = sh.i === (a < 0 ? N - 1 : a);
      sh.el.tab.classList.toggle("hi", on);
      sh.dots.forEach((dt) => dt.setAttribute("class", on ? "dot m" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : `snap ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On one fixed plane through the middle of the stack: within the stack, the tab whose band holds the pointer's y. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], GAP);
    if (x < -10 || x > W + T + OUTMAX + 10 || y < -12 || y > W + 12) return -1;
    let best = 0;
    TY.forEach((ty, i) => { if (Math.abs(y - ty) < Math.abs(y - TY[best])) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { out = clamp(v, 30, OUTMAX); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "traffic-model",
  means: "Three dated traffic snapshots stacked with index tabs: the one under the pointer slides out of the stack and its tab lights.",
  rules: [1, 2, 4, 5],
  range: [34, 46, 58],
  tour: [[255, 225], [262, 190], [270, 150], null],
  mount,
});
