// Ketchup was sold as medicine — cizgi-short (32,9 sn)
export const meta = { fps: 30 };

const SHOTS = [[0, "hook"], [100, "doctor"], [172, "claims"], [303, "laugh"], [385, "recipes"], [454, "salesman"], [524, "pills"],
  [564, "rivals"], [679, "inside"], [796, "lax"], [818, "dead"], [906, "fries"]];
const END = 1009;
const shotAt = (f) => { let i = 0; while (i < SHOTS.length - 1 && f >= SHOTS[i + 1][0]) i++; return { i, name: SHOTS[i][1], f0: SHOTS[i][0], f1: (SHOTS[i + 1] || [END])[0], t: f - SHOTS[i][0] }; };

const PX = 200, NX = 400, DX = -200; // sokak, gazete sahnesi, modern restoran
let R = {};

function tomato(E, r, pos, parent) {
  const g = E.group(parent, pos);
  E.sphere(r, E.mat("#e0352b"), [0, r * 0.85, 0], { parent: g, scale: [1, 0.85, 1], seg: 20 });
  const lm = E.mat("#3f8a3a");
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; const l = E.box(r * 0.5, r * 0.06, r * 0.16, lm, [Math.cos(a) * r * 0.22, r * 1.66, Math.sin(a) * r * 0.22], { parent: g }); l.rotation.y = -a; }
  E.cyl(r * 0.05, r * 0.06, r * 0.25, lm, [0, r * 1.66, 0], { parent: g, seg: 6 });
  return g;
}

function oldBottle(E, T, s, pos, parent, text = "TOMATO\nCATSUP", sub = "cures all!") {
  const g = E.group(parent, pos), red = E.mat("#a8201f"), glass = E.mat("#c23b3b");
  E.cyl(0.09 * s, 0.09 * s, 0.25 * s, red, [0, 0, 0], { parent: g, seg: 18 });
  E.cyl(0.04 * s, 0.09 * s, 0.07 * s, glass, [0, 0.25 * s, 0], { parent: g, seg: 18 });
  E.cyl(0.035 * s, 0.04 * s, 0.09 * s, glass, [0, 0.32 * s, 0], { parent: g, seg: 14 });
  E.cyl(0.043 * s, 0.043 * s, 0.04 * s, E.mat("#c79a5b"), [0, 0.4 * s, 0], { parent: g, seg: 14 });
  const lab = E.label(T.sign(text, { bg: "#f4ecd6", fg: "#7a1a1a", border: "#7a1a1a", size: 140, sub, subSize: 70 }), 0.15 * s, 0.11 * s, [0, 0.12 * s, 0.092 * s], { parent: g });
  lab.castShadow = false;
  return g;
}

function pillBox(E, T, s, pos, parent) {
  const g = E.group(parent, pos);
  E.box(0.5 * s, 0.3 * s, 0.3 * s, E.mat("#f4ecd6"), [0, 0, 0], { parent: g });
  E.box(0.52 * s, 0.07 * s, 0.32 * s, E.mat("#b8262e"), [0, 0.3 * s, 0], { parent: g });
  const lab = E.label(T.sign("TOMATO\nPILLS", { bg: "#f4ecd6", fg: "#b8262e", border: null, size: 150, sub: "Extract of Tomato", subSize: 62 }), 0.46 * s, 0.26 * s, [0, 0.15 * s, 0.152 * s], { parent: g });
  lab.castShadow = false;
  return g;
}

function popSign(E, T, text, w, h, pos, o = {}) {
  const m = E.label(T.sign(text, { bg: o.bg || "#fbf3dc", fg: o.fg || "#2b2633", border: o.border === undefined ? "#2b2633" : o.border, size: o.size || 150, sub: o.sub || null }), w, h, pos, o);
  m.castShadow = false; m.visible = false; return m;
}

function burstTex(E, a, b) {
  const { THREE } = E, bc = document.createElement("canvas"); bc.width = bc.height = 1024; const bg = bc.getContext("2d");
  bg.fillStyle = a; bg.fillRect(0, 0, 1024, 1024); bg.fillStyle = b;
  for (let i = 0; i < 24; i++) { const an = (i / 24) * Math.PI * 2; bg.beginPath(); bg.moveTo(512, 512); bg.lineTo(512 + 1100 * Math.cos(an), 512 + 1100 * Math.sin(an)); bg.lineTo(512 + 1100 * Math.cos(an + 0.13), 512 + 1100 * Math.sin(an + 0.13)); bg.fill(); }
  const t = new THREE.CanvasTexture(bc); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function build(E) {
  const { S, T, THREE } = E;
  // ---- eczane (x = 0) ----
  S.room({ w: 10, d: 8, h: 4.2, wall: T.wallpaper("#5f8a6a", "#557d60", "stripe"), floor: T.planks("#9a6a3a"), floorRep: 0.4, window: false, door: false });
  for (const x of [-3.4, -1.7, 1.7, 3.4]) S.shelf(x, -3.7, { seed: 3 + x * 2 });
  E.label(T.sign("APOTHECARY", { bg: "#2b2633", fg: "#e8c45a", border: "#e8c45a", size: 170 }), 2.6, 0.62, [0, 3.35, -3.93]);
  S.counter(0, -1.6, { w: 4.2, col: "#6b4428" });
  R.hero = oldBottle(E, T, 1, [0, 1.18, -1.35]);
  for (const [x, s] of [[-1.5, 0.7], [-1.25, 0.6], [1.3, 0.7], [1.55, 0.6], [-0.55, 0.55]]) oldBottle(E, T, s, [x, 1.18, -1.55]);
  R.tom = tomato(E, 0.2, [0.32, 1.18, -1.4]);
  R.claims = [
    popSign(E, T, "DIARRHEA", 0.85, 0.3, [0.2, 2.95, -1.9], { bg: "#ffffff" }),
    popSign(E, T, "INDIGESTION", 0.85, 0.3, [0.2, 2.55, -1.9], { bg: "#ffffff" }),
    popSign(E, T, "JAUNDICE", 0.85, 0.3, [0.2, 2.15, -1.9], { bg: "#ffffff" }),
  ];
  // yan masa (iç bakış sahnesi)
  S.table(2.6, 1.6, { w: 1.4, d: 0.9, col: "#7a4a2a" });
  S.hangLamp(2.6, 4.2, 1.6, { col: "#2f4a3a" });
  R.pbInside = pillBox(E, T, 0.7, [2.2, 0.96, 1.55]);
  R.laxTag = popSign(E, T, "LAXATIVE", 0.42, 0.16, [2.2, 1.27, 1.78], { bg: "#fff3a8", fg: "#b8262e", border: "#b8262e" });
  const pr = 0.09, pm1 = E.mat("#d9473a"), pm2 = E.mat("#f4f1ea");
  R.pillA = E.group(null, [2.75, 0.96 + pr, 1.65]); R.pillB = E.group(null, [2.75, 0.96 + pr, 1.65]);
  const hemi = (m, par, flip) => { const me = new THREE.Mesh(new THREE.SphereGeometry(pr, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m); me.rotation.z = flip ? -Math.PI / 2 : Math.PI / 2; me.castShadow = true; E.add(me, par); const cap = new THREE.Mesh(new THREE.CircleGeometry(pr * 0.98, 20), E.mat("#f7f3e8")); cap.rotation.y = flip ? Math.PI / 2 : -Math.PI / 2; E.add(cap, par); };
  hemi(pm1, R.pillA, false); hemi(pm2, R.pillB, true);

  // ---- sokak (x = 200) ----
  E.ground(T.grass("#86b860"), 320, 0.2, [PX, -0.03, 0]);
  S.street({ x: PX, len: 140, width: 9, z: -4, col: "#cbb48c" });
  S.row(PX - 50, PX + 60, -14.2, { seed: 7 });
  S.hills({ z: -110, col: "#8cbf6a" }); S.clouds({ n: 7, z: -120, y: 45 });
  for (const x of [-9, 9]) S.tree(PX + x, 2.5, { s: 1.1 });
  S.crate(PX - 29.8, -3.6, 0.9); R.tomStreet = tomato(E, 0.18, [PX - 29.8, 0.81, -3.6]);
  // satıcı tezgâhı (salesman, x = PX+30)
  S.table(PX + 30, -3.2, { w: 1.6, d: 0.9, col: "#a8743f", cloth: "#f4ecd6" });
  R.tomSale = tomato(E, 0.2, [PX + 30.3, 0.95, -3.1]);
  R.pbSale = pillBox(E, T, 0.75, [PX + 30.3, 0.95, -3.1]);
  // rakip tezgâhlar
  R.rivalSigns = [];
  const stalls = [[-1.35, -3.4, "TOMATO PILLS!", "#b8262e"], [0, -6.4, "BETTER\nTOMATO PILLS", "#2f5f6a"], [1.35, -3.4, "MIRACLE\nPILLS!", "#7b5ac9"]];
  R.stallMeshes = [];
  for (const [x, z, txt, col] of stalls) {
    S.table(PX + x, z, { w: 1.3, d: 0.8, col: "#a8743f", cloth: col });
    pillBox(E, T, 0.45, [PX + x - 0.3, 0.95, z + 0.1]); pillBox(E, T, 0.45, [PX + x + 0.3, 0.95, z + 0.1]);
    E.cyl(0.04, 0.04, 2.6, E.mat("#6b4428"), [PX + x - 0.62, 0, z - 0.3], { seg: 6 }); E.cyl(0.04, 0.04, 2.6, E.mat("#6b4428"), [PX + x + 0.62, 0, z - 0.3], { seg: 6 });
    const sg = E.group(null, [PX + x, 2.25, z - 0.28]);
    const m = E.label(T.sign(txt, { bg: "#fbf3dc", fg: col, border: col, size: 160 }), 1.15, 0.48, [0, 0, 0], { parent: sg }); m.castShadow = false;
    R.rivalSigns.push(sg);
  }
  R.closed = popSign(E, T, "CLOSED", 0.9, 0.34, [PX + 1.35, 1.35, -2.95], { bg: "#2b2633", fg: "#ffffff", border: "#ffffff" });

  // ---- gazete / insert sahnesi (x = 400) ----
  E.plane(30, 30, E.flat("#ffffff", { map: burstTex(E, "#ffcf4a", "#ffb43a"), fog: false }), [NX, 0, -6], { noink: true, noShadow: true });
  const tomPic = (g, x, y, w, h) => { g.fillStyle = "#fbe7c8"; g.fillRect(x, y, w, h); g.fillStyle = "#e0352b"; g.beginPath(); g.ellipse(x + w * 0.35, y + h * 0.55, h * 0.32, h * 0.28, 0, 0, 7); g.fill(); g.lineWidth = 6; g.strokeStyle = "#2b2633"; g.stroke(); g.fillStyle = "#3f8a3a"; g.fillRect(x + w * 0.33, y + h * 0.2, 14, 26); g.fillStyle = "#a8201f"; g.fillRect(x + w * 0.66, y + h * 0.25, w * 0.12, h * 0.55); g.strokeRect(x + w * 0.66, y + h * 0.25, w * 0.12, h * 0.55); g.fillStyle = "#c79a5b"; g.fillRect(x + w * 0.68, y + h * 0.16, w * 0.08, h * 0.1); };
  R.paper = E.plane(2.3, 3.07, E.flat("#ffffff", { map: T.newspaper("TOMATO CATSUP\nA RECIPE FOR HEALTH", { paper: "THE DAILY HERALD", date: "1834", col: "#b8262e", picDraw: tomPic }), side: THREE.DoubleSide, fog: false }), [NX, 0, 0], { noShadow: true });
  R.pbBig = pillBox(E, T, 2.4, [NX, -0.5, 0.4]);
  R.rain = []; for (let i = 0; i < 14; i++) { const p = E.sphere(0.07, E.mat(i % 2 ? "#d9473a" : "#f4f1ea"), [NX, 0, 0.8], { scale: [1.5, 1, 1], seg: 10 }); R.rain.push(p); }

  // ---- modern restoran (x = -200) ----
  S.room({ x: DX, w: 8, d: 7, h: 3.6, wall: T.wallpaper("#f4ecd6", "#e05a4a", "stripe"), floor: T.tiles("#f4f1ea", "#2b2633", 8), floorRep: 0.3, window: true, door: false });
  S.table(DX, -1.2, { w: 1.6, d: 1.0, col: "#c23b3b" });
  S.chair(DX - 0.2, -2.1, { col: "#2f5f6a" });
  E.cyl(0.26, 0.24, 0.03, E.mat("#ffffff"), [DX + 0.15, 0.96, -1.0], { seg: 24 });
  R.fries = E.group(null, [DX + 0.15, 0.99, -1.0]);
  E.box(0.2, 0.16, 0.12, E.mat("#d9302a"), [0, 0, 0], { parent: R.fries });
  for (let i = 0; i < 16; i++) { const fr = E.box(0.025, 0.2, 0.025, E.mat(i % 3 ? "#f2c23a" : "#e8b02a"), [-0.075 + (i % 6) * 0.03, 0.06, -0.035 + Math.floor(i / 6) * 0.035], { parent: R.fries }); fr.rotation.z = ((i * 37) % 11 - 5) * 0.05; fr.rotation.x = ((i * 53) % 7 - 3) * 0.05; }
  R.blob = E.sphere(0.07, E.mat("#b8262e"), [DX + 0.15, 1.2, -1.0], { scale: [1.3, 0.5, 1.1], seg: 14 });
  R.squeeze = E.group(null, [DX - 0.25, 0.96, -0.95]);
  E.cyl(0.07, 0.075, 0.26, E.mat("#c8201f"), [0, 0, 0], { parent: R.squeeze, seg: 18 });
  E.cyl(0.03, 0.07, 0.08, E.mat("#f4f1ea"), [0, 0.26, 0], { parent: R.squeeze, seg: 14 });
  const ml = E.label(T.sign("KETCHUP", { bg: "#f4f1ea", fg: "#c8201f", border: null, size: 170 }), 0.12, 0.06, [0, 0.13, 0.077], { parent: R.squeeze }); ml.castShadow = false;

  // ---- karakterler ----
  E.actor("doc", { shirt: "#f4f1ea", jacket: "#2b2633", tie: "#b8262e", hat: "tophat", moustache: "#7a6a60", beard: "#7a6a60", glasses: true, skin: "#f6dcc0", seed: 5 });
  E.actor("sales", { shirt: "#f4e3b0", jacket: "#b5653f", tie: "#2f5f6a", hat: "bowler", moustache: "#2a1d16", seed: 12, skin: "#e9c3a0" });
  E.actor("r1", { shirt: "#f4f1ea", jacket: "#2f5f6a", hat: "tophat", hatCol: "#2f5f6a", moustache: "#c9a24a", seed: 14, skin: "#fbf5ea" });
  E.actor("r2", { shirt: "#f4f1ea", jacket: "#7b5ac9", hat: "fedora", seed: 16, skin: "#c98f66", beard: "#2a1d16" });
  E.actor("cust", { shirt: "#5d7a3a", pants: "#3b3f52", hat: "cap", hatCol: "#4a4f5a", seed: 19, skin: "#f0d0b0" });
  E.actor("kid", { shirt: "#3f6fb5", hair: "spiky", hairCol: "#7a4a2a", build: "kid", seed: 33, skin: "#f6dcc0" });
  const coats = ["#8c3b4a", "#3f6fb5", "#c2843a", "#3f8a6a"], hats = ["bowler", null, "tophat", null];
  for (let i = 0; i < 4; i++) { const woman = i % 2 === 1; E.actor("c" + i, { shirt: coats[i], dress: woman ? coats[(i + 2) % 4] : null, hair: woman ? (i === 1 ? "bun" : "long") : "short", hairCol: ["#2a1d16", "#7a4a2a", "#c9a24a", "#2a1d16"][i], hat: hats[i], seed: 60 + i * 7, skin: ["#fbf5ea", "#f6dcc0", "#e9c3a0", "#c98f66"][i], moustache: i === 2 ? "#3a2a20" : null }); }
}

const nameCard = (title, sub) => (g, w, h) => {
  const k = w / 1080, x = 70 * k, y = 1390 * k, pw = Math.max(430, 40 + title.length * 30) * k;
  g.save(); g.fillStyle = "rgba(20,14,24,.88)"; g.beginPath(); g.roundRect(x, y, pw, 112 * k, 22 * k); g.fill();
  g.fillStyle = "#e0352b"; g.fillRect(x, y, 10 * k, 112 * k);
  g.font = `900 ${44 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#fff"; g.textBaseline = "middle"; g.fillText(title, x + 34 * k, y + 40 * k);
  g.font = `700 ${30 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#ffb4a0"; g.fillText(sub, x + 34 * k, y + 82 * k); g.restore();
};
const yearCard = (txt, a) => (g, w, h) => {
  const k = w / 1080; g.save(); g.globalAlpha = a; g.font = `900 ${150 * k}px CizgiFont, Nunito, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.lineWidth = 18 * k; g.strokeStyle = "#2b2633"; g.strokeText(txt, w / 2, 360 * k); g.fillStyle = "#ffe066"; g.fillText(txt, w / 2, 360 * k); g.restore();
};

export function frame(f, E) {
  const X = E.X, sh = shotAt(f), t = sh.t, A = [], FX = [];
  const st = (seed, o = {}) => ({ blink: E.blink(f, seed), ...E.idle(f, seed), ...o });
  const pop = (f0, n = 8) => (f < f0 ? 0 : X.back(X.span(f, f0, f0 + n)));
  const show = (m, s) => { m.visible = s > 0.001; m.scale.setScalar(Math.max(0.001, s)); };
  const flashIn = (f0, n = 6) => Math.max(0, 1 - Math.abs(f - f0) / n);
  let cam, light = "interior", dof = { focus: 4, amount: 0 }, flash = 0, overlay = null, focusPt = null;

  // varsayılanlar
  R.claims.forEach((m) => show(m, 0)); show(R.laxTag, 0); show(R.closed, 0);
  R.tom.visible = true; R.tomSale.visible = true; R.pbSale.visible = false; R.pbBig.visible = false; R.paper.visible = true;
  R.rain.forEach((p) => (p.visible = false));
  R.rivalSigns.forEach((s) => { s.scale.setScalar(1); s.rotation.set(0, 0, 0); s.position.y = 2.25; s.visible = true; });
  R.pillA.position.set(2.75, 1.05, 1.65); R.pillB.position.set(2.75, 1.05, 1.65);
  R.squeeze.rotation.set(0, 0, 0); R.squeeze.position.set(DX - 0.25, 0.96, -0.95); show(R.blob, 0);

  switch (sh.name) {
    case "hook": {
      cam = E.camAt(f, [{ f: 0, pos: [0.05, 1.36, -0.45], look: [0, 1.25, -1.35], fov: 40 }, { f: 46, pos: [0.08, 1.37, -0.32], look: [0, 1.26, -1.35], fov: 40 }, { f: 99, pos: [0.3, 1.75, 1.4], look: [0, 1.5, -1.6], fov: 42 }]);
      dof = { focus: [0, 1.36, -1.35], amount: X.keyed(f, [[0, 10], [60, 10], [99, 4]]) };
      A.push({ id: "doc", pos: [-0.5, 0, -2.5], st: st(1, { face: "smug", arms: "present", look: 0.4 }) });
      FX.push({ kind: "sparkle", pos: [0.12, 1.62, -1.25], size: 0.25, t: t / 30 }, { kind: "sparkle", pos: [-0.1, 1.3, -1.25], size: 0.18, t: t / 30 + 0.5 });
      break;
    }
    case "doctor": {
      const x = X.keyed(f, [[100, 1.6], [138, -0.35]]); const walking = f < 136;
      A.push({ id: "doc", pos: [x, 0, -2.45], st: st(1, { legs: walking ? "walk" : "stand", phase: t / 22, face: walking ? "happy" : "smug", arms: walking ? "hang" : "hip", look: walking ? -0.5 : 0.3, talk: 0 }) });
      cam = E.camAt(f, [{ f: 100, pos: [0.4, 1.75, 1.6], look: [0.1, 1.6, -2.4], fov: 42 }, { f: 171, pos: [0.0, 1.75, 0.9], look: [-0.2, 1.7, -2.4], fov: 40 }]);
      dof = { focus: [x, 1.6, -2.45], amount: 5 };
      if (f >= 139) overlay = nameCard("Dr. John Cook Bennett", "Ohio, 1834");
      break;
    }
    case "claims": {
      const ws = [212, 241, 275];
      R.claims.forEach((m, i) => show(m, pop(ws[i] - 2)));
      A.push({ id: "doc", pos: [-0.38, 0, -2.45], st: st(1, { face: f < 205 ? "talk" : "determined", arms: f < 205 ? "present" : "point", look: 0.6, talk: E.talk(f, 172, 205) }) });
      ws.forEach((w, i) => { if (f >= w) FX.push({ kind: "check", pos: [0.68, 2.95 - i * 0.4, -1.85], size: 0.28 * pop(w + 2, 6) }); });
      cam = E.camAt(f, [{ f: 172, pos: [0.0, 1.95, 1.8], look: [0.0, 2.05, -2], fov: 46 }, { f: 302, pos: [0.0, 2.05, 1.4], look: [0.0, 2.1, -2], fov: 46 }]);
      dof = { focus: [0, 2, -2], amount: 3 };
      FX.push({ kind: "sparkle", pos: [0.32, 1.65, -1.3], size: 0.3, t: t / 30 });
      break;
    }
    case "laugh": {
      light = "day"; const LX = PX - 30;
      const q1 = f >= 337, q2 = f >= 364;
      const P = [[-1.0, -2.6], [-0.35, -3.2], [0.55, -2.5], [1.15, -3.3]];
      P.forEach(([x, z], i) => A.push({ id: "c" + i, pos: [LX + x, 0, z], st: st(10 + i, { face: q1 ? (i % 2 ? "think" : "laugh") : "laugh", arms: q1 ? (i % 2 ? "shrug" : "point") : ["point", "cheer", "point", "facepalm"][i], bob: q1 ? 0 : 10 * Math.abs(Math.sin(f / 4 + i)), look: x > 0.2 ? -0.6 : 0.6, talk: q1 ? 0 : 0.6 + 0.4 * Math.sin(f / 3 + i) }) }));
      if (q1) FX.push({ kind: "question", pos: [LX - 0.55, 2.45, -2.4], size: 0.38 * pop(337) });
      if (q2) FX.push({ kind: "question", pos: [LX + 0.6, 2.5, -2.4], size: 0.4 * pop(364) });
      cam = E.camAt(f, [{ f: 303, pos: [LX + 0.1, 1.9, 3.2], look: [LX + 0.1, 1.4, -3], fov: 46 }, { f: 336, pos: [LX + 0.1, 1.85, 2.6], look: [LX + 0.1, 1.45, -3], fov: 44 }, { f: 345, pos: [LX + 0.2, 1.7, 1.2], look: [LX + 0.2, 1.4, -3], fov: 42 }]);
      dof = { focus: [LX, 1.4, -2.9], amount: 5 }; focusPt = [LX, 0, -3];
      break;
    }
    case "recipes": {
      light = "day";
      const p = X.easeOut(X.span(f, 385, 405));
      R.paper.rotation.set(0, 0, (1 - p) * Math.PI * 5); R.paper.scale.setScalar(0.15 + 0.85 * p);
      R.paper.position.set(NX, 0.2 + 0.05 * Math.sin(t / 5), 0);
      cam = { pos: [NX, 0.2, 4.1 - 0.4 * X.smooth(X.span(f, 405, 453))], look: [NX, 0.2, 0], fov: 46, roll: 0 };
      if (f > 405) { const s = E.shake(f, 405, 0.05, 8); cam.pos = cam.pos.map((v, i) => v + s[i]); }
      flash = flashIn(405, 4) * 0.6;
      break;
    }
    case "salesman": {
      light = "day";
      const done = f >= 499;
      R.tomSale.visible = !done; R.pbSale.visible = done; if (done) R.pbSale.scale.setScalar(Math.max(0.01, pop(499)));
      A.push({ id: "sales", pos: [PX + 29.55, 0, -3.75], st: st(4, { face: done ? "grin" : "sly", arms: done ? "present" : f < 478 ? "hip" : "reach", look: 0.6, talk: done ? 0 : 0 }) });
      if (f >= 495 && f < 515) FX.push({ kind: "puff", pos: [PX + 30.3, 1.15, -2.9], size: 0.9, t: X.span(f, 495, 515) });
      if (done) FX.push({ kind: "sparkle", pos: [PX + 30.4, 1.4, -2.9], size: 0.4, t: (f - 499) / 30 });
      cam = E.camAt(f, [{ f: 454, pos: [PX + 30.6, 1.7, 0.4], look: [PX + 29.9, 1.4, -3.3], fov: 44 }, { f: 523, pos: [PX + 30.5, 1.6, -0.3], look: [PX + 30.0, 1.35, -3.2], fov: 42 }]);
      dof = { focus: [PX + 30, 1.3, -3.2], amount: 6 }; focusPt = [PX + 30, 0, -3];
      if (f >= 463 && f < 520) overlay = nameCard("A clever salesman", "1830s");
      break;
    }
    case "pills": {
      light = "day";
      R.paper.visible = false; R.pbBig.visible = true;
      const s = pop(524, 10); R.pbBig.scale.setScalar(Math.max(0.01, s)); R.pbBig.rotation.y = 0.25 * Math.sin(t / 10);
      R.rain.forEach((p, i) => { const ph = ((t / 30) * 1.3 + i * 0.137) % 1; p.visible = f >= 530; p.position.set(NX - 1.3 + ((i * 0.53) % 2.6), 2.6 - ph * 4.2, 0.9 + (i % 3) * 0.15); p.rotation.z = i + t / 6; });
      cam = { pos: [NX, 0.2, 4.0 - 0.3 * X.smooth(X.span(f, 524, 563))], look: [NX, 0.15, 0], fov: 46 };
      FX.push({ kind: "sparkle", pos: [NX + 0.9, 0.9, 0.9], size: 0.6, t: t / 30 }, { kind: "sparkle", pos: [NX - 0.9, -0.2, 0.9], size: 0.5, t: t / 30 + 0.4 });
      flash = flashIn(524, 4) * 0.5;
      break;
    }
    case "rivals": {
      light = "day";
      const ws = [572, 584, 599];
      R.rivalSigns.forEach((sg, i) => { const s = pop(ws[i] - 2, 9); sg.scale.setScalar(Math.max(0.01, s)); sg.visible = s > 0.01; });
      const sellers = [["sales", -1.35, -3.95], ["r1", 0, -6.95], ["r2", 1.35, -3.95]];
      sellers.forEach(([id, x, z], i) => A.push({ id, pos: [PX + x, 0, z], st: st(5 + i, { face: f >= ws[i] ? (f >= 623 ? "grin" : "talk") : "neutral", arms: f >= 623 ? ["present", "cheer", "point"][i] : f >= ws[i] ? "wave" : "hang", look: x > 0 ? -0.4 : 0.4, talk: f >= ws[i] && f < 623 ? E.talk(f, ws[i], 622) : 0 }) }));
      if (f >= 623) { FX.push({ kind: "money", pos: [PX, 2.0, -2.0], size: 1.4, t: (f - 623) / 30 }); FX.push({ kind: "stars", pos: [PX, 3.4, -5.5], size: 1.6, t: (f - 623) / 30 }); }
      cam = E.camAt(f, [{ f: 564, pos: [PX - 0.4, 2.4, 4.4], look: [PX, 1.5, -4.5], fov: 50 }, { f: 678, pos: [PX + 0.4, 2.2, 3.4], look: [PX, 1.6, -4.5], fov: 50 }]);
      dof = { focus: [PX, 1.6, -4.2], amount: 3, range: 4 }; focusPt = [PX, 0, -4];
      break;
    }
    case "inside": {
      light = "dramatic";
      const sp = X.easeOut(X.span(f, 703, 716));
      R.pillA.position.x = 2.75 - 0.09 * sp; R.pillB.position.x = 2.75 + 0.09 * sp;
      const no = f >= 747;
      A.push({ id: "cust", pos: [2.85, 0, 0.45], st: st(9, { face: no ? "shock" : f >= 703 ? "think" : "neutral", arms: no ? "up" : "holdR", prop: no ? null : { kind: "magnifier", hand: "r" }, look: -0.7, lean: no ? 0 : 6 }) });
      if (f >= 703 && f < 747) FX.push({ kind: "question", pos: [2.75, 1.55, 1.75], size: 0.25 * pop(705) });
      if (no) FX.push({ kind: "cross", pos: [2.75, 1.4, 1.75], size: 0.35 * pop(749) });
      cam = E.camAt(f, [{ f: 679, pos: [2.7, 1.5, 3.6], look: [2.72, 1.35, 1.4], fov: 42 }, { f: 746, pos: [2.72, 1.45, 3.1], look: [2.74, 1.3, 1.4], fov: 40 }, { f: 760, pos: [2.72, 1.55, 3.5], look: [2.75, 1.45, 1.2], fov: 42 }]);
      if (no) { const s = E.shake(f, 749, 0.04, 10); cam.pos = cam.pos.map((v, i) => v + s[i]); }
      dof = { focus: f < 747 ? [2.75, 1.05, 1.65] : [2.9, 1.4, 1.1], amount: 7 }; focusPt = [2.6, 0, 1.4];
      break;
    }
    case "lax": {
      light = "dramatic";
      R.pillA.position.x = 2.66; R.pillB.position.x = 2.84;
      show(R.laxTag, pop(798, 6));
      A.push({ id: "cust", pos: [2.85, 0, 0.45], st: st(9, { face: "scared", arms: "facepalm", look: -0.5, sweat: true, blush: true }) });
      FX.push({ kind: "sweat", pos: [3.1, 2.2, 0.9], size: 0.3 }, { kind: "exclaim", pos: [2.2, 1.6, 1.9], size: 0.3 * pop(800) });
      cam = { pos: [2.4, 1.5, 3.6], look: [2.45, 1.4, 1.4], fov: 46 };
      { const s = E.shake(f, 798, 0.05, 12); cam.pos = cam.pos.map((v, i) => v + s[i]); }
      dof = { focus: [2.5, 1.3, 1.6], amount: 5 };
      break;
    }
    case "dead": {
      light = "golden";
      flash = flashIn(818, 6);
      overlay = yearCard("1850", Math.min(1, X.span(f, 820, 830)) * (1 - X.span(f, 880, 895)));
      R.rivalSigns.forEach((sg, i) => { sg.rotation.z = [0.5, -0.3, 0][i]; sg.position.y = [1.7, 2.0, 2.25][i]; });
      const fall = X.span(f, 885, 896); R.rivalSigns[2].rotation.z = -1.4 * fall * fall; R.rivalSigns[2].position.y = 2.25 - 1.5 * fall * fall;
      show(R.closed, 1);
      A.push({ id: "sales", pos: [PX - 1.4, 0, -2.6], st: st(4, { legs: "sit", face: "sad", arms: "chin", look: 0.3 }) });
      if (f >= 892) FX.push({ kind: "dust", pos: [PX + 1.35, 0.6, -3.3], size: 1.0, t: X.span(f, 892, 905) });
      cam = E.camAt(f, [{ f: 818, pos: [PX - 0.3, 2.4, 3.6], look: [PX, 1.3, -4], fov: 50 }, { f: 905, pos: [PX - 0.1, 2.1, 2.6], look: [PX, 1.3, -4], fov: 48 }]);
      dof = { focus: [PX, 1.3, -3.4], amount: 3, range: 4 }; focusPt = [PX, 0, -4];
      break;
    }
    case "fries": {
      light = "interior";
      const tilt = X.smooth(X.span(f, 936, 948)) * (1 - X.smooth(X.span(f, 962, 974)));
      R.squeeze.rotation.z = -2.2 * tilt; R.squeeze.position.set(DX - 0.25 + 0.3 * tilt, 0.96 + 0.42 * tilt, -0.98);
      show(R.blob, X.easeOut(X.span(f, 946, 962)));
      const happy = f >= 958;
      A.push({ id: "kid", pos: [DX - 0.1, 0.4, -1.95], st: st(3, { face: happy ? "grin" : f >= 914 ? "think" : "happy", arms: happy ? "cheer" : "hang", look: 0.4, bob: happy ? 8 * Math.abs(Math.sin(f / 5)) : 0 }) });
      if (f >= 914 && f < 936) FX.push({ kind: "question", pos: [DX + 0.45, 1.9, -1.6], size: 0.3 * pop(914) });
      if (happy) FX.push({ kind: "sparkle", pos: [DX + 0.2, 1.4, -0.9], size: 0.35, t: (f - 958) / 30 }, { kind: "hearts", pos: [DX + 0.35, 2.0, -1.7], size: 0.35, t: (f - 958) / 30 });
      cam = E.camAt(f, [{ f: 906, pos: [DX + 0.1, 1.75, 1.4], look: [DX, 1.25, -1.4], fov: 42 }, { f: 958, pos: [DX + 0.1, 1.55, 0.4], look: [DX + 0.05, 1.15, -1.2], fov: 40 }, { f: 1008, pos: [DX + 0.12, 1.5, 0.1], look: [DX + 0.08, 1.2, -1.2], fov: 38 }]);
      dof = { focus: [DX + 0.1, 1.1, -1.0], amount: 6 };
      flash = flashIn(906, 5) * 0.5;
      break;
    }
  }
  return { cam, light, dof, actors: A, fx: FX, flash, overlay, focusPt };
}
