/**
 * Replan: a patch of street plan, three low blocks with a main road along
 * their near side, a side street along their far side, and two cross streets
 * joining them round the middle block. A roadworks barrier stands across the
 * main road in front of the middle block: a striped board on two legs. At
 * rest the route runs straight along the main road, dim, into the barrier,
 * and the barrier takes the bright edge. As the pointer comes near the
 * barrier, the route re-forms round it: it bends off up the first cross
 * street, along the side street behind the middle block and back down the
 * second, the nearer the pointer the further, and takes the bright edge from
 * the barrier. The slider is the reach.
 *
 * The pattern: one place, on one spring. The route is the same number of
 * points on both paths, so it morphs; the hit test measures the pointer
 * against the barrier's rest middle on screen, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rings, seg,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const S = 2.05, X0 = -80, X1 = 80, Y0 = -10, Y1 = 50, MY = 39, FY = 0, CX = 25, BH = 5;
const BLOCKS = [[X0 + 4, 7, -CX - 6, 28, 3], [-CX + 6, 7, CX - 6, 28, 6], [CX + 6, 7, X1 - 4, 28, 4]];
const SX0 = X0 + 8, SX1 = X1 - 8, NS = 160;

/** A polyline resampled to n points at equal steps along it. */
function resample(pts, n) {
  const run = [0];
  for (let k = 1; k < pts.length; k++) run.push(run[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  const out = [], tot = run[run.length - 1];
  for (let i = 0, k = 1; i < n; i++) {
    const s = (i / (n - 1)) * tot;
    while (k < pts.length - 1 && run[k] < s) k++;
    const f = (s - run[k - 1]) / (run[k] - run[k - 1] || 1), a = pts[k - 1], b = pts[k];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

const STRAIGHT = resample([[SX0, MY], [SX1, MY]], NS);
const DETOUR = (() => {
  const raw = [[SX0, MY], [-CX, MY], [-CX, FY], [CX, FY], [CX, MY], [SX1, MY]];
  return resample(fillet(raw, raw.map((_, k) => (k === 0 || k === raw.length - 1 ? 0 : 7)), 6), NS);
})();

/** The share of the route replanned with the pointer u reaches from the barrier: 1 to 40%, .3 at 80%, 0 from 130%. */
const falloff = (u) => (u <= 0.4 ? 1 : u <= 0.8 ? 1 - ((u - 0.4) / 0.4) * 0.7 : u <= 1.3 ? 0.3 - ((u - 0.8) / 0.5) * 0.3 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, S);
  fit(C, [[X0, Y0, -3], [X1, Y1, -3], [X1, Y0, 0], [X0, Y1, -3], [X0, Y0, 6], [0, MY, 11]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the ground the streets are laid on, the main road's kerb lines either side of the route
  put(solid(g), prism(P, front, ...rings(X0, Y0, X1, Y1, 8, 2), -3, 0));
  mk("path", { class: "nf lo", d: seg(P(X0 + 4, Y1 - 3, 0), P(X1 - 4, Y1 - 3, 0)) + seg(P(X0 + 4, Y0 + 3, 0), P(X1 - 4, Y0 + 3, 0)) }, g);

  mk("path", { class: "dash nf", d: open([P(X0 + 8, MY + 5, 0), P(X1 - 8, MY + 5, 0)]) + open([P(-CX + 4, FY - 5, 0), P(CX - 4, FY - 5, 0)]) }, g);

  // the route, under the blocks so the far street hides behind them, as it would
  const route = mk("path", { class: "nf" }, g);
  const start = flatDot(g, C, 3.2, "dot m"), end = flatDot(g, C, 3.2, "dot off");
  place(start, P(SX0, MY, 0));
  place(end, P(SX1, MY, 0));

  // the blocks, back to front, each a low kerbed slab with a crease
  for (const [a, b, c, d, h] of BLOCKS) put(solid(g), prism(P, front, ...rings(a, b, c, d, 4, 1.5), 0, h));

  // the barrier: two legs and a striped board across the main road, at x = 0
  const BY0 = MY - 9, BY1 = MY + 9, BZ0 = 4, BZ1 = 11, BT = 1.2;
  for (const y of [BY0 + 1.5, BY1 - 1.5]) put(solid(g), prism(P, front, ...rings(-1.6, y - 1.6, 1.6, y + 1.6, 0.8, 0.5), 0, BZ0));
  const board = fillet([[BY0, BZ0], [BY1, BZ0], [BY1, BZ1], [BY0, BZ1]], [1.2, 1.2, 1.2, 1.2], 3);
  const bf = board.map(([y, z]) => P(BT, y, z)), bb = board.map(([y, z]) => P(-BT, y, z));
  const bar = solid(g);
  put(bar, { sil: poly(hull(bf.concat(bb))), crease: poly(bf) });
  bar.sil.classList.add("hi");
  let st = "";
  for (let y = BY0 + 3; y < BY1 - 1; y += 4.5) st += seg(P(BT, y, BZ0 + 0.8), P(BT, y + 3, BZ1 - 0.8));
  mk("path", { class: "nf lo", d: st }, g);

  const sp = spring(0, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const c = sp.x;
    if (c === drawn) return;
    drawn = c;
    route.setAttribute("d", open(STRAIGHT.map((p, i) => P(lerp(p[0], DETOUR[i][0], c), lerp(p[1], DETOUR[i][1], c), 0))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(0, MY, BZ0);
  let lit = null;
  function retarget() {
    const c = over ? falloff(Math.hypot(over[0] - mid[0], (over[1] - mid[1]) * 0.8) / reach) : 0;
    sp.t = c;
    const on = c > 0.4;
    if (on !== lit) {
      lit = on;
      route.setAttribute("class", on ? "nf hi" : "nf");
      end.setAttribute("class", on ? "dot" : "dot off");
      bar.sil.classList.toggle("hi", !on);
    }
    read.textContent = on ? "detour" : "rest";
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
  name: "replan",
  means: "A route running into a barrier on the main road: as the pointer comes near, it re-forms round the block by the side street.",
  rules: [1, 3, 4, 6],
  range: [70, 110, 160],
  tour: [[340, 250], [250, 210], [205, 190], null],
  mount,
});
