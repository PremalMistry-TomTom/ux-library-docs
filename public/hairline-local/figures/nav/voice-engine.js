/**
 * Voice engine: the speaker in a car's door card, the voice that reads the
 * turns out. An upright door panel faces the viewer, an armrest ledge across
 * its top; low on it a round speaker, a raised rim set into the panel and,
 * inside it, a round grille of dots. The pointer over the grille is where
 * the cone moves: the dots near it push out towards the viewer on springs,
 * in a ripple, a crest under the pointer, a trough round it, a faint second
 * crest beyond. The dots that push out furthest light. At rest the cone
 * sits a little out at its middle, the dust cap's dots lit. The read-out
 * says how near the middle, as a level. The slider is the ripple's reach.
 *
 * The pattern: a field. A spring per dot, a falloff by distance with a
 * floor. The hit test is the grille's rest plane on screen, which never
 * moves: a front-facing plane, inverted exactly.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, poly, prism, proj, rrect,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PT = 6, SQ = Math.SQRT1_2;
// the door card's outline across (t) and up (s): a sloped window line on top, the lower front corner cut
const CARD = [[-76, 0], [62, 0], [76, 20], [76, 116], [-66, 124], [-76, 108]];
const SC = [-14, 38], R = 28, RIM = 6, RD = 4, GAP = 6, PUSH = 14;
const ARM = [-58, 44, 82, 90, 10], HANDLE = [30, 98, 54, 105];

/** The ripple's shape at u reaches: a crest, a trough, a faint crest, and nothing beyond twice the reach. */
const ripple = (u) => (u >= 2 ? 0 : Math.cos(u * Math.PI * 0.95) * Math.exp(-u * u * 0.9));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  // a point on the panel: across it t, up it s, out of it d (towards the viewer)
  const W = (t, s, d) => [(t + d) * SQ, (d - t) * SQ, s];
  fit(C, CARD.map(([t, s]) => W(t, s, -PT)).concat(CARD.map(([t, s]) => W(t, s, 0)), [W(ARM[0], ARM[2], ARM[4]), W(ARM[1], ARM[3], ARM[4])]), 200, 166);
  const P = proj(C), front = facing(C), pw = (t, s, d) => P(...W(t, s, d));
  const g = mk("g", {}, svg);

  // the panel: a plate standing on its edge, its face as the crease
  const card = fillet(CARD, [6, 8, 8, 8, 8, 8], 5);
  const face = card.map(([t, s]) => pw(t, s, 0));
  put(solid(g), { sil: poly(hull(face.concat(card.map(([t, s]) => pw(t, s, -PT))))), crease: poly(fillet(CARD.map(([t, s]) => [t * 0.96, 2.5 + s * 0.96]), [4, 6, 6, 6, 6, 6], 5).map(([t, s]) => pw(t, s, 0))) });
  // the door's pull: a recessed slot above the armrest's front end
  mk("path", { class: "nf lo", d: poly(rrect(HANDLE[0], HANDLE[1], HANDLE[2], HANDLE[3], 3.4, 4).map((q) => pw(q.u, q.v, 0))) }, g);

  // the rim: a raised ring round the grille, its front face's outer edge the crease, its opening drawn as an edge
  const ro = circ(R + RIM, 64), at = (r, d) => r.map((q) => pw(SC[0] + q.u, SC[1] + q.v, d));
  put(solid(g), { sil: poly(hull(at(ro, 0).concat(at(ro, RD)))), crease: poly(at(circ(R + RIM - 1.6, 64), RD)) });
  mk("path", { class: "nf sil", d: poly(at(circ(R, 64), RD)) }, g);
  mk("path", { class: "nf lo", d: poly(at(circ(R - 2, 64), 1)) }, g);
  // four screws hold the rim into the panel
  for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + (k * Math.PI) / 2; place(flatDot(g, C, 1.1, "dot off"), pw(SC[0] + (R + RIM / 2) * Math.cos(a), SC[1] + (R + RIM / 2) * Math.sin(a), RD)); }

  // the grille: dots on a square pitch inside the opening, each on its own spring
  const dots = [];
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) {
    const t = i * GAP, s = j * GAP;
    if (Math.hypot(t, s) > R - 3.5) continue;
    dots.push({ t, s, el: flatDot(g, C, 1.6, "dot m"), sp: spring(0, { eps: 0.01 }), drawn: NaN, cls: "" });
  }

  // the armrest: a ledge standing out of the panel above the speaker, nearer than the grille, painted last
  const sk = (r) => r.map((q) => { const [x, y] = W(q.u, 0, q.v); return { ...q, u: x, v: y, nu: (q.nu + q.nv) * SQ, nv: (q.nv - q.nu) * SQ }; });
  put(solid(g), prism(P, front, sk(rrect(ARM[0], 0, ARM[1], ARM[4], 4, 5)), sk(rrect(ARM[0] + 1.4, 1.4, ARM[1] - 1.4, ARM[4] - 1.4, 2.8, 5)), ARM[2], ARM[3]));

  let over = null;
  /** Retarget every dot from where the cone is pushed: the pointer, or the rest pose at the middle. */
  function retarget() {
    const [cx, cy, amp, r] = over ? [over[0], over[1], 1, reach] : [0, 0, 0.8, 16];
    for (const d of dots) d.sp.t = PUSH * amp * ripple(Math.hypot(d.t - cx, d.s - cy) / r);
    B.wake();
  }

  function draw(d) {
    const x = d.sp.x;
    if (x === d.drawn) return;
    d.drawn = x;
    place(d.el, pw(SC[0] + d.t, SC[1] + d.s, RD - 2 + x));
    const cls = x > PUSH * 0.4 ? "dot" : x < -PUSH * 0.2 ? "dot off" : "dot m";
    if (cls !== d.cls) { d.cls = cls; d.el.setAttribute("class", cls); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const d of dots) { if (stepS(d.sp, dt)) m = true; draw(d); }
    return m;
  });
  bag.add(B.unregister);

  // the grille's rest plane faces the viewer: screen x and y map back to (t, s) through a fixed 2 × 2
  const o = pw(SC[0], SC[1], RD), et = pw(SC[0] + 1, SC[1], RD), es = pw(SC[0], SC[1] + 1, RD);
  const a = et[0] - o[0], b = es[0] - o[0], c = et[1] - o[1], e = es[1] - o[1], det = a * e - b * c;
  function move(p) {
    const dx = p[0] - o[0], dy = p[1] - o[1], t = (e * dx - b * dy) / det, s = (a * dy - c * dx) / det, r = Math.hypot(t, s);
    if (r > R + RIM + 8) { leave(); return; }
    const k = Math.min(1, R / Math.max(r, 1e-6));
    over = [t * k, s * k];
    read.textContent = `level ${clamp(5 - Math.floor((r / R) * 5), 1, 5)}`;
    retarget();
  }
  function leave() { over = null; read.textContent = "rest"; retarget(); }
  read.textContent = "rest";
  retarget();

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 12, 26); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "voice-engine",
  means: "A door speaker's grille: the dots near the pointer push out in a ripple, like the cone moving as the voice speaks.",
  rules: [1, 3, 5, 9],
  range: [12, 18, 26],
  tour: [[200, 200], [160, 180], [235, 225], null],
  mount,
});
