/**
 * HUD: a car driving away from us up a road, seen from behind and to its
 * left. The car is a body with a narrower cabin on it, the windscreen
 * sloping forward to a bonnet, the rear window and a side window on the
 * faces we see, its wheels at the corners. Ahead of it the road runs on, a
 * slab with a dashed centre line, and bends. Just in front of the
 * windscreen, floating above the bonnet where a head-up display puts it,
 * is the route's echo: a small dim pane, the display's image, and on it a
 * little road, two edges narrowing as they rise and lean into the bend, a
 * dot at its tip. The pointer's place across the
 * road bends the road ahead left or right, on a spring, and the echo leans
 * with it; it is the bright mark, at rest and under the pointer. At rest
 * the road bends gently right. The slider is how far the road can bend.
 *
 * The pattern: scrub. One spring for the bend. The hit test is the ground
 * plane, which never moves: the pointer's distance across the road sets
 * the spring's target.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the road in its own frame: s ahead of the car (world -x), t to the driver's right (world -y)
const S0 = -36, S1 = 96, BEND0 = 26, HW = 19, REST = 14;
// the car, its front at -x: CW its half width, wheels of radius WR at ±WX
const CW = 11, WR = 5, WX = 15, ZB = 4, ZW = 12, ZT = 21;
// the echo: an upright plane across the car at x = EX, above the bonnet, just ahead of the glass
const EX = -14, EZ = ZT - 2, EH = 15, EW = 9;
const W = (s, t, z) => [-s, -t, z];

const centre = (s, b) => (s <= BEND0 ? 0 : b * ((s - BEND0) / (S1 - BEND0)) ** 2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [W(S0, -HW, 0), W(S0, HW, 0), W(S1, -44 - HW, 0), W(S1, 44 + HW, 0), [EX, 0, EZ + EH], [14, CW, ZT]], 200, 166);
  const P = proj(C), front = facing(C), at = (w) => P(w[0], w[1], w[2]);
  const g = mk("g", {}, svg);

  // the road, its kerb lines and its dashed middle, redrawn as it bends
  const road = mk("path", { class: "sil" }, g), kerb = mk("path", { class: "nf lo" }, g), mid = mk("path", { class: "dash nf" }, g);

  // a wheel on one side: a tyre and its hub, standing in the x-z plane at y
  const wheel = (y) => [-WX, WX].forEach((cx) => {
    const ring = (r) => poly(Array.from({ length: 24 }, (_, k) => { const a = (2 * Math.PI * k) / 24; return P(cx + r * Math.cos(a), y, WR + r * Math.sin(a)); }));
    mk("path", { class: "sil", d: ring(WR) }, g);
    mk("path", { class: "nf lo", d: ring(1.8) }, g);
  });
  wheel(-CW - 0.4);
  // the body, then the cabin on it: its foot on the body's top, its roof narrower and set back, so the windscreen slopes to the bonnet
  put(solid(g), prism(P, front, ...rings(-25, -CW, 24, CW, 5, 1.4), ZB, ZW));
  // the echo, above the bonnet: nearer than the bonnet's nose, farther than the cabin, so painted between them
  // the virtual image's pane, dim, rounded, floating upright; the route on it bright
  mk("path", { class: "nf lo", d: poly(rrect(-EW, EZ, EW, EZ + EH, 2.5, 4).map((q) => P(EX, q.u, q.v))) }, g);
  const echo = mk("path", { class: "nf hi" }, g), tip = flatDot(g, C, 1.8, "dot");

  const foot = rrect(-8, -CW + 0.8, 19, CW - 0.8, 4, 6), top = rrect(-1, -CW + 2.6, 15, CW - 2.6, 2.6, 6), topIn = rrect(0.2, -CW + 3.8, 13.8, CW - 3.8, 1.6, 6);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, ZW).concat(ringAt(P, top, ZT)))), crease: open(ringAt(P, run(topIn, front), ZT)) });
  // the windows we see: the rear one on the cabin's back, a side one on its left; the boot lid's line
  const lerp = (a, b, f) => a + (b - a) * f, rearX = (z) => lerp(19, 15, (z - ZW) / (ZT - ZW)), frontX = (z) => lerp(-8, -1, (z - ZW) / (ZT - ZW));
  mk("path", { class: "nf lo", d: poly([[-CW + 3, ZW + 1.6], [CW - 3, ZW + 1.6], [CW - 4.2, ZT - 1.6], [-CW + 4.2, ZT - 1.6]].map(([y, z]) => P(rearX(z) + 0.1, y, z))) }, g);
  const sy = CW - 0.8 + 0.1, sideW = (z) => [frontX(z) + 2.2, rearX(z) - 2.2];
  mk("path", { class: "nf lo", d: poly([[sideW(ZW + 1.6)[0], ZW + 1.6], [sideW(ZW + 1.6)[1], ZW + 1.6], [sideW(ZT - 1.6)[1], ZT - 1.6], [sideW(ZT - 1.6)[0], ZT - 1.6]].map(([x, z]) => P(x, sy + (z - ZW) * -0.2, z))) }, g);
  mk("path", { class: "nf lo", d: open([P(24, -CW + 2.5, ZW - 3), P(24, CW - 2.5, ZW - 3)]) }, g);
  wheel(CW + 0.4);

  const sp = spring(REST);
  let drawn = NaN;
  function draw(b) {
    if (b === drawn) return;
    drawn = b;
    const N = 48, L = [], R = [], K = [[], []], M = [];
    for (let k = 0; k <= N; k++) {
      const s = S0 + ((S1 - S0) * k) / N, c = centre(s, b);
      L.push(at(W(s, c - HW, 0))); R.push(at(W(s, c + HW, 0)));
      K[0].push(at(W(s, c - HW + 3, 0))); K[1].push(at(W(s, c + HW - 3, 0)));
      M.push(at(W(s, c, 0)));
    }
    road.setAttribute("d", poly(L.concat(R.reverse())));
    kerb.setAttribute("d", open(K[0]) + open(K[1]));
    mid.setAttribute("d", open(M.slice(Math.round(N * (28 - S0) / (S1 - S0)))));
    // the echo rises from the bonnet's height and leans into the bend: right is -y
    const lean = clamp(-b * 0.16, -EW + 2, EW - 2);
    // a little road on the pane: two edges narrowing as they rise, leaning into the bend, the dot where it turns
    const edge = (w) => Array.from({ length: 17 }, (_, k) => { const f = k / 16; return P(EX, lean * f * f + w * (1 - 0.7 * f), EZ + 2 + f * (EH - 5)); });
    echo.setAttribute("d", open(edge(-3.2)) + open(edge(3.2)));
    place(tip, P(EX, lean, EZ + EH - 1.6));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  /** On the ground plane: across the road is the bend, within the road's reach. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), s = -x, t = -y;
    const on = s > S0 - 10 && s < S1 + 30 && Math.abs(t) < 110;
    sp.t = on ? clamp(t * 0.9, -reach, reach) : REST;
    read.textContent = on ? (sp.t < 0 ? "left" : "right") : "rest";
    B.wake();
  }
  read.textContent = "rest";

  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 20, 44); if (read.textContent !== "rest") sp.t = clamp(sp.t, -reach, reach); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hud",
  means: "A car on the road, the route's echo floating ahead of its windscreen: the pointer bends the road left or right, and the echo leans with it.",
  rules: [1, 4, 5, 8],
  range: [20, 32, 44],
  tour: [[122, 190], [249, 127], [200, 188], null],
  mount,
});
