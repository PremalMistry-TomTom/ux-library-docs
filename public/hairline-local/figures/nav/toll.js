/**
 * Toll: a stretch of road through a toll gate. On an island at the road's far
 * side stands a small booth, a cabin with windows under a flat roof that
 * overhangs it, and beside it the barrier: a squat housing and a long striped
 * arm across the road, its tip resting on a short post at the near kerb. A
 * stop line is painted across the lane before the gate. At rest the arm is
 * down and the booth's front window takes the bright edge, the place you pay.
 * As the pointer comes near the gate the arm lifts on its pivot, the nearer
 * the higher, and takes the bright edge from the window. The slider is the reach.
 *
 * The pattern: one place, on one spring. The hit test measures the pointer
 * against the gate's rest middle on screen, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rad, rings, rrect, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const S = 2.15, RX0 = -58, RX1 = 76, RW = 34;
const AXP = 32, AY = -2, AZ = 15, AL = 36, AH = 2.2, AT = 1.4, UP = 80, REST = 0;

/** The arm's outline in its own upright plane: t along the arm from the pivot, s across it. */
const ARM = fillet([[-4, -AH], [AL, -AH], [AL, AH], [-4, AH]], [1.6, 1.6, 1.6, 1.6], 4);

/** The share of the gate opened with the pointer u reaches from it: 1 to 40%, .3 at 80%, 0 from 130%. */
const falloff = (u) => (u <= 0.4 ? 1 : u <= 0.8 ? 1 - ((u - 0.4) / 0.4) * 0.7 : u <= 1.3 ? 0.3 - ((u - 0.8) / 0.5) * 0.3 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, S);
  fit(C, [[RX0, -24, -3], [RX1, RW + 4, -3], [RX1, -24, 0], [RX0, RW + 4, -3], [-20, -24, 34], [AXP, AY, AZ + AL + 4], [40, -24, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the island, then the road in front of it, its centre dashes broken at the gate, the stop line before it
  put(solid(g), prism(P, front, ...rings(-24, -24, 40, -1, 5, 1.6), 0, 4));
  put(solid(g), prism(P, front, ...rings(RX0, 0, RX1, RW + 4, 8, 2), -3, 0));
  mk("path", { class: "dash nf", d: open([P(RX0 + 6, RW / 2 + 2, 0), P(AXP - 26, RW / 2 + 2, 0)]) + open([P(AXP + 12, RW / 2 + 2, 0), P(RX1 - 6, RW / 2 + 2, 0)]) }, g);
  mk("path", { class: "nf lo", d: seg(P(AXP - 12, 3, 0), P(AXP - 12, RW + 1, 0)) + seg(P(AXP - 15, 3, 0), P(AXP - 15, RW + 1, 0)) }, g);

  // the booth: a cabin, a window in its front and its side, a roof that overhangs it
  put(solid(g), prism(P, front, ...rings(-16, -19, 4, -6, 2.5, 1.2), 4, 30));
  const win = mk("path", { class: "nf hi", d: poly(rrect(-13, 15, 1, 26, 2, 4).map((q) => P(q.u, -6, q.v))) }, g);
  mk("path", { class: "nf lo", d: poly(rrect(-17, 15, -8, 26, 2, 4).map((q) => P(4, q.u, q.v))) + seg(P(-16, -6, 10), P(4, -6, 10)) }, g);
  put(solid(g), prism(P, front, ...rings(-20, -23, 8, -2, 4, 1.4), 30, 33.5));

  // the housing the arm turns on
  put(solid(g), prism(P, front, ...rings(AXP - 4, -9, AXP + 4, -3, 2, 1), 4, AZ + 4));

  // the arm, turned th degrees up about its pivot: along it runs (0, cos th, sin th)
  const armS = solid(g), stripes = mk("path", { class: "nf lo" }, g), hub = mk("path", { class: "nf" }, g);
  let drawn = NaN;
  function draw(th) {
    if (th === drawn) return;
    drawn = th;
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const at = (t, h, w) => P(AXP + w, AY + t * c - h * s, AZ + t * s + h * c);
    const A = ARM.map(([t, h]) => at(t, h, AT)), Bk = ARM.map(([t, h]) => at(t, h, -AT));
    put(armS, { sil: poly(hull(A.concat(Bk))), crease: poly(A) });
    let st = "";
    for (let t = 8; t < AL - 2; t += 6) st += seg(at(t, -AH + 0.4, AT), at(t + 2.5, AH - 0.4, AT));
    stripes.setAttribute("d", st);
    hub.setAttribute("d", poly(Array.from({ length: 12 }, (_, k) => at(1.3 * Math.cos((k / 12) * 2 * Math.PI), 1.3 * Math.sin((k / 12) * 2 * Math.PI), AT))));
  }

  // the rest post at the near kerb, painted after the arm it holds
  put(solid(g), prism(P, front, ...rings(AXP - 1.8, RW + 0.5, AXP + 1.8, RW + 4, 1.2, 0.6), 0, AZ - AH - 0.4));

  const sp = spring(0, { eps: 0.002 });
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(lerp(REST, UP, sp.x)); return m; });
  bag.add(B.unregister);

  const mid = P(AXP, RW / 2, AZ);
  let lit = null;
  function retarget() {
    const c = over ? falloff(Math.hypot(over[0] - mid[0], (over[1] - mid[1]) * 0.8) / reach) : 0;
    sp.t = c;
    const on = c > 0.4;
    if (on !== lit) {
      lit = on;
      armS.sil.classList.toggle("hi", on);
      win.classList.toggle("hi", !on);
    }
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 40, 300); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "toll",
  means: "A toll booth by the road and a barrier across it: as the pointer comes near, the arm lifts, the nearer the higher.",
  rules: [1, 3, 4, 8],
  range: [80, 120, 170],
  tour: [[340, 260], [270, 200], [215, 165], null],
  mount,
});
