/**
 * Road Profile: a road running ahead, bending once to the left and once to the
 * right, its middle dashed. Over it, held up on dashed posts, a ribbon traces
 * what the road does next: it follows the road's bends from above, and its
 * height is the road's climb and fall. A marker rides the ribbon, a dot with a
 * dashed drop to the road under it; the stretch of ribbon round it carries the
 * bright edge. The pointer scrubs along the road: the marker follows, on a
 * spring, and the lit stretch with it. The read-out is the gradient under the
 * marker. The slider is how long the lit stretch is.
 *
 * The pattern: scrub. A spring on where along the road; the hit test is the
 * road's plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, open, poly, proj, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, register,
} = HL;

const X0 = -80, X1 = 80, HW = 9, TT = 3, N = 64, H0 = 40, RW = 4, TB = 1.6, REST = 0.7;
/** The road's middle at s in 0..1: x along, y bending. */
const mid = (s) => { const x = X0 + (X1 - X0) * s; return [x, 16 * Math.sin(s * Math.PI * 1.6 - 0.4)]; };
/** The ribbon's height over the road: a climb, a crest, a dip. */
const elev = (s) => H0 + 8 * Math.sin(2 * Math.PI * (s - 0.15)) + 2 * Math.sin(5 * Math.PI * s);
const grade = (s) => Math.round((elev(s + 0.01) - elev(s - 0.01)) / 0.02 / 9);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  const S = Array.from({ length: N + 1 }, (_, k) => k / N);
  /** A point w off the road's middle at s, along its normal: +w is the near side. */
  const off = (s, w) => {
    const a = mid(s - 0.004), b = mid(s + 0.004), m = mid(s), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    return [m[0] - (w * dy) / l, m[1] + (w * dx) / l];
  };
  const shape = S.map((s) => off(s, HW)).concat(S.map((s) => off(s, -HW)).reverse());
  const rnd = fillet(shape, shape.map((_, k) => (k === N || k === N + 1 || k === 0 || k === 2 * N + 1 ? 5 : 0)));
  fit(C, [...shape.map((p) => [p[0], p[1], -TT]), ...S.map((s) => [...mid(s), elev(s) + 2])], 200, 166);
  const P = proj(C), at = (s, z) => P(...mid(s), z);
  const edge = (w, ss, dz = 0) => ss.map((s) => P(...off(s, w), elev(s) + dz));
  const band = (ss) => edge(RW, ss).concat(edge(-RW, ss.slice().reverse()));

  const g = mk("g", {}, svg);
  // the road: its foot, its top, its dashed middle
  mk("path", { class: "sil", d: poly(rnd.map((p) => P(p[0], p[1], -TT))) }, g);
  mk("path", { class: "sil", d: poly(rnd.map((p) => P(p[0], p[1], 0))) }, g);
  mk("path", { class: "nf dash", d: open(S.filter((s) => s > 0.03 && s < 0.97).map((s) => at(s, 0))) }, g);
  // the posts, dashed, from the road's middle up under the ribbon; the marker's drop and its foot on the road
  const POSTS = 13;
  const posts = Array.from({ length: POSTS }, (_, k) => { const s = (k + 0.5) / POSTS; return { s, el: mk("path", { class: "nf dash lo", d: open([at(s, 0), at(s, elev(s) - TB)]) }, g) }; });
  const drop = mk("path", { class: "nf hi" }, g);
  const puck = flatDot(g, C, 1.8, "dot");
  // the ribbon: a band over the road, its near edge's thickness under it, then the lit stretch
  mk("path", { class: "nf lo", d: open(edge(RW, S, -TB)) }, g);
  mk("path", { class: "sil", d: poly(band(S)) }, g);
  const lit = mk("path", { class: "nf hi" }, g);

  const pos = spring(REST);
  let drawn = "";
  function draw() {
    const s = clamp(pos.x, 0, 1), key = s.toFixed(4) + "," + reach;
    if (key === drawn) return;
    drawn = key;
    const a = clamp(s - reach / 2, 0, 1), b = clamp(s + reach / 2, 0, 1), ss = [];
    for (let k = 0; k <= 24; k++) ss.push(a + ((b - a) * k) / 24);
    lit.setAttribute("d", poly(band(ss)));
    drop.setAttribute("d", open([at(s, elev(s) - TB), at(s, 0)]));
    place(puck, at(s, 0));
    for (const q of posts) q.el.setAttribute("class", Math.abs(q.s - s) < reach * 0.9 ? "nf dash" : "nf dash lo");
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(); return m; });
  bag.add(B.unregister);

  /** On the road's plane: where along it, by x; anywhere over the road and a margin round it. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const s = (x - X0) / (X1 - X0);
    if (s < -0.06 || s > 1.06 || Math.abs(y - mid(clamp(s, 0, 1))[1]) > 46) return leave();
    pos.t = clamp(s, 0.03, 0.97);
    const gr = grade(pos.t);
    read.textContent = (gr > 0 ? "+" : gr < 0 ? "−" : "") + Math.abs(gr) + "%";
    B.wake();
  }
  function leave() { pos.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 0.08, 0.3); drawn = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "adas-data",
  means: "A road with a ribbon over it tracing its bends and gradient ahead: the pointer scrubs a marker along and the profile under it lights.",
  rules: [1, 3, 4, 8],
  range: [0.1, 0.18, 0.28],
  tour: [[200, 215], [285, 250], [130, 192], null],
  mount,
});
