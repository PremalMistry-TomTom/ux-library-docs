/**
 * CarPlay: phone projection. A dashboard's top runs across, and on it stand a
 * wide head unit, a thick screen on a short neck, and to its right a phone,
 * upright in a cradle, a cable from the cradle curving over the dashboard to
 * the head unit's neck. A steering wheel stands
 * nearest, on the left. The head unit's screen is blank; the phone shows the
 * route, small and bright. That is rest: the phone knows the way, the car
 * does not yet. When the pointer comes over the phone, a dot runs down the
 * cable to the head unit, the map's streets draw on across the wide screen,
 * and the route draws after them from the car's dot, bright,
 * a ring at its end; the phone's route gives the bright up. Let go, the route
 * winds back off the screen and the phone has it again. The slider is how far
 * along the route the screen draws.
 *
 * The pattern: one of two. Tweens: the dot first, the route after it. The hit
 * test is the phone's and cradle's rest box on screen, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rrect,
  tdone, tset, tval, tween, disposer, mk, place, flatDot, pointer, put, register, solid,
} = HL;

// everything stands in an upright plane facing the viewer, turned a little: t across, h up, d towards the viewer
const TH = (68 * Math.PI) / 180, CT = Math.cos(TH), ST = Math.sin(TH);
const DASH = [-112, -40, 104, 40], DT = 7;
const HU = [-78, 12, 30, 70], HUD = 9, HUR = 6, NECK = [-36, -12, -14, -4];
const PH = [52, 10, 80, 64], PHD = 4.5, PHR = 5, CR = [46, -8, 86, 8], CRH = 10;
const ROUTE = [[-52, 22], [-52, 44], [-8, 44], [-8, 62]];
const WT = -86, WH = 22, WD = 50, WR = 27;
const STREETS = { up: [-52, -8], across: [30, 44] }, KW = 3.2;
const turn = (r) => r.map((q) => ({ ...q, u: q.u * ST + q.v * CT, v: q.v * ST - q.u * CT, nu: q.nu * ST + q.nv * CT, nv: q.nv * ST - q.nu * CT }));
const wp = (t, h, d) => [t * ST + d * CT, d * ST - t * CT, h];
const smooth = (pts, r) => fillet(pts, pts.map((_, k) => (k === 0 || k === pts.length - 1 ? 0 : r)), 5).filter((p, k, a) => k === 0 || Math.hypot(p[0] - a[k - 1][0], p[1] - a[k - 1][1]) > 0.01);
/** The first share k of a polyline. */
function part(pts, k) {
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = k * len[len.length - 1], out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (len[i] <= s) { out.push(pts[i]); continue; }
    const f = (s - len[i - 1]) / (len[i] - len[i - 1] || 1);
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]);
    break;
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.55);
  const [a0, b0, a1, b1] = DASH;
  fit(C, [wp(a0, -DT, b1), wp(a1, -DT, b1), wp(a0, 0, b0), wp(a1, 0, b0), wp(HU[0], HU[3], 0), wp(HU[2], HU[3], -HUD), wp(PH[2], PH[3], PHD), wp(WT - WR, WH, WD), wp(WT, WH - WR, WD), wp(WT, WH + WR, WD)], 200, 166);
  const P = proj(C), front = facing(C), pw = (t, h, d) => P(...wp(t, h, d));
  const box = (b, r, d, n = 6) => rrect(b[0], b[1], b[2], b[3], r, n).map((q) => pw(q.u, q.v, d));
  /** A thick upright plate: its back and front outlines hulled, the front outline its crease. */
  const plate = (parent, b, r, d0, d1) => {
    const f = box(b, r, d1), s = solid(parent);
    put(s, { sil: poly(hull(box(b, r, d0).concat(f))), crease: poly(box([b[0] + 1.2, b[1] + 1.2, b[2] - 1.2, b[3] - 1.2], r - 1, d1)) });
    return s;
  };

  const g = mk("g", {}, svg);
  // the dashboard's top, a slab running across under it all
  put(solid(g), prism(P, front, turn(rrect(a0, b0, a1, b1, 16, 6)), turn(rrect(a0 + 2, b0 + 2, a1 - 2, b1 - 2, 14, 6)), -DT, 0));
  // the head unit: a neck on the dashboard, the thick screen on it, its glass inset
  put(solid(g), prism(P, front, turn(rrect(NECK[0], NECK[1], NECK[2], NECK[3], 2, 4)), turn(rrect(NECK[0] + 1, NECK[1] + 1, NECK[2] - 1, NECK[3] - 1, 1.4, 4)), 0, HU[1] + 2));
  plate(g, HU, HUR, -HUD, 0);
  const GL = [HU[0] + 5, HU[1] + 5, HU[2] - 5, HU[3] - 5];
  mk("path", { class: "nf", d: poly(box(GL, HUR - 3, 0)) }, g);
  // the map on it: the streets' kerbs, each pair open where another street crosses
  const scr = (p) => pw(p[0], p[1], 0.2), kerbs = [];
  for (const t of STREETS.up) for (const e of [-KW, KW]) {
    let s = GL[1] + 1;
    for (const h of STREETS.across) { kerbs.push([[t + e, s], [t + e, h - KW]]); s = h + KW; }
    kerbs.push([[t + e, s], [t + e, GL[3] - 1]]);
  }
  for (const h of STREETS.across) for (const e of [-KW, KW]) {
    let s = GL[0] + 1;
    for (const t of STREETS.up) { kerbs.push([[s, h + e], [t - KW, h + e]]); s = t + KW; }
    kerbs.push([[s, h + e], [GL[2] - 1, h + e]]);
  }
  const streets = mk("path", { class: "nf lo" }, g);
  const way = smooth(ROUTE, 6), route = mk("path", { class: "nf hi" }, g), end = mk("path", { class: "nf" }, g);
  const car = mk("path", { class: "dot m", d: poly(circ(2.2, 16).map((q) => scr([ROUTE[0][0] + q.u, ROUTE[0][1] + q.v]))) }, g);

  // the cradle on the dashboard, and the phone standing in it: its screen, the same route on it, small
  put(solid(g), prism(P, front, turn(rrect(CR[0], CR[1], CR[2], CR[3], 4, 4)), turn(rrect(CR[0] + 1.4, CR[1] + 1.4, CR[2] - 1.4, CR[3] - 1.4, 3, 4)), 0, CRH));
  plate(g, PH, PHR, -PHD, PHD);
  const PS = [PH[0] + 2.6, PH[1] + 7, PH[2] - 2.6, PH[3] - 3];
  mk("path", { class: "nf", d: poly(box(PS, PHR - 2, PHD)) }, g);
  mk("path", { class: "nf lo", d: poly(box([60, PH[3] - 6, 72, PH[3] - 4.6], 0.7, PHD, 3)) }, g);
  const mini = ROUTE.map(([t, h]) => [PS[0] + 4 + ((t - GL[0]) / (GL[2] - GL[0])) * (PS[2] - PS[0] - 4), PS[1] + ((h - GL[1]) / (GL[3] - GL[1])) * (PS[3] - PS[1] - 4)]);
  const phoneRoute = mk("path", { class: "nf hi", d: open(smooth(mini, 2).map((p) => pw(p[0], p[1], PHD + 0.2))) }, g);
  // the cable: out of the cradle's front, a sag over the dashboard towards the viewer, into the neck
  const cable = smooth([[CR[0] + 8, CR[3]], [CR[0] + 4, 26], [-6, 26], [-25, NECK[3]]], 14).map(([t, d]) => P(...wp(t, 0, d)));
  mk("path", { class: "nf sil", d: open(cable) }, g);
  const pulse = flatDot(g, C, 2.4, "dot m");
  place(pulse, cable[0]);

  // the steering wheel, nearest of all, on the left: a rim, three spokes, the hub
  const wc = (r, d, n = 56) => circ(r, n).map((q) => pw(WT + q.u, WH + q.v, d)), wh = mk("g", {}, g);
  for (const a of [-0.35, Math.PI + 0.35, -Math.PI / 2]) {
    const c = Math.cos(a), sn = Math.sin(a), sp = fillet([[0, -3], [WR - 2, -4], [WR - 2, 4], [0, 3]], [1, 1, 1, 1], 2);
    mk("path", { class: "", d: poly(sp.map(([r, w]) => pw(WT + r * c - w * sn, WH + r * sn + w * c, WD))) }, wh);
  }
  mk("path", { class: "sil", d: poly(wc(9, WD + 1, 32)) }, wh);
  const area = (q) => q.reduce((a, p, i) => { const n = q[(i + 1) % q.length]; return a + p[0] * n[1] - n[0] * p[1]; }, 0);
  const rimOut = hull(wc(WR, WD + 1.5).concat(wc(WR, WD - 1.5)));
  let rimIn = wc(WR - 5, WD + 1.5);
  if (Math.sign(area(rimIn)) === Math.sign(area(rimOut))) rimIn = rimIn.reverse();
  mk("path", { class: "sil", d: poly(rimOut) + poly(rimIn) }, wh);
  mk("path", { class: "nf lo", d: poly(wc(WR, WD + 1.5)) }, wh);

  const k = tween(0), run = tween(0);
  let drawn = "";
  function draw(kv, rv) {
    const key = kv + "," + rv;
    if (key === drawn) return;
    drawn = key;
    // the map comes up on the screen first, the streets drawing on, and the route after them
    const m = Math.min(1, kv * 1.6);
    streets.setAttribute("d", m < 0.01 ? "" : kerbs.map((q) => open(part(q, m).map(scr))).join(""));
    car.setAttribute("visibility", m > 0.3 ? "visible" : "hidden");
    const pts = part(way, Math.max(0, (kv - 0.35) / 0.65) * reach);
    route.setAttribute("d", kv < 0.36 ? "" : open(pts.map(scr)));
    const e = pts[pts.length - 1];
    end.setAttribute("d", kv < 0.8 ? "" : poly(circ(3.4 * Math.min(1, (kv - 0.8) / 0.2), 20).map((q) => scr([e[0] + q.u, e[1] + q.v]))));
    const on = rv > 0.01 && rv < 0.99;
    pulse.setAttribute("visibility", on ? "visible" : "hidden");
    if (on) { const p = part(cable, rv); place(pulse, p[p.length - 1]); }
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(k, now), tval(run, now));
    return !tdone(k, now) || !tdone(run, now);
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now();
    if (a) { Object.assign(run, { from: 0, to: 0, t0: -1e9 }); tset(run, 1, now, 0); }
    else tset(run, 0, now, 0);
    tset(k, a ? 1 : 0, now, a ? 450 : 0);
    phoneRoute.setAttribute("class", a ? "nf lo" : "nf hi");
    read.textContent = a ? "linked" : "rest";
    drawn = "";
    B.wake();
  }
  setActive(false, true);

  // the hit test: the phone and its cradle at rest, on screen
  const zone = hull(box(PH, PHR, PHD).concat(box(PH, PHR, -PHD), turn(rrect(...CR, 4, 4)).map((q) => P(q.u, q.v, 0))));
  const inside = (p, q) => {
    let c = false;
    for (let i = 0, j = q.length - 1; i < q.length; j = i++)
      if ((q[i][1] > p[1]) !== (q[j][1] > p[1]) && p[0] < ((q[j][0] - q[i][0]) * (p[1] - q[i][1])) / (q[j][1] - q[i][1]) + q[i][0]) c = !c;
    return c;
  };

  bag.add(pointer(stage, { move: (p) => setActive(inside(p, zone)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 0.5, 1); drawn = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "carplay",
  means: "A dashboard head unit with a phone docked beside it on a cable: over the phone, the route runs down the cable and draws on the wide screen.",
  rules: [1, 4, 5, 8],
  range: [0.7, 0.85, 1],
  tour: [[301, 160], [170, 140], [305, 180], null],
  mount,
});
