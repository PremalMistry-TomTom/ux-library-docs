/**
 * Voice Puck: the in-car AI voice assistant. A round smart-speaker puck
 * stands on a dashboard ledge, a band of grille dots round its side and a
 * light ring set in its top. Above it float four sound rings, each wider and
 * higher than the last, as if the voice were rising out of it. At rest the
 * rings sit close and the light ring carries the bright edge. The pointer
 * near the puck makes it speak: the rings swell outward and spread apart on
 * springs, the outer ones the most, the nearer the pointer the more; the
 * newest ring, the lowest, takes the bright edge from the light ring. The
 * slider is the reach, in world units.
 *
 * The pattern: a field of one value. A spring per ring, a falloff by distance
 * with a floor, and a hit test on the ledge's top plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, open, poly, prism, proj, ringAt, rings, rrect, run, unproj, facing,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PR = 26, PH = 17, LT = 7, N = 4;
const LEDGE = [-92, -46, 92, 46];
// ring i: its radius and height at rest (k 0) and speaking (k 1)
const RR = (i, k) => PR * 0.7 + i * (6 + 5 * k) + k * 4;
const RZ = (i, k) => PH + 11 + i * (8 + 4 * k) + k * 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  const ext = [[LEDGE[0], LEDGE[1], -LT], [LEDGE[2], LEDGE[3], -LT], [LEDGE[2], LEDGE[1], 0], [LEDGE[0], LEDGE[3], 0]];
  const top = RR(N - 1, 1), tz = RZ(N - 1, 1);
  fit(C, ext.concat([[-top, top, tz], [top, -top, tz], [0, 0, tz + 4]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the dashboard ledge: a thick plate, its near edge swept round
  const ledge = rrect(LEDGE[0], LEDGE[1], LEDGE[2], LEDGE[3], 30, 8);
  const ledgeIn = rrect(LEDGE[0] + 2, LEDGE[1] + 2, LEDGE[2] - 2, LEDGE[3] - 2, 28, 8);
  put(solid(g), prism(P, front, ledge, ledgeIn, -LT, 0));
  // a demister slot along the ledge's far side, where the windscreen meets it
  mk("path", { class: "nf lo", d: poly(rrect(-70, -38, 40, -32, 3, 4).map((q) => P(q.u, q.v, 0))) }, g);
  mk("path", { class: "nf lo", d: poly(rrect(52, -38, 78, -32, 3, 4).map((q) => P(q.u, q.v, 0))) }, g);

  // the puck: a short round solid, its top's edge the crease
  const pr = circ(PR, 48), pi = circ(PR - 2, 48);
  put(solid(g), prism(P, front, pr, pi, 0, PH));
  // the grille band: rows of dots round the near half of its side
  for (let row = 0; row < 2; row++) for (let k = 0; k < 14; k++) {
    const a = Math.PI / 4 + ((k + row * 0.5 - 6.75) / 6.75) * Math.PI * 0.4;
    place(flatDot(g, C, 1.2, "dot off"), P(PR * Math.cos(a), PR * Math.sin(a), 5 + row * 5));
  }
  // the light ring set in the top, and a button dot at its middle
  const light = mk("path", { class: "nf hi", d: poly(ringAt(P, circ(PR - 8, 48), PH)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(PR - 11, 48), PH)) }, g);
  place(flatDot(g, C, 1.8, "dot m"), P(0, 0, PH));

  // the sound rings, lowest first: each on its own spring between rest and speaking
  const rs = [];
  for (let i = 0; i < N; i++) rs.push({ el: mk("path", { class: "nf lo" }, g), sp: spring(0), drawn: NaN });

  function draw(r, i) {
    const k = r.sp.x;
    if (k === r.drawn) return;
    r.drawn = k;
    r.el.setAttribute("d", poly(ringAt(P, circ(RR(i, k), 64), RZ(i, k))));
  }

  let lit = null;
  const B = register(stage, (dt) => {
    let m = false;
    rs.forEach((r, i) => { if (stepS(r.sp, dt)) m = true; draw(r, i); });
    return m;
  });
  bag.add(B.unregister);

  /** How hard it speaks: 1 on the puck, falling to a floor of .31 at the reach, nothing past it. */
  function amount(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
    if (d > reach) return 0;
    return d < PR ? 1 : clamp(1 - (0.69 * (d - PR)) / (reach - PR), 0.31, 1);
  }
  function setAmount(a) {
    rs.forEach((r, i) => { r.sp.t = a * (0.55 + (0.45 * i) / (N - 1)); });
    const on = a > 0;
    if (on !== lit) {
      lit = on;
      light.setAttribute("class", on ? "nf lo" : "nf hi");
      rs[0].el.setAttribute("class", on ? "nf hi" : "nf sil");
      for (let i = 1; i < N; i++) rs[i].el.setAttribute("class", on ? "nf sil" : "nf lo");
    }
    read.textContent = on ? "speaking" : "rest";
    B.wake();
  }
  setAmount(0);

  bag.add(pointer(stage, { move: (p) => setAmount(amount(p)), leave: () => setAmount(0) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { reach = clamp(v, 50, 110); }, destroy: bag.dispose };
}

hairline({
  name: "ai-voice",
  means: "A voice-assistant puck on a dashboard ledge: near the pointer its sound rings swell and rise, the newest bright.",
  rules: [1, 3, 4, 5],
  range: [50, 80, 110],
  tour: [[200, 150], [150, 190], [255, 205], null],
  mount,
});
