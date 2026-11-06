/**
 * Cluster: the instrument cluster seen through the steering wheel, a rim on
 * three spokes and a hub on its column, nearer than the pod. A binnacle stands on
 * the dashboard's top, a deep pod whose hood arches over its face, and in the
 * recess under the hood two round gauges, each a disc with a bezel, a ring of
 * tick dots and a needle on a hub, and between them a small screen showing a
 * short route, the car a dot at its start. At rest the left needle sits low,
 * the right one part-way, bright. The pointer over a gauge sweeps its needle
 * up, the ticks it passes lighting one after another, and the needle takes
 * the bright edge; over the screen, its route draws again, bright. Let go, the
 * needles fall back and the right one takes the bright edge again. The slider
 * is how far a chosen needle sweeps, as a share of the dial.
 *
 * The pattern: one of many. A tween per needle and one for the route. The hit
 * test is the pod's rest face on screen, which never moves, and the part
 * nearest the pointer's x by its rest centre.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rrect,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

// the pod, in its own upright plane facing the viewer: t across, h up, d towards the viewer
const W = 80, HS = 48, HT = 72, DB = 34, HF = 16, WL = 5, H0 = 5;
const GR = 18, GX = 44, GH = 25, TICKS = 9, REST = [0.22, 0.52];
const SCR = [-14, 10, 14, 44];
const ROUTE = [[-6, 15], [-6, 26], [6, 30], [6, 38]];
const ang = (v) => ((225 - 270 * v) * Math.PI) / 180;
const DASH = [-104, -46, 104, 38], DT = 6, POP = 10, WR = 40, WH = 4, WD = 52, WT = 22, TH = (70 * Math.PI) / 180;
const CT = Math.cos(TH), ST = Math.sin(TH);

/** The pod's face: a flat foot, upright sides, a hood arching over the top. */
function profile(w, hs, ht, h0) {
  const pts = [[-w, h0], [w, h0]];
  for (let k = 0; k <= 16; k++) { const t = w - (2 * w * k) / 16; pts.push([t, hs + (ht - hs) * Math.cos((Math.PI * t) / (2 * w))]); }
  return fillet(pts, pts.map((_, k) => (k < 2 ? 7 : k === 2 || k === 18 ? 10 : 0)), 4);
}
/** Is screen point p inside the polygon q? */
const inside = (p, q) => {
  let c = false;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++)
    if ((q[i][1] > p[1]) !== (q[j][1] > p[1]) && p[0] < ((q[j][0] - q[i][0]) * (p[1] - q[i][1])) / (q[j][1] - q[i][1]) + q[i][0]) c = !c;
  return c;
};
/** A ring drawn in (t, d), turned into the world. */
const turn = (r) => r.map((q) => ({ ...q, u: q.u * ST + q.v * CT, v: q.v * ST - q.u * CT, nu: q.nu * ST + q.nv * CT, nv: q.nv * ST - q.nu * CT }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sweep = value;
  const C = Cam(45, 0.5, 1.5);
  // the pod turned a little off the viewer, so its right side shows
  const wp = (t, h, d) => [t * ST + d * CT, d * ST - t * CT, h];
  const [a0, b0, a1, b1] = DASH;
  fit(C, [wp(a0, -DT, b1), wp(a1, -DT, b1), wp(a0, 0, b0), wp(a1, 0, b0), wp(0, HT, HF), wp(0, 30, -DB), wp(WT - WR, WH, WD), wp(WT + WR, WH, WD), wp(WT, WH - WR, WD)], 200, 166);
  const P = proj(C), front = facing(C);
  const pw = (t, h, d) => P(...wp(t, h, d));

  const g = mk("g", {}, svg);
  // the dashboard's top, a slab running across under the pod
  put(solid(g), prism(P, front, turn(rrect(a0, b0, a1, b1, 14, 6)), turn(rrect(a0 + 2, b0 + 2, a1 - 2, b1 - 2, 12, 6)), -DT, 0));

  // the pod: a silhouette of its back and front, the front face its crease, the outer edge stroked again over it
  // its back is lower than its face: the hood sweeps down into the dashboard behind
  const outer = profile(W, HS, HT, 0), back = profile(W - 6, 20, 30, 0), mouth = profile(W - WL, HS - 3, HT - 7, H0);
  const edge = poly(hull(back.map(([t, h]) => pw(t, h, -DB)).concat(outer.map(([t, h]) => pw(t, h, HF)))));
  put(solid(g), { sil: edge, crease: poly(outer.map(([t, h]) => pw(t, h, HF))) });
  mk("path", { class: "nf sil", d: edge }, g);
  // the mouth under the hood, and the recess's floor running back to the face the instruments sit on
  mk("path", { class: "nf", d: poly(mouth.map(([t, h]) => pw(t, h, HF))) }, g);
  const wi = W - WL, floor = fillet([[-wi, HF], [-wi, 0], [wi, 0], [wi, HF]], [0, 5, 5, 0], 4);
  mk("path", { class: "nf lo", d: open(floor.map(([t, d]) => pw(t, H0, d))) }, g);

  const disc = (cx, cy, r, d, n = 32) => poly(circ(r, n).map((q) => pw(cx + q.u, cy + q.v, d)));
  // each gauge a disc: a bezel, a dial ring, the tick dots, a tapered needle on its hub; it steps forward when chosen
  const gauges = [-GX, GX].map((cx, i) => {
    const grp = mk("g", {}, g);
    const els = { rim: mk("path", { class: "sil" }, grp), dial: mk("path", { class: "nf lo" }, grp) };
    els.ticks = Array.from({ length: TICKS }, () => mk("path", { class: "dot off" }, grp));
    els.needle = mk("path", { class: "sil" }, grp);
    els.hub = mk("path", { class: "" }, grp);
    return { cx, ...els, v: tween(REST[i]), d: tween(0), drawn: "" };
  });

  // the screen between them: a bezel, and the route on it from the car's dot to a ring at its end
  const scr = mk("g", {}, g);
  const [s0, h0, s1, h1] = SCR;
  const bez = mk("path", { class: "sil" }, scr), glass = mk("path", { class: "nf lo" }, scr);
  const way = fillet(ROUTE, [0, 3, 3, 0], 4).filter((p, k, a) => k === 0 || p[0] !== a[k - 1][0] || p[1] !== a[k - 1][1]);
  const len = [0];
  for (let k = 1; k < way.length; k++) len.push(len[k - 1] + Math.hypot(way[k][0] - way[k - 1][0], way[k][1] - way[k - 1][1]));
  const line = mk("path", { class: "nf lo" }, scr), car = mk("path", { class: "dot m" }, scr), end = mk("path", { class: "nf lo" }, scr);
  const [ex, ey] = ROUTE[ROUTE.length - 1];
  const route = { k: tween(1), d: tween(0), drawn: "" };

  // the steering wheel, nearer than all of it: a short column under the hub, three spokes, the hub, the rim
  const wh = mk("g", {}, g), wc = (r, d, n = 56) => circ(r, n).map((q) => pw(WT + q.u, WH + q.v, d));
  mk("path", { class: "sil", d: poly(hull(wc(5, WD - 2, 16).concat(circ(5, 16).map((q) => pw(WT + q.u, WH - 2 + q.v, WD - 16))))) }, wh);
  for (const a of [-0.35, Math.PI + 0.35, -Math.PI / 2]) {
    const c = Math.cos(a), s = Math.sin(a), sp = fillet([[0, -3], [WR - 2, -4], [WR - 2, 4], [0, 3]], [1, 1, 1, 1], 2);
    mk("path", { class: "", d: poly(sp.map(([r, w]) => pw(WT + r * c - w * s, WH + r * s + w * c, WD))) }, wh);
  }
  mk("path", { class: "sil", d: poly(wc(9, WD + 1, 32)) }, wh);
  mk("path", { class: "nf lo", d: poly(wc(6, WD + 1, 28)) }, wh);
  // the rim: a thin ring, its hole wound against its outline so the gauges show through it
  const area = (q) => q.reduce((a, p, i) => { const n = q[(i + 1) % q.length]; return a + p[0] * n[1] - n[0] * p[1]; }, 0);
  const rimOut = hull(wc(WR, WD + 1.5).concat(wc(WR, WD - 1.5)));
  let rimIn = wc(WR - 5, WD + 1.5);
  if (Math.sign(area(rimIn)) === Math.sign(area(rimOut))) rimIn = rimIn.reverse();
  mk("path", { class: "sil", d: poly(rimOut) + poly(rimIn) }, wh);
  mk("path", { class: "nf lo", d: poly(wc(WR, WD + 1.5)) }, wh);
  mk("path", { class: "nf sil", d: poly(rimOut) }, wh);

  function drawGauge(gg, v, d) {
    if (v + "," + d === gg.drawn) return;
    gg.drawn = v + "," + d;
    const a = ang(v), c = Math.cos(a), s = Math.sin(a), at = (r, w) => pw(gg.cx + r * c - w * s, GH + r * s + w * c, d);
    gg.rim.setAttribute("d", disc(gg.cx, GH, GR, d, 40));
    gg.dial.setAttribute("d", disc(gg.cx, GH, GR - 2.6, d, 40));
    gg.needle.setAttribute("d", poly(fillet([[-4, -1.6], [GR - 7, -0.5], [GR - 7, 0.5], [-4, 1.6]], [0.8, 0.4, 0.4, 0.8], 2).map(([r, w]) => at(r, w))));
    gg.hub.setAttribute("d", disc(gg.cx, GH, 2.8, d, 16));
    gg.ticks.forEach((tk, k) => {
      const b = ang(k / (TICKS - 1)), r = GR - 6;
      tk.setAttribute("d", disc(gg.cx + r * Math.cos(b), GH + r * Math.sin(b), 1.1, d, 10));
      tk.setAttribute("class", k / (TICKS - 1) <= v + 0.01 ? "dot m" : "dot off");
    });
  }
  function drawRoute(k, d) {
    if (k + "," + d === route.drawn) return;
    route.drawn = k + "," + d;
    bez.setAttribute("d", poly(rrect(s0, h0, s1, h1, 3, 4).map((q) => pw(q.u, q.v, d))));
    glass.setAttribute("d", poly(rrect(s0 + 2, h0 + 2, s1 - 2, h1 - 2, 1.6, 4).map((q) => pw(q.u, q.v, d))));
    car.setAttribute("d", disc(ROUTE[0][0], ROUTE[0][1], 1.6, d, 12));
    end.setAttribute("d", disc(ex, ey + 2, 2, d, 14));
    const s = k * len[len.length - 1], out = [pw(way[0][0], way[0][1], d)];
    for (let i = 1; i < way.length; i++) {
      if (len[i] <= s) { out.push(pw(way[i][0], way[i][1], d)); continue; }
      const f = (s - len[i - 1]) / (len[i] - len[i - 1]);
      out.push(pw(way[i - 1][0] + (way[i][0] - way[i - 1][0]) * f, way[i - 1][1] + (way[i][1] - way[i - 1][1]) * f, d));
      break;
    }
    line.setAttribute("d", k < 0.01 ? "" : open(out));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const gg of gauges) { drawGauge(gg, tval(gg.v, now), tval(gg.d, now)); if (!tdone(gg.v, now) || !tdone(gg.d, now)) moving = true; }
    drawRoute(tval(route.k, now), tval(route.d, now));
    if (!tdone(route.k, now) || !tdone(route.d, now)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  // parts left to right: gauge 1, the map, gauge 2
  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    if (a === 1 && act !== 1) { route.k = tween(0); route.drawn = NaN; tset(route.k, 1, now, 120); }
    act = a;
    // the chosen part steps forward out of the recess, its neighbours after it; a chosen needle sweeps up
    gauges.forEach((gg, i) => {
      tset(gg.v, a === i * 2 ? Math.max(sweep, REST[i]) : REST[i], now, a === i * 2 ? 0 : 60);
      tset(gg.d, a === i * 2 ? POP : 0, now, a < 0 ? 0 : Math.abs(i * 2 - a) * 50);
    });
    tset(route.d, a === 1 ? POP : 0, now, 0);
    const lit = a === -1 ? 2 : a;
    gauges.forEach((gg, i) => { gg.needle.setAttribute("class", lit === i * 2 ? "hi" : "sil"); gg.rim.setAttribute("class", lit === i * 2 ? "hi" : "sil"); });
    line.setAttribute("class", lit === 1 ? "nf hi" : "nf lo");
    bez.setAttribute("class", lit === 1 ? "hi" : "sil");
    read.textContent = a === -1 ? "rest" : a === 1 ? "map" : `gauge ${a / 2 + 1}`;
    B.wake();
  }
  setActive(-1, true);

  // the hit test: inside the pod's rest face, the part whose rest centre is nearest the pointer's x
  const face = hull(outer.map(([t, h]) => pw(t, h, HF)).concat(back.map(([t, h]) => pw(t, h, -DB))));
  const cx = [pw(-GX, GH, 0)[0], pw(0, GH, 0)[0], pw(GX, GH, 0)[0]];
  const hit = (p) => {
    if (!inside(p, face)) return -1;
    let best = 0;
    cx.forEach((x, i) => { if (Math.abs(p[0] - x) < Math.abs(p[0] - cx[best])) best = i; });
    return best;
  };

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { sweep = clamp(v, 0.6, 1); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "cluster",
  means: "An instrument cluster seen through the wheel: the gauge under the pointer sweeps its needle up, and over the screen the route lights.",
  rules: [1, 4, 5, 8],
  range: [0.7, 0.85, 1],
  tour: [[138, 116], [197, 130], [257, 144], null],
  mount,
});
