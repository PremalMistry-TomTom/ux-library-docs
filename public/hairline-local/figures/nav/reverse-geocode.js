/**
 * Reverse geocode: a row of three gabled houses, each a block with a pitched
 * roof, a door in its front wall, a window beside it and a small plate by the
 * door, and a map pin, a thick teardrop with a hole through its head, hanging
 * over them on a dashed drop. At rest the pin hovers high over the gap between
 * the first two houses, a point not yet given an address, and carries the
 * bright edge. The house under the pointer gets the pin: it glides over that
 * roof and settles low, its drop falling behind the house, and that house's
 * door and the plate by it take the bright edge. The slider is how high the pin hangs.
 *
 * The pattern: one of many. Tweens for where the pin goes, and a hit test on
 * the houses' rest middles on screen, which never move.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, proj, ringAt, rrect, run, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, register, solid,
} = HL;

const HOUSES = [
  { x: -52, w: 30, wh: 20, rh: 33 },
  { x: 0, w: 36, wh: 25, rh: 40 },
  { x: 50, w: 28, wh: 18, rh: 30 },
];
const D = 28, RP = 11, HC = 25, PT = 6, LMAX = 22, REST_X = -26, REST_UP = 30;

/** The pin's outline in its own upright plane, a across and h up from the tip. */
const PIN = (() => {
  const g = Math.acos(RP / HC), pts = [];
  for (let k = 0; k <= 24; k++) { const t = g + ((2 * Math.PI - 2 * g) * k) / 24; pts.push([RP * Math.sin(t), HC - RP * Math.cos(t)]); }
  pts.push([0, 0]);
  return fillet(pts, pts.map((_, i) => (i === pts.length - 1 ? 3 : 0.01)));
})();

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hang = value;
  const C = Cam(45, 0.5, 1.75);
  const top = Math.max(...HOUSES.map((h) => h.rh)) + REST_UP + HC + RP;
  fit(C, [[-70, -D / 2, 0], [66, D / 2, 0], [-70, D / 2, 0], [66, -D / 2, 0], [REST_X, 0, top], [0, 0, 40 + LMAX + HC + RP]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the drop goes first, so a house covers the part of it that falls behind the house
  const drop = mk("path", { class: "dash" }, g);
  const yf = D / 2, onFront = (u0, v0, u1, v1, r) => poly(rrect(u0, v0, u1, v1, r, 4).map((q) => P(q.u, yf, q.v)));
  const houses = HOUSES.map((h) => {
    const grp = mk("g", {}, g), s = solid(grp), x0 = h.x - h.w / 2, x1 = h.x + h.w / 2;
    const foot = rrect(x0, -D / 2, x1, D / 2, 2.5, 4), ridge = rrect(x0, -0.6, x1, 0.6, 0.5, 4);
    s.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, foot, h.wh), ringAt(P, ridge, h.rh)))));
    // the crease is the front eave only: over the gable end the wall rises to the ridge
    s.cr.setAttribute("d", open(ringAt(P, run(foot, (q) => front(q) && q.nv > 0.2), h.wh)));
    // the door, the plate by it and a window beside it, all on the front wall
    const dx = h.x + 1;
    const door = mk("path", { class: "nf", d: onFront(dx - 4.5, 0.6, dx + 4.5, 13, 1.5) }, grp);
    const plate = mk("path", { class: "nf lo", d: onFront(dx + 6, 8.5, dx + 12, 12, 1) }, grp);
    mk("path", { class: "nf lo", d: onFront(x0 + 3, 7, x0 + 3 + h.w * 0.2, 13.5, 1.2) }, grp);
    return { ...h, door, plate, mid: P(h.x, 0, h.wh / 2) };
  });

  const pin = mk("g", {}, g);
  const pinSil = mk("path", { class: "sil" }, pin), pinCr = mk("path", { class: "nf lo" }, pin);
  const hole = mk("ellipse", { rx: RP * 0.42 * C.S, ry: RP * 0.42 * C.S * 0.866, class: "nf" }, pin);
  const pinAt = (x, a, h, w, z) => P(x + (a + w) / Math.SQRT2, (w - a) / Math.SQRT2, z + h);

  const restZ = () => HOUSES[1].rh + REST_UP;
  const px = tween(REST_X), pz = tween(restZ());
  let drawn = "";
  function draw(x, z) {
    const key = x + "," + z;
    if (key === drawn) return;
    drawn = key;
    const F = PIN.map(([a, h]) => pinAt(x, a, h, PT / 2, z)), Bk = PIN.map(([a, h]) => pinAt(x, a, h, -PT / 2, z));
    pinSil.setAttribute("d", poly(hull(F.concat(Bk))));
    pinCr.setAttribute("d", open(F.slice(30, 95)));
    const [hx, hy] = pinAt(x, 0, HC, PT / 2, z);
    hole.setAttribute("cx", hx);
    hole.setAttribute("cy", hy);
    drop.setAttribute("d", seg(P(x, 0, 0), pinAt(x, 0, 0, 0, z)));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(px, now), tval(pz, now));
    return !tdone(px, now) || !tdone(pz, now);
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    tset(px, a < 0 ? REST_X : houses[a].x, now, 0);
    tset(pz, a < 0 ? restZ() : houses[a].rh + hang, now, 0);
    houses.forEach((h, i) => { h.plate.setAttribute("class", i === a ? "nf hi" : "nf lo"); h.door.classList.toggle("hi", i === a); });
    pinSil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : `house ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  /** The house whose rest middle on screen is nearest the pointer's x, if the pointer is near the row at all. */
  function hit(p) {
    let best = -1, bd = 44;
    houses.forEach((h, i) => {
      const d = Math.abs(p[0] - h.mid[0]);
      if (d < bd && Math.abs(p[1] - h.mid[1]) < 80) { bd = d; best = i; }
    });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { hang = clamp(v, 0, LMAX); if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "reverse-geocode",
  means: "A map pin over a row of houses: the house under the pointer gets the pin, and the plate by its door lights.",
  rules: [1, 4, 5, 8],
  range: [6, 12, 22],
  tour: [[138, 182], [264, 247], [202, 211], null],
  mount,
});
