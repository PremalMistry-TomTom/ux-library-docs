/**
 * Theming: a navigation panel lying on the desk and, beside it, a tray of
 * four token blocks, the brand's tokens. The panel is a thin plate with a
 * header bar along its far edge, a map below it with a route drawn from a dot,
 * and a round button in the near corner. Each block is a small cube with the
 * shape of what it drives raised on its top: a frame, a bar, a line, a disc.
 * At rest one block, the header's, stands a little out of the tray and the
 * header carries the bright edge. The pointer picks a block along the row: it
 * lifts out of the tray, its neighbours lift a little after it, staggered by
 * distance, and the part of the panel it drives takes the bright edge. Let go,
 * they settle back. The slider is the lift.
 *
 * The pattern: one of many. A tween per block, delay by distance, the lift
 * falling off with it. The hit test is the blocks' rest centres along the row,
 * which never move.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, pointer, put, place, register, solid,
} = HL;

// the panel, PT thick; the tray along y to its right, WH deep; the blocks, B square and BH tall
const PX0 = -52, PY0 = -40, PX1 = 12, PY1 = 22, PT = 3;
const TX0 = 30, TY0 = -38, TX1 = 50, TY1 = 22, WT = 2.2, WH = 5, FL = 1.2, B = 13, BH = 10, STEP = 45;
const YS = [-26, -13.3, -0.7, 12], XC = (TX0 + TX1) / 2, REST = [0, 4, 0, 1], START = 1;
const ROUTE = [[-44, 10], [-30, 10], [-30, -6], [-12, -6], [-12, -22], [4, -22]];
const shift = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[PX0, PY0, 0], [PX0, PY1, 0], [TX1, TY1, 0], [TX0, TY1, 0], [TX1, TY0, 0], [XC - B / 2, YS[0] - B / 2, BH + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the panel: its plate, the map's streets under the route, the header bar, the route and its dot, the button
  const panel = solid(g);
  put(panel, prism(P, front, rrect(PX0, PY0, PX1, PY1, 7, 12), rrect(PX0 + 1.6, PY0 + 1.6, PX1 - 1.6, PY1 - 1.6, 5.4, 12), 0, PT));
  const at = (pts) => open(pts.map(([x, y]) => P(x, y, PT)));
  mk("path", { class: "nf lo", d: at([[PX0 + 3, -15], [PX1 - 3, -15]]) + at([[-40, -27], [-40, PY1 - 3]]) + at([[-21, -27], [-21, PY1 - 3]]) + at([[-2, -27], [-2, PY1 - 3]]) + at([[PX0 + 3, 2], [PX1 - 3, 2]]) }, g);
  const header = solid(g);
  put(header, prism(P, front, ...rings(PX0 + 4, PY0 + 4, PX1 - 4, PY0 + 11, 2.5, 0.8), PT, PT + 1.6));
  const route = mk("path", { class: "nf", d: at(ROUTE) }, g);
  const pin = flatDot(g, C, 1.8, "dot m");
  place(pin, P(ROUTE[0][0], ROUTE[0][1], PT));
  const button = solid(g), bc = [PX1 - 10, PY1 - 10];
  put(button, prism(P, front, shift(circ(5.5, 28), ...bc), shift(circ(4.4, 28), ...bc), PT, PT + 2.6));
  const parts = [{ el: panel.sil }, { el: header.sil }, { el: route, line: true }, { el: button.sil }];

  // the tray's far half: body, the rim's inner edge, the floor seam
  const outer = rrect(TX0, TY0, TX1, TY1, 5, 6), inner = rrect(TX0 + WT, TY0 + WT, TX1 - WT, TY1 - WT, 5 - WT, 6);
  mk("path", { class: "sil", d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))) }, g);
  mk("path", { class: "nf", d: poly(ringAt(P, inner, WH)) }, g);
  mk("path", { class: "nf lo", d: open(ringAt(P, run(inner, (q) => !front(q)), FL)) }, g);

  // the blocks, far to near along y: a cube each, the shape of its part raised on its top
  const [br, bi] = rings(-B / 2, -B / 2, B / 2, B / 2, 1.6, 1);
  const marks = [
    (x, y, z) => poly(rrect(x - 3.4, y - 3.4, x + 3.4, y + 3.4, 1.2, 4).map((q) => P(q.u, q.v, z))),
    (x, y, z) => poly(rrect(x - 3.6, y - 3.6, x + 3.6, y - 1.2, 0.8, 3).map((q) => P(q.u, q.v, z))),
    (x, y, z) => open([[x - 3.6, y + 2], [x - 1, y + 2], [x - 1, y - 2], [x + 3.6, y - 2]].map(([u, v]) => P(u, v, z))),
    (x, y, z) => poly(circ(2.6, 20).map((q) => P(q.u + x, q.v + y, z))),
  ];
  const blocks = YS.map((y, i) => {
    const grp = mk("g", {}, g), el = solid(grp), mark = mk("path", { class: "nf" }, grp);
    return { i, y, grp, el, mark, z: tween(REST[i]), drawn: NaN };
  });
  function draw(b, z) {
    if (z === b.drawn) return;
    b.drawn = z;
    const z0 = FL + z, z1 = z0 + BH;
    put(b.el, prism(P, front, shift(br, XC, b.y), shift(bi, XC, b.y), z0, z1));
    b.mark.setAttribute("d", marks[b.i](XC, b.y, z1));
  }

  // the tray's near half, over the blocks in it: one opaque piece from the rim's inner edge down
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { class: "fo", d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]) }, g);
  mk("path", { class: "nf lo", d: open(oT) }, g);
  mk("path", { class: "nf", d: open(iF) }, g);
  mk("path", { class: "nf sil", d: open([oT[0], ...oB, oT[oT.length - 1]]) }, g);

  const Bk = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of blocks) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(Bk.unregister);

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : START;
    act = a;
    const lit = a < 0 ? START : a;
    blocks.forEach((b) => {
      const d = Math.abs(b.i - from), fall = [1, 0.3, 0.12, 0.08][d];
      tset(b.z, a < 0 ? REST[b.i] : lift * fall, now, d * STEP);
    });
    parts.forEach((p, i) => p.el.classList.toggle("hi", i === lit));
    pin.setAttribute("class", lit === 2 ? "dot" : "dot m");
    read.textContent = a < 0 ? "rest" : `token ${a + 1}`;
    Bk.wake();
  }
  setActive(-1);

  /** Over the tray: the block whose rest centre is nearest the pointer's screen x. */
  const cx = YS.map((y) => P(XC, y, FL + BH)[0]);
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], FL + BH);
    if (x < TX0 - 10 || x > TX1 + 6 || y < TY0 - 4 || y > TY1 + 4) return -1;
    let k = 0;
    cx.forEach((c, i) => { if (Math.abs(c - p[0]) < Math.abs(cx[k] - p[0])) k = i; });
    return k;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 12, 28); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "theming",
  means: "Token blocks in a tray beside a nav panel: the block under the pointer lifts and the part of the panel it drives lights.",
  rules: [1, 2, 3, 4],
  range: [12, 20, 28],
  tour: [[150, 200], [215, 235], [270, 260], null],
  mount,
});
