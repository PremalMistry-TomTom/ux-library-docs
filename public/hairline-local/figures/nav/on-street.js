/**
 * On-street: a stretch of street on a tile, the pavement raised along its
 * back, a row of six kerbside bays painted along the kerb and a dashed lane
 * line beyond them. Two bays hold a small parked car (a body, a cabin whose
 * top is shorter than its foot, wheels on the side we see); each of the other
 * four holds a short rounded bar, its height its chance of being free. At
 * rest the bars stand low and uneven, the first carrying the bright edge.
 * The pointer's place along the street draws the bars near it up by their
 * chance, falling off with distance on a spring each; what is in the bay
 * under it takes the bright edge. The slider is the reach, in bays.
 *
 * The pattern: a field. Springs, a falloff by distance along the street, a
 * hit test on the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, BL = 26, X0 = -(N * BL) / 2, TX = X0 - 8, TY0 = -38, TY1 = 38, TT = 3, KY = -14, KH = 4;
const BY0 = -12, BY1 = 8, YC = -2, BW = 4.5, HMIN = 3, HMAX = 46;
const TAKEN = [1, 4], CHANCE = [0.8, 0, 0.95, 0.5, 0, 0.7], REST = [17, 0, 8, 11, 0, 5], LIT = 0;
// a small car, parallel parked, its front at +x
const CL = 21, CW = 12, Z0 = 2.4, ZB = 9, ZC = 15.5, WR = 3.4;
const xc = (i) => X0 + (i + 0.5) * BL;

/** The share of full height at u reaches from the pointer: a bell, held to a floor of .08 beyond the reach. */
const falloff = (u) => Math.max(0.08, Math.exp(-2 * u * u));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value * BL, over = null;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[TX, TY0, -TT], [-TX, TY1, -TT], [-TX, TY0, -TT], [TX, TY1, -TT], [xc(0), YC, HMAX + 4], [xc(N - 1), YC, HMAX + 4]], 200, 166);
  const P = proj(C), front = facing(C), at = (x, y) => P(x, y, 0);
  const g = mk("g", {}, svg);

  // the tile, the pavement along its back, its paving joints
  put(solid(g), prism(P, front, ...rings(TX, TY0, -TX, TY1, 8, 1.8), -TT, 0));
  put(solid(g), prism(P, front, ...rings(TX + 3, TY0 + 3, -TX - 3, KY, 4, 1.2), 0, KH));
  mk("path", { class: "nf lo", d: [-1, 1].flatMap((s) => [24, 64].map((x) => open([P(s * x, TY0 + 6, KH), P(s * x, KY, KH)]))).join("") }, g);
  // the bays: a tick between each pair, an edge line along the road side; the lane line dashed beyond
  const ticks = Array.from({ length: N + 1 }, (_, i) => open([at(X0 + i * BL, BY0), at(X0 + i * BL, BY1)])).join("");
  mk("path", { class: "nf", d: ticks + open([at(X0, BY1), at(-X0, BY1)]) }, g);
  mk("path", { class: "nf dash lo", d: open([at(TX + 8, 24), at(-TX - 8, 24)]) }, g);

  // what each bay holds, appended along the street, far end first
  const bays = [];
  for (let i = 0; i < N; i++) {
    const x = xc(i);
    if (TAKEN.includes(i)) {
      const H = CL / 2, W2 = CW / 2, sh = (r) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + YC }));
      const car = mk("g", {}, g), body = solid(car);
      put(body, prism(P, front, ...rings(x - H, YC - W2, x + H, YC + W2, 4.5, 1.2), Z0, ZB));
      const foot = sh(rrect(-H + 4.5, -W2 + 1.2, H - 6, W2 - 1.2, 3, 4)), top = sh(rrect(-H + 6.5, -W2 + 2.4, H - 10.5, W2 - 2.4, 1.6, 4));
      const topIn = sh(rrect(-H + 7.5, -W2 + 3.4, H - 11.5, W2 - 3.4, 1, 4));
      put(solid(car), { sil: poly(hull(ringAt(P, foot, ZB).concat(ringAt(P, top, ZC)))), crease: open(ringAt(P, run(topIn, front), ZC)) });
      for (const cu of [-H + 5, H - 5]) {
        const pts = Array.from({ length: 18 }, (_, j) => { const t = (j / 18) * Math.PI * 2; return P(x + cu + WR * Math.cos(t), YC + W2 + 0.3, WR + WR * Math.sin(t)); });
        mk("path", { class: "sil", d: poly(pts) }, car);
      }
      bays.push({ i, car: body });
    } else {
      const [ring, inner] = rings(x - BW, YC - BW, x + BW, YC + BW, 2, 0.9);
      bays.push({ i, ring, inner, el: solid(g), sp: spring(REST[i], { eps: 0.04 }), drawn: NaN });
    }
  }
  const bars = bays.filter((b) => b.sp);

  function drawBar(b) {
    const h = Math.max(HMIN, b.sp.x);
    if (h === b.drawn) return;
    b.drawn = h;
    put(b.el, prism(P, front, b.ring, b.inner, 0, h));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bars) { if (stepS(b.sp, dt)) m = true; drawBar(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const a = over === null ? LIT : clamp(Math.floor((over - X0) / BL), 0, N - 1);
    for (const b of bars) b.sp.t = over === null ? REST[b.i] : HMIN + (HMAX - HMIN) * CHANCE[b.i] * falloff(Math.abs(xc(b.i) - over) / R);
    for (const b of bays) (b.el || b.car).sil.classList.toggle("hi", b.i === a);
    read.textContent = over === null ? "rest" : `bay ${a + 1}`;
    B.wake();
  }
  retarget();

  /** On the ground plane: anywhere on the street; the place along it is what counts. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    over = x > X0 - 6 && x < -X0 + 6 && y > TY0 && y < TY1 ? x : null;
    retarget();
  }
  bag.add(pointer(stage, { move, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { R = clamp(v, 0.8, 3.2) * BL; if (over !== null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "on-street",
  means: "Kerbside bays along a street, two with cars: near the pointer each free bay's bar rises by its chance of being free.",
  rules: [1, 3, 4, 5],
  range: [1.3, 2.1, 3],
  tour: [[132, 150], [185, 176], [262, 214], null],
  mount,
});
