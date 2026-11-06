/**
 * Controls: a slim raised control panel, the kind set into a car's screen
 * bezel, with four round push buttons in a row, each a short round cap
 * standing in a dim bezel ring cut into the panel, a dot in its middle. The
 * button under the pointer sinks into the panel and takes the bright rim and
 * the bright dot; its neighbours dip a little in sympathy, less the farther
 * they are, staggered out from it. At rest the third button is the one held
 * down. The slider is how far a pressed button sinks.
 *
 * The pattern: one of many. Tweens for which button, a stagger by distance,
 * and a hit test on the buttons' rest tops: the button whose rest centre is
 * nearest the pointer's screen x, inside the panel's rest outline.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// the panel, x along the row, PZ its top; four buttons of radius R standing H above it, at BX
const PX = 62, PY = 19, PZ = 5, R = 10, H = 9, BEZ = 2.6, BX = [-40, -13.3, 13.3, 40], N = BX.length;
// how much of the press each neighbour takes, by distance; the stagger step in ms; the key held at rest
const FALL = [1, 0.34, 0.14, 0.06], STEP = 45, REST = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-PX, -PY, 0], [PX, PY, 0], [PX, -PY, 0], [-PX, PY, 0], [-PX, -PY, PZ + H], [PX, -PY, PZ]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the panel: one slim plate, rounded, with a fine inset where its face meets the rim
  put(solid(g), prism(P, front, ...rings(-PX, -PY, PX, PY, 11, 2), 0, PZ));
  const sh = (ring, x) => ring.map((q) => ({ ...q, u: q.u + x }));
  // the bezel rings, cut into the panel's face round each button
  BX.forEach((x) => mk("path", { class: "nf lo", d: poly(sh(circ(R + BEZ, 40), x).map((q) => P(q.u, q.v, PZ))) }, g));

  // the buttons, far to near along x
  const keys = BX.map((x) => {
    const grp = mk("g", {}, g), el = solid(grp), dot = flatDot(grp, C, 1.6, "dot off");
    return { x, grp, el, dot, z: tween(0), drawn: NaN, ring: sh(circ(R, 40), x), inner: sh(circ(R - 1.6, 40), x) };
  });
  function draw(k, d) {
    if (d === k.drawn) return;
    k.drawn = d;
    const top = PZ + H - d;
    put(k.el, prism(P, front, k.ring, k.inner, PZ - 0.5, top));
    place(k.dot, P(k.x, 0, top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.z, now)); if (!tdone(k.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Presses key a (-1 is rest, the third held): the press spreads out from it, the farther the later and the less. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), on = a < 0 ? REST : a, from = act === null || act < 0 ? REST : act;
    act = a;
    keys.forEach((k, i) => {
      const dist = Math.abs(i - on);
      tset(k.z, clamp(depth * FALL[dist], 0, H - 1), now, force ? 0 : Math.abs(i - (a < 0 ? from : on)) * STEP);
      k.el.sil.classList.toggle("hi", i === on);
      k.dot.setAttribute("class", i === on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : `key ${a + 1}`;
    B.wake();
  }
  setActive(-1, true);

  // the rest tops' centres on screen, which never move
  const cx = BX.map((x) => P(x, 0, PZ + H)[0]);
  /** Inside the panel at its top's height, the key whose rest centre is nearest the pointer's x. */
  function hit(p) {
    const [x, y] = unproj(C, p[0], p[1], PZ + H);
    if (Math.abs(x) > PX + 4 || Math.abs(y) > PY + 6) return -1;
    let best = 0;
    cx.forEach((c, i) => { if (Math.abs(c - p[0]) < Math.abs(cx[best] - p[0])) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { depth = clamp(v, 3, 8); if (act !== null) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "controls",
  means: "Four push buttons on a slim panel: the one under the pointer sinks in and lights, its neighbours dipping after it.",
  rules: [1, 2, 4, 5],
  range: [5, 6.5, 8],
  tour: [[126, 113], [274, 187], [176, 138], null],
  mount,
});
