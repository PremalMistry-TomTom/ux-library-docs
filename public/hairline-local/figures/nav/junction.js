/**
 * Junction: a crossroads, four road arms meeting with rounded kerbs, a dashed
 * line down each arm and a stop line across each mouth, no tile under it. On
 * each arm, by its stop line, stands a counter: a short post of thin stacked
 * rings, one ring for so many vehicles through; rings not in use ride inside
 * the top one. At rest the posts stand
 * uneven, and the tallest one's top ring is bright. The pointer over an arm
 * picks it: its kerbs light and its post telescopes up to the arm's
 * count, while the other posts sink back to one ring, staggered round the
 * junction from it. The slider is that stagger, in ms.
 *
 * The pattern: one of many. A tween per post for its height, staggered by
 * the post's distance round the junction from the chosen arm, and a hit test on the ground plane, which never moves:
 * which arm's sector the pointer is in.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, open, poly, prism, proj, seg, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const A = 80, HW = 16, K = 12, TT = 3, RR = 8, RT = 2.4, PITCH = 4, MAX = 12, PD = 44;
const ARMS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const REST = [3, 5, 2, 4], COUNT = [9, 8, 12, 10], REST_LIT = 1;

/** The crossroads' outline: a plus, every corner rounded, the inner ones as kerbs. */
function plus() {
  const p = [[A, -HW], [A, HW], [HW, HW], [HW, A], [-HW, A], [-HW, HW], [-A, HW], [-A, -HW], [-HW, -HW], [-HW, -A], [HW, -A], [HW, -HW]];
  return fillet(p, p.map((q) => (Math.abs(q[0]) === HW && Math.abs(q[1]) === HW ? K : 3)), 6);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const H = (MAX - 1) * PITCH + RT;
  fit(C, [[A, -HW, -TT], [-A, HW, -TT], [HW, A, -TT], [-HW, -A, -TT], [-PD, -HW, H], [PD, -HW, H], [-HW, -PD, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the crossroads: the plate's foot, its top, a dashed line down each arm, a stop line across each mouth
  const road = plus();
  mk("path", { class: "sil", d: poly(road.map((p) => P(p[0], p[1], -TT))) }, g);
  mk("path", { class: "", d: poly(road.map((p) => P(p[0], p[1], 0))) }, g);
  const at = (x, y) => P(x, y, 0);
  mk("path", { class: "nf dash", d: ARMS.map(([u, v]) => open([at(u * (HW + 10), v * (HW + 10)), at(u * (A - 6), v * (A - 6))])).join("") }, g);
  mk("path", { class: "nf lo", d: ARMS.map(([u, v]) => open([at(u * (HW + 4) + v * (HW - 3), v * (HW + 4) - u * (HW - 3)), at(u * (HW + 4), v * (HW + 4))])).join("") }, g);
  // each arm's two kerbs, drawn over the plate's edge so the chosen arm can light
  const kerbs = ARMS.map(([u, v]) => mk("path", {
    class: "nf",
    d: [1, -1].map((s) => seg(at(u * (HW + K) - v * s * HW, v * (HW + K) + u * s * HW), at(u * (A - 3) - v * s * HW, v * (A - 3) + u * s * HW))).join(""),
  }, g));

  // the posts, on the inbound lane by the stop line, painted far to near
  const ringOf = (cx, cy, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
  const posts = ARMS.map(([u, v], i) => {
    const cx = u * PD + v * (HW / 2), cy = v * PD - u * (HW / 2);
    return { i, cx, cy, ring: ringOf(cx, cy, RR), inner: ringOf(cx, cy, RR - 1.4) };
  });
  const order = posts.slice().sort((a, b) => a.cx + a.cy - (b.cx + b.cy));
  for (const p of order) {
    const grp = mk("g", {}, g);
    p.rings = Array.from({ length: MAX }, () => ({ s: solid(grp), drawn: NaN }));
    p.h = tween((REST[p.i] - 1) * PITCH);
  }

  function draw(p, k, z) {
    const r = p.rings[k];
    if (z === r.drawn) return;
    r.drawn = z;
    put(r.s, prism(P, front, p.ring, p.inner, z, z + RT));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    // the stack telescopes: ring k stands at k pitches, or rides under the top ring at the stack's height h
    for (const p of posts) { const h = tval(p.h, now); p.rings.forEach((_, k) => draw(p, k, Math.min(k * PITCH, h))); if (!tdone(p.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Picks arm a (-1 is rest): its post stacks to its count from the foot up, the others sink to one ring. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? -1;
    act = a;
    const lit = a < 0 ? REST_LIT : a;
    posts.forEach((p) => {
      const n = a < 0 ? REST[p.i] : p.i === a ? COUNT[p.i] : 1;
      const d = from < 0 ? 0 : Math.min(Math.abs(p.i - from), 4 - Math.abs(p.i - from));
      tset(p.h, (n - 1) * PITCH, now, d * stag);
      p.rings[MAX - 1].s.sil.classList.toggle("hi", p.i === lit);
      kerbs[p.i].classList.toggle("hi", p.i === a);
    });
    read.textContent = a < 0 ? "rest" : `arm ${a + 1}`;
    B.wake();
  }
  setActive(-1, true);

  /** On the ground: the sector of the arm the pointer is over; the middle of the junction is rest. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const d = Math.hypot(x, y);
    if (d > A + 16 || d < HW) return -1;
    if (Math.abs(x) >= Math.abs(y)) return x > 0 ? 0 : 2;
    return y > 0 ? 1 : 3;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { stag = clamp(v, 0, 100); }, destroy: bag.dispose };
}

hairline({
  name: "junction",
  means: "A crossroads with a counter post on each arm: the arm under the pointer lights and its post stacks up to its count.",
  rules: [1, 2, 4, 5],
  range: [30, 60, 100],
  tour: [[290, 220], [110, 220], [120, 120], null],
  mount,
});
