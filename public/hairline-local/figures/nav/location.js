/**
 * Location: where the device is, from the sky. A position puck, a round disc
 * with a dot on it, stands on a small patch of street, two streets crossing
 * under it, and round it on the ground its accuracy ring. High above, three
 * satellites hang at different spots, each a small body with its two solar
 * panels spread, an antenna under it pointing down. At rest one satellite is
 * locked: it carries the bright edge, a dashed guide runs from its antenna
 * down to the puck, and the ring sits wide. The pointer picks a satellite: it
 * takes the bright edge, its guide draws down to the puck, and once it lands
 * the ring tightens round the puck. A second fix, a smaller circle. The
 * slider is how tight the ring pulls, its radius.
 *
 * The pattern: one of many. Tweens for which satellite, the guide first and
 * the ring after it, so the answer runs from the pointer down to the ground.
 * The hit test is each satellite's rest centre on screen; they never move.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const G = 44, GT = 3, KW = 7, PKR = 9, PK = 5, RING_REST = 38, PW = 7, TILT = 0.7;
// the satellites: where each hangs, its panels along the screen's horizontal
const SATS = [[-42, 28, 84], [-30, -38, 112], [36, -34, 78]];
const LOCK = 0, A = -Math.PI / 4;
/** A ring turned by a and set down at (x, y), normals with it. */
const turn = (ring, x, y) => {
  const c = Math.cos(A), s = Math.sin(A);
  return ring.map((q) => ({ ...q, u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

/** The streets' kerbs on the patch: two streets crossing at the middle, each kerb open where the other crosses. */
function kerbs() {
  const out = [], m = G - 3;
  for (const e of [-KW, KW]) {
    out.push([[e, -m], [e, -KW]], [[e, KW], [e, m]]);
    out.push([[-m, e], [-KW, e]], [[KW, e], [m, e]]);
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tight = value;
  const C = Cam(45, 0.5, 1.42);
  fit(C, [[-G, -G, 0], [G, G, -GT], [G, -G, 0], [-G, G, 0], ...SATS.map(([x, y, z]) => [x, y, z + 9])], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the patch of street: a plate, the kerbs on it
  put(solid(g), prism(P, front, ...rings(-G, -G, G, G, 8, 1.8), -GT, 0));
  mk("path", { class: "nf lo", d: kerbs().map((k) => open(k.map(([x, y]) => P(x, y, 0)))).join("") }, g);
  // the accuracy ring, on the ground round the puck
  const ring = mk("path", { class: "nf" }, g);
  // the guides, behind the puck and the satellites they join
  const guides = SATS.map(() => mk("path", { class: "nf dash lo" }, g));

  // the puck: a round disc with a dot on it
  put(solid(g), prism(P, front, circ(PKR, 48), circ(PKR - 1.8, 48), 0, PK));
  place(flatDot(g, C, 3.4, "dot m"), P(0, 0, PK));

  // the satellites, far to near: the far panel, the body, the near panel, a strut each side, an antenna under it
  const order = SATS.map((s, i) => i).sort((a, b) => SATS[a][0] + SATS[a][1] - SATS[b][0] - SATS[b][1]);
  const sats = [];
  for (const i of order) {
    const [x, y, z] = SATS[i], grp = mk("g", {}, g), sils = [];
    const lp = (u, v, h) => { const c = Math.cos(A), s = Math.sin(A); return P(x + u * c - v * s, y + u * s + v * c, h); };
    mk("path", { class: "nf lo", d: open([lp(0, 0, z - 6), lp(0, 0, z - 11)]) }, grp);
    // a panel: a thin plate along u, tilted about its long axis, its near edge dipping; its upper face the crease
    const panel = (side) => {
      const u0 = side > 0 ? 9 : -27, u1 = side > 0 ? 27 : -9, ct = Math.cos(TILT), st = Math.sin(TILT);
      const at = (u, w, t) => lp(u, w * ct + t * st, z - w * st + t * ct);
      const out = rrect(u0, -PW, u1, PW, 1.4, 4), up = out.map((q) => at(q.u, q.v, 0.8));
      const el = solid(grp);
      const inn = rrect(u0 + 1.3, -PW + 1.3, u1 - 1.3, PW - 1.3, 0.8, 4).map((q) => at(q.u, q.v, 0.8));
      put(el, { sil: poly(hull(up.concat(out.map((q) => at(q.u, q.v, -0.8))))), crease: poly(inn) });
      mk("path", { class: "nf lo", d: [1, 2].map((k) => open([at(u0 + (k * (u1 - u0)) / 3, -PW + 1.3, 0.8), at(u0 + (k * (u1 - u0)) / 3, PW - 1.3, 0.8)])).join("") }, grp);
      mk("path", { class: "nf lo", d: open([lp(side * 6, 0, z), lp(side * 9, 0, z)]) }, grp);
      sils.push(el.sil);
    };
    panel(-1);
    const [br, bi] = rings(-6, -6, 6, 6, 1.8, 1.2), body = solid(grp);
    put(body, prism(P, front, turn(br, x, y), turn(bi, x, y), z - 6, z + 6));
    sils.push(body.sil);
    panel(1);
    const dot = flatDot(grp, C, 1.8, "dot off");
    place(dot, lp(0, 0, z - 11));
    sats[i] = { sils, dot, at: P(x, y, z), tip: [x, y, z - 11], k: tween(i === LOCK ? 1 : 0), drawn: NaN };
  }

  const rr = tween(RING_REST);
  let ringDrawn = NaN;
  function draw(now) {
    let moving = false;
    const r = tval(rr, now);
    if (!tdone(rr, now)) moving = true;
    if (r !== ringDrawn) ring.setAttribute("d", poly(circ(r, 56).map((q) => P(q.u, q.v, 0))));
    // each lock is a cone of signal, from the antenna down to the ring's two sides across it: it narrows as the ring does
    sats.forEach((s, i) => {
      const k = tval(s.k, now);
      if (!tdone(s.k, now)) moving = true;
      if (k === s.drawn && r === ringDrawn) return;
      s.drawn = k;
      const [x, y, z] = s.tip, l = Math.hypot(x, y), n = [-y / l, x / l];
      const to = (sg) => P(x + (sg * n[0] * r - x) * k, y + (sg * n[1] * r - y) * k, z * (1 - k));
      guides[i].setAttribute("d", k < 0.01 ? "" : open([P(x, y, z), to(1)]) + open([P(x, y, z), to(-1)]));
    });
    ringDrawn = r;
    return moving;
  }
  const B = register(stage, (_dt, now) => draw(now));
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), on = a < 0 ? LOCK : a;
    sats.forEach((s, i) => {
      // the satellite chosen draws its guide down; the locked one keeps its own, the others wind theirs back
      tset(s.k, i === on || i === LOCK ? 1 : 0, now, i === on ? 0 : 120);
      s.sils.forEach((el) => el.classList.toggle("hi", i === on));
      s.dot.setAttribute("class", i === on || i === LOCK ? "dot m" : "dot off");
      guides[i].setAttribute("class", i === on ? "nf dash" : "nf dash lo");
    });
    // the ring tightens once the guide has landed
    tset(rr, a < 0 ? RING_REST : tight, now, a < 0 ? 0 : 420);
    read.textContent = a < 0 ? "rest" : `sat ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** The satellite whose rest centre is nearest the pointer on screen, within reach of its panels. */
  function hit([px, py]) {
    let best = -1, bd = 46;
    sats.forEach((s, i) => { const d = Math.hypot((px - s.at[0]) * 0.8, py - s.at[1]); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { tight = clamp(v, 11, 22); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "location",
  means: "A position puck on a street under three satellites: the one under the pointer locks on, its guide drops, and the accuracy ring tightens.",
  rules: [1, 4, 5, 8],
  range: [20, 14, 11],
  tour: [[208, 60], [270, 137], [130, 122], null],
  mount,
});
