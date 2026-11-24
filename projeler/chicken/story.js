// One Hen, Three Futures — cizgi-short hikâyesi (55,2 sn, 1677 kare)
export const meta = { fps: 30 };

const SHOTS = [[0, "hook"], [87, "village"], [224, "line"], [265, "path"], [410, "soup"], [505, "zero"], [555, "egg"], [679, "gather"],
  [759, "returns"], [823, "incub"], [875, "hatch"], [934, "grow"], [993, "feed"], [1055, "multiply"], [1185, "protest"], [1250, "hire"],
  [1372, "outcomes"], [1451, "qhen"], [1488, "qegg"], [1517, "qinc"], [1557, "end"]];
const END = 1677;
const shotAt = (f) => { let i = 0; while (i < SHOTS.length - 1 && f >= SHOTS[i + 1][0]) i++; return { i, name: SHOTS[i][1], f0: SHOTS[i][0], f1: (SHOTS[i + 1] || [END])[0], t: f - SHOTS[i][0] }; };

// mekânlar (x)
const HX = -120, VX = 0, PX = 30, G1 = -60, G2 = -30, FM = 60, SQ = 120;
const COOPS = [[FM, -3, 0], [FM + 4.5, -7, 1082], [FM - 4.5, -7, 1093], [FM, -10.5, 1099], [FM - 8.5, -10.5, 1109], [FM + 8.5, -10.5, 1115], [FM - 4.5, -14, 1122], [FM + 4.5, -14, 1128]];
const NEST = [FM + 2.9, 0.95, -0.2]; // yuva (masa üstü)
const STALL = [FM - 3.2, 0, -0.4];
let R = {};

// ---------- modeller ----------
function makeHen(E, col) {
  const g = E.group(null), body = E.group(g);
  const m = E.mat(col), dk = E.mat(col === "#f6f0e4" ? "#e3d8c4" : col === "#b8743a" ? "#94592a" : "#bf8a48"), red = E.mat("#d8342c"), org = E.mat("#f2a83a"), ink = E.mat("#1d1622");
  E.sphere(0.26, m, [0, 0.36, 0], { parent: body, scale: [1.25, 1, 0.95] });
  E.sphere(0.16, dk, [-0.03, 0.38, 0.2], { parent: body, scale: [1.25, 0.7, 0.35] }); E.sphere(0.16, dk, [-0.03, 0.38, -0.2], { parent: body, scale: [1.25, 0.7, 0.35] });
  E.cone(0.14, 0.32, dk, [-0.36, 0.36, 0], { parent: body, rot: [0, 0, 0.75], seg: 10 });
  const head = E.group(body, [0.25, 0.6, 0]);
  E.sphere(0.14, m, [0, 0, 0], { parent: head });
  E.cone(0.05, 0.12, org, [0.16, -0.07, 0], { parent: head, rot: [0, 0, -Math.PI / 2], seg: 8 });
  for (const [x, y, r] of [[-0.05, 0.13, 0.04], [0.02, 0.15, 0.05], [0.08, 0.13, 0.04]]) E.sphere(r, red, [x, y, 0], { parent: head, seg: 10 });
  E.sphere(0.035, red, [0.11, -0.1, 0], { parent: head, seg: 10, scale: [1, 1.4, 1] });
  E.sphere(0.024, ink, [0.08, 0.035, 0.115], { parent: head, seg: 8 }); E.sphere(0.024, ink, [0.08, 0.035, -0.115], { parent: head, seg: 8 });
  for (const z of [0.07, -0.07]) { E.cyl(0.02, 0.02, 0.14, org, [0.03, 0, z], { parent: body, seg: 6 }); E.box(0.1, 0.02, 0.06, org, [0.06, 0, z], { parent: body }); }
  g.visible = false; return { g, body, head };
}
function makeChick(E) {
  const g = E.group(null), y = E.mat("#ffd84a"), org = E.mat("#f2a83a"), ink = E.mat("#1d1622");
  E.sphere(0.11, y, [0, 0.11, 0], { parent: g, scale: [1.1, 1, 1] });
  const head = E.group(g, [0.07, 0.22, 0]); E.sphere(0.075, y, [0, 0, 0], { parent: head });
  E.cone(0.025, 0.06, org, [0.085, -0.03, 0], { parent: head, rot: [0, 0, -Math.PI / 2], seg: 6 });
  E.sphere(0.014, ink, [0.04, 0.02, 0.06], { parent: head, seg: 6 }); E.sphere(0.014, ink, [0.04, 0.02, -0.06], { parent: head, seg: 6 });
  g.visible = false; return { g, head };
}
function makeCoop(E, label) {
  const g = E.group(null), wood = E.mat("#ffffff", { map: E.T.planks("#b07a46", 5) }), roof = E.mat("#ffffff", { map: E.T.roof("#b8463a") }), dark = E.mat("#3a2418"), leg = E.mat("#6b4428");
  for (const [x, z] of [[-1.1, -0.8], [1.1, -0.8], [-1.1, 0.8], [1.1, 0.8]]) E.box(0.14, 0.4, 0.14, leg, [x, 0, z], { parent: g });
  E.box(2.6, 1.5, 2, wood, [0, 0.4, 0], { parent: g });
  for (const s of [-1, 1]) { const r = E.box(3.0, 0.12, 1.35, roof, [0, 0, 0], { parent: g, center: true }); r.position.set(0, 2.22, s * 0.55); r.rotation.x = s * 0.62; }
  E.box(2.6, 0.5, 0.06, wood, [0, 1.9, 0.97], { parent: g }); E.box(2.6, 0.5, 0.06, wood, [0, 1.9, -0.97], { parent: g });
  E.box(0.6, 0.75, 0.06, dark, [0.55, 0.45, 1.02], { parent: g });
  const ramp = E.box(0.55, 0.06, 0.9, E.mat("#9a6a3a"), [0.55, 0, 1.4], { parent: g }); ramp.rotation.x = 0.42; ramp.position.y = 0.2;
  E.box(0.5, 0.4, 0.06, E.mat("#f3e7c4"), [-0.6, 0.95, 1.02], { parent: g });
  if (label) E.label(E.T.sign(label, { bg: "#fbf3dc", fg: "#2b2633", size: 130 }), 1.5, 0.5, [-0.35, 1.62, 1.06], { parent: g });
  return g;
}
function makeHut(E, x, z, s = 1, wall = "#b89468") {
  const g = E.group(null, [x, 0, z]);
  E.cyl(1.5 * s, 1.6 * s, 2.0 * s, E.mat("#ffffff", { map: E.T.plaster(wall) }), [0, 0, 0], { parent: g, seg: 16 });
  E.cone(2.1 * s, 1.7 * s, E.mat("#ffffff", { map: E.T.planks("#c9a35a", 10) }), [0, 1.9 * s, 0], { parent: g, seg: 16 });
  E.box(0.8 * s, 1.4 * s, 0.1, E.mat("#3a2418"), [0, 0, 1.55 * s], { parent: g });
  return g;
}
function makePot(E, x, z) {
  const g = E.group(null, [x, 0, z]), stick = E.mat("#5a3a22"), stone = E.mat("#8d8a86");
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; E.sphere(0.13, stone, [Math.cos(a) * 0.6, 0.06, Math.sin(a) * 0.6], { parent: g, seg: 8, scale: [1, 0.7, 1] }); }
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; const s = E.cyl(0.03, 0.03, 1.6, stick, [0, 0, 0], { parent: g, seg: 6, center: true }); s.position.set(Math.cos(a) * 0.55, 0.75, Math.sin(a) * 0.55); s.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); }
  const pot = E.group(g, [0, 0.45, 0]);
  E.cyl(0.42, 0.34, 0.5, E.mat("#2b2830"), [0, 0, 0], { parent: pot, seg: 18 });
  const soup = E.cyl(0.38, 0.38, 0.02, E.mat("#e09a3a"), [0, 0.44, 0], { parent: pot, seg: 18 });
  const fire = E.group(g, [0, 0, 0]);
  const fm = [E.mat("#ff7a2a", { emissive: "#ff5a1a", glow: 1.2 }), E.mat("#ffd24a", { emissive: "#ffb21a", glow: 1.2 })];
  const flames = [[0, 0, 0.3, 0.55, 0], [0.12, 0.06, 0.2, 0.4, 1], [-0.12, -0.05, 0.2, 0.42, 1], [0.05, -0.12, 0.16, 0.34, 0]].map(([fx, fz, r, h, k]) => E.cone(r, h, fm[k], [fx, 0, fz], { parent: fire, seg: 8 }));
  for (const fl of flames) fl.userData.noink = true;
  return { g, soup, fire, flames };
}
function makeBones(E, x, z) { const g = E.group(null, [x, 0, z]), m = E.mat("#f4efe2"); for (const [a, b, r] of [[0, 0, 0.4], [0.3, 0.2, 1.4], [-0.25, 0.15, 2.3]]) { const c = E.cyl(0.03, 0.03, 0.35, m, [a, 0.04, b], { parent: g, seg: 6, center: true }); c.rotation.set(Math.PI / 2, r, 0); } return g; }

export function build(E) {
  const { S, T } = E; E.T = T;
  E.ground(T.dirt("#c4a273"), 600, 0.2);
  S.hills({ z: -110, col: "#9aae66" }); S.mountains({ z: -180, col: "#a3a9c4" }); S.clouds({ n: 8, z: -130, y: 45, spread: 360 });
  // --- kanca: konak + kulübe ---
  S.building(HX - 3.2, -8, { w: 6.5, d: 5, floors: 3, wall: "#f3e2b0", roof: "#5a6b8a", shutter: "#2f4f80" });
  makeHut(E, HX + 3.2, -7, 1, "#9a7a52");
  R.gold = E.group(null, [HX - 1.3, 0, -0.6]); for (let i = 0; i < 9; i++) E.cyl(0.16, 0.16, 0.05, E.mat("#f2c23a"), [(i % 3 - 1) * 0.12, Math.floor(i / 3) * 0.05, (i % 2) * 0.1], { parent: R.gold, seg: 14 });
  // --- köy ---
  for (const [x, z, s] of [[-9, -10, 1], [-4, -13, 1.1], [2.5, -12, 1], [8, -10, 0.95], [13, -14, 1.1], [-14, -15, 1]]) makeHut(E, VX + x, z, s, ["#b89468", "#a8845a", "#c4a070"][Math.abs(Math.round(x)) % 3]);
  S.fence(VX - 7, VX - 2, -7, { col: "#8a6a46" }); S.fence(VX + 3, VX + 9, -7.5, { col: "#8a6a46" });
  S.tree(VX + 6, -4.5, { s: 0.8, col: "#8a8a4a" }); S.tree(VX - 11, -6, { s: 1, col: "#7a9a4a" });
  E.box(9, 0.02, 0.16, E.flat("#fbf8f0"), [VX, 0.005, 0]); // başlangıç çizgisi
  R.pot2 = makePot(E, VX - 2.7, -1.6); R.pot2.soup.visible = false; R.pot2.fire.visible = false;
  R.coop8 = makeCoop(E, null); R.coop8.position.set(VX + 3.1, 0, -2.8); R.coop8.scale.setScalar(0.75); R.coop8.rotation.y = -0.35;
  // --- yol ayrımı ---
  S.crate(PX, 0, 1); for (const [x, txt, c] of [[-1.9, "PATH 1", "#b8463a"], [0, "PATH 2", "#3f6fb5"], [1.9, "PATH 3", "#4f8a3a"]]) { E.cyl(0.07, 0.07, 2.0, E.mat("#8a6a46"), [PX + x, 0, -2.6], { seg: 8 }); E.label(T.sign(txt, { bg: c, fg: "#ffffff", size: 190 }), 1.3, 0.49, [PX + x, 2.2, -2.54]); }
  S.tree(PX - 5, -6, { s: 0.9, col: "#8a9a4a" }); S.tree(PX + 5.5, -7, { s: 1.1, col: "#7a9a4a" });
  // --- grup 1 kampı ---
  makeHut(E, G1 - 2.5, -4.5, 0.9, "#a8845a"); R.pot = makePot(E, G1, 0); R.bones = makeBones(E, G1 + 0.9, 0.7);
  S.tree(G1 + 4, -6, { s: 0.9, col: "#6a8a4a" }); S.crate(G1 + 1.8, -2.2, 0.7, 0.3);
  // --- grup 2 kulübesi ---
  makeHut(E, G2 - 1.2, -3.8, 1, "#c4a070"); S.crate(G2 + 1.2, -0.8, 0.8, 0.2); S.fence(G2 - 4, G2 + 3, -6.5, { col: "#8a6a46" }); S.bush(G2 + 3.5, -4, 0.9, "#7a9a4a");
  R.nestHay = E.box(0.8, 0.05, 0.5, E.mat("#d9b45a"), [G2 - 0.6, 0, 0.2]);
  // --- çiftlik ---
  R.coops = COOPS.map(([x, z], i) => { const c = makeCoop(E, i === 0 ? "SHARED COOP" : null); c.position.set(x, 0, z); return c; });
  S.fence(FM - 11, FM + 11, -17, { col: "#e8dcc0" });
  S.table(NEST[0], NEST[2], { w: 1.3, d: 0.8, col: "#8a5a36" });
  E.box(0.95, 0.22, 0.6, E.mat("#ffffff", { map: T.planks("#d9b45a", 12) }), [NEST[0], 0.86, NEST[2]]);
  R.lamp = E.group(null, [NEST[0], 2.05, NEST[2]]); E.cyl(0.015, 0.015, 0.7, E.mat("#2b2f3a"), [0, 0, 0], { parent: R.lamp, seg: 6 });
  E.cone(0.24, 0.22, E.mat("#b8463a"), [0, -0.2, 0], { parent: R.lamp, seg: 14 });
  R.bulb = E.sphere(0.09, E.mat("#ffd27a", { emissive: "#ffb24a", glow: 1.4 }), [0, -0.12, 0], { parent: R.lamp }); R.bulb.userData.noink = true;
  S.counter(STALL[0], STALL[2], { w: 2.2, col: "#7a4a2a" }); E.label(T.sign("FEED", { bg: "#f2c23a", fg: "#2b2633", size: 190 }), 1.2, 0.45, [STALL[0], 2.15, STALL[2] - 0.3]);
  for (const dx of [-0.9, 0.9]) E.cyl(0.05, 0.05, 2.2, E.mat("#6b4428"), [STALL[0] + dx, 0, STALL[2] - 0.3], { seg: 6 });
  R.sack = E.group(null); E.sphere(0.35, E.mat("#d9bf8f"), [0, 0.36, 0], { parent: R.sack, scale: [1, 1.15, 0.85] }); E.label(T.sign("FEED", { bg: "#d9bf8f", border: null, size: 200 }), 0.42, 0.18, [0, 0.4, 0.31], { parent: R.sack });
  S.tree(FM + 13, -4, { s: 1.1 }); S.tree(FM - 13, -5, { s: 1 }); S.tree(FM + 15, -16, { s: 1.2 });
  // --- meydan ---
  const sq = E.mat("#ffffff", { map: (() => { const t = T.cobble("#cbbb9c").clone(); t.needsUpdate = true; t.repeat.set(8, 8); return t; })() });
  E.box(32, 0.04, 32, sq, [SQ, -0.02, -6]);
  S.row(SQ - 18, SQ + 18, -16, { seed: 6 });
  const well = E.group(null, [SQ + 3.2, 0, -5]); E.cyl(0.9, 0.95, 0.9, E.mat("#ffffff", { map: T.stone("#b8ad98") }), [0, 0, 0], { parent: well, seg: 16 });
  for (const dx of [-0.75, 0.75]) E.box(0.12, 2.2, 0.12, E.mat("#6b4428"), [dx, 0, 0], { parent: well }); E.cone(1.25, 0.8, E.mat("#ffffff", { map: T.roof("#8a4a3a") }), [0, 2.1, 0], { parent: well, seg: 4, rot: [0, Math.PI / 4, 0] });
  S.lamp(SQ - 4, -4.5);
  // --- havuzlar ---
  const hc = (i) => (i % 5 === 3 ? "#b8743a" : i % 7 === 5 ? "#d9a35a" : "#f6f0e4");
  R.hens = []; for (let i = 0; i < 44; i++) R.hens.push(makeHen(E, hc(i)));
  R.chicks = []; for (let i = 0; i < 10; i++) R.chicks.push(makeChick(E));
  R.eggs = []; for (let i = 0; i < 18; i++) { const e = E.sphere(0.075, E.mat("#f6ead2"), [0, 0, 0], { scale: [0.85, 1.1, 0.85] }); e.visible = false; R.eggs.push(e); }
  // --- karakterler ---
  const rag = { pants: "#5a4a3a", shoes: "#3a2a20" };
  E.actor("g1a", { ...rag, shirt: "#b8463a", hair: "short", hairCol: "#2a1d16", seed: 3, skin: "#e9c3a0" });
  E.actor("g1w", { ...rag, shirt: "#b8463a", hat: "cap", hatCol: "#8a6a46", apron: "#d9cbb3", hair: "short", hairCol: "#2a1d16", seed: 3, skin: "#e9c3a0" });
  E.actor("g1b", { ...rag, shirt: "#c25a4a", dress: "#c25a4a", hair: "long", hairCol: "#7a4a2a", seed: 5, skin: "#f0d0b0" });
  E.actor("g2a", { ...rag, shirt: "#3f6fb5", hat: "cap", hatCol: "#2f4f80", moustache: "#3a2a20", seed: 11, skin: "#f0d0b0" });
  E.actor("g2b", { ...rag, shirt: "#4a7ac0", dress: "#4a7ac0", hair: "bun", hairCol: "#2a1d16", seed: 13, skin: "#e9c3a0" });
  E.actor("g3a", { ...rag, shirt: "#4f8a3a", hair: "part", hairCol: "#1d1410", seed: 21, skin: "#c98f66" });
  E.actor("g3b", { ...rag, shirt: "#5f9e4a", dress: "#5f9e4a", hair: "long", hairCol: "#1d1410", seed: 23, skin: "#c98f66" });
  E.actor("g3r", { shirt: "#f4f1ea", pants: "#2f3a2a", jacket: "#2f5a2a", tie: "#f2c23a", hat: "fedora", hatCol: "#3a4a2a", hair: "part", hairCol: "#1d1410", seed: 21, skin: "#c98f66", buttons: "#f2c23a" });
  E.actor("rich", { shirt: "#f4f1ea", jacket: "#2b2633", tie: "#b8262e", hat: "tophat", moustache: "#3a2a20", build: "stout", seed: 31, skin: "#f6dcc0" });
  E.actor("poor", { shirt: "#8a7a62", pants: "#5a4a3a", hair: "spiky", hairCol: "#4a3a2a", seed: 41, skin: "#e0b48c" });
  E.actor("seller", { shirt: "#c2843a", apron: "#f4efe4", hat: "beret", hatCol: "#5a3a22", moustache: "#5a4a3a", build: "stout", seed: 51, skin: "#f6dcc0" });
  E.actor("v1", { ...rag, shirt: "#8a6a9a", hair: "short", hairCol: "#7a4a2a", seed: 61, skin: "#f6dcc0" });
  E.actor("v2", { ...rag, shirt: "#9a8a4a", dress: "#9a8a4a", hair: "bun", hairCol: "#c9a24a", seed: 67, skin: "#e9c3a0" });
}

// ---------- 2D kartlar ----------
const badge = (title, sub, col, y = 0.17) => (g, w, h) => {
  const k = w / 1080; g.save(); g.font = `900 ${64 * k}px CizgiFont, Nunito, sans-serif`;
  const tw = g.measureText(title).width; g.font = `800 ${36 * k}px CizgiFont, Nunito, sans-serif`; const sw = sub ? g.measureText(sub).width : 0;
  const pw = Math.max(tw, sw) + 90 * k, ph = (sub ? 150 : 104) * k, x = (w - pw) / 2, yy = h * y;
  g.fillStyle = "rgba(20,14,24,.88)"; g.beginPath(); g.roundRect(x, yy, pw, ph, 26 * k); g.fill();
  g.fillStyle = col; g.fillRect(x, yy + ph - 12 * k, pw, 12 * k);
  g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${64 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#fff"; g.fillText(title, w / 2, yy + 54 * k);
  if (sub) { g.font = `800 ${36 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#ffd34d"; g.fillText(sub, w / 2, yy + 108 * k); }
  g.restore();
};
const both = (...fs) => (g, w, h, s) => fs.forEach((fn) => fn && fn(g, w, h, s));

export function frame(f, E) {
  const X = E.X, sh = shotAt(f), t = sh.t, A = [], FX = [];
  const st = (seed, o = {}) => ({ blink: E.blink(f, seed), ...E.idle(f, seed), ...o });
  let cam, light = "day", dof = { focus: 4, amount: 0 }, flash = 0, overlay = null, focusPt = null;
  const flashIn = (f0, n = 6) => Math.max(0, 1 - Math.abs(f - f0) / n);
  const pop = (f0, n = 9) => X.back(X.span(f, f0, f0 + n));
  // varsayılanlar: havuzları gizle
  R.hens.forEach((h) => (h.g.visible = false)); R.chicks.forEach((c) => (c.g.visible = false)); R.eggs.forEach((e) => (e.visible = false));
  R.coops.forEach((c, i) => { const s = f < COOPS[i][2] ? 0 : pop(COOPS[i][2], 10); c.visible = s > 0.01; c.scale.setScalar(Math.max(0.01, s)); });
  R.pot2.g.visible = false; R.coop8.visible = false; R.sack.visible = false; R.bones.visible = false; R.pot.soup.visible = true;
  const fl = (k) => 0.85 + 0.25 * Math.sin(f * 0.9 + k * 2.1) + 0.1 * Math.sin(f * 2.3 + k);
  R.pot.flames.forEach((m, k) => m.scale.set(1, fl(k), 1)); R.pot.fire.visible = true;
  R.bulb.scale.setScalar(1 + 0.08 * Math.sin(f * 0.4));
  const peck = (seed) => 0.9 * Math.pow(Math.max(0, Math.sin(f / 9 + seed * 1.7)), 10);
  const H = (i, x, z, yaw = 0, o = {}) => { const h = R.hens[i]; h.g.visible = true; h.g.position.set(x, (o.y || 0) + (o.hop || 0), z); h.g.rotation.y = yaw; h.g.scale.setScalar(o.s ?? 1); h.head.rotation.z = -(o.peck ?? peck(i)); h.body.rotation.z = o.lean || 0; };
  const C = (i, x, y, z, yaw = 0, s = 1) => { const c = R.chicks[i]; c.g.visible = true; c.g.position.set(x, y + 0.02 * Math.abs(Math.sin(f / 4 + i)), z); c.g.rotation.y = yaw; c.g.scale.setScalar(s); c.head.rotation.z = -0.4 * Math.max(0, Math.sin(f / 6 + i)); };
  const G = (i, x, y, z, s = 1) => { const e = R.eggs[i]; e.visible = s > 0.01; e.position.set(x, y + 0.08 * s, z); e.scale.set(0.85 * s, 1.1 * s, 0.85 * s); };
  const nestEggs = (n, s = (i) => 1) => { const off = [[-0.25, -0.1], [0, -0.13], [0.25, -0.1], [-0.12, 0.1], [0.14, 0.1]]; for (let i = 0; i < n; i++) G(i, NEST[0] + off[i][0], NEST[1] + 0.08, NEST[2] + off[i][1], s(i)); };
  const henField = (n, seed = 0) => { // çiftlikte dağılmış tavuklar
    for (let i = 0; i < n && i < 40; i++) { const r1 = ((i * 0.618 + seed) % 1), r2 = ((i * 0.381 + 0.17) % 1); const x = FM - 10 + r1 * 20, z = 1.6 - r2 * 16; H(i, x + 0.3 * Math.sin(f / 40 + i), z, i * 1.3, { hop: 0.03 * Math.abs(Math.sin(f / 5 + i)) }); }
  };

  switch (sh.name) {
    case "hook": {
      light = "golden";
      const rs = 1 + 0.12 * X.smooth(X.span(f, 26, 44)), ps = 1 - 0.1 * X.smooth(X.span(f, 59, 76));
      A.push({ id: "rich", pos: [HX - 0.75, 0, -0.9], scale: rs, st: st(1, { face: f >= 26 ? "smug" : "happy", arms: "holdR", prop: { kind: "bag", hand: "r", gold: true }, look: 0.4 }) });
      A.push({ id: "poor", pos: [HX + 0.8, 0, -0.7], scale: ps, st: st(2, { face: f >= 59 ? "sad" : "nervous", arms: f >= 59 ? "shrug" : "hang", look: -0.6, sweat: f >= 59 }) });
      if (f >= 26) FX.push({ kind: "money", pos: [HX - 0.8, 2.9, -0.6], size: 1.1, t: (f - 26) / 30 });
      if (f >= 62) FX.push({ kind: "sweat", pos: [HX + 1.25, 2.3, -0.5], size: 0.28 * pop(62) });
      cam = E.camAt(f, [{ f: 0, pos: [HX, 1.6, 5.6], look: [HX, 1.35, -1], fov: 44 }, { f: 86, pos: [HX, 1.6, 4.7], look: [HX, 1.4, -1], fov: 42 }]);
      dof = { focus: [HX, 1.4, -0.8], amount: 7 }; focusPt = [HX, 0, -1];
      break;
    }
    case "village": {
      light = ["golden", "day", X.span(f, 87, 200)];
      const awake = f >= 142, hen = f >= 183;
      const ppl = [["g1a", -3.4, -3.2], ["g1b", -2.2, -4.4], ["g2a", -0.6, -3.0], ["g2b", 0.7, -4.5], ["g3a", 2.2, -3.2], ["g3b", 3.4, -4.3]];
      ppl.forEach(([id, x, z], i) => {
        const stand = X.span(f, 142 + i * 2, 150 + i * 2);
        A.push({ id, pos: [VX + x, 0, z], st: st(10 + i, hen ? { face: ["wow", "happy", "grin", "wow", "happy", "grin"][i], arms: "present", prop: { kind: "hen", hand: "r", dy: 30, dx: -40, s: 1.3 * pop(183 + i * 2, 8) } }
          : awake ? { face: "sleep", arms: stand > 0.5 ? "up" : "hang", legs: stand > 0.3 ? "stand" : "sit", face: stand > 0.5 ? "neutral" : "sleep" } : { face: "sleep", legs: "sit", arms: "hang" }) });
        if (!awake) FX.push({ kind: "zzz", pos: [VX + x + 0.4, 1.9, z], size: 0.45, t: ((f + i * 9) % 60) / 60 });
        if (f >= 183 + i * 2 && f < 199 + i * 2) FX.push({ kind: "sparkle", pos: [VX + x, 1.2, z + 0.3], size: 1.0, t: X.span(f, 183 + i * 2, 199 + i * 2) });
      });
      if (f >= 104 && f < 140) FX.push({ kind: "sweat", pos: [VX - 0.3, 2.1, -2.8], size: 0.2 });
      cam = E.camAt(f, [{ f: 87, pos: [VX, 6.5, 13], look: [VX, 1.2, -5], fov: 46 }, { f: 160, pos: [VX, 2.6, 6.4], look: [VX, 1.2, -3.6], fov: 46 }, { f: 223, pos: [VX + 0.2, 1.9, 4.2], look: [VX, 1.3, -3.6], fov: 46 }]);
      dof = { focus: [VX, 1.2, -3.6], amount: 4 }; focusPt = [VX, 0, -3.6];
      break;
    }
    case "line": {
      const xs = [["g1a", -1.7], ["g2a", 0], ["g3a", 1.7]];
      xs.forEach(([id, x], i) => { A.push({ id, pos: [VX + x, 0, -0.9], st: st(20 + i, { face: "determined", arms: "hip", look: 0 }) }); H(i, VX + x + 0.25, 0.45, -1.2 + i * 0.1); });
      cam = E.camAt(f, [{ f: 224, pos: [VX - 0.8, 0.8, 6.4], look: [VX - 0.2, 1.0, -0.5], fov: 50 }, { f: 264, pos: [VX + 0.8, 0.85, 6.0], look: [VX + 0.2, 1.05, -0.5], fov: 50 }]);
      dof = { focus: [VX, 0.6, 0.3], amount: 5 };
      break;
    }
    case "path": {
      H(0, PX, 0.12, 0.0, { y: 0.9, peck: f >= 381 ? 0 : undefined, s: 1.05 });
      R.hens[0].g.position.z = 0.0;
      [303, 311, 322].forEach((q, i) => { if (f >= q) FX.push({ kind: "question", pos: [PX - 0.9 + i * 0.9, 2.55 + 0.05 * Math.sin(f / 6 + i), -0.6], size: 0.5 * pop(q), opt: { col: ["#ff8a7a", "#8fb8ff", "#9fdc7a"][i] } }); });
      if (f >= 381) FX.push({ kind: "sparkle", pos: [PX + 0.3, 1.9, 0.1], size: 0.7, t: (f - 381) / 30 });
      cam = E.camAt(f, [{ f: 265, pos: [PX + 1.6, 1.5, 3.4], look: [PX, 1.25, 0], fov: 40 }, { f: 330, pos: [PX - 0.2, 1.7, 4.6], look: [PX, 1.55, -0.8], fov: 44 }, { f: 409, pos: [PX - 0.9, 1.5, 3.2], look: [PX, 1.3, -0.2], fov: 40 }]);
      dof = { focus: [PX, 1.2, 0], amount: X.keyed(f, [[265, 8], [330, 3], [409, 7]]) };
      break;
    }
    case "soup": {
      light = "night";
      const great = f >= 454;
      A.push({ id: "g1a", pos: [G1 - 0.9, 0, 0.7], st: st(30, { face: great ? "laugh" : "grin", arms: "holdR", prop: { kind: "bowl", hand: "r", steam: true }, look: 0.6, legs: "sit" }) });
      A.push({ id: "g1b", pos: [G1 + 0.9, 0, 0.6], st: st(31, { face: great ? "happy" : "talk", arms: "holdR", prop: { kind: "bowl", hand: "r", steam: true }, look: -0.6, legs: "sit", talk: great ? 0 : E.talk(f, 410, 450) }) });
      
      if (great) FX.push({ kind: "hearts", pos: [G1, 2.4, 0.4], size: 0.7, t: (f - 454) / 50 });
      overlay = f < 470 ? badge("GROUP 1", "eats the hen", "#e05a4a") : null;
      cam = E.camAt(f, [{ f: 410, pos: [G1, 2.0, 6.8], look: [G1, 1.1, 0], fov: 46 }, { f: 504, pos: [G1 + 0.2, 1.8, 5.6], look: [G1, 1.1, 0], fov: 46 }]);
      dof = { focus: [G1, 1, 0.3], amount: 5 }; focusPt = [G1, 0, 0];
      break;
    }
    case "zero": {
      light = "day"; flash = flashIn(505, 6); R.pot.soup.visible = false; R.pot.fire.visible = false; R.bones.visible = true;
      A.push({ id: "g1a", pos: [G1 - 0.9, 0, 0.7], st: st(30, { face: "sad", arms: "holdR", prop: { kind: "bowl", hand: "r", empty: true }, look: 0.5, legs: "sit" }) });
      A.push({ id: "g1b", pos: [G1 + 0.9, 0, 0.6], st: st(31, { face: "sad", arms: "hang", look: -0.4, legs: "sit", sweat: true }) });
      if (f >= 515) FX.push({ kind: "burst", pos: [G1, 2.55, 0.2], size: 0.9 * pop(515, 8), opt: { text: "0", size: 200, col: "#ff9a8a" } });
      cam = E.camAt(f, [{ f: 505, pos: [G1, 1.8, 5.8], look: [G1, 1.3, 0], fov: 46 }, { f: 554, pos: [G1, 1.7, 5.0], look: [G1, 1.35, 0], fov: 46 }]);
      dof = { focus: [G1, 1, 0.3], amount: 5 }; focusPt = [G1, 0, 0];
      break;
    }
    case "egg": {
      const laid = f >= 586, taken = f >= 600, eaten = f >= 628, shrug = f >= 644;
      H(0, G2 - 0.5, 0.3, -0.5, { y: laid && f < 596 ? 0.12 * X.span(f, 586, 590) : 0, peck: laid ? 0 : undefined });
      if (laid && !taken) G(0, G2 - 0.25, 0.02, 0.55, pop(586, 6));
      A.push({ id: "g2a", pos: [G2 + 0.45, 0, -0.1], st: st(40, { face: shrug ? "neutral" : eaten ? "happy" : taken ? "grin" : "think", arms: shrug ? "shrug" : taken && !eaten ? "holdR" : "hang", prop: taken && !eaten ? { kind: "egg", hand: "r" } : null, look: -0.7, talk: eaten && !shrug ? 0.4 : 0 }) });
      if (f >= 586 && f < 600) FX.push({ kind: "exclaim", pos: [G2 + 0.75, 2.75, 0], size: 0.45 * pop(586, 6) });
      if (shrug) FX.push({ kind: "lines", pos: [G2 + 1.1, 2.3, 0], size: 0.4 });
      overlay = both(f < 590 ? badge("GROUP 2", "one egg a day", "#5a8ae0") : null, f >= 595 ? badge("1 EGG / DAY", null, "#ffd34d", 0.2) : null);
      cam = E.camAt(f, [{ f: 555, pos: [G2, 1.6, 5.2], look: [G2, 1.1, 0], fov: 44 }, { f: 640, pos: [G2, 1.5, 4.4], look: [G2, 1.1, 0], fov: 44 }, { f: 678, pos: [G2, 1.5, 4.3], look: [G2, 1.1, 0], fov: 44 }]);
      dof = { focus: [G2, 0.9, 0.1], amount: 5 }; focusPt = [G2, 0, 0];
      break;
    }
    case "gather": {
      for (let i = 0; i < 7; i++) {
        const t0 = 682 + i * 9, p = X.span(f, t0, t0 + 50), x = X.keyed(f, [[t0, FM - 6.5 - i * 0.4], [t0 + 50, FM + 0.55]], (v) => v), z = X.keyed(f, [[t0, 1.0 + (i % 3) * 0.5], [t0 + 50, -1.5]], (v) => v);
        if (p < 1) H(i, x, z, Math.atan2(-(z - 1.5), (FM + 0.55 - x)) * 0 + -0.25, { hop: 0.06 * Math.abs(Math.sin(f / 2.5 + i)), peck: 0, y: p > 0.85 ? (p - 0.85) * 1.5 : 0 });
      }
      A.push({ id: "g3a", pos: [FM - 3.6, 0, 1.9], st: st(50, { face: "determined", arms: "point", legs: "walk", phase: t / 20, look: 0.8 }), flip: false });
      A.push({ id: "g3b", pos: [FM - 2.4, 0, 2.1], st: st(51, { face: "happy", arms: "wave", look: 0.6 }) });
      if (f >= 734) FX.push({ kind: "sparkle", pos: [FM - 0.35, 2.0, -1.8], size: 0.9, t: (f - 734) / 30 });
      overlay = f < 720 ? badge("GROUP 3", "builds a coop", "#6ab04a") : null;
      cam = E.camAt(f, [{ f: 679, pos: [FM - 3.0, 2.4, 7.5], look: [FM - 1.5, 0.9, -1.5], fov: 46 }, { f: 758, pos: [FM - 1.6, 2.1, 6.2], look: [FM - 0.6, 1.1, -1.8], fov: 44 }]);
      dof = { focus: [FM - 2, 0.8, 0], amount: 3 }; focusPt = [FM - 1, 0, -1];
      break;
    }
    case "returns": {
      const handed = f >= 790;
      A.push({ id: "g3a", pos: [FM - 1.25, 0, 1.0], st: st(50, { face: "happy", arms: handed ? "present" : "holdR", prop: handed ? null : { kind: "basket", hand: "r" }, look: 0.7 }) });
      A.push({ id: "g2a", pos: [FM + 0.15, 0, 1.0], st: st(40, { face: handed ? "grin" : "wow", arms: handed ? "holdR" : "reach", prop: handed ? { kind: "basket", hand: "r" } : null, look: -0.7 }) });
      if (handed) FX.push({ kind: "hearts", pos: [FM - 0.45, 2.6, 1.0], size: 0.55, t: (f - 790) / 40 });
      overlay = f >= 798 ? badge("→ GROUP 2", null, "#5a8ae0", 0.15) : null;
      cam = E.camAt(f, [{ f: 759, pos: [FM - 0.55, 1.7, 6.2], look: [FM - 0.55, 1.3, 0.8], fov: 44 }, { f: 822, pos: [FM - 0.55, 1.65, 5.4], look: [FM - 0.55, 1.3, 0.8], fov: 44 }]);
      dof = { focus: [FM - 0.5, 1.2, 0.9], amount: 6 }; focusPt = [FM, 0, 0];
      break;
    }
    case "incub": {
      light = ["day", "interior", 0.6];
      nestEggs(5); H(5, NEST[0] - 0.95, NEST[2] + 0.05, 0.3, { y: 0.95, s: 0.75 });
      FX.push({ kind: "sparkle", pos: [NEST[0], NEST[1] + 0.5, NEST[2] + 0.2], size: 0.55, t: t / 30 });
      cam = E.camAt(f, [{ f: 823, pos: [NEST[0] + 0.3, 1.75, 2.2], look: [NEST[0], 1.1, NEST[2]], fov: 40 }, { f: 874, pos: [NEST[0] + 0.15, 1.6, 1.5], look: [NEST[0], 1.05, NEST[2]], fov: 38 }]);
      dof = { focus: [NEST[0], NEST[1], NEST[2]], amount: 8 }; focusPt = [NEST[0], 0, NEST[2]];
      break;
    }
    case "hatch": {
      light = ["day", "interior", 0.6];
      H(5, NEST[0] - 0.95, NEST[2] + 0.05, 0.3, { y: 0.95, s: 0.75 });
      const off = [[-0.25, -0.1], [0, -0.13], [0.25, -0.1], [-0.12, 0.1], [0.14, 0.1]];
      for (let i = 0; i < 5; i++) {
        const h0 = 887 + i * 5, x = NEST[0] + off[i][0], z = NEST[2] + off[i][1];
        if (f < h0) G(i, x, NEST[1] + 0.08 + (f > h0 - 8 ? 0.01 * Math.sin(f * 3) : 0), z, 1);
        else { C(i, x, NEST[1] + 0.06, z, -1.2 + i * 0.5, 0.75 * pop(h0, 8)); if (f < h0 + 14) FX.push({ kind: "sparkle", pos: [x, NEST[1] + 0.25, z + 0.05], size: 0.4, t: X.span(f, h0, h0 + 14) }); }
      }
      overlay = f >= 897 ? badge("21 DAYS", "to hatch", "#ffd34d") : null;
      cam = E.camAt(f, [{ f: 875, pos: [NEST[0] + 0.1, 1.6, 2.0], look: [NEST[0], 1.05, NEST[2]], fov: 40 }, { f: 933, pos: [NEST[0] - 0.1, 1.55, 1.7], look: [NEST[0], 1.05, NEST[2]], fov: 38 }]);
      dof = { focus: [NEST[0], NEST[1], NEST[2]], amount: 8 }; focusPt = [NEST[0], 0, NEST[2]];
      break;
    }
    case "grow": {
      flash = flashIn(934, 6);
      const g = 0.55 + 0.45 * X.back(X.span(f, 936, 952));
      for (let i = 0; i < 5; i++) {
        const x = FM - 1.2 + i * 0.75, z = 0.6 + (i % 2) * 0.5;
        H(i, x, z, -0.6 + (i % 2) * 0.3, { s: g });
        const e0 = 944 + i * 6; if (f >= e0) G(6 + i, x - 0.35, 0, z + 0.25, pop(e0, 6));
        if (f >= e0 && f < e0 + 10) FX.push({ kind: "sparkle", pos: [x - 0.35, 0.3, z + 0.3], size: 0.35, t: X.span(f, e0, e0 + 10) });
      }
      overlay = badge("5–6 MONTHS", "to lay eggs", "#ffd34d");
      cam = E.camAt(f, [{ f: 934, pos: [FM + 0.4, 1.7, 6.6], look: [FM + 0.3, 0.8, 0.4], fov: 44 }, { f: 992, pos: [FM + 0.3, 1.6, 5.8], look: [FM + 0.3, 0.8, 0.4], fov: 44 }]);
      dof = { focus: [FM + 0.3, 0.5, 0.8], amount: 5 }; focusPt = [FM, 0, 0];
      break;
    }
    case "feed": {
      const sold = f >= 1016, sack = f >= 1024;
      A.push({ id: "seller", pos: [STALL[0] - 0.3, 0, STALL[2] - 0.9], st: st(60, { face: sold ? "grin" : "smug", arms: sold ? "holdR" : "count", prop: sold ? { kind: "basket", hand: "r" } : null, look: 0.6 }) });
      A.push({ id: "g3a", pos: [STALL[0] + 0.9, 0, STALL[2] + 1.3], st: st(50, { face: sack ? "happy" : "talk", arms: sold ? "hip" : "holdR", prop: sold ? null : { kind: "basket", hand: "r" }, look: -0.7, talk: sold ? 0 : E.talk(f, 993, 1015) }) });
      if (sack) { R.sack.visible = true; const p = X.span(f, 1024, 1032); R.sack.position.set(STALL[0] + 1.7, 1.2 * (1 - X.easeIn(p)), STALL[2] + 1.6); }
      if (f >= 1016 && f < 1045) FX.push({ kind: "money", pos: [STALL[0] + 0.2, 2.4, STALL[2] + 0.6], size: 0.7, t: (f - 1016) / 30 });
      if (f >= 1032 && f < 1044) FX.push({ kind: "dust", pos: [STALL[0] + 1.7, 0.3, STALL[2] + 1.7], size: 0.7, t: X.span(f, 1032, 1044) });
      overlay = f >= 1007 ? badge("EXTRA EGGS → FEED", null, "#ffd34d", 0.16) : null;
      cam = E.camAt(f, [{ f: 993, pos: [STALL[0] + 0.7, 1.7, 5.4], look: [STALL[0] + 0.5, 1.2, 0], fov: 44 }, { f: 1054, pos: [STALL[0] + 0.8, 1.6, 4.6], look: [STALL[0] + 0.6, 1.1, 0.2], fov: 42 }]);
      dof = { focus: [STALL[0] + 0.6, 1.1, 0.5], amount: 4 }; focusPt = [STALL[0], 0, 0];
      break;
    }
    case "multiply": {
      light = ["day", "golden", X.span(f, 1110, 1184)];
      const n = Math.round(6 + 34 * X.smooth(X.span(f, 1080, 1150)));
      henField(n);
      COOPS.forEach(([x, z, f0], i) => { if (i && f >= f0 && f < f0 + 14) FX.push({ kind: "sparkle", pos: [x, 1.2, z + 1.2], size: 2.2, t: X.span(f, f0, f0 + 14) }); });
      if (f >= 1122) FX.push({ kind: "lines", pos: [FM - 6, 5.5, -4], size: 1.6 }, { kind: "sparkle", pos: [FM + 5, 5, -6], size: 1.4, t: (f - 1122) / 30 });
      const lbl = f >= 1109 ? "×8" : f >= 1093 ? "×4" : f >= 1082 ? "×2" : "×1";
      overlay = badge("COOPS " + lbl, null, "#6ab04a", 0.13);
      cam = E.camAt(f, [{ f: 1055, pos: [FM + 1, 4.5, 9.5], look: [FM, 0.8, -4], fov: 48 }, { f: 1105, pos: [FM + 1.5, 8.5, 13], look: [FM, 0.5, -7], fov: 50 }, { f: 1184, pos: [FM + 2, 14, 16], look: [FM, 0, -8], fov: 52 }]);
      dof = { focus: [FM, 0, -7], amount: 0 }; focusPt = [FM, 0, -7];
      break;
    }
    case "protest": {
      const ids = [["g1a", -1.3, -0.4, "UNFAIR!"], ["g1b", -0.1, -1.0, "NOT FAIR!"], ["v1", 1.1, -0.5, "WHY THEM?"], ["v2", 0.4, -2.0, "UNFAIR!"]];
      ids.forEach(([id, x, z, txt], i) => { const up = Math.sin(f / 5 + i * 1.6) > 0; A.push({ id, pos: [SQ + x, 0, z], st: st(70 + i, { face: "angry", arms: up ? "up" : "holdR", prop: { kind: "sign", hand: "r", text: txt, size: txt.length > 7 ? 21 : 26, col: "#fbf3dc" }, look: 0, talk: E.talk(f, 1185, 1249) * (i % 2 ? 1 : 0.6), bob: up ? 10 : 0 }) }); });
      FX.push({ kind: "anger", pos: [SQ - 1.6, 2.9, -0.3], size: 0.45 * pop(1197) }, { kind: "anger", pos: [SQ + 1.5, 2.8, -0.4], size: 0.4 * pop(1211) });
      cam = E.camAt(f, [{ f: 1185, pos: [SQ + 0.2, 1.9, 5.6], look: [SQ, 1.5, -1], fov: 44 }, { f: 1249, pos: [SQ - 0.2, 1.75, 4.5], look: [SQ, 1.5, -1], fov: 42 }]);
      dof = { focus: [SQ, 1.4, -0.8], amount: 4 }; focusPt = [SQ, 0, -1];
      break;
    }
    case "hire": {
      light = "golden";
      henField(40, 0.3);
      const wx = X.keyed(f, [[1250, FM - 6.5], [1300, FM - 1.6]]), walking = f < 1300, hired = f >= 1306, paid = f >= 1325;
      A.push({ id: "g3r", pos: [FM + 0.4, 0, 2.0], st: st(80, { face: hired ? "smug" : "happy", arms: hired ? "present" : "hip", look: -0.7, talk: E.talk(f, 1306, 1350) * 0.5 }) });
      A.push({ id: hired ? "g1w" : "g1a", pos: [wx, 0, 2.3], st: st(30, { legs: walking ? "walk" : "stand", phase: t / 18, face: paid ? "sad" : hired ? "nervous" : "neutral", arms: paid ? "holdR" : "hang", prop: paid ? { kind: "egg", hand: "r", n: 3 } : null, look: 0.7 }) });
      A.push({ id: "g1b", pos: [wx - 1.1, 0, 2.6], st: st(31, { legs: walking ? "walk" : "stand", phase: t / 18 + 0.4, face: hired ? "nervous" : "neutral", arms: "hang", look: 0.7 }) });
      if (hired) FX.push({ kind: "check", pos: [FM + 0.8, 3.0, 2.0], size: 0.45 * pop(1306) });
      overlay = hired ? badge("HIRING", "3 eggs a day", "#ffd34d") : null;
      cam = E.camAt(f, [{ f: 1250, pos: [FM - 1.5, 3.6, 10], look: [FM - 1.5, 1.2, -1], fov: 48 }, { f: 1300, pos: [FM - 0.9, 2.0, 8.2], look: [FM - 0.8, 1.3, 1.5], fov: 46 }, { f: 1371, pos: [FM - 0.8, 1.8, 7.3], look: [FM - 0.8, 1.35, 1.8], fov: 46 }]);
      dof = { focus: [FM - 1, 1.3, 2.1], amount: X.keyed(f, [[1250, 0], [1300, 4]]) }; focusPt = [FM - 1, 0, 0];
      break;
    }
    case "outcomes": {
      light = "golden"; R.pot2.g.visible = true; R.coop8.visible = true;
      const wide = f >= 1404;
      A.push({ id: "g1a", pos: [VX - 1.8, 0, -0.9], st: st(30, { face: "sad", arms: "holdR", prop: { kind: "bowl", hand: "r", empty: true }, look: 0.3 }) });
      A.push({ id: "g2a", pos: [VX, 0, -0.9], st: st(40, { face: "neutral", arms: "shrug", look: 0 }) }); H(0, VX + 0.35, -0.3, -1.3);
      A.push({ id: "g3r", pos: [VX + 1.8, 0, -0.9], st: st(80, { face: "grin", arms: "present", look: -0.3 }) });
      for (let i = 1; i < 6; i++) H(i, VX + 2.0 + (i % 3) * 0.6, -1.7 - Math.floor(i / 3) * 0.5 + 0.1 * Math.sin(f / 30 + i), -0.8 + i);
      flash = flashIn(1404, 5) * 0.5;
      cam = wide ? E.camAt(f, [{ f: 1404, pos: [VX + 0.3, 1.8, 5.6], look: [VX + 0.3, 1.2, -1.3], fov: 50 }, { f: 1450, pos: [VX + 0.3, 2.0, 6.2], look: [VX + 0.3, 1.2, -1.4], fov: 50 }])
        : E.camAt(f, [{ f: 1372, pos: [VX - 0.6, 0.8, 6.0], look: [VX, 1.0, -0.6], fov: 50 }, { f: 1403, pos: [VX + 0.6, 0.85, 5.6], look: [VX, 1.05, -0.6], fov: 50 }]);
      dof = { focus: [VX, 1, -0.9], amount: wide ? 2 : 5 }; focusPt = [VX, 0, -1];
      break;
    }
    case "qhen": {
      light = "night";
      FX.push({ kind: "sparkle", pos: [G1, 1.45, 0.2], size: 0.4, t: t / 30 });
      cam = E.camAt(f, [{ f: 1451, pos: [G1 + 0.6, 1.8, 3.4], look: [G1, 0.85, 0], fov: 40 }, { f: 1487, pos: [G1 + 0.4, 1.6, 2.7], look: [G1, 0.85, 0], fov: 40 }]);
      dof = { focus: [G1, 0.9, 0], amount: 8 }; focusPt = [G1, 0, 0];
      break;
    }
    case "qegg": {
      G(0, G2 + 1.2, 0.8 * 1 + 0.1, -0.8, 1.4); H(1, G2 + 0.45, -0.4, -0.4);
      FX.push({ kind: "sparkle", pos: [G2 + 1.2, 1.35, -0.7], size: 0.45, t: t / 30 });
      cam = E.camAt(f, [{ f: 1488, pos: [G2 + 1.3, 1.4, 1.6], look: [G2 + 1.1, 0.9, -0.8], fov: 40 }, { f: 1516, pos: [G2 + 1.25, 1.3, 1.0], look: [G2 + 1.15, 0.95, -0.8], fov: 38 }]);
      dof = { focus: [G2 + 1.2, 1.0, -0.8], amount: 8 }; focusPt = [G2, 0, 0];
      break;
    }
    case "qinc": {
      light = ["golden", "interior", 0.4];
      nestEggs(5); H(5, NEST[0] - 0.95, NEST[2] + 0.05, 0.3, { y: 0.95, s: 0.75 });
      FX.push({ kind: "sparkle", pos: [NEST[0], NEST[1] + 0.5, NEST[2] + 0.2], size: 0.7, t: t / 30 }, { kind: "stars", pos: [NEST[0], NEST[1] + 0.85, NEST[2]], size: 0.8, t: t / 30 });
      cam = E.camAt(f, [{ f: 1517, pos: [NEST[0] - 0.2, 1.7, 1.9], look: [NEST[0], 1.05, NEST[2]], fov: 40 }, { f: 1556, pos: [NEST[0] - 0.1, 1.55, 1.2], look: [NEST[0], 1.05, NEST[2]], fov: 36 }]);
      dof = { focus: [NEST[0], NEST[1], NEST[2]], amount: 8 }; focusPt = [NEST[0], 0, NEST[2]];
      break;
    }
    case "end": {
      light = "golden";
      A.push({ id: "g1a", pos: [VX - 1.8, 0, -0.9], st: st(30, { face: "think", arms: "chin", look: 0.3 }) });
      A.push({ id: "g2a", pos: [VX, 0, -1.2], st: st(40, { face: "happy", arms: "wave", look: 0 }) });
      A.push({ id: "g3r", pos: [VX + 1.8, 0, -0.9], st: st(80, { face: "grin", arms: "point", look: -0.3 }) });
      H(0, VX + 0.05, 0.5, -1.4, { s: 1.15 });
      if (f >= 1576) FX.push({ kind: "question", pos: [VX + 0.1, 3.4 + 0.06 * Math.sin(f / 7), -0.8], size: 1.0 * pop(1576) });
      cam = E.camAt(f, [{ f: 1557, pos: [VX, 1.4, 4.2], look: [VX, 1.1, -0.5], fov: 44 }, { f: 1620, pos: [VX, 2.2, 6.4], look: [VX, 1.4, -1.0], fov: 46 }, { f: 1677, pos: [VX, 3.2, 8.4], look: [VX, 1.6, -1.5], fov: 48 }]);
      dof = { focus: [VX, 1.2, -0.8], amount: 2 }; focusPt = [VX, 0, -1];
      break;
    }
  }
  return { cam, light, dof, actors: A, fx: FX, flash, overlay, focusPt };
}
