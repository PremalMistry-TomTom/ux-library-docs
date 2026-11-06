/**
 * Location engine: where the device is, from its own sensors. A position puck
 * lies on the ground in front, a dot on it and an accuracy ring round it, and
 * behind it, in a row, three sensors stand on round plinths: a dish on a post,
 * its bowl turned up towards the puck, struts holding a feed over it; a wheel
 * standing upright, rim, hub and spokes; a gyroscope, a hoop and its equator
 * round a spinning disc on an axle. From each plinth a link runs on the
 * ground to the puck. At rest the dish's link is bright and the dish sits a
 * little raised. The pointer picks a sensor: it rises off the ground, its
 * neighbours a little after it, and its link draws again from it to the puck,
 * bright; the others stay dim and dashed. The slider is the rise.
 *
 * The pattern: one of many. Tweens for which sensor, staggered from it. The
 * hit test is each sensor's rest centre on screen, nearest the pointer's x.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PK = [34, 34], PKR = 12, PKH = 5, RING = 23;
const SENS = [{ name: "dish", at: [-58, 18] }, { name: "wheel", at: [-20, -20] }, { name: "gyro", at: [18, -58] }];
const REST = [5, 0, 2], LIT = 0, BR = 10, BH = 3;
const V = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const nz = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** A circle of radius r round c, in the plane of the unit vectors e1 and e2. */
const loop = (c, e1, e2, r, n = 40) => Array.from({ length: n }, (_, k) => {
  const t = (2 * Math.PI * k) / n;
  return V(V(c, e1, r * Math.cos(t)), e2, r * Math.sin(t));
});
const sh = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

/** A loop's far and near runs, each as open polylines, split at its centre's depth. */
const depth = (p) => ((p[0] + p[1]) * 0.866) / Math.SQRT2 + p[2] * 0.5;
function halvesOf(Q, pts, c) {
  const dc = depth(c), n = pts.length, f = pts.map((p) => depth(p) > dc), d = ["", ""];
  let s = 0;
  while (s < n && f[s] === f[(s + n - 1) % n]) s++;
  s %= n;
  let run = [pts[s]], st = f[s];
  for (let k = 1; k <= n; k++) {
    const i = (s + k) % n;
    run.push(pts[i]);
    if (k === n || f[i] !== st) { d[st ? 1 : 0] += open(run.map(Q)); run = [pts[i]]; st = f[i]; }
  }
  return d;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2);
  const ext = [[PK[0] + RING, PK[1] + RING, 0], [PK[0] - RING, PK[1] + RING, 0], [PK[0] + RING, PK[1] - RING, 0]];
  for (const s of SENS) ext.push([s.at[0] - 18, s.at[1] + 18, 0], [s.at[0] + 18, s.at[1] - 18, 0], [s.at[0], s.at[1], 14 + 50]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C), Q = (p) => P(...p), halves = (q, c) => halvesOf(Q, q, c);

  const g = mk("g", {}, svg);
  mk("path", { class: "nf lo", d: poly(circ(RING, 56).map((q) => P(PK[0] + q.u, PK[1] + q.v, 0))) }, g);
  const links = SENS.map(() => mk("path", { class: "nf dash lo" }, g));
  const layer = mk("g", {}, g);

  /** A round plinth and a post on it, from z up to top. */
  const stand = (grp, x, y, z, top, r) => {
    put(solid(grp), prism(P, front, sh(circ(BR, 36), x, y), sh(circ(BR - 1.6, 36), x, y), z, z + BH));
    if (top > BH) put(solid(grp), prism(P, front, sh(circ(r, 16), x, y), sh(circ(r - 0.8, 16), x, y), z + BH, z + top));
  };
  const BUILD = {
    dish(grp, x, y, z) {
      stand(grp, x, y, z, 22, 2.2);
      // the bowl turned up to the sky, leaning away to the left, so its back shows under the rim
      const c = [x, y, z + 29], n = nz([-0.12, 0.42, 0.9]);
      const e1 = nz(cross(n, [0, 0, 1])), e2 = cross(n, e1);
      const rim = loop(c, e1, e2, 16, 48), back = loop(V(c, n, -9), e1, e2, 6, 24), tip = V(c, n, 7);
      const s = solid(grp);
      put(s, { sil: poly(hull(rim.concat(back).map(Q))), crease: poly(loop(c, e1, e2, 14.6, 48).map(Q)) });
      mk("path", { class: "nf lo", d: [0, 16, 32].map((k) => open([Q(rim[k]), Q(tip)])).join("") }, grp);
      place(flatDot(grp, C, 1.8, "dot m"), Q(tip));
      return [s.sil];
    },
    wheel(grp, x, y, z) {
      stand(grp, x, y, z, 0, 0);
      const R = 17, W = 5, c = [x, y, z + BH + R], ax = [1, 0, 0], e1 = [0, 1, 0], e2 = [0, 0, 1], f = V(c, ax, W);
      const s = solid(grp);
      put(s, { sil: poly(hull(loop(f, e1, e2, R, 48).concat(loop(V(c, ax, -W), e1, e2, R, 48)).map(Q))), crease: poly(loop(f, e1, e2, R - 3.4, 48).map(Q)) });
      const spokes = [0, 1, 2, 3, 4].map((k) => {
        const t = (2 * Math.PI * k) / 5 + 0.3, d = V(V([0, 0, 0], e1, Math.cos(t)), e2, Math.sin(t));
        return open([Q(V(f, d, 3.4)), Q(V(f, d, R - 6))]);
      });
      mk("path", { class: "nf lo", d: poly(loop(f, e1, e2, R - 6, 40).map(Q)) + spokes.join("") }, grp);
      mk("path", { class: "", d: poly(loop(f, e1, e2, 3.4, 20).map(Q)) }, grp);
      return [s.sil];
    },
    gyro(grp, x, y, z) {
      stand(grp, x, y, z, 8, 1.8);
      // the hoop, a band of two rings, split so its near half passes in front of the rotor
      const R = 16, c = [x, y, z + 8 + R], s2 = Math.SQRT1_2, hp = (r) => loop(c, [s2, -s2, 0], [0, 0, 1], r, 56);
      const far = mk("path", { class: "nf sil" }, grp);
      mk("path", { class: "nf lo", d: open([Q([x, y, c[2] - R]), Q(c)]) }, grp);
      const rot = solid(grp);
      put(rot, prism(P, front, sh(circ(11, 40), x, y), sh(circ(9.4, 40), x, y), c[2] - 2, c[2] + 2));
      mk("path", { class: "nf lo", d: open([Q([x, y, c[2] + 2]), Q([x, y, c[2] + R - 2])]) }, grp);
      place(flatDot(grp, C, 1.6, "dot m"), Q([x, y, c[2] + 2]));
      const near = mk("path", { class: "nf sil" }, grp), d = [hp(R), hp(R - 2.4)].map((q) => halves(q, c));
      far.setAttribute("d", d[0][0] + d[1][0]);
      near.setAttribute("d", d[0][1] + d[1][1]);
      return [far, near];
    },
  };

  const sens = SENS.map((s, i) => ({ ...s, i, grp: mk("g", {}, layer), z: tween(REST[i]), k: tween(1), drawn: "", edges: [] }));
  // the puck, nearest of all: a low disc with a dot on it
  put(solid(g), prism(P, front, sh(circ(PKR, 48), ...PK), sh(circ(PKR - 1.8, 48), ...PK), 0, PKH));
  place(flatDot(g, C, 3.4, "dot m"), P(PK[0], PK[1], PKH));

  let act = null;
  const lit = () => (act === null || act < 0 ? LIT : act);
  function draw(s, z, k) {
    const key = z + "," + k + "," + lit();
    if (key === s.drawn) return;
    s.drawn = key;
    s.grp.replaceChildren();
    const [x, y] = s.at;
    s.edges = BUILD[s.name](s.grp, x, y, z);
    s.edges.forEach((el) => el.classList.toggle("hi", s.i === lit()));
    const a = [x, y, z], b = [PK[0], PK[1], PKH * 0.5];
    links[s.i].setAttribute("d", k < 0.01 ? "" : open([Q(a), Q([lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)])]));
    links[s.i].setAttribute("class", s.i === lit() ? "nf hi" : "nf dash lo");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of sens) { draw(s, tval(s.z, now), tval(s.k, now)); if (!tdone(s.z, now) || !tdone(s.k, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), was = lit();
    act = a;
    sens.forEach((s) => {
      const near = a < 0 ? REST[s.i] : s.i === a ? lift : lift * 0.3;
      tset(s.z, near, now, a < 0 ? 0 : Math.abs(s.i - a) * 50);
    });
    const s = sens[lit()];
    if (lit() !== was) { s.k = tween(0); s.drawn = ""; tset(s.k, 1, now, 120); }
    read.textContent = a < 0 ? "rest" : SENS[a].name;
    B.wake();
  }
  setActive(-1, true);

  // the hit test: the sensor whose rest centre is nearest the pointer's x, inside the band they stand in
  const mids = SENS.map((s, i) => P(s.at[0], s.at[1], REST[i] + 24));
  const top = Math.min(...mids.map((m) => m[1])) - 50, foot = P(PK[0], PK[1], 0)[1] + 10;
  const hit = ([px, py]) => {
    if (py < top || py > foot) return -1;
    let best = -1, bd = 46;
    mids.forEach((m, i) => { const d = Math.abs(px - m[0]); if (d < bd) { bd = d; best = i; } });
    return best;
  };

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 6, 14); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "location-engine",
  means: "A position puck fed by three sensors, a dish, a wheel and a gyroscope: the one under the pointer rises and its link to the puck lights.",
  rules: [1, 2, 4, 8],
  range: [6, 10, 14],
  tour: [[118, 100], [200, 115], [285, 100], null],
  mount,
});
