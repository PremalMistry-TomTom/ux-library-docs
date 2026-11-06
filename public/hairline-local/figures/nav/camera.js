/**
 * Camera: a map camera on a rail. A map tile stands on a short round post,
 * its streets and a river on it, and a curved rail arches over it from one
 * foot on the ground to the other, in the plane facing the viewer. A small
 * camera rides the rail, a body, a viewfinder on its back and a lens turned
 * on the tile's middle. At rest the camera waits part way down the left of
 * the arch and the tile's middle dot, where it looks, is the bright mark.
 * The pointer's place across the figure slides the camera along the arch:
 * overhead is a tilt of 0, low down the side the most; its lens takes the
 * bright edge, and the tile tips a little toward it, following. The slider
 * is the furthest the camera may tilt.
 *
 * The pattern: a position. One spring for the camera's angle, and a hit test
 * on the ground plane, which never moves: how far across the arch it is.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 76, H = W / 2, TT = 3, ZT = 14, R = 88, Z0 = 12, REST = -38, FOLLOW = 0.2;
const STREETS = [[[-34, -12], [34, -12]], [[8, -34], [8, 34]], [[-34, 16], [-6, 16], [8, 4]], [[22, -12], [22, 34]]];
const RIVER = Array.from({ length: 15 }, (_, k) => { const u = -34 + k * (68 / 14); return [u, -26 + 5 * Math.sin(u / 10)]; });
const S2 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  // a point in the arch's frame: h across the viewer, d toward them, z up
  const A = (h, d, z) => [S2 * (h + d), S2 * (d - h), z];
  fit(C, [A(-R - 6, 0, 0), A(R + 6, 0, 0), A(0, 0, Z0 + R + 24), A(0, H * 1.42, 0), A(0, -H * 1.42, ZT)], 200, 166);
  const P = proj(C), front = facing(C);
  const PA = (h, d, z) => P(...A(h, d, z));

  const g = mk("g", {}, svg);
  // the post the tile turns on, and the tile
  const [pr, pi] = rings(-5, -5, 5, 5, 5, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, ZT - 2));
  const tileG = mk("g", {}, g), tile = solid(tileG);
  const tm = mk("path", { class: "nf lo" }, tileG), riv = mk("path", { class: "nf" }, tileG);
  const target = flatDot(tileG, C, 2, "dot");
  const outer = rrect(-H, -H, H, H, 6, 5), inner = rrect(-H + 1.6, -H + 1.6, H - 1.6, H - 1.6, 4.4, 5);

  // the rail: a band between two arcs, a groove along it, a foot at each end
  const arc = (r, d) => Array.from({ length: 49 }, (_, k) => { const a = -Math.PI / 2 + (k / 48) * Math.PI; return PA(r * Math.sin(a), d, Z0 + r * Math.cos(a)); });
  for (const s of [-1, 1]) { const [fr, fi] = rings(-5, -5, 5, 5, 2, 1); put(solid(g), prism(P, front, fr.map((q) => ({ ...q, u: q.u + S2 * s * R, v: q.v - S2 * s * R })), fi.map((q) => ({ ...q, u: q.u + S2 * s * R, v: q.v - S2 * s * R })), 0, Z0)); }
  mk("path", { class: "sil", d: poly(arc(R + 2.2, 1).concat(arc(R - 2.2, 1).reverse())) }, g);
  mk("path", { class: "nf lo", d: open(arc(R, 1)) }, g);

  // the camera: a body, a viewfinder behind it, a lens toward the tile
  const camG = mk("g", {}, g), body = solid(camG), finder = solid(camG), lens = solid(camG), glass = mk("path", { class: "nf lo" }, camG);
  const bodyR = rrect(-14, -9, 14, 9, 3.5, 4), bodyI = rrect(-12.6, -7.6, 12.6, 7.6, 2.1, 4), finR = rrect(-6, -6, 6, 6, 2, 3);

  /** A solid along the camera's radial axis at angle a: ring (t, d) from radial r0 to r1. */
  function along(a, ring, r0, r1, innerRing) {
    const at = (q, r) => PA((R + r) * Math.sin(a) + q.u * Math.cos(a), q.v + 1, Z0 + (R + r) * Math.cos(a) - q.u * Math.sin(a));
    const sil = poly(hull(ring.map((q) => at(q, r0)).concat(ring.map((q) => at(q, r1)))));
    // the outer end shows while the camera is above the viewer's eye line, the inner end otherwise
    const end = Math.cos(a) * 0.5 + Math.sin(a) * 0 > -0.2 ? r1 : r0;
    return { sil, crease: innerRing ? poly(innerRing.map((q) => at(q, end))) : "" };
  }

  const ang = spring(REST * Math.PI / 180);
  let drawn = NaN;
  function draw(a) {
    if (a === drawn) return;
    drawn = a;
    const t = a * FOLLOW, ct = Math.cos(t), st = Math.sin(t);
    // the tile turns on the d axis: its edge toward the camera dips, its face follows
    const T = (x, y, w) => { const h = S2 * (x - y), d = S2 * (x + y); return PA(h * ct + w * st, d, ZT - h * st + w * ct); };
    const ring = (r, w) => r.map((q) => T(q.u, q.v, w));
    put(tile, { sil: poly(hull(ring(outer, 0).concat(ring(outer, TT)))), crease: poly(ring(inner, TT)) });
    tm.setAttribute("d", STREETS.map((l) => open(l.map(([x, y]) => T(x, y, TT)))).join(""));
    riv.setAttribute("d", open(RIVER.map(([x, y]) => T(x, y, TT))) + open(RIVER.map(([x, y]) => T(x, y + 4, TT))));
    place(target, T(0, 0, TT));
    put(body, along(a, bodyR, 3, 15, bodyI));
    put(finder, along(a, finR, 15, 20, null));
    put(lens, along(a, circ(7, 28), -9, 3, null));
    glass.setAttribute("d", along(a, circ(4.6, 24), -9, -9, circ(4.6, 24)).crease);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function aim(deg) {
    ang.t = deg * Math.PI / 180;
    const now = deg !== null && on;
    lens.sil.classList.toggle("hi", on);
    target.setAttribute("class", on ? "dot m" : "dot");
    read.textContent = on ? `tilt ${Math.round(Math.abs(deg) / 5) * 5}` : "rest";
    B.wake();
    return now;
  }
  aim(REST);

  /** On the ground: how far across the arch the pointer is sets the angle; off the figure, rest. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), h = S2 * (x - y), d = S2 * (x + y);
    on = Math.abs(h) < R + 24 && d < H * 1.6 && d > -R * 2.2;
    aim(on ? clamp(h / R, -1, 1) * reach : REST);
  }

  bag.add(pointer(stage, { move, leave: () => { on = false; aim(REST); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 40, 75); }, destroy: bag.dispose };
}

hairline({
  name: "camera",
  means: "A camera rides a rail arched over a map tile: the pointer slides it along, its lens lights and the tile tips to follow.",
  rules: [1, 3, 4, 8],
  range: [40, 60, 75],
  tour: [[110, 170], [200, 160], [300, 170], null],
  mount,
});
