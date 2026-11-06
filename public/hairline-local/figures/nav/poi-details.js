/**
 * POI details: a shop front on a strip of pavement, a flat-roofed block with
 * a shop window and a door in its long front, and at its left corner a
 * hanging sign: a wall bracket with a brace, and a thick plate hung from its
 * end on one rod. One face of the plate is plain, framed; the other carries a
 * clock, the opening hours. At rest the plate hangs a little turned, its
 * plain face out, and takes the bright edge. As the pointer comes near the
 * shop, the plate turns over on its rod to its clock face, and the door
 * lights: the bright goes from the sign to the door. The slider is the reach.
 *
 * The pattern: one place, opened or not. A tween for the turn (a discrete
 * change), and a hit test on the shop's rest middle on screen, which never moves.
 */
const {
  Cam, circ, clamp, fillet, fit, hull, open, poly, prism, proj, rad, rings, rrect, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, facing,
} = HL;

const S = 1.85, BW = 100, BD = 46, BH = 50;
const AX = 6, AL = 40, AZ = 46, PW = 30, PH = 22, PT = 2.8, HANG = 3;
const REST = -22, OPEN = 158;

/** The plate's outline in its own upright plane: t across, s up from its foot. */
const PLATE = fillet([[-PW / 2, 0], [PW / 2, 0], [PW / 2, PH], [-PW / 2, PH]], [3, 3, 3, 3], 4);
const FRAME = fillet([[-PW / 2 + 2.2, 2.2], [PW / 2 - 2.2, 2.2], [PW / 2 - 2.2, PH - 2.2], [-PW / 2 + 2.2, PH - 2.2]], [1.4, 1.4, 1.4, 1.4], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, S);
  const hy = BD + AL - PW / 2 - 2, z0 = AZ - HANG - PH;
  fit(C, [[-14, -6, -3], [BW + 6, BD + 36, -3], [BW + 6, -6, -3], [-14, BD + 36, -3], [0, 0, BH + 4], [AX, BD + AL, AZ]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the pavement the shop stands on
  put(solid(g), prism(P, front, ...rings(-14, -6, BW + 6, BD + 36, 6, 2), -3, 0));
  mk("path", { class: "nf lo", d: open([P(-8, BD + 22, 0), P(BW, BD + 22, 0)]) }, g);

  // the shop: a block, its window and door in the front, a band under the roof line
  put(solid(g), prism(P, front, ...rings(0, 0, BW, BD, 4, 1.6), 0, BH));
  put(solid(g), prism(P, front, ...rings(-2.5, -2.5, BW + 2.5, BD + 2.5, 5, 1.6), BH, BH + 4));
  const onFront = (u0, v0, u1, v1, r) => poly(rrect(u0, v0, u1, v1, r, 5).map((q) => P(q.u, BD, q.v)));
  mk("path", { class: "nf", d: onFront(18, 6, 60, 38, 3) }, g);
  mk("path", { class: "nf lo", d: onFront(20.5, 8.5, 57.5, 35.5, 1.5) + seg(P(39, BD, 8.5), P(39, BD, 35.5)) }, g);
  const door = mk("path", { class: "nf", d: onFront(68, 0.5, 88, 38, 3) }, g);
  const pane = mk("path", { class: "nf lo", d: onFront(71, 20, 85, 35, 1.5) }, g);
  mk("path", { class: "nf lo", d: seg(P(83, BD, 15), P(83, BD, 19)) }, g);

  // the bracket: an arm straight out of the wall, a brace under it
  mk("path", { class: "nf sil", d: open([P(AX, BD, AZ), P(AX, BD + AL, AZ)]) + open([P(AX, BD, AZ - 12), P(AX, BD + AL - 10, AZ)]) }, g);
  mk("path", { class: "nf", d: seg(P(AX, hy, AZ), P(AX, hy, AZ - HANG)) }, g);

  // the plate, turned a degrees about its rod: across it runs (sin a, cos a), through it (cos a, -sin a)
  const plateS = solid(g), face = mk("path", { class: "nf lo" }, g), hands = mk("path", { class: "nf" }, g);
  plateS.sil.classList.add("hi");
  let drawn = NaN;
  function draw(a) {
    if (a === drawn) return;
    drawn = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (t, h, w) => P(AX + t * s + w * c, hy + t * c - w * s, z0 + h);
    // the face toward the camera is the one whose normal leans to +x +y
    const side = c - s > 0 ? 1 : -1, w = (side * PT) / 2;
    const A = PLATE.map(([t, h]) => at(t, h, w)), Bk = PLATE.map(([t, h]) => at(t, h, -w));
    put(plateS, { sil: poly(hull(A.concat(Bk))), crease: poly(A) });
    if (side > 0) {
      face.setAttribute("d", poly(FRAME.map(([t, h]) => at(t, h, w))));
      hands.setAttribute("d", "");
    } else {
      const m = PH / 2;
      face.setAttribute("d", poly(circ(7.5, 28).map((q) => at(q.u, m + q.v, w))));
      hands.setAttribute("d", seg(at(0, m, w), at(0, m + 5.6, w)) + seg(at(0, m, w), at(4, m - 1.4, w)));
    }
  }

  const tw = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(BW / 2, BD / 2, BH / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? OPEN : REST, performance.now(), 0);
    plateS.sil.classList.toggle("hi", !on);
    door.classList.toggle("hi", on);
    pane.classList.toggle("hi", on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);

  const near = (p) => Math.hypot(p[0] - mid[0], (p[1] - mid[1]) * 0.8) < reach;
  bag.add(pointer(stage, { move: (p) => setActive(near(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 40, 200); }, destroy: bag.dispose };
}

hairline({
  name: "poi-details",
  means: "A shop front with a hanging sign: as the pointer comes near, the sign turns to its clock face and the door lights.",
  rules: [1, 4, 5, 8],
  range: [70, 110, 150],
  tour: [[360, 280], [150, 165], [225, 120], null],
  mount,
});
