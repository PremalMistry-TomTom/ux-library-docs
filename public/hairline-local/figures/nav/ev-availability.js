/**
 * EV availability: a charging post, a tall rounded column on a plinth, a
 * small screen near its top, and on its face three sockets one above the
 * other, each a round collar with its pin holes, a status dot beside it. The
 * middle socket is taken: a plug sits in it, its cable bending out to the
 * side, down the post and across the ground beside it in a slack loop, and its status
 * dot is dim. At rest the top socket's collar is bright, the first free one.
 * The pointer picks a socket by its height: a free one pushes its collar out
 * from the face, its neighbours a little after it, and takes the bright edge;
 * over the busy one nothing lights, the plug sits where it is and the read-out
 * says so. The slider is how far a free collar pushes out.
 *
 * The pattern: one of many, tweens staggered from the pointer. The hit test
 * is each socket's rest centre on screen, nearest the pointer's y, inside the
 * post's rest outline, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rrect,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

// the post stands in a frame facing the viewer, turned a little: t across, h up, d towards the viewer
const TH = (66 * Math.PI) / 180, CT = Math.cos(TH), ST = Math.sin(TH);
const PW = 21, PD = 13, PHT = 114, BASE = [-27, -21, 27, 21], BH = 5;
const SOCK = [80, 57, 34], BUSY = 1, LIT = 0, SR = 8.5, SX = -3;
const turn = (r) => r.map((q) => ({ ...q, u: q.u * ST + q.v * CT, v: q.v * ST - q.u * CT, nu: q.nu * ST + q.nv * CT, nv: q.nv * ST - q.nu * CT }));
const wp = (t, h, d) => [t * ST + d * CT, d * ST - t * CT, h];
const ring = (b, r) => turn(rrect(b[0], b[1], b[2], b[3], r, 6));

/** A smooth line through world points (t, h, d): Catmull-Rom, eight steps a span. */
function spline(p) {
  const out = [], at = (i) => p[clamp(i, 0, p.length - 1)];
  for (let i = 0; i < p.length - 1; i++) for (let s = 0; s < 8; s++) {
    const u = s / 8, a = at(i - 1), b = at(i), c = at(i + 1), d = at(i + 2);
    out.push([0, 1, 2].map((j) => 0.5 * (2 * b[j] + (c[j] - a[j]) * u + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * u * u + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * u * u * u)));
  }
  out.push(p[p.length - 1]);
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pop = value;
  const C = Cam(45, 0.5, 1.8);
  // the cable: out of the plug, round to the side, down the post's corner, out across the ground into a loop
  const ch = SOCK[BUSY];
  const cable = spline([[SX, ch, PD + 17], [SX + 12, ch - 3, PD + 18], [PW + 7, ch - 14, PD + 14], [PW + 10, 12, PD + 16], [PW + 15, 0.6, PD + 24], [50, 0.6, 34], [66, 0.6, 22], [64, 0.6, 4], [48, 0.6, 2], [42, 0.6, 16]]);
  fit(C, [wp(BASE[0], 0, BASE[3]), wp(BASE[2], 0, BASE[1]), wp(-PW, PHT, PD), wp(PW, PHT, -PD), wp(BASE[0], 0, BASE[1]), ...cable.map((p) => wp(...p))], 200, 166);
  const P = proj(C), front = facing(C), pw = (t, h, d) => P(...wp(t, h, d));
  const disc = (t, h, r, d, n = 32) => circ(r, n).map((q) => pw(t + q.u, h + q.v, d));

  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ring(BASE, 7), ring([BASE[0] + 1.8, BASE[1] + 1.8, BASE[2] - 1.8, BASE[3] - 1.8], 5.4), 0, BH));
  put(solid(g), prism(P, front, ring([-PW, -PD, PW, PD], 9), ring([-PW + 1.6, -PD + 1.6, PW - 1.6, PD - 1.6], 7.6), BH, PHT));
  // the screen near the top, and a seam round the head
  const flat = (b, r, d) => rrect(b[0], b[1], b[2], b[3], r, 5).map((q) => pw(q.u, q.v, d));
  mk("path", { class: "nf", d: poly(flat([-13, 92, 13, 106], 3, PD)) }, g);

  // the sockets: a recess in the face, a collar that can push out of it, pin holes, a status dot beside it
  const socks = SOCK.map((h, i) => {
    const grp = mk("g", {}, g), s = solid(grp);
    const pins = mk("path", { class: "dot off" }, grp);
    mk("path", { class: i === BUSY ? "dot off" : "dot m", d: poly(disc(PW - 6, h, 1.7, PD, 14)) }, g);
    return { h, i, grp, s, pins, z: tween(i === LIT ? 3 : 1.2), drawn: NaN };
  });
  function drawSock(k, z) {
    if (z === k.drawn) return;
    k.drawn = z;
    const f = disc(SX, k.h, SR, PD + z, 40);
    put(k.s, { sil: poly(hull(disc(SX, k.h, SR, PD, 40).concat(f))), crease: poly(disc(SX, k.h, SR - 2.2, PD + z, 36)) });
    const holes = [[0, 3.2], [-3, -1.6], [3, -1.6]].map(([a, b]) => poly(disc(SX + a, k.h + b, 1.2, PD + z, 12))).join("");
    k.pins.setAttribute("d", holes);
  }

  // the plug in the busy socket: a round body out of the collar, a tapering sleeve, the cable out of it
  const pg = mk("g", {}, g), body = solid(pg), sleeve = solid(pg);
  put(body, { sil: poly(hull(disc(SX, ch, SR - 1, PD + 1.2, 36).concat(disc(SX, ch, SR - 1, PD + 10, 36)))), crease: poly(disc(SX, ch, SR - 2.4, PD + 10, 36)) });
  put(sleeve, { sil: poly(hull(disc(SX, ch, 5, PD + 10, 24).concat(disc(SX, ch, 3, PD + 17, 20)))), crease: poly(disc(SX, ch, 2.2, PD + 17, 18)) });
  mk("path", { class: "nf sil", d: open(cable.map((p) => pw(...p))) }, g);

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of socks) { drawSock(k, tval(k.z, now)); if (!tdone(k.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), on = a < 0 ? LIT : a === BUSY ? -1 : a;
    socks.forEach((k) => {
      // a free collar pushes out, its free neighbours a little after it; the busy one holds its plug still
      const to = k.i === BUSY ? 1.2 : a < 0 ? (k.i === LIT ? 3 : 1.2) : a === BUSY ? 1.2 : k.i === a ? pop : 1.2 + pop * 0.25;
      tset(k.z, to, now, a < 0 ? 0 : Math.abs(k.i - a) * 50);
      k.s.sil.classList.toggle("hi", k.i === on);
    });
    read.textContent = a < 0 ? "rest" : a === BUSY ? `socket ${a + 1} busy` : `socket ${a + 1}`;
    B.wake();
  }
  setActive(-1, true);

  // the hit test: inside the post's rest outline, the socket whose rest centre is nearest the pointer's y
  const xs = [-PW, PW].flatMap((t) => [-PD, PD].map((d) => pw(t, 0, d)[0]));
  const x0 = Math.min(...xs) - 6, x1 = Math.max(...xs) + 6;
  const ys = SOCK.map((h) => pw(SX, h, PD)[1]), top = pw(0, PHT, PD)[1];
  const hit = ([px, py]) => {
    if (px < x0 || px > x1 || py < top || py > ys[2] + 26) return -1;
    let best = 0;
    ys.forEach((y, i) => { if (Math.abs(py - y) < Math.abs(py - ys[best])) best = i; });
    return best;
  };

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { pop = clamp(v, 6, 12); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "ev-availability",
  means: "A charging post with three sockets, one taken by a plug: a free socket under the pointer pushes out and lights; the busy one stays dim.",
  rules: [1, 2, 4, 5],
  range: [6, 9, 12],
  tour: [[161, 120], [161, 158], [161, 194], null],
  mount,
});
