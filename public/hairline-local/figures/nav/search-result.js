/**
 * Search result: a phone lying flat, a thick rounded slab with its screen
 * inset, a speaker slot at its top and a home bar at its foot. On the screen
 * a search field, a long pill, and under it a list of three result rows,
 * thin plates each with a pin dot in a ring at its start and two dashes of
 * text, a title and a line under it, no two alike. At rest the rows sit a
 * hair proud of the screen, the first the most, and the search field carries
 * the bright edge. The row under the pointer rises out of the list and takes
 * the bright edge and its dot; its neighbours lift a little, less the
 * farther they are, staggered outwards from it. The slider is the lift.
 *
 * The pattern: one of many. Tweens for which row, and a hit test on the
 * screen's plane at the rows' rest height, which never moves: which row's
 * band along the phone the pointer is in.
 */
const {
  Cam, circ, clamp, fit, poly, prism, proj, rings, rrect, seg, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid, facing,
} = HL;

// the phone: L along x (its top at x 0, up the screen), W across y, SZ thick
const L = 150, W = 76, SZ = 7, RT = 2, LMAX = 26, STEP = 45;
const ROWS = [[40, 68], [73, 101], [106, 134]];
const REST = [3, 1.2, 0.4];
// where each row's title and the line under it end, across the row (y), so no two read alike
const TEXT = [[18, 30], [24, 34], [14, 26]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [ROWS[0][0], 0, SZ + LMAX + RT], [ROWS[0][0], W, SZ + LMAX + RT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const flat = (r, z) => poly(r.map((q) => P(q.u, q.v, z)));

  // the phone: a slab, its screen inset, a speaker slot at the top, a home bar at the foot
  const [ring, inner] = rings(0, 0, L, W, 12, 1.8);
  put(solid(g), prism(P, front, ring, inner, 0, SZ));
  mk("path", { class: "nf lo", d: flat(rrect(9, 5, L - 9, W - 5, 7, 6), SZ) }, g);
  mk("path", { class: "nf lo", d: flat(rrect(3.2, W / 2 - 9, 5.8, W / 2 + 9, 1.3, 4), SZ) }, g);
  mk("path", { class: "nf lo", d: flat(rrect(L - 6, W / 2 - 12, L - 4, W / 2 + 12, 1, 4), SZ) }, g);

  // the search field: a long pill, the bright mark at rest
  const field = mk("path", { class: "nf sil", d: flat(rrect(16, 11, 30, W - 11, 7, 6), SZ) }, g);
  mk("path", { class: "nf lo", d: seg(P(23, W - 21, SZ), P(23, W - 48, SZ)) }, g);

  const rows = ROWS.map(([x0, x1], i) => {
    const grp = mk("g", {}, g);
    const shape = rrect(x0, 10, x1, W - 10, 4, 5);
    const el = {
      foot: mk("path", { class: "sil" }, grp), top: mk("path", { class: "" }, grp),
      pin: mk("path", { class: "nf" }, grp), title: mk("path", { class: "nf" }, grp), text: mk("path", { class: "nf lo" }, grp),
    };
    const dot = flatDot(grp, C, 1.8, "dot off");
    return { i, x0, x1, shape, el, dot, z: tween(REST[i]), drawn: NaN };
  });

  function draw(r, z) {
    if (z === r.drawn) return;
    r.drawn = z;
    const zt = SZ + z + RT, xm = (r.x0 + r.x1) / 2, py = W - 20, [t1, t2] = TEXT[r.i];
    r.el.foot.setAttribute("d", flat(r.shape, SZ + z));
    r.el.top.setAttribute("d", flat(r.shape, zt));
    r.el.pin.setAttribute("d", flat(circ(5, 20).map((q) => ({ u: q.u + xm, v: q.v + py })), zt));
    place(r.dot, P(xm, py, zt));
    r.el.title.setAttribute("d", seg(P(xm - 4, py - 10, zt), P(xm - 4, t1, zt)));
    r.el.text.setAttribute("d", seg(P(xm + 4.5, py - 10, zt), P(xm + 4.5, t2, zt)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rows) { draw(r, tval(r.z, now)); if (!tdone(r.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Raises row a out of the list (-1 is rest, the field focused); neighbours lift less the farther they are. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? 0;
    act = a;
    rows.forEach((r) => {
      const d = Math.abs(r.i - from), z = a < 0 ? REST[r.i] : lift * [1, 0.22, 0.06][Math.abs(r.i - a)];
      tset(r.z, z, now, d * STEP);
      r.el.top.classList.toggle("sil", r.i === a);
      r.el.top.classList.toggle("hi", r.i === a);
      r.dot.setAttribute("class", r.i === a ? "dot" : "dot off");
    });
    field.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : `row ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On the screen's plane at the rows' rest height: the row whose band along the phone holds the pointer. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], SZ + RT);
    if (y < 4 || y > W - 4 || x < ROWS[0][0] - 2 || x > ROWS[2][1] + 2) return -1;
    let best = 0;
    ROWS.forEach(([x0, x1], i) => { if (Math.abs(x - (x0 + x1) / 2) < Math.abs(x - (ROWS[best][0] + ROWS[best][1]) / 2)) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 10, LMAX); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "search-result",
  means: "A phone with a search field and three result rows: the row under the pointer rises out of the list, its neighbours a little.",
  rules: [1, 2, 3, 4],
  range: [12, 18, 26],
  tour: [[200, 140], [235, 175], [270, 205], null],
  mount,
});
