/**
 * Map style: one map tile held on a pivot, a yoke of two posts on a low base,
 * its axle running through the tile's middle. The tile has two faces: the day
 * face on top, its streets, a river and a park drawn plain; the night face
 * under, the same streets dim and lined with street lights, a dot every few
 * units. At rest the tile leans toward the viewer, day up, and the axle's hub
 * on the near post is the bright mark. The pointer on the far side of the
 * axle settles the tile day up, its edge bright; on the near side the tile
 * tips over and lands night up, its street lights bright. The slider is the
 * lean the shown face keeps toward the viewer.
 *
 * The pattern: one of two. A tween for the turn, and a hit test on the ground
 * plane, which never moves: which side of the axle the pointer is on.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 88, H = W / 2, TH = 3, HP = 54, PX = H + 7, BZ = 4, REST = 34;
const STREETS = [[[-40, -16], [40, -16]], [[-12, -40], [-12, 40]], [[-40, 18], [6, 18], [20, 4], [40, 4]], [[20, -40], [20, -16]]];
const RIVER = Array.from({ length: 17 }, (_, k) => { const u = -40 + k * 5; return [u, -30 + 4 * Math.sin(u / 12)]; });
const PARK = rrect(-36, 24, -18, 38, 3, 3);
const NAMES = ["day", "night"];

/** Street lights: a dot every 8 units along each street. */
const LIGHTS = (() => {
  const out = [];
  for (const s of STREETS) for (let k = 1; k < s.length; k++) {
    const [a, b] = [s[k - 1], s[k]], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let d = 4; d < l - 2; d += 8) out.push([a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l]);
  }
  return out;
})();

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-PX - 8, -12, 0], [PX + 8, 12, 0], [PX + 8, -12, 0], [-PX - 8, 12, 0], [0, 0, HP + H + TH], [-H, H, HP - 30], [H, H, HP - 30]], 200, 166);
  const P = proj(C), front = facing(C);

  /** A point of the tile at turn a (radians): u along the axle, v across, w through it. */
  const T = (a, u, v, w) => P(u, v * Math.cos(a) + w * Math.sin(a), HP - v * Math.sin(a) + w * Math.cos(a));
  // the camera looks along (.61, .61, .5): the top face shows while its normal points that way
  const topUp = (a) => 0.612 * Math.sin(a) + 0.5 * Math.cos(a) > 0;

  const g = mk("g", {}, svg);
  const [br, bi] = rings(-PX - 8, -12, PX + 8, 12, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const post = (x) => { const [r, i] = rings(x - 3.5, -3.5, x + 3.5, 3.5, 2.5, 1); put(solid(g), prism(P, front, r, i, BZ, HP + 5)); };
  post(-PX);
  mk("path", { class: "nf lo", d: open([P(-PX + 3.5, 0, HP), P(-H, 0, HP)]) }, g);

  const tile = mk("g", {}, g), el = solid(tile);
  const dayM = mk("path", { class: "nf" }, tile), dayP = mk("path", { class: "nf lo" }, tile);
  const nightM = mk("path", { class: "nf lo" }, tile), lamps = mk("g", {}, tile);
  const dots = LIGHTS.map(() => flatDot(lamps, C, 1.1, "dot m"));
  const outer = rrect(-H, -H, H, H, 6, 5), inner = rrect(-H + 1.6, -H + 1.6, H - 1.6, H - 1.6, 4.4, 5);

  post(PX);
  mk("path", { class: "nf lo", d: open([P(H, 0, HP), P(PX - 3.5, 0, HP)]) }, g);
  const hub = flatDot(g, C, 2.2, "dot");
  place(hub, P(PX, 3.5, HP));

  const turn = tween(REST * Math.PI / 180);
  let drawn = NaN;
  function draw(a) {
    if (a === drawn) return;
    drawn = a;
    const up = topUp(a), w = up ? TH / 2 : -TH / 2, at = (u, v) => T(a, u, v, w);
    const ring = (r, ww) => r.map((q) => T(a, q.u, q.v, ww));
    put(el, { sil: poly(hull(ring(outer, TH / 2).concat(ring(outer, -TH / 2)))), crease: poly(ring(inner, w)) });
    const lines = (ls) => ls.map((l) => open(l.map(([u, v]) => at(u, v)))).join("");
    // the night face is the day face turned over: mirror it across the axle so it reads the same way up
    const nv = (ls) => ls.map((l) => l.map(([u, v]) => [u, -v]));
    dayM.setAttribute("d", up ? lines(STREETS) + open(RIVER.map(([u, v]) => at(u, v))) + open(RIVER.map(([u, v]) => at(u, v + 5))) : "");
    dayP.setAttribute("d", up ? poly(PARK.map((q) => at(q.u, q.v))) : "");
    nightM.setAttribute("d", up ? "" : lines(nv(STREETS)));
    if (up) lamps.remove(); else if (!lamps.parentNode) tile.appendChild(lamps);
    if (!up) dots.forEach((d, k) => place(d, at(LIGHTS[k][0], -LIGHTS[k][1])));
  }

  const B = register(stage, (_dt, now) => { draw(tval(turn, now)); return !tdone(turn, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const deg = a < 0 ? REST : a === 0 ? lean : 180 + lean;
    tset(turn, deg * Math.PI / 180, performance.now(), 0);
    el.sil.classList.toggle("hi", a === 0);
    dots.forEach((d) => d.setAttribute("class", a === 1 ? "dot" : "dot m"));
    hub.setAttribute("class", a < 0 ? "dot" : "dot m");
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);

  /** On the ground: beyond the axle is day, before it night; off the yoke, rest. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.abs(x) > PX + 14 || Math.abs(y) > H + 30) return -1;
    return y < 0 ? 0 : 1;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lean = clamp(v, 0, 20); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "map-style",
  means: "A map tile on a pivot, day face on top, night face under: the pointer tips it over to show the other style.",
  rules: [1, 4, 5, 8],
  range: [0, 10, 20],
  tour: [[230, 110], [170, 230], [230, 110], null],
  mount,
});
