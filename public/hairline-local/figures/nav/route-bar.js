/**
 * Route bar: the strip a navigation screen keeps along its edge, built as a
 * thing on the table. A long slim rail lies across the view, the trip from
 * start to end; a round puck rides on it, the car; and three small things
 * stand along the rail's far side, what the trip holds: a jam, three short
 * cars nose to tail; a stop, a pin with a hole in its head; a charger, a
 * slim upright post with a screen and its cable hanging in a loop. The
 * pointer's place along the rail is where the car is: the puck slides there
 * on a spring. What the car has passed settles low and dim; the next thing
 * ahead stands tall with the bright edge. At rest the puck sits a third of
 * the way, the jam behind it, the stop next. The slider is how low what is
 * passed settles.
 *
 * The pattern: scrub. A spring for where the puck is, a tween each for the
 * things it passes, staggered from the next one. The hit test is the ground
 * plane, which never moves, and the choice of "next" reads the spring's
 * target, never its position.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, rrect, unproj,
  spring, stepS, tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X0 = -82, X1 = 82, RW = 4.5, RH = 3, PR = 11, PH = 7, BY = -24;
const PX0 = X0 + 12, PX1 = X1 - 14, REST = PX0 + (PX1 - PX0) / 3;
// the things along the trip: where they stand on the rail, and what they are
const ITEMS = [{ kind: "jam", x: -44 }, { kind: "stop", x: 8 }, { kind: "charger", x: 50 }];
const PIN_R = 11.5, PIN_H = 38, PIN_T = 4.5;

function pinShape() {
  const cy = PIN_H - PIN_R, a0 = Math.acos(PIN_R / cy), pts = [];
  for (let k = 0; k <= 24; k++) { const a = a0 + (k / 24) * (2 * Math.PI - 2 * a0); pts.push([PIN_R * Math.sin(a), cy - PIN_R * Math.cos(a)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, k) => (k === pts.length - 1 ? 2 : 0.4)), 3);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let settle = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[X0, -RW, 0], [X1, RW, 0], [X0, BY - 8, PIN_H], [X1, BY - 8, PIN_H], [X1, PR, 0], [X0, PR, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sh = (r, x, y) => r.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  // the things, behind the rail: each drawn whole through Q, which shrinks it about its foot by h
  const pin = pinShape();
  const things = ITEMS.map((it, i) => {
    const grp = mk("g", {}, g), parts = [];
    let draw;
    if (it.kind === "jam") {
      // three short cars nose to tail, each a body and a cabin on it
      const cars = [-13, 0, 13].map((dx) => ({ dx, body: solid(grp), cab: solid(grp) }));
      cars.forEach((c) => parts.push([c.body.sil, ""], [c.cab.sil, ""]));
      draw = (Q) => cars.forEach(({ dx, body, cab }) => {
        const x = it.x + dx;
        put(body, prism(Q, front, ...rings(x - 5.8, BY - 6.5, x + 5.8, BY + 6.5, 3, 1), 0, 6.5));
        put(cab, prism(Q, front, ...rings(x - 3.8, BY - 4.8, x + 2, BY + 4.8, 1.8, 0.8), 6.5, 12));
      });
    } else if (it.kind === "stop") {
      // a pin standing on its point, its plate facing the viewer, a hole in its head; its edge stroked again over the face
      const edge = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp), hole = mk("path", { class: "nf lo" }, grp);
      const rim = mk("path", { class: "nf sil" }, grp);
      parts.push([edge, ""], [rim, "nf "]);
      draw = (Q) => {
        const pw = (t, s, d) => Q(it.x + (t + d) / Math.SQRT2, BY + (d - t) / Math.SQRT2, s);
        const d = poly(hull(pin.map((p) => pw(p[0], p[1], -PIN_T)).concat(pin.map((p) => pw(p[0], p[1], 0)))));
        edge.setAttribute("d", d); rim.setAttribute("d", d);
        face.setAttribute("d", poly(pin.map((p) => pw(p[0], p[1], 0))));
        hole.setAttribute("d", poly(circ(4.2, 20).map((q) => pw(q.u, PIN_H - PIN_R + q.v, 0))));
      };
    } else {
      // a slim post, a screen on its face, the cable hanging from it in a loop below the screen
      const post = solid(grp), screen = mk("path", { class: "nf lo" }, grp), cable = mk("path", { class: "nf" }, grp);
      parts.push([post.sil, ""]);
      draw = (Q) => {
        put(post, prism(Q, front, ...rings(it.x - 5, BY - 6.5, it.x + 5, BY + 6.5, 2.4, 1.1), 0, 36));
        screen.setAttribute("d", poly(rrect(BY - 4, 22, BY + 4, 31, 1.2, 3).map((q) => Q(it.x + 5, q.u, q.v))));
        cable.setAttribute("d", open(Array.from({ length: 19 }, (_, k) => {
          const a = Math.PI * (k / 18);
          return Q(it.x + 5.4 + 4 * Math.sin(a), BY - 4.5 * Math.cos(a), 20 - 15 * Math.sin(a));
        })));
      };
    }
    const Qh = (h) => (x, y, z) => P(it.x + (x - it.x) * h, BY + (y - BY) * h, z * h);
    return { ...it, i, grp, parts, draw: (h) => draw(Qh(h)), tw: tween(1), drawn: NaN };
  });


  // the rail, then the puck riding on it, a dot on its top: the car
  put(solid(g), prism(P, front, ...rings(X0, -RW, X1, RW, RW, 1.2), 0, RH));
  const puckG = mk("g", {}, g), puck = solid(puckG), dot = flatDot(puckG, C, 2.6, "dot m");
  const pr = circ(PR, 48), pi = circ(PR - 1.8, 48);
  const sp = spring(REST);
  let puckDrawn = NaN;
  function drawPuck(x) {
    if (x === puckDrawn) return;
    puckDrawn = x;
    put(puck, prism(P, front, sh(pr, x, 0), sh(pi, x, 0), RH, RH + PH));
    place(dot, P(x, 0, RH + PH));
  }

  /** The next thing ahead of a puck at x, or -1 past them all. */
  const nextOf = (x) => things.findIndex((t) => t.x > x);
  let next = -2;
  function choose(over) {
    const n = nextOf(sp.t), now = performance.now();
    if (n !== next) {
      next = n;
      things.forEach((t) => {
        const behind = t.x <= sp.t;
        tset(t.tw, behind ? settle : 1, now, Math.abs(t.i - (n < 0 ? things.length : n)) * 40);
        t.parts.forEach(([p, base]) => p.setAttribute("class", base + (behind ? "lo" : t.i === n ? "sil hi" : "sil")));
      });
    }
    read.textContent = over ? (n < 0 ? "end" : `stop ${n + 1}`) : "rest";
    B.wake();
  }

  const B = register(stage, (dt, now) => {
    let moving = stepS(sp, dt);
    drawPuck(sp.x);
    for (const t of things) {
      const h = tval(t.tw, now);
      if (h !== t.drawn) { t.drawn = h; t.draw(h); }
      if (!tdone(t.tw, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);
  choose(false);

  /** On the ground plane: near the rail, the pointer's place along it is where the car goes. */
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const on = x > X0 - 14 && x < X1 + 14 && y > BY - 30 && y < 26;
    sp.t = on ? clamp(x, PX0, PX1) : REST;
    choose(on);
  }

  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; choose(false); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { settle = clamp(v, 0.4, 0.8); next = -2; choose(read.textContent !== "rest"); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "route-bar",
  means: "A trip as a rail: the puck rides to the pointer, what it has passed settles low, and the next stop ahead stands bright.",
  rules: [1, 2, 4, 8],
  range: [0.8, 0.6, 0.4],
  tour: [[88, 158], [223, 225], [288, 258], null],
  mount,
});
