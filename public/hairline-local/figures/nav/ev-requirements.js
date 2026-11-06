/**
 * EV requirements: does the plug fit the car. A socket stands on a panel, a
 * round collar flattened on its far side, the recess in its top the same D
 * and five pin holes in it, one of them the key. Over it hovers the plug: the
 * same D, a body with five pins under it, a tapering sleeve on top and its
 * cable rising out of it. At rest the plug hangs high, turned off the socket,
 * and the key hole is bright. As the pointer nears the socket the plug
 * lowers, the nearer the lower, and turns as it comes down, so its flat and
 * its pins line up with the socket's. The bright edge passes from the key
 * hole to the key pin, the one that matches it, as soon as the plug starts
 * down; at the bottom the pins go into their holes, the plug seats, and the
 * bright edge is the plug's own, round its body. The slider
 * is the reach, in viewBox units.
 *
 * The pattern: a field. One spring for how far down the plug is, from the
 * pointer's distance to the socket's fixed centre on screen, which never
 * moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rad, rings,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const PL = 46, PT = 4, CR = 29, CH = 9, RR = 24, BR = 22, BH = 15, PIN = 9;
const HIGH = CH + 42, LOW = CH + 4, YAW = 32, KEY = 0;
const PINS = [[-3, 12], [-12, 2], [6, 3], [-8, -9], [3, -9]];
/** A D: a circle of radius r with a flat at a = +flat, on the right, its two corners rounded, in local (a, b). */
function dee(r, flat) {
  const al = Math.asin(flat / r), pts = [];
  for (let k = 0; k <= 30; k++) { const t = -al + (k / 30) * (Math.PI + 2 * al); pts.push([r * Math.cos(t), r * Math.sin(t)]); }
  return fillet(pts, pts.map((_, k) => (k === 0 || k === 30 ? 3 : 0.2)), 3).map(([a, b]) => [-b, a]);
}
/** The falloff of the plug's descent: all the way within 40% of the reach, none past it. */
const falloff = (u) => (u <= 0.4 ? 1 : u >= 1 ? 0 : 1 - (u - 0.4) / 0.6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.6);
  // local (a, b) to world: b runs towards the viewer, turned by yaw degrees
  const W = (yaw) => { const t = rad(45 + yaw), f = [Math.cos(t), Math.sin(t)], s = [f[1], -f[0]]; return (a, b) => [a * s[0] + b * f[0], a * s[1] + b * f[1]]; };
    fit(C, [[-PL, -PL, -PT], [PL, PL, -PT], [PL, -PL, -PT], [-PL, PL, -PT], [24, -24, HIGH + BH + 48], [0, 0, HIGH + BH + 34], [-BR, -BR, HIGH + BH]], 200, 160);
  const P = proj(C), front = facing(C);
  const at = (yaw, z) => { const w = W(yaw); return ([a, b]) => { const [x, y] = w(a, b); return P(x, y, z); }; };
  /** A D-shaped solid from z0 to z1, turned by yaw: its hull and its top inset by b. */
  const deeSolid = (r, flat, yaw, z0, z1, b) => ({
    sil: poly(hull(dee(r, flat).map(at(yaw, z0)).concat(dee(r, flat).map(at(yaw, z1))))),
    crease: poly(dee(r - b, flat - b).map(at(yaw, z1))),
  });

  const g = mk("g", {}, svg);
  // the car's panel, the socket's collar on it, the recess in its top, the pin holes in the recess
  put(solid(g), prism(P, front, ...rings(-PL, -PL, PL, PL, 12, 1.8), -PT, 0));
  put(solid(g), deeSolid(CR, CR - 8, 0, 0, CH, 1.6));
  mk("path", { class: "nf", d: poly(dee(RR, RR - 7).map(at(0, CH))) }, g);
  const holes = PINS.map(([a, b], i) => mk("path", { class: i === KEY ? "nf hi" : "nf lo", d: poly(circ(i === KEY ? 3 : 2.6, 18).map((q) => at(0, CH)([a + q.u, b + q.v]))) }, g));

  // the plug: its pins under it, the body, the sleeve, the cable; drawn again each frame it moves
  const plug = mk("g", {}, g);
  const sA = spring(0, { eps: 0.002 });
  let drawn = NaN, seated = null;
  function draw() {
    const a = sA.x;
    if (a === drawn) return;
    drawn = a;
    plug.replaceChildren();
    const z = lerp(HIGH, LOW, a), yaw = YAW * (1 - clamp(a / 0.85, 0, 1)) ** 2, w = W(yaw), on = a > 0.97;
    // the pins, far to near, each a short round peg; below the collar's top they are inside the hole
    const order = PINS.map((p, i) => i).sort((i, j) => PINS[i][1] - PINS[j][1]);
    for (const i of order) {
      const [x, y] = w(...PINS[i]), r = i === KEY ? 2.6 : 2.2, sh = (q) => ({ ...q, u: q.u + x, v: q.v + y });
      const s = solid(plug);
      put(s, prism(P, front, circ(r, 16).map(sh), circ(r - 0.6, 16).map(sh), Math.max(z - PIN, CH), z));
      if (i === KEY) s.sil.classList.toggle("hi", a > 0.05 && !on);
    }
    const body = solid(plug);
    put(body, deeSolid(BR, BR - 7, yaw, z, z + BH, 1.6));
    body.sil.classList.toggle("hi", on);
    // a ridge round the body's waist, where a hand holds it
    mk("path", { class: "nf lo", d: open(dee(BR, BR - 7).map(at(yaw, z + BH * 0.45)).filter((_, k, q) => k > 1 && k < q.length - 2)) }, plug);
    const sl = (r, h) => circ(r, 28).map((q) => P(q.u, q.v, z + h));
    put(solid(plug), { sil: poly(hull(sl(10, BH).concat(sl(5, BH + 18)))), crease: poly(sl(3.8, BH + 18)) });
    const cable = [[0, 0, BH + 18], [0, 0, BH + 28], [3, -3, BH + 38], [12, -12, BH + 44], [24, -24, BH + 48]].map(([x, y, h]) => P(x, y, z + h));
    mk("path", { class: "nf sil", d: open(cable) }, plug);
    holes[KEY].setAttribute("class", a > 0.05 ? "nf lo" : "nf hi");
    if (on !== seated) { seated = on; read.textContent = on ? "fit" : "rest"; }
  }

  const B = register(stage, (dt) => {
    const m = stepS(sA, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);

  // the hit test: the pointer's distance to the socket's fixed centre on screen, halfway up to the plug's rest
  const mid = P(0, 0, (CH + HIGH) / 2);
  function retarget() {
    let t = 0;
    if (over) t = falloff(Math.hypot(over[0] - mid[0], (over[1] - mid[1]) * 0.6) / reach);
    sA.t = t;
    if (!over) read.textContent = "rest";
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "ev-requirements",
  means: "A charging plug over its socket: as the pointer nears, the plug lowers and turns until its pins line up, and it seats.",
  rules: [1, 3, 4, 8],
  range: [90, 120, 160],
  tour: [[260, 120], [200, 150], [205, 175], null],
  mount,
});
