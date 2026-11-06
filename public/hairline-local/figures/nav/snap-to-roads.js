/**
 * Snap Line: a road bending gently across the ground, and strewn either side
 * of it a trail of GPS fixes, dim dots that wander off the road as raw
 * positions do. The pointer passes along the road: every fix behind it is
 * pulled onto the road's middle and the snapped fixes join into one bright
 * line, the matched trace; the fixes just ahead lean in, the farther the less,
 * and the rest stay where they fell. At rest the first few fixes are matched,
 * a short bright line where the trace begins. The read-out counts the snapped
 * fixes. The slider is how far ahead of the pointer the pull reaches.
 *
 * The pattern: a field along a line. A spring per fix on how far it is pulled;
 * the hit test is the road's plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, lerp, open, poly, proj, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, register,
} = HL;

const X0 = -80, X1 = 80, HW = 8, TT = 3, N = 64, FIXES = 20, REST = 0.17;
/** The road's middle at s in 0..1. */
const mid = (s) => [X0 + (X1 - X0) * s, 20 * Math.sin(s * Math.PI * 1.3 - 0.75)];
// each fix: its place along the road, and how far off the middle it fell (+ the near side), a fixed scatter
const OFF = [14, -17, 21, -12, 16, -23, 13, 19, -15, -20, 12, 24, -14, 17, -19, 13, -22, 15, -13, 20];
const SLIP = [0.3, -0.4, 0.1, 0.5, -0.2, 0.4, -0.5, 0.2, 0.3, -0.3, 0.5, -0.1, 0.2, -0.4, 0.4, -0.2, 0.1, -0.5, 0.3, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const S = Array.from({ length: N + 1 }, (_, k) => k / N);
  const off = (s, w) => {
    const a = mid(s - 0.004), b = mid(s + 0.004), m = mid(s), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    return [m[0] - (w * dy) / l, m[1] + (w * dx) / l];
  };
  const shape = S.map((s) => off(s, HW)).concat(S.map((s) => off(s, -HW)).reverse());
  const rnd = fillet(shape, shape.map((_, k) => (k === N || k === N + 1 || k === 0 || k === 2 * N + 1 ? 5 : 0)));
  const fixes = OFF.map((w, i) => {
    const s = (i + 0.5 + SLIP[i] * 0.6) / FIXES;
    return { s, raw: off(s, w), on: mid(s), pull: spring(0), cls: "" };
  });
  fit(C, [...shape.map((p) => [p[0], p[1], -TT]), ...fixes.map((f) => [...f.raw, 0])], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  // the road: its foot and its top
  mk("path", { class: "sil", d: poly(rnd.map((p) => P(p[0], p[1], -TT))) }, g);
  mk("path", { class: "sil", d: poly(rnd.map((p) => P(p[0], p[1], 0))) }, g);
  mk("path", { class: "nf dash lo", d: open(S.filter((s) => s > 0.03 && s < 0.97).map((s) => P(...mid(s), 0))) }, g);
  // the matched trace, then the fixes over it
  const line = mk("path", { class: "nf hi" }, g);
  fixes.forEach((f) => { f.el = flatDot(g, C, 1.6, "dot off"); });

  /** How hard each fix is pulled, with the pointer at sp: all of it behind, falling off ahead. */
  const target = (f, sp) => (f.s <= sp ? 1 : clamp(1 - (f.s - sp) / reach, 0, 1) * 0.7);
  let sp = REST, drawn = "";
  const aim = () => fixes.forEach((f) => { f.pull.t = target(f, sp); });
  function draw() {
    const key = fixes.map((f) => f.pull.x.toFixed(3)).join();
    if (key === drawn) return;
    drawn = key;
    const run = [];
    fixes.forEach((f) => {
      const k = clamp(f.pull.x, 0, 1), at = P(lerp(f.raw[0], f.on[0], k), lerp(f.raw[1], f.on[1], k), 0);
      place(f.el, at);
      const cls = k > 0.9 ? "dot" : k > 0.15 ? "dot m" : "dot off";
      if (cls !== f.cls) { f.cls = cls; f.el.setAttribute("class", cls); }
      if (k > 0.9 && run.length === fixes.indexOf(f)) run.push(at);
    });
    // the line starts on the road's first end and runs through the snapped fixes, in order
    line.setAttribute("d", run.length ? open([P(...mid(0.02), 0), ...run]) : "");
  }
  aim();
  fixes.forEach((f) => { f.pull.x = f.pull.t; });
  draw();

  const B = register(stage, (dt) => { let m = false; for (const f of fixes) if (stepS(f.pull, dt)) m = true; draw(); return m; });
  bag.add(B.unregister);

  const count = () => fixes.filter((f) => f.s <= sp).length;
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const s = (x - X0) / (X1 - X0);
    if (s < -0.06 || s > 1.06 || Math.abs(y - mid(clamp(s, 0, 1))[1]) > 44) return leave();
    sp = clamp(s, 0, 1);
    aim();
    read.textContent = `${count()} snapped`;
    B.wake();
  }
  function leave() { sp = REST; aim(); read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 0.04, 0.3); aim(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "snap-to-roads",
  means: "Raw GPS fixes strewn beside a road: as the pointer passes along, the fixes behind it snap onto the road and join into one line.",
  rules: [1, 3, 4, 5],
  range: [0.06, 0.14, 0.26],
  tour: [[125, 122], [262, 212], [190, 192], null],
  mount,
});
