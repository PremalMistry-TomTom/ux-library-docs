/**
 * Fuel prices: a forecourt island, a raised kerbed slab on a tile, with two
 * fuel pumps standing on it in a row. Each pump is a tall cabinet under a
 * wider head, a price window high on its face with two dim rows in it, and
 * on its side a holster holding a nozzle, its hose hanging from the cabinet
 * from high on the cabinet in a slack loop. At rest both nozzles sit holstered and the second pump's
 * window carries the bright edge. The pointer picks a pump: its nozzle lifts
 * out of the holster and swings towards the viewer, the hose following, and
 * its window takes the bright edge. The slider is how far the nozzle lifts.
 *
 * The pattern: one of many, tweens. The hit test is each pump's rest centre
 * on screen, nearest the pointer's x, inside the tile's rest box.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const TX = 76, TY = 40, TT = 3, IX = 50, IY = 15, IZ = 5;
const PX = [-25, 25], BW = 9, BD = 6, ZB = 56, ZH = 68, HW = 11, HD = 7.5, LIT = 1;
// the nozzle in the plane of the pump's side: s across it (along y), h up; NT its thickness
// the nozzle's body hangs with its foot at h 0, the spout leaving its top and bending forward and down
const GRIP = rrect(-3, 0, 3, 12.5, 2, 3).map((q) => [q.u, q.v]);
const SPOUT = [[0.5, 10.5], [2.6, 12.6], [10.5, 8.2], [10, 6.4]];
const NT = 3.4, NZ = 21;

/** A smooth line through world points: Catmull-Rom, eight steps a span. */
function spline(p) {
  const out = [], at = (i) => p[clamp(i, 0, p.length - 1)];
  for (let i = 0; i < p.length - 1; i++) for (let s = 0; s < 8; s++) {
    const u = s / 8, a = at(i - 1), b = at(i), c = at(i + 1), d = at(i + 2);
    out.push([0, 1, 2].map((j) => 0.5 * (2 * b[j] + (c[j] - a[j]) * u + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * u * u + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * u * u * u)));
  }
  out.push(p[p.length - 1]);
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-TX, -TY, -TT], [TX, TY, -TT], [TX, -TY, -TT], [-TX, TY, -TT], [PX[0] - HW, -HD, ZH], [PX[1] + HW, HD, ZH], [PX[1] + BW + 22, 20, 58]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the forecourt tile, a lane line across it, the island on it
  put(solid(g), prism(P, front, ...rings(-TX, -TY, TX, TY, 8, 1.8), -TT, 0));
  mk("path", { class: "nf dash lo", d: open([P(-TX + 10, IY + 14, 0), P(TX - 10, IY + 14, 0)]) }, g);
  put(solid(g), prism(P, front, ...rings(-IX, -IY, IX, IY, 7, 1.6), 0, IZ));

  const pumps = PX.map((x, i) => {
    // the cabinet, and the wider head over it
    put(solid(g), prism(P, front, ...rings(x - BW, -BD, x + BW, BD, 3, 1), IZ, ZB));
    put(solid(g), prism(P, front, ...rings(x - HW, -HD, x + HW, HD, 3.5, 1.2), ZB, ZH));
    // the face: the price window and its two dim rows; a panel seam lower down
    const onFace = (u, z) => P(x + u, BD + 0.1, z);
    const win = mk("path", { class: "nf", d: poly(rrect(-6, 39, 6, 51, 1.6, 3).map((q) => onFace(q.u, q.v))) }, g);
    mk("path", { class: "nf lo", d: open([onFace(-4, 47.5), onFace(4, 47.5)]) + open([onFace(-4, 43), onFace(2, 43)]) }, g);
    mk("path", { class: "nf lo", d: open([onFace(-BW + 2, 30), onFace(BW - 2, 30)]) }, g);
    // the holster on the side we see
    const side = x + BW + 0.1;
    mk("path", { class: "nf", d: poly(rrect(-4.2, NZ + 3, 4.2, NZ + 11, 1.6, 3).map((q) => P(side, q.u, q.v))) }, g);
    const hose = mk("path", { class: "nf sil" }, g);
    const noz = mk("g", {}, g), grip = solid(noz), spout = solid(noz);
    return { i, x, side, win, hose, grip, spout, tw: tween(0), drawn: NaN };
  });

  /** A flat convex profile in the side plane, set at (x, y, z), tilted by a, and given thickness NT. */
  function slab(pr, x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    const at = (d) => pr.map(([u, h]) => P(x + d, y + u * c - h * s, z + h * c + u * s));
    const near = at(NT);
    return { sil: poly(hull(at(0).concat(near))), crease: poly(near) };
  }
  function drawPump(p, t) {
    if (t === p.drawn) return;
    p.drawn = t;
    // lifted, the nozzle comes out from the side, forward and up, and tilts its spout out
    const nx = p.side + t * lift * 0.8, ny = t * lift * 0.6, nz = NZ + t * lift * 0.9, a = t * 0.45;
    put(p.grip, slab(GRIP, nx, ny, nz, a));
    put(p.spout, slab(SPOUT, nx, ny, nz, a));
    // the hose: out of the cabinet high on its side, slack down towards the island, up into the nozzle's foot
    const low = IZ + 3 + t * 5, mx = nx + NT / 2;
    const pts = spline([[p.side, -4, 50], [p.side + 5, -5.5, 40], [p.side + 9 + t * 3, -4 + t * 2, low + 6], [mx + 3, ny - 1, low], [mx, ny, nz - 4], [mx, ny, nz]]);
    p.hose.setAttribute("d", open(pts.map((q) => P(...q))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pumps) { drawPump(p, tval(p.tw, now)); if (!tdone(p.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), on = a < 0 ? LIT : a;
    pumps.forEach((p) => {
      tset(p.tw, p.i === a ? 1 : 0, now, 0);
      p.win.setAttribute("class", p.i === on ? "nf hi" : "nf");
    });
    read.textContent = a < 0 ? "rest" : `pump ${a + 1}`;
    B.wake();
  }
  setActive(-1, true);

  // the hit test: inside the tile's rest box on screen, the pump whose rest centre is nearest the pointer's x
  const cx = PX.map((x) => P(x, 0, 0)[0]);
  const xs = [P(-TX, TY, 0)[0], P(TX, -TY, 0)[0]], top = P(PX[0], -HD, ZH)[1] - 8, bot = P(TX, TY, 0)[1];
  const hit = ([px, py]) => {
    if (px < xs[0] || px > xs[1] || py < top || py > bot) return -1;
    return Math.abs(px - cx[0]) <= Math.abs(px - cx[1]) ? 0 : 1;
  };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 8, 22); pumps.forEach((p) => { p.drawn = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "fuel-prices",
  means: "Two fuel pumps on a forecourt island: the pump under the pointer lifts its nozzle from the holster and its price window lights.",
  rules: [1, 4, 5, 8],
  range: [10, 15, 20],
  tour: [[160, 150], [245, 185], null],
  mount,
});
