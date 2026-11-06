/**
 * Map image: a map rendered to order and handed out as one sheet. A server
 * box, three units tall, a seam between each, vents and a status light on its
 * side; a slot across the front of its top unit, and a map sheet coming out of the slot like
 * a print, its streets, river and a park on it. At rest the sheet is part way
 * out and the status light is the bright mark. The pointer over the box or
 * the sheet pulls the sheet out, the map coming with it, and its edge takes
 * the bright stroke; let go, it slides back to rest. The slider is how far
 * the sheet comes out.
 *
 * The pattern: one choice, out or rest. A tween for the pull, and a hit test
 * on fixed planes, which never move: the box's foot and lid, and the sheet at its furthest.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X0 = -34, X1 = 34, Y0 = -42, Y1 = 42, ZH = 54, ZS = 43, SW = 32, TT = 1.4, PL = 92, MAXP = 80, REST = 30;
// the map on the sheet, in its own frame: p from the leading edge back, y across
const STREETS = [[[6, -24], [86, -24]], [[30, -32], [30, 32]], [[6, 10], [50, 10], [64, -2], [86, -2]], [[66, 14], [66, 32]], [[48, -32], [48, -24]]];
const RIVER = Array.from({ length: 19 }, (_, k) => { const p = 4 + k * 4.6; return [p, 22 + 5 * Math.sin(p / 11)]; });
const PARK = [[70, 18], [84, 30]];

/** A segment clipped to p in [a, b], or null. */
function cut([[p0, y0], [p1, y1]], a, b) {
  const lo = Math.min(p0, p1), hi = Math.max(p0, p1);
  if (hi <= a || lo >= b) return null;
  const at = (p) => (p1 === p0 ? y0 : y0 + ((y1 - y0) * (p - p0)) / (p1 - p0));
  const s = clamp(p0, a, b), e = clamp(p1, a, b);
  return [[s, p1 === p0 ? y0 : at(s)], [e, p1 === p0 ? y1 : at(e)]];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, ZH], [X1 + MAXP, -SW, ZS], [X1 + MAXP, SW, ZS]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0, Y0, X1, Y1, 7, 2);
  const box = solid(g);
  put(box, prism(P, front, br, bi, 0, ZH));
  // the seam between the two units, round the faces that show
  const seamRing = rrect(X0, Y0, X1, Y1, 7, 6);
  mk("path", { class: "nf lo", d: open(ringAt(P, run(seamRing, front), ZH / 3)) + open(ringAt(P, run(seamRing, front), (2 * ZH) / 3)) }, g);
  // on the side: vents in the lower unit, and the status light in the upper
  const onSide = (x, z) => P(x, Y1, z);
  let vents = "";
  for (let u = 0; u < 2; u++) for (let k = 0; k < 4; k++) vents += open([onSide(4 + k * 6, 5 + u * 18), onSide(4 + k * 6, 13 + u * 18)]);
  mk("path", { class: "nf lo", d: vents }, g);
  const led = flatDot(g, C, 2.2, "dot");
  place(led, onSide(-24, ZH - 9));
  mk("path", { class: "nf lo", d: open([onSide(-14, ZH - 9), onSide(18, ZH - 9)]) }, g);
  // the slot across the front, the sheet coming out of its lower lip
  const slot = rrect(-SW - 3, ZS - 1.5, SW + 3, ZS + 3.5, 1.6, 3);
  mk("path", { class: "nf", d: poly(slot.map((q) => P(X1, q.u, q.v))) }, g);

  const sheet = solid(g), map = mk("path", { class: "nf lo" }, g), river = mk("path", { class: "nf" }, g);
  const out = tween(REST);
  let drawn = NaN;
  function draw(L) {
    if (L === drawn) return;
    drawn = L;
    // a sheet of paper: square where it leaves the slot, round at its leading corners
    const fp = fillet([[X1, -SW], [X1 + L, -SW], [X1 + L, SW], [X1, SW]], [0, 3, 3, 0], 3);
    const top = fp.map(([x, y]) => P(x, y, ZS + TT)), bot = fp.map(([x, y]) => P(x, y, ZS));
    put(sheet, { sil: poly(hull(top.concat(bot))), crease: poly(top) });
    // the map moves with the sheet: p = 0 is its leading edge, at x = X1 + L
    const at = (p, y) => P(X1 + L - p, y, ZS + TT);
    const lines = (ls) => ls.flatMap((l) => l.slice(1).map((b, k) => cut([l[k], b], 1.5, L - 1.5))).filter(Boolean).map((s) => open(s.map(([p, y]) => at(p, y)))).join("");
    const riv = (dy) => lines([RIVER.map(([p, y]) => [p, y + dy])]);
    const pk = PARK[1][0] < L - 1.5 ? poly(rrect(PARK[0][0], PARK[0][1], PARK[1][0], PARK[1][1], 2.5, 3).map((q) => at(q.u, q.v))) : "";
    map.setAttribute("d", lines(STREETS) + pk);
    river.setAttribute("d", riv(0) + riv(4));
  }

  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on, force) {
    if (on === act && !force) return;
    act = on;
    tset(out, on ? pull : REST, performance.now(), 0);
    sheet.sil.classList.toggle("hi", on);
    led.setAttribute("class", on ? "dot m" : "dot");
    read.textContent = on ? "sheet" : "rest";
    B.wake();
  }
  setActive(false);

  /** On the ground: over the box's footprint, or the sheet's at its furthest. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), [xs, ys] = unproj(C, p[0], p[1], ZS), [xt, yt] = unproj(C, p[0], p[1], ZH);
    const inBox = (a, b) => a > X0 - 6 && a < X1 + 6 && b > Y0 - 6 && b < Y1 + 6;
    return inBox(x, y) || inBox(xt, yt) || (x > X0 - 6 && x < X1 + 6 && y > Y0 - 6 && y < Y1 + 6) || (xs > X1 && xs < X1 + MAXP + 6 && Math.abs(ys) < SW + 8);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { pull = clamp(v, 50, MAXP); if (act) setActive(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "map-image",
  means: "A server box prints a map: the pointer pulls the sheet out of its slot, the map with it, and its edge lights.",
  rules: [1, 4, 5, 8],
  range: [50, 66, 80],
  tour: [[150, 150], [290, 230], [150, 150], null],
  mount,
});
