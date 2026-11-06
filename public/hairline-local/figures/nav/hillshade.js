/**
 * Hillshade: a relief tile. A slab of landscape on a thin plinth, cut into
 * twelve strips across the tile, each strip's top following the ground: two
 * ridges cross the tile on the diagonal with a valley between, and the cut
 * edges of the slab show the profile. Along each strip's top edge the ground
 * facing the sun takes the silhouette's stroke and the ground facing away the
 * dim one, so the lit side reads as a hillshade. A dot on the plinth's rim
 * marks where the sun is; at rest it is the bright mark, low in one quarter.
 * The pointer sets the sun, from the tile's middle toward it: the lit edges
 * swing round to face it, the ground near the pointer swells a little, and the
 * lit edges within reach of it take the bright stroke. The slider is the reach.
 *
 * The pattern: a field. Springs for the sun's direction, the pointer's place
 * and the swell; a falloff by distance; a hit test on the ground plane, which
 * never moves. Strips are painted far to near, so a nearer one covers a farther.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 12, E = 54, DY = (2 * E) / N, NS = 44, PB = 4, M = 7, REST = 100, SWELL = 0.5, RISE = 11, HMAX = 46;

/** The ground: two ridges on the diagonal, a valley between, a low ripple. */
function ground(x, y) {
  const u = x / E, v = y / E;
  return 3 + 24 * Math.exp(-((u - 0.7 * v - 0.25) ** 2) / 0.07) * (0.65 + 0.35 * v)
    + 15 * Math.exp(-((u - 0.7 * v + 0.85) ** 2) / 0.06) * (0.55 + 0.45 * u)
    + 2.2 * Math.sin(3.1 * u + 1) * Math.cos(2.3 * v);
}
const fall = (d) => (d <= 0 ? 1 : d < 1 ? 0.5 + 0.5 * Math.cos(Math.PI * d) : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-E - M, -E - M, -PB], [E + M, E + M, -PB], [E + M, -E - M, -PB], [-E - M, E + M, -PB], [-E, -E, HMAX], [0, 0, HMAX]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-E - M, -E - M, E + M, E + M, 7, 2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  const sun = flatDot(g, C, 2.6, "dot");

  const xs = Array.from({ length: NS + 1 }, (_, k) => -E + (k / NS) * 2 * E);
  const strips = Array.from({ length: N }, (_, j) => {
    // the strip's body is a fill; its top edge is stroked piece by piece, by the light, and the rest of its outline as a silhouette
    const grp = mk("g", {}, g), body = mk("path", { class: "fo" }, grp), cut = mk("path", { class: "nf sil" }, grp);
    const shade = mk("path", { class: "nf lo" }, grp), lit = mk("path", { class: "nf sil" }, grp), hot = mk("path", { class: "nf hi" }, grp);
    return { y0: -E + j * DY, y1: -E + (j + 1) * DY, yc: -E + (j + 0.5) * DY, grp, body, cut, shade, lit, hot };
  });

  const sx = spring(Math.cos(REST * Math.PI / 180)), sy = spring(Math.sin(REST * Math.PI / 180));
  const px = spring(0), py = spring(0), amp = spring(0);
  let over = null, drawn = "", dotAt = -2;

  function draw() {
    const l = Math.hypot(sx.x, sy.x) || 1, dx = sx.x / l, dy = sy.x / l;
    const key = [dx, dy, px.x, py.x, amp.x, reach].map((n) => n.toFixed(3)).join();
    if (key === drawn) return;
    drawn = key;
    // near the pointer the ground swells: a little higher, and a rise of its own
    const sw = (x, y) => amp.x * fall(Math.hypot(x - px.x, y - py.x) / (reach * 1.6));
    const h = (x, y) => { const f = sw(x, y); return ground(x, y) * (1 + SWELL * f) + RISE * f; };
    for (const s of strips) {
      const hs = xs.map((x) => h(x, s.yc));
      const back = xs.map((x, k) => P(x, s.y0, hs[k])), top = xs.map((x, k) => P(x, s.y1, hs[k]));
      // the strip's outline: its far top edge, down its near end, along its foot, up its far end
      s.body.setAttribute("d", poly([...back, top[NS], P(E, s.y1, 0), P(-E, s.y1, 0), top[0]]));
      s.cut.setAttribute("d", open([back[NS], top[NS], P(E, s.y1, 0), P(-E, s.y1, 0), top[0], back[0]]));
      let sh = "", li = "", ho = "";
      for (let k = 0; k < NS; k++) {
        const x = (xs[k] + xs[k + 1]) / 2, hx = (hs[k + 1] - hs[k]) / (xs[k + 1] - xs[k]);
        const hy = (h(x, s.yc + 1) - h(x, s.yc - 1)) / 2, lum = (hx * dx + hy * dy) / Math.hypot(hx, hy, 1);
        const d = open([back[k], back[k + 1]]);
        if (lum < 0.08) sh += d;
        else if (over && Math.hypot(x - over[0], s.yc - over[1]) < reach) ho += d;
        else li += d;
      }
      s.shade.setAttribute("d", sh); s.lit.setAttribute("d", li); s.hot.setAttribute("d", ho);
    }
    // the sun on the rim, painted just after the strip it lies beside, so nearer strips cover it
    const k = (E + M - 2.5) / Math.max(Math.abs(dx), Math.abs(dy)), ux = dx * k, uy = dy * k;
    place(sun, P(ux, uy, 0));
    const at = uy < -E ? -1 : clamp(Math.floor((uy + E) / DY), 0, N - 1);
    if (at !== dotAt) { dotAt = at; if (at < 0) strips[0].grp.before(sun); else strips[at].grp.after(sun); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const sp of [sx, sy, px, py, amp]) if (stepS(sp, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    over = p;
    let az = REST;
    if (p && Math.hypot(p[0], p[1]) > 4) az = (Math.atan2(p[1], p[0]) * 180) / Math.PI;
    sx.t = Math.cos(az * Math.PI / 180); sy.t = Math.sin(az * Math.PI / 180);
    if (p) { px.t = p[0]; py.t = p[1]; }
    amp.t = p ? 1 : 0;
    sun.setAttribute("class", p ? "dot m" : "dot");
    read.textContent = p ? `sun ${(Math.round(((az + 360) % 360) / 5) * 5) % 360}` : "rest";
    drawn = "";
    B.wake();
  }
  aim(null);

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.abs(x) < E + 30 && Math.abs(y) < E + 30 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 14, 60); if (over) aim(over); }, destroy: bag.dispose };
}

hairline({
  name: "hillshade",
  means: "A relief tile: the pointer sets the sun, the lit side of every ridge swings round to it, and the ground near it swells and lights.",
  rules: [1, 3, 4, 6],
  range: [18, 30, 48],
  tour: [[200, 110], [300, 190], [110, 200], null],
  mount,
});
