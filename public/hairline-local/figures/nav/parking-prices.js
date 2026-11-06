/**
 * Parking prices: a parking meter on a post at the kerb, beside an empty bay
 * painted on the road. The meter is a slim post with a collar at its foot and
 * a head wider than the post, its top rounded off, turned to face the bay. On
 * the head's face a round dial with twelve tick dots and one hand, and under
 * it a coin slot. At rest the hand stands at an hour and carries the bright
 * edge. The pointer's place along the bay is the stay: the hand sweeps there
 * on a spring, the ticks it passes light, and the bay's outline takes the
 * bright edge from the hand, the stretch of it the stay buys drawn inside. The slider is the longest stay the bay sells.
 *
 * The pattern: scrub. One spring for how long. The hit test is the ground
 * plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the street: a base tile, the pavement raised along its back, a bay painted on the road
const TX0 = -78, TX1 = 70, TY0 = -46, TY1 = 40, TT = 3, KY = -12, KH = 4;
const BX0 = -34, BX1 = 52, BY0 = -8, BY1 = 24;
// the meter on the pavement, at the bay's back corner, its face turned towards the bay
const MX = -46, MY = -24, PH = 50, HZ0 = 50, HZ1 = 88, HZ2 = 95, HW = 14, HD = 8;
const PHI = (58 * Math.PI) / 180, CP = Math.cos(PHI), SP = Math.sin(PHI);
const DZ = 74, DR = 10.5, TURN = 6, REST = 1;
const wp = (t, h, d) => [MX + t * SP + d * CP, MY - t * CP + d * SP, h];
const turn = (r) => r.map((q) => ({ ...q, u: MX + q.u * SP + q.v * CP, v: MY - q.u * CP + q.v * SP, nu: q.nu * SP + q.nv * CP, nv: q.nv * SP - q.nu * CP }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[TX0, TY0, -TT], [TX1, TY1, -TT], [TX1, TY0, -TT], [TX0, TY1, -TT], wp(-HW, HZ2, 0), wp(HW, HZ2, 0)], 200, 166);
  const P = proj(C), front = facing(C), pw = (t, h, d) => P(...wp(t, h, d)), at = (x, y) => P(x, y, 0);
  const g = mk("g", {}, svg);

  // the tile, the pavement on it, and a joint or two in the paving
  put(solid(g), prism(P, front, ...rings(TX0, TY0, TX1, TY1, 8, 1.8), -TT, 0));
  put(solid(g), prism(P, front, ...rings(TX0 + 3, TY0 + 3, TX1 - 3, KY, 4, 1.2), 0, KH));
  mk("path", { class: "nf lo", d: [-20, 18, 50].map((x) => open([P(x, TY0 + 6, KH), P(x, KY, KH)])).join("") }, g);
  // the bay: its painted outline on the road, and the lane's dashed edge beyond it
  const bay = mk("path", { class: "nf", d: poly(rrect(BX0, BY0, BX1, BY1, 1.5, 2).map((q) => at(q.u, q.v))) }, g);
  const paid = mk("path", { class: "nf hi" }, g);
  mk("path", { class: "nf dash lo", d: open([at(TX0 + 8, BY1 + 8), at(TX1 - 8, BY1 + 8)]) }, g);

  // the post and its collar
  const m = mk("g", {}, g), sh = (r) => r.map((q) => ({ ...q, u: q.u + MX, v: q.v + MY }));
  put(solid(m), prism(P, front, sh(circ(5.5, 24)), sh(circ(4.3, 24)), KH, KH + 4));
  put(solid(m), prism(P, front, sh(circ(2.8, 20)), sh(circ(2, 20)), KH + 4, PH + 1));
  // the head: a block wider than the post, its top rounded off into a shorter lid
  const foot = turn(rrect(-HW, -HD, HW, HD, 4, 6)), lid = turn(rrect(-HW + 3.5, -HD + 2, HW - 3.5, HD - 2, 3, 6));
  const lidIn = turn(rrect(-HW + 5, -HD + 3.4, HW - 5, HD - 3.4, 2, 6));
  put(solid(m), {
    sil: poly(hull(ringAt(P, foot, HZ0).concat(ringAt(P, foot, HZ1), ringAt(P, lid, HZ2)))),
    crease: open(ringAt(P, run(lidIn, front), HZ2)),
  });
  // the face: a seam under the lid, the dial's window, its ticks and hand, the coin slot below
  mk("path", { class: "nf lo", d: open([pw(-HW + 2, HZ1 - 1, HD), pw(HW - 2, HZ1 - 1, HD)]) }, m);
  const disc = (r, h, n = 48) => circ(r, n).map((q) => pw(q.u, h + q.v, HD + 0.1));
  mk("path", { class: "nf", d: poly(disc(DR, DZ)) }, m);
  mk("path", { class: "nf lo", d: poly(disc(DR + 1.8, DZ)) }, m);
  const ticks = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * 2 * Math.PI, el = flatDot(m, C, k % 3 ? 0.6 : 0.95, "dot off");
    place(el, pw((DR - 2.6) * Math.sin(a), DZ + (DR - 2.6) * Math.cos(a), HD + 0.2));
    return el;
  });
  const hand = mk("path", { class: "nf hi" }, m);
  place(flatDot(m, C, 1.3, "dot m"), pw(0, DZ, HD + 0.3));
  mk("path", { class: "nf sil", d: poly(rrect(-4.5, 57.2, 4.5, 59.4, 1, 3).map((q) => pw(q.u, q.v, HD + 0.1))) }, m);
  mk("path", { class: "nf lo", d: poly(rrect(-7, 55, 7, 61.6, 2, 3).map((q) => pw(q.u, q.v, HD + 0.1))) }, m);

  const sp = spring(REST);
  let drawn = "", on = false;
  function draw(h) {
    const key = h + "," + on + "," + most;
    if (key === drawn) return;
    drawn = key;
    // the stretch of bay the stay buys, from its near end, inside the painted outline
    const e = BX0 + 4 + clamp((h - 0.5) / (most - 0.5), 0.04, 1) * (BX1 - BX0 - 8);
    paid.setAttribute("d", on ? poly(rrect(BX0 + 4, BY0 + 4, e, BY1 - 4, 1, 2).map((q) => at(q.u, q.v))) : "");
    const a = (h / TURN) * 2 * Math.PI;
    hand.setAttribute("d", open([pw(0, DZ, HD + 0.3), pw((DR - 3) * Math.sin(a), DZ + (DR - 3) * Math.cos(a), HD + 0.3)]));
    ticks.forEach((t, j) => t.setAttribute("class", j > 0 && (j / 12) * TURN <= h + 1e-6 ? "dot m" : "dot off"));
  }
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function show(f) {
    on = f !== null;
    // a stay of half an hour at the bay's near end, the longest at its far end
    sp.t = on ? 0.5 + f * (most - 0.5) : REST;
    hand.setAttribute("class", on ? "nf sil" : "nf hi");
    bay.setAttribute("class", on ? "nf hi" : "nf");
    read.textContent = on ? `${Math.max(1, Math.round(sp.t))} h` : "rest";
    B.wake();
  }
  show(null);

  /** On the ground plane: over the bay, or the pavement beside it; the share along the bay is the stay. */
  let last = null;
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    last = x > BX0 - 10 && x < BX1 + 6 && y > TY0 && y < BY1 + 12 ? clamp((x - BX0) / (BX1 - BX0), 0, 1) : null;
    show(last);
  }
  bag.add(pointer(stage, { move, leave: () => { last = null; show(null); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { most = clamp(v, 2, 6); if (last !== null) show(last); }, destroy: bag.dispose };
}

hairline({
  name: "parking-prices",
  means: "A parking meter beside a bay: the pointer's place along the bay sets the stay, the dial's hand sweeps to it and the bay lights.",
  rules: [1, 3, 4, 5],
  range: [3, 4, 5.5],
  tour: [[160, 212], [195, 230], [234, 262], null],
  mount,
});
