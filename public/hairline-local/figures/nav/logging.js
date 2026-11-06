/**
 * Black Box: a small recorder, a rounded case with a carrying handle on top
 * and a slot in its front, and out of the slot a strip of trace paper that
 * curls down to the ground and runs on, its end lifting a little. A trace runs
 * along the paper, quiet but for a spike at each event, and over each spike a
 * dot stands on a dashed stem, at heights that differ. At rest the newest
 * event, nearest the slot, is lit: its spike and its stem carry the bright
 * edge. The pointer along the strip picks an event: its dot rises and lights,
 * the others settle, staggered out from it. The slider is how high it rises.
 *
 * The pattern: one of many. Tweens for which event, staggered by distance; the
 * hit test is the ground under the strip, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the case: x from BX0 to BX1, its front at +x; the slot at height SZ on the front
const BX0 = -48, BX1 = -12, BY = 13, BZ = 22, SZ = 10, SW = 9;
// the paper: half width W, from the slot to XE; the events along it
const W = 7, XE = 84, EV = [14, 29, 43, 57, 71], REST_H = [14, 5, 8, 4, 6], STEP = 45;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
/** The paper's height at x: down from the slot, flat, then its end curling up. */
const pz = (x) => (x < 4 ? SZ * (1 - smooth((x - BX1) / (4 - BX1))) : x > 74 ? 2.6 * ((x - 74) / (XE - 74)) ** 2 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[BX0, -BY, 0], [BX1, BY, 0], [BX0, BY, 0], [BX1, -BY, 0], [-30, 0, BZ + 7], [XE, W, 0], [XE, -W, 0], [EV[2], 0, 22]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the case, its handle over the top, the slot in its front
  const [body, bodyIn] = rings(BX0, -BY, BX1, BY, 5, 1.6);
  put(solid(g), prism(P, front, body, bodyIn, 0, BZ));
  // the lid's seam round the faces we see
  mk("path", { class: "nf lo", d: open(ringAt(P, run(body, front), BZ - 6)) }, g);
  const handle = fillet([[-37, BZ], [-37, BZ + 6], [-23, BZ + 6], [-23, BZ]], [0, 2.5, 2.5, 0]).map(([x, z]) => P(x, 0, z));
  mk("path", { class: "nf sil", d: open(handle) }, g);
  mk("path", { class: "nf", d: poly(rrect(-SW, SZ - 1.6, SW, SZ + 1.6, 1.4, 3).map((q) => P(BX1 + 0.05, q.u, q.v))) }, g);

  // the paper: its near edge's thickness, its face, the trace along it
  const XS = Array.from({ length: 49 }, (_, k) => BX1 + ((XE - BX1) * k) / 48);
  mk("path", { class: "nf lo", d: open(XS.filter((x) => x > 0).map((x) => P(x, W, pz(x) - 0.9))) }, g);
  mk("path", { class: "sil", d: poly(XS.map((x) => P(x, W, pz(x))).concat(XS.slice().reverse().map((x) => P(x, -W, pz(x))))) }, g);
  const ty = (x) => 0.9 * Math.sin(x * 0.8) + EV.reduce((s, e) => s - 4.6 * Math.exp(-(((x - e) / 1.1) ** 2)), 0);
  const trace = (a, b) => { const out = []; for (let x = a; x <= b; x += 0.4) out.push(P(x, ty(x), pz(x) + 0.02)); return out; };
  mk("path", { class: "nf lo", d: open(trace(2, 76)) }, g);

  // each event: its spike lit when chosen, a dashed stem, a dot on top
  const evs = EV.map((e, i) => ({
    e, spike: mk("path", { class: "nf hi", d: "" }, g), stem: mk("path", { class: "nf dash" }, g),
    dot: flatDot(g, C, 1.8, "dot m"), h: tween(REST_H[i]), drawn: NaN,
  }));

  function draw(ev, h) {
    if (h === ev.drawn) return;
    ev.drawn = h;
    ev.stem.setAttribute("d", open([P(ev.e, -4.6, 0.1), P(ev.e, -4.6, h)]));
    place(ev.dot, P(ev.e, -4.6, h));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const ev of evs) { draw(ev, tval(ev.h, now)); if (!tdone(ev.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function pick(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), on = a < 0 ? 0 : a;
    evs.forEach((ev, i) => {
      const lit = i === on;
      tset(ev.h, a < 0 ? REST_H[i] : lit ? lift : 3 + Math.abs(i - a) * 1.5, now, a < 0 ? 0 : Math.abs(i - a) * STEP);
      ev.spike.setAttribute("d", lit ? open(trace(ev.e - 2.6, ev.e + 2.6)) : "");
      ev.stem.setAttribute("class", lit ? "nf hi" : "nf dash");
      ev.dot.setAttribute("class", lit ? "dot" : "dot m");
    });
    read.textContent = a < 0 ? "rest" : `event ${a + 1}`;
    B.wake();
  }
  pick(-1);

  /** On the ground under the paper: the event nearest the pointer along it. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < EV[0] - 10 || x > XE + 6 || Math.abs(y) > 34) return -1;
    let best = 0;
    EV.forEach((e, i) => { if (Math.abs(x - e) < Math.abs(x - EV[best])) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => pick(hit(p)), leave: () => pick(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { lift = clamp(v, 10, 24); if (act >= 0) pick(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "logging",
  means: "A recorder printing a strip of trace paper with a spike for each event: the pointer along the strip lifts and lights one event.",
  rules: [1, 2, 4, 5],
  range: [12, 17, 22],
  tour: [[283, 233], [226, 193], [249, 208], null],
  mount,
});
