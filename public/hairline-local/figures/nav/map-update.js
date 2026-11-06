/**
 * Map update: a saved region laid out as nine map tiles, the tiles of Saved
 * Region, each a thin plate with its piece of the streets on it, the main road
 * crossing them on the diagonal. Over them hangs one fresh tile, bright, the
 * update: the same streets, and one new street running through it. At rest it
 * waits over the right-hand corner, whose old tile has begun to lift. The
 * pointer picks a tile by where it is: that old tile lifts out of the grid and
 * back, the fresh one flies over to its place and drops in, only that tile
 * patched. Let go, the fresh tile rises and returns to the corner, and the old
 * one settles back. The slider is how high the old tile lifts out.
 *
 * The pattern: one of many. A tween for each old tile's lift; the fresh tile
 * rises, crosses and drops on three tweens, each leg after the last. The hit
 * test is the ground plane, which never moves.
 */
const {
  Cam, clamp, extremes, facing, fit, open, prism, proj, rings, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

// the tiles: N × N cells of T, a gap between, TT thick
const N = 3, T = 24, GAP = 2, E = (N * T + (N - 1) * GAP) / 2, TT = 1.6;
// the fresh tile waits at HV over tile REST_AT, whose old tile is lifted UP0; an old tile lifted out drifts back by BACK, none here: straight up
const HV = 15, REST_AT = 2, UP0 = 5, BACK = 0;
const STREETS = [[-E, -25, E, -25], [-E, 3, E, 3], [-E, 28, E, 28], [-27, -E, -27, E], [-3, -E, -3, E], [24, -E, 24, E]];
const ROAD = [-4.5, 4.5].map((c) => [-E - 20, c + E + 20, c + E + 20, -E - 20]);
// the new street, only on the fresh tile: through its middle, across the road, on the other diagonal
const NEW = (cx, cy) => [[cx - 27, cy - 33, cx + 33, cy + 27]];

/** A segment clipped to a box, or null. */
function clip([x0, y0, x1, y1], [a0, b0, a1, b1]) {
  let t0 = 0, t1 = 1;
  const dx = x1 - x0, dy = y1 - y0;
  for (const [p, q] of [[-dx, x0 - a0], [dx, a1 - x0], [-dy, y0 - b0], [dy, b1 - y0]]) {
    if (p === 0) { if (q < 0) return null; continue; }
    const r = q / p;
    if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
  }
  return t0 < t1 ? [[x0 + dx * t0, y0 + dy * t0], [x0 + dx * t1, y0 + dy * t1]] : null;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-E, -E, 0], [E, E, 0], [E, -E, 0], [-E, E, 0], [-E - BACK, -E - BACK, 38 + TT], [E - BACK, -E - BACK, 38 + TT], [-E - BACK, E - BACK, 38 + TT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A tile's paths in its own cell, drawn anywhere: its plate, its streets, its road (and the new street). */
  const cell = (i) => {
    const r = Math.floor(i / N), c = i % N, x0 = -E + c * (T + GAP), y0 = -E + r * (T + GAP);
    const cut = (ss) => ss.map((s) => clip(s, [x0 + 1.4, y0 + 1.4, x0 + T - 1.4, y0 + T - 1.4])).filter(Boolean);
    return { r, c, cx: x0 + T / 2, cy: y0 + T / 2, segs: cut(STREETS), kerbs: cut(ROAD), fresh: cut(NEW(x0 + T / 2, y0 + T / 2)) };
  };
  const ring = rings(-T / 2, -T / 2, T / 2, T / 2, 2, 1);
  const make = () => { const grp = mk("g", {}, g), drop = mk("path", { class: "nf dash" }, grp), el = solid(grp); return { grp, drop, el, map: mk("path", { class: "nf lo" }, grp), road: mk("path", { class: "nf" }, grp), add: mk("path", { class: "nf hi" }, grp), drawn: "" }; };
  function draw(o, k, x, y, z, extra) {
    const key = k + "," + x + "," + y + "," + z;
    if (key === o.drawn) return;
    o.drawn = key;
    const s = cell(k), dx = x - s.cx, dy = y - s.cy, sh = (rg) => rg.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
    put(o.el, prism(P, front, sh(ring[0]), sh(ring[1]), z, z + TT));
    // dashed drops from a tile in the air, at its left and right, down to the slot it belongs over, painted behind it
    o.drop.setAttribute("d", z < 3 ? "" : extremes(P, sh(ring[0])).slice(0, 2).map((q) => open([P(q.u, q.v, z), P(q.u, q.v, TT)])).join(""));
    const lines = (ss) => ss.map((sg) => open(sg.map(([u, v]) => P(u + dx, v + dy, z + TT)))).join("");
    o.map.setAttribute("d", lines(s.segs));
    o.road.setAttribute("d", lines(s.kerbs));
    o.add.setAttribute("d", extra ? lines(s.fresh) : "");
  }

  const tiles = Array.from({ length: N * N }, (_, i) => ({ i, ...cell(i), ...make(), z: tween(i === REST_AT ? UP0 : 0) }));
  const home = cell(REST_AT);
  const fresh = { ...make(), at: REST_AT, x: tween(home.cx), y: tween(home.cy), z: tween(HV), want: -1 };
  fresh.el.sil.classList.add("hi");

  let order = "";
  function paintOrder(zs, fz) {
    // grounded tiles far to near; anything in the air after them, lowest first
    const key = (z, r, c) => (z < 3 ? r + c : 10 + z + (r + c) * 0.1);
    const all = tiles.map((t, k) => ({ o: t, d: key(zs[k], t.r, t.c) }));
    const fc = cell(fresh.at);
    all.push({ o: fresh, d: fz < 3 ? fc.r + fc.c + 0.5 : key(fz, fc.r, fc.c) + 0.05 });
    all.sort((a, b) => a.d - b.d);
    const k = all.map((a) => (a.o === fresh ? "f" : a.o.i)).join();
    if (k === order) return;
    order = k;
    all.forEach((a) => g.appendChild(a.o.grp));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    const zs = tiles.map((t) => {
      const z = tval(t.z, now), u = clamp((z - UP0) / (lift - UP0), 0, 1);
      draw(t, t.i, t.cx - BACK * u, t.cy - BACK * u, z, false);
      if (!tdone(t.z, now)) moving = true;
      return z;
    });
    // the fresh tile's legs: up to HV, across to its slot, then down into it when one is wanted
    const fx = tval(fresh.x, now), fy = tval(fresh.y, now), fz = tval(fresh.z, now);
    if (tdone(fresh.z, now) && Math.abs(fz - HV) < 0.01) {
      const s = cell(fresh.want < 0 ? REST_AT : fresh.want);
      fresh.at = fresh.want < 0 ? REST_AT : fresh.want;
      tset(fresh.x, s.cx, now, 150); tset(fresh.y, s.cy, now, 150);
      if (fresh.want >= 0 && tdone(fresh.x, now) && tdone(fresh.y, now) && Math.abs(fx - s.cx) + Math.abs(fy - s.cy) < 0.01) tset(fresh.z, 0, now, 0);
    }
    draw(fresh, fresh.at, fx, fy, fz, true);
    paintOrder(zs, fz);
    if (!tdone(fresh.x, now) || !tdone(fresh.y, now) || !tdone(fresh.z, now) || (fresh.want >= 0 && fz > 0) || (fresh.want < 0 && fz < HV)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    tiles.forEach((t) => tset(t.z, a < 0 ? (t.i === REST_AT ? UP0 : 0) : t.i === a ? lift : 0, now, 0));
    // the fresh tile leaves where it is by rising first; the tick sends it across and down
    if (fresh.want !== a) tset(fresh.z, HV, now, 0);
    fresh.want = a;
    read.textContent = a < 0 ? "rest" : `tile ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** On the ground plane: the cell under the pointer, or -1 off the grid. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < -E - 4 || x > E + 4 || y < -E - 4 || y > E + 4) return -1;
    const c = (v) => clamp(Math.floor((v + E + GAP / 2) / (T + GAP)), 0, N - 1);
    return c(y) * N + c(x);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 20, 38); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "map-update",
  means: "Nine map tiles and one fresh tile over them: the tile under the pointer lifts out, the fresh one drops into its place.",
  rules: [1, 4, 5, 8],
  range: [20, 28, 38],
  tour: [[200, 190], [140, 170], [250, 215], null],
  mount,
});
