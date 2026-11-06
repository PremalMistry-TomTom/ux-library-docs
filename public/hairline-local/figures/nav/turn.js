/**
 * Turn: a crossroads, four road arms meeting with rounded kerbs, a dashed
 * line down each arm and a stop line across each mouth, no tile under it.
 * Over it floats the route, a raised ribbon that comes up the near-right
 * approach road and bends into one of the three ways on. At rest it turns
 * right, bright. The pointer over a branch picks the turn: the ribbon winds
 * back off the old branch, dim, and draws on along the new one, bright, its
 * curve taking the corner the way a car would. Over the approach it rests.
 * The slider is how high the ribbon floats above the road.
 *
 * The pattern: one of many, drawn as a route. Tweens for how much of each
 * branch is drawn, the old one let go at once and the new one after it, and a
 * hit test on the ground plane, which never moves: which arm's sector the
 * pointer is in.
 */
const {
  Cam, clamp, fillet, fit, open, poly, proj, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, register,
} = HL;

// the arms reach A from the centre, HW half wide, the kerbs rounded K; the plate TT thick
const A = 82, HW = 17, K = 12, TT = 3;
// the ribbon: RW half wide, RT thick, turning on a radius TR; it starts on the approach (+x) at S0
const RW = 4.6, RT = 2.4, TR = 15, S0 = A - 10, END = A - 18;
// the branches, as a driver coming up the +x arm sees them: left (+y), ahead (-x), right (-y); right at rest
const NAMES = ["left", "ahead", "right"], ENDS = [[0, END], [-END, 0], [0, -END]], REST = 2;

/** The crossroads' outline: a plus, every corner rounded, the inner ones as kerbs. */
function plus() {
  const p = [[A, -HW], [A, HW], [HW, HW], [HW, A], [-HW, A], [-HW, HW], [-A, HW], [-A, -HW], [-HW, -HW], [-HW, -A], [HW, -A], [HW, -HW]];
  return fillet(p, p.map((q) => (Math.abs(q[0]) === HW && Math.abs(q[1]) === HW ? K : 3)), 6);
}

/** A branch's middle line from the approach's start, rounded through the turn, with its running length. */
function middle(end) {
  const raw = [[S0, 0], [0, 0], end];
  const straight = end[1] === 0;
  const pts = (straight ? raw : fillet(raw, [0, TR, 0], 8)).filter((p, k, a) => k === 0 || Math.hypot(p[0] - a[k - 1][0], p[1] - a[k - 1][1]) > 0.01);
  if (!straight) { pts.pop(); pts.shift(); pts.unshift(raw[0]); pts.push(end); }
  const run = [0];
  for (let k = 1; k < pts.length; k++) run.push(run[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  return { pts, run, total: run[run.length - 1], mouth: S0 - HW - 2 };
}

/** The first s units of a middle line. */
function cut(m, s) {
  const out = [m.pts[0]];
  for (let i = 1; i < m.pts.length; i++) {
    const p = m.pts[i - 1], q = m.pts[i];
    if (m.run[i] <= s) { out.push(q); continue; }
    const f = (s - m.run[i - 1]) / (m.run[i] - m.run[i - 1]);
    if ((s - m.run[i - 1]) > 0.8) out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]);
    break;
  }
  return out;
}

/** A line widened by RW each side, its two ends rounded off: the ribbon's outline on the ground. */
function widen(pts) {
  const n = pts.length, side = (s) => pts.map((p, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    return [p[0] - (s * RW * dy) / l, p[1] + (s * RW * dx) / l];
  });
  const shape = side(1).concat(side(-1).reverse());
  return fillet(shape, shape.map((_, k) => (k === 0 || k === n - 1 || k === n || k === 2 * n - 1 ? 2 : 0)), 3);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[A, -HW, -TT], [-A, HW, -TT], [HW, A, -TT], [-HW, -A, -TT], [-HW, -A, 12 + RT], [-A, -HW, 12 + RT]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the crossroads: the plate's foot, its top over it, a dashed line down each arm, a stop line across each mouth
  const road = plus();
  mk("path", { class: "sil", d: poly(road.map((p) => P(p[0], p[1], -TT))) }, g);
  mk("path", { class: "", d: poly(road.map((p) => P(p[0], p[1], 0))) }, g);
  const arms = [[1, 0], [0, 1], [-1, 0], [0, -1]], at = (x, y) => P(x, y, 0);
  mk("path", { class: "nf dash", d: arms.map(([u, v]) => open([at(u * (HW + 10), v * (HW + 10)), at(u * (A - 6), v * (A - 6))])).join("") }, g);
  mk("path", { class: "nf lo", d: arms.map(([u, v]) => open([at(u * (HW + 4) - v * (HW - 3), v * (HW + 4) + u * (HW - 3)), at(u * (HW + 4), v * (HW + 4))])).join("") }, g);

  // the ribbon, one per branch: its foot and its top, the chosen one painted last
  const ribG = mk("g", {}, g);
  const ribs = ENDS.map((end, i) => {
    const grp = mk("g", {}, ribG);
    return { i, grp, foot: mk("path", { class: "lo" }, grp), top: mk("path", { class: "lo" }, grp), m: middle(end), k: tween(i === REST ? 1 : 0), drawn: "" };
  });
  function draw(r, k, on) {
    const key = r2k(k) + "," + lift + "," + on;
    if (key === r.drawn) return;
    r.drawn = key;
    if (!on && k < 0.01) { r.foot.setAttribute("d", ""); r.top.setAttribute("d", ""); return; }
    const shape = widen(cut(r.m, r.m.mouth + k * (r.m.total - r.m.mouth)));
    r.foot.setAttribute("d", poly(shape.map((p) => P(p[0], p[1], lift))));
    r.top.setAttribute("d", poly(shape.map((p) => P(p[0], p[1], lift + RT))));
  }
  const r2k = (k) => Math.round(k * 1000) / 1000;

  let act = null, chosen = REST;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of ribs) { draw(r, tval(r.k, now), r.i === chosen); if (!tdone(r.k, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** Picks turn a (-1 is rest, the right turn): the old branch winds back at once, the new one draws after it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    chosen = a < 0 ? REST : a;
    ribs.forEach((r) => {
      const on = r.i === chosen;
      tset(r.k, on ? 1 : 0, now, on && !force ? 220 : 0);
      r.top.setAttribute("class", on ? "sil hi" : "lo");
      r.foot.setAttribute("class", on ? "sil" : "lo");
    });
    ribG.appendChild(ribs[chosen].grp);
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1, true);

  /** On the ground: the sector of the arm the pointer is over; the approach's sector is rest. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(x, y) > A + 14 || Math.hypot(x, y) < 6) return -1;
    if (Math.abs(x) >= Math.abs(y)) return x > 0 ? -1 : 1;
    return y > 0 ? 0 : 2;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 2, 12); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "turn",
  means: "A crossroads with the route floating over it: the branch under the pointer takes the turn, the ribbon redrawn into it.",
  rules: [1, 4, 5, 8],
  range: [4, 8, 12],
  tour: [[122, 137], [122, 215], [278, 137], null],
  mount,
});
