// In Japan, you can't be fired — cizgi-short (70,6 sn)
export const meta = { fps: 30 };

const SHOTS = [[0, "hook"], [85, "cant"], [130, "tanaka"], [220, "decides"], [307, "law"], [475, "reasons"], [652, "sowhat"],
  [703, "boreout"], [780, "emptyroom"], [889, "nothing"], [977, "name"], [1104, "clock"], [1192, "window"], [1265, "goal"],
  [1304, "bored"], [1391, "otherside"], [1514, "tears"], [1581, "team"], [1660, "pay"], [1723, "agency"], [1772, "call"],
  [1807, "bosscall"], [1846, "year"], [1979, "guess"], [2011, "hired"], [2083, "yeah"]];
const END = 2140;
const shotAt = (f) => { let i = 0; while (i < SHOTS.length - 1 && f >= SHOTS[i + 1][0]) i++; return { i, name: SHOTS[i][1], f0: SHOTS[i][0], f1: (SHOTS[i + 1] || [END])[0], t: f - SHOTS[i][0] }; };

const NX = 400, RX = -200, CX = -400, AX = 200, BX = 300;
const TD = [1.4, -1.2];          // Tanaka'nın ofis masası
const BD = [-3.6, -1.7];         // patron masası
const ED = [RX - 0.3, -1.4];     // boş odadaki masa
let R = {};

function popSign(E, T, text, w, h, pos, o = {}) {
  const m = E.label(T.sign(text, { bg: o.bg || "#fbf3dc", fg: o.fg || "#2b2633", border: o.border === undefined ? "#2b2633" : o.border, size: o.size || 150, sub: o.sub || null, subSize: o.subSize || 60 }), w, h, pos, o);
  m.castShadow = false; m.visible = false; return m;
}

function burstTex(E, a, b) {
  const { THREE } = E, bc = document.createElement("canvas"); bc.width = bc.height = 1024; const bg = bc.getContext("2d");
  bg.fillStyle = a; bg.fillRect(0, 0, 1024, 1024); bg.fillStyle = b;
  for (let i = 0; i < 24; i++) { const an = (i / 24) * Math.PI * 2; bg.beginPath(); bg.moveTo(512, 512); bg.lineTo(512 + 1100 * Math.cos(an), 512 + 1100 * Math.sin(an)); bg.lineTo(512 + 1100 * Math.cos(an + 0.13), 512 + 1100 * Math.sin(an + 0.13)); bg.fill(); }
  const t = new THREE.CanvasTexture(bc); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function laptop(E, pos) {
  const g = E.group(null, pos);
  E.box(0.46, 0.025, 0.32, E.mat("#3a3f4a"), [0, 0, 0], { parent: g });
  const s = E.box(0.46, 0.3, 0.02, E.mat("#3a3f4a"), [0, 0.025, -0.16], { parent: g }); s.rotation.x = 0.2;
  return g;
}

function phone(E, pos) {
  const g = E.group(null, pos);
  E.box(0.26, 0.07, 0.2, E.mat("#2b2f3a"), [0, 0, 0], { parent: g });
  E.box(0.28, 0.05, 0.07, E.mat("#2b2f3a"), [0, 0.08, -0.03], { parent: g });
  return g;
}

function office(E, T, S, x0, o) {
  // genel ofis odası (iç mekân, ön açık)
  S.room({ x: x0, w: o.w || 12, d: o.d || 9, h: 3.6, wall: o.wall, floor: o.floor, floorRep: 0.3, window: o.window !== false, door: false });
}

function clock(E, pos) {
  const g = E.group(null, pos);
  E.cyl(0.42, 0.42, 0.05, E.mat("#2b2633"), [0, 0, -0.02], { rot: [Math.PI / 2, 0, 0], center: true, parent: g });
  E.cyl(0.37, 0.37, 0.06, E.mat("#fbf8ef"), [0, 0, 0], { rot: [Math.PI / 2, 0, 0], center: true, parent: g });
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const tk = E.box(0.025, i % 3 ? 0.05 : 0.09, 0.01, E.mat("#2b2633"), [Math.sin(a) * 0.3, Math.cos(a) * 0.3, 0.035], { center: true, parent: g }); tk.rotation.z = -a; }
  const hh = E.group(g, [0, 0, 0.045]), mh = E.group(g, [0, 0, 0.055]);
  E.box(0.04, 0.2, 0.012, E.mat("#2b2633"), [0, 0.09, 0], { center: true, parent: hh });
  E.box(0.025, 0.29, 0.012, E.mat("#b8262e"), [0, 0.13, 0], { center: true, parent: mh });
  E.sphere(0.03, E.mat("#2b2633"), [0, 0, 0.065], { parent: g });
  return { g, hh, mh };
}

export function build(E) {
  const { S, T, THREE } = E;

  // ---- OFİS (x = 0) ----
  office(E, T, S, 0, { wall: T.wallpaper("#e9eef2", "#dfe6ec", "stripe"), floor: T.carpet("#7d8794") });
  E.label(T.sign("BIG COMPANY INC.", { bg: "#2b2633", fg: "#ffffff", border: null, size: 150 }), 2.4, 0.5, [1.6, 3.0, -4.46]);
  // Tanaka masası
  S.desk(TD[0], TD[1], { col: "#c9ccd2" }); S.chair(TD[0] - 0.2, TD[1] - 0.85, { col: "#2f4a6a" });
  laptop(E, [TD[0] + 0.55, 0.95, TD[1] + 0.05]);
  E.box(0.3, 0.02, 0.4, E.mat("#fbf8ef"), [TD[0] - 0.5, 0.95, TD[1] + 0.1]);
  // arka masalar + iş arkadaşları
  for (const [x, z] of [[-1.0, -2.6], [2.6, -3.1], [0.4, -3.4]]) { S.desk(x, z, { col: "#c9ccd2" }); laptop(E, [x - 0.25, 0.95, z + 0.05]); }
  // beyaz tahta
  E.box(2.5, 1.5, 0.05, E.mat("#9aa3ad"), [-2.4, 0.85, -4.47]);
  E.box(2.36, 1.36, 0.05, E.mat("#ffffff"), [-2.4, 0.92, -4.44]);
  R.unprod = popSign(E, T, "UNPRODUCTIVE", 1.2, 0.32, [-2.35, 1.9, -4.38], { bg: "#fff3a8", size: 140 });
  R.downs = popSign(E, T, "DOWNSIZING", 1.2, 0.32, [-2.35, 1.4, -4.38], { bg: "#cfe9ff", size: 140 });
  // patron masası
  S.desk(BD[0], BD[1], { col: "#6b4428" }); phone(E, [BD[0] - 0.55, 0.95, BD[1] + 0.15]);
  E.label(T.sign("BOSS", { bg: "#e8c45a", fg: "#2b2633", size: 170 }), 0.45, 0.17, [BD[0] - 0.1, 1.1, BD[1] + 0.56]);
  S.shelf(-5.0, -4.1, { seed: 5 });
  // yırtılan mektup parçaları
  R.bits = []; for (let i = 0; i < 12; i++) { const p = E.plane(0.09, 0.11, E.flat("#fbf8ef", { side: THREE.DoubleSide }), [0, -5, 0], { noShadow: true }); R.bits.push(p); }

  // ---- HUKUK insert (x = 400) ----
  E.plane(30, 30, E.flat("#ffffff", { map: burstTex(E, "#cfe0ff", "#b8cff7"), fog: false }), [NX, 0, -6], { noink: true, noShadow: true });
  R.book = E.group(null, [NX, 0.55, 0]);
  E.box(1.75, 1.25, 0.25, E.mat("#7a2a2a"), [0, 0, -0.14], { parent: R.book, center: true });
  E.box(1.62, 1.12, 0.06, E.mat("#f4ecd6"), [0, 0, 0], { parent: R.book, center: true });
  { const m = E.label(T.sign("JAPANESE\nLABOR LAW", { bg: "#f4ecd6", fg: "#7a2a2a", border: "#7a2a2a", size: 170, sub: "No just cause = no firing", subSize: 64 }), 1.5, 1.0, [0, 0, 0.035], { parent: R.book }); m.castShadow = false; }
  R.gavel = E.group(null, [NX + 0.35, -0.6, 0.9]);
  E.cyl(0.32, 0.36, 0.12, E.mat("#6b4428"), [0, -0.12, 0], { parent: R.gavel });
  R.gArm = E.group(R.gavel, [0.75, 0.05, 0]);
  E.box(0.9, 0.06, 0.06, E.mat("#8a5a36"), [-0.45, 0.2, 0], { center: true, parent: R.gArm });
  E.cyl(0.13, 0.13, 0.42, E.mat("#6b4428"), [-0.9, 0.2, 0], { center: true, parent: R.gArm, seg: 18 });
  R.stamp = popSign(E, T, "INVALID", 1.25, 0.43, [NX, 0.5, 0.4], { bg: "#ffffff", fg: "#d4202a", border: "#d4202a", size: 190, lit: false });

  // ---- BOŞ ODA (x = -200) ----
  S.room({ x: RX, w: 6, d: 6, h: 3.4, wall: T.plaster("#d6d1c6"), floor: T.tiles("#cfcac0", "#bdb7ab", 8), floorRep: 0.35, window: true, door: false });
  S.table(ED[0], ED[1], { w: 1.4, d: 0.8, h: 0.75, col: "#8c8f96" }); S.chair(ED[0] - 0.25, ED[1] - 0.7, { col: "#6c7078" });
  R.clk = clock(E, [RX - 1.5, 2.55, -2.95]);
  R.noSigns = [
    popSign(E, T, "NO COMPUTER", 0.8, 0.26, [ED[0] + 0.62, 2.0, ED[1] + 0.2], { bg: "#ffffff" }),
    popSign(E, T, "NO PHONE", 0.8, 0.26, [ED[0] + 0.62, 1.68, ED[1] + 0.2], { bg: "#ffffff" }),
    popSign(E, T, "NO WORK", 0.8, 0.26, [ED[0] + 0.62, 1.36, ED[1] + 0.2], { bg: "#ffffff" }),
  ];
  R.letter = E.plane(0.3, 0.4, E.mat("#fbf8ef", { side: THREE.DoubleSide }), [ED[0] + 0.25, 0.752, ED[1] + 0.1], { rot: [-Math.PI / 2, 0, 0.2], noShadow: true });
  { const m = E.label(T.sign("RESIGNATION", { bg: "#fbf8ef", fg: "#2b2633", border: null, size: 120 }), 0.28, 0.1, [ED[0] + 0.25, 0.756, ED[1] + 0.02], { rot: [-Math.PI / 2, 0, 0.2] }); m.castShadow = false; R.letterTxt = m; }

  // ---- KORİDOR (x = -400) ----
  E.ground(T.tiles("#cfcac0", "#bdb7ab", 8), 40, 0.35, [CX, 0, 0]);
  { const wt = T.plaster("#c9d2d6").clone(); wt.needsUpdate = true; wt.repeat.set(4, 1); E.plane(16, 3.8, E.mat("#ffffff", { map: wt }), [CX, 1.9, -2.1]); }
  S.door(CX, -2.06, { col: "#8c8f96" });
  E.box(16, 0.15, 0.05, E.mat("#8a8f96"), [CX, 0, -2.06]);
  R.plate = popSign(E, T, "OIDASHI-BEYA", 1.7, 0.45, [CX, 2.95, -2.02], { bg: "#2b2633", fg: "#ffffff", border: "#e8c45a", size: 150 });
  R.plateSub = popSign(E, T, "= firing room", 1.3, 0.3, [CX + 0.15, 2.48, -2.0], { bg: "#fff3a8", fg: "#b8262e", border: "#b8262e", size: 130 });
  S.window(CX + 3.0, 1.0, -2.05, {}); S.window(CX - 3.0, 1.0, -2.05, {});

  // ---- AJANS (x = 200) ve İKİNCİ AJANS (x = 300) ----
  const agency = (x0, wallA, wallB, title, sub, col) => {
    S.room({ x: x0, w: 8, d: 7, h: 3.5, wall: T.wallpaper(wallA, wallB, "dots"), floor: T.planks("#b9824f"), floorRep: 0.35, window: false, door: false });
    S.desk(x0 + 0.3, -1.2, { col: "#f4f1ea" }); phone(E, [x0 - 0.3, 0.95, -1.05]);
    const sg = popSign(E, T, title, 3.2, 1.0, [x0, 2.55, -3.45], { bg: "#ffffff", fg: col, border: col, size: 140, sub, subSize: 58 });
    sg.visible = true; return sg;
  };
  R.agSign = agency(AX, "#e3f2ee", "#cde7e0", "RESIGNATION\nAGENCY", "We quit for you!", "#1f7a6a");
  R.ag2Sign = agency(BX, "#efe6fa", "#e0d2f5", "ANOTHER\nRESIGNATION AGENCY", "We quit for quitters!", "#6a3fb8");
  R.stack = [];
  for (let i = 0; i < 3; i++) for (let k = 0; k < 6 + i * 2; k++) R.stack.push(E.box(0.3, 0.035, 0.4, E.mat(k % 2 ? "#fbf8ef" : "#f0ebdc"), [AX - 0.35 + i * 0.33, 0.95 + k * 0.036, -1.1 + (k % 2) * 0.01]));
  R.stack.forEach((m) => (m.visible = false));

  // ---- karakterler ----
  E.actor("tanaka", { skin: "#f0d0b0", shirt: "#f4f1ea", jacket: "#3b4a63", tie: "#2f5fb0", pants: "#3b4a63", hair: "part", hairCol: "#1f1a1a", glasses: true, seed: 7 });
  E.actor("boss", { skin: "#efc9a6", shirt: "#f4f1ea", jacket: "#2b2633", tie: "#b8262e", pants: "#2b2633", hair: "short", hairCol: "#9a9a9a", moustache: "#8a8a8a", glasses: true, build: "stout", seed: 11 });
  E.actor("c1", { skin: "#f6dcc0", shirt: "#f4f1ea", jacket: "#5a6a7a", tie: "#3f8a6a", hair: "spiky", hairCol: "#2a1d16", seed: 15 });
  E.actor("c2", { skin: "#f0d0b0", shirt: "#f4f1ea", jacket: "#8c3b4a", dress: "#8c3b4a", hair: "long", hairCol: "#1f1a1a", seed: 18 });
  E.actor("yuki", { skin: "#f6dcc0", shirt: "#f4f1ea", jacket: "#2f4a6a", dress: "#2f4a6a", hair: "bun", hairCol: "#2a1d16", seed: 23 });
  E.actor("agent", { skin: "#efc9a6", shirt: "#f4f1ea", jacket: "#1f7a6a", tie: "#e8c45a", hair: "spiky", hairCol: "#3a2a20", seed: 27 });
  E.actor("agent2", { skin: "#f0d0b0", shirt: "#f4f1ea", jacket: "#6a3fb8", dress: "#6a3fb8", hair: "long", hairCol: "#7a4a2a", glasses: true, seed: 31 });
}

const nameCard = (title, sub) => (g, w, h) => {
  const k = w / 1080, x = 70 * k, y = 1390 * k, pw = Math.max(470, 60 + Math.max(title.length * 27, sub.length * 17)) * k;
  g.save(); g.fillStyle = "rgba(20,14,24,.88)"; g.beginPath(); g.roundRect(x, y, pw, 112 * k, 22 * k); g.fill();
  g.fillStyle = "#d4202a"; g.fillRect(x, y, 10 * k, 112 * k);
  g.font = `900 ${44 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#fff"; g.textBaseline = "middle"; g.fillText(title, x + 34 * k, y + 40 * k);
  g.font = `700 ${30 * k}px CizgiFont, Nunito, sans-serif`; g.fillStyle = "#ffb4a0"; g.fillText(sub, x + 34 * k, y + 82 * k); g.restore();
};
const bigCard = (txt, a, col = "#ffe066") => (g, w, h) => {
  const k = w / 1080; g.save(); g.globalAlpha = a; g.font = `900 ${150 * k}px CizgiFont, Nunito, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.lineWidth = 18 * k; g.strokeStyle = "#2b2633"; g.strokeText(txt, w / 2, 1650 * k); g.fillStyle = col; g.fillText(txt, w / 2, 1650 * k); g.restore();
};

export function frame(f, E) {
  const X = E.X, sh = shotAt(f), t = sh.t, A = [], FX = [];
  const st = (seed, o = {}) => ({ blink: E.blink(f, seed), ...E.idle(f, seed), ...o });
  const pop = (f0, n = 8) => (f < f0 ? 0 : X.back(X.span(f, f0, f0 + n)));
  const show = (m, s) => { m.visible = s > 0.001; m.scale.setScalar(Math.max(0.001, s)); };
  const flashIn = (f0, n = 6) => Math.max(0, 1 - Math.abs(f - f0) / n);
  const shake = (cam, f0, amp, dur) => { if (f >= f0) { const s = E.shake(f, f0, amp, dur); cam.pos = cam.pos.map((v, i) => v + s[i]); } return cam; };
  let cam, light = "interior", dof = { focus: 4, amount: 0 }, flash = 0, overlay = null, focusPt = null;

  // varsayılanlar
  show(R.unprod, 0); show(R.downs, 0); show(R.stamp, 0); show(R.plate, 0); show(R.plateSub, 0);
  R.noSigns.forEach((m) => show(m, 0));
  R.bits.forEach((p) => (p.visible = false));
  R.stack.forEach((m) => (m.visible = false));
  R.letter.visible = false; R.letterTxt.visible = false;
  R.book.scale.setScalar(1); R.gArm.rotation.z = 0;
  R.agSign.scale.setScalar(1); show(R.ag2Sign, 1);
  // saat: 9:00 → 17:00 (1104–1264), sonra 17:00'de durur
  { const hrs = 9 + 8 * X.smooth(X.span(f, 1104, 1264)); R.clk.hh.rotation.z = -((hrs % 12) / 12) * Math.PI * 2; R.clk.mh.rotation.z = -(hrs % 1) * Math.PI * 2; }

  // Tanaka ofis masasında (oturur)
  const tanakaDesk = (o = {}) => ({ id: "tanaka", pos: [TD[0] - 0.05, 0, TD[1] - 0.75], st: st(2, { ...o }) });
  const bossAtDesk = (o = {}) => ({ id: "boss", pos: [BD[0] + 0.2, 0, BD[1] - 0.75], st: st(1, o) });
  const tanakaRoom = (o = {}) => ({ id: "tanaka", pos: [ED[0] - 0.25, 0, ED[1] - 0.65], st: st(2, { legs: "sit", ...o }) });

  switch (sh.name) {
    case "hook": {
      const angry = f >= 55;
      A.push({ id: "boss", pos: [0.15, 0, -0.5], st: st(1, { face: angry ? "angry" : "smug", arms: angry ? "point" : "hold", prop: { kind: "paper", hand: "l", text: "FIRED" }, look: 0.7, talk: E.talk(f, 18, 80) * 0.8 }) });
      A.push(tanakaDesk({ face: f >= 62 ? "nervous" : "neutral", arms: "hang", look: -0.6, sweat: f >= 62 }));
      if (f >= 61) FX.push({ kind: "exclaim", pos: [TD[0] - 0.2, 1.95, TD[1] - 0.6], size: 0.3 * pop(61) });
      cam = E.camAt(f, [{ f: 0, pos: [0.1, 1.6, 1.6], look: [0.15, 1.45, -0.5], fov: 40 }, { f: 30, pos: [0.12, 1.62, 1.8], look: [0.15, 1.6, -0.5], fov: 40 }, { f: 84, pos: [0.7, 1.85, 3.0], look: [0.75, 1.35, -1.2], fov: 44 }]);
      dof = { focus: f < 40 ? [0.15, 1.6, -0.5] : [0.7, 1.4, -1.2], amount: f < 40 ? 7 : 4 };
      focusPt = [0.7, 0, -1.2];
      break;
    }
    case "cant": {
      const no = f >= 106;
      A.push({ id: "boss", pos: [0.15, 0, -0.5], st: st(1, { face: no ? "shock" : "angry", arms: no ? "shrug" : "point", prop: no ? null : { kind: "paper", hand: "l", text: "FIRED" }, look: 0.5, sweat: no }) });
      A.push(tanakaDesk({ face: no ? "happy" : "nervous", arms: no ? "cheer" : "hang", look: -0.6 }));
      if (no) FX.push({ kind: "cross", pos: [-0.05, 1.25, -0.25], size: 0.3 * pop(106) });
      cam = { pos: [0.75, 1.8, 3.1 - 0.4 * X.smooth(X.span(f, 85, 129))], look: [0.75, 1.3, -1.2], fov: 44 };
      shake(cam, 106, 0.04, 10);
      dof = { focus: [0.5, 1.4, -1.0], amount: 4 }; focusPt = [0.7, 0, -1.2];
      break;
    }
    case "tanaka": {
      A.push(tanakaDesk({ face: "happy", arms: [[30 + 6 * Math.sin(f / 3), 70], [30 + 6 * Math.cos(f / 3), 70]], look: 0.2 }));
      A.push({ id: "c1", pos: [-1.0, 0, -3.35], st: st(5, { legs: "sit", face: "neutral", arms: [[30, 70], [30, 70]], look: 0.3 }) });
      if (f >= 139) overlay = nameCard("Mr. Tanaka", "20 years at the same company");
      if (f >= 188) FX.push({ kind: "sparkle", pos: [TD[0] + 0.3, 1.9, TD[1] - 0.5], size: 0.35, t: (f - 188) / 30 });
      cam = E.camAt(f, [{ f: 130, pos: [TD[0], 1.7, 1.6], look: [TD[0], 1.35, TD[1] - 0.7], fov: 42 }, { f: 219, pos: [TD[0] - 0.05, 1.65, 1.0], look: [TD[0] - 0.05, 1.4, TD[1] - 0.7], fov: 40 }]);
      dof = { focus: [TD[0] - 0.2, 1.2, TD[1] - 0.7], amount: 6 }; focusPt = [TD[0], 0, TD[1]];
      break;
    }
    case "decides": {
      light = "golden";
      const point = f >= 252, go = f >= 288;
      A.push({ id: "boss", pos: [-0.45, 0, -0.2], st: st(1, { face: go ? "angry" : point ? "sly" : "think", arms: go ? "point" : point ? "point" : "chin", look: 0.8 }) });
      A.push(tanakaDesk({ face: "happy", arms: [[30 + 6 * Math.sin(f / 3), 70], [30 + 6 * Math.cos(f / 3), 70]], look: 0.2 }));
      if (go) FX.push({ kind: "anger", pos: [-0.2, 2.0, -0.1], size: 0.3 * pop(290) });
      cam = E.camAt(f, [{ f: 220, pos: [-0.2, 1.75, 3.0], look: [0.5, 1.4, -1.2], fov: 46 }, { f: 306, pos: [-0.15, 1.75, 2.6], look: [0.5, 1.4, -1.2], fov: 46 }]);
      dof = { focus: point ? [-0.45, 1.6, -0.2] : [TD[0] - 0.2, 1.3, TD[1] - 0.7], amount: 7 }; focusPt = [0.4, 0, -0.8];
      break;
    }
    case "law": {
      light = "day";
      const bp = X.easeOut(X.span(f, 307, 320)); R.book.scale.setScalar(Math.max(0.01, 0.2 + 0.8 * bp)); R.book.rotation.z = (1 - bp) * 0.6;
      R.book.position.y = 0.55 + 0.03 * Math.sin(t / 8);
      const up = X.smooth(X.span(f, 420, 438)), down = X.span(f, 441, 447);
      R.gArm.rotation.z = -0.9 * up * (1 - down * down);
      show(R.stamp, pop(449, 6)); R.stamp.rotation.z = 0.12;
      if (f >= 404 && f < 445) FX.push({ kind: "question", pos: [NX + 0.75, 1.35, 0.4], size: 0.4 * pop(404) });
      if (f >= 447) FX.push({ kind: "burst", pos: [NX - 0.1, -0.45, 1.0], size: 0.8 * pop(447, 5), opt: {} });
      cam = { pos: [NX, 0.4, 5.0 - 0.5 * X.smooth(X.span(f, 307, 474))], look: [NX, 0.3, 0], fov: 46 };
      shake(cam, 447, 0.06, 10);
      flash = flashIn(447, 4) * 0.5;
      break;
    }
    case "reasons": {
      const u = f >= 489, ux = f >= 509, d = f >= 601, dx = f >= 620;
      show(R.unprod, pop(489)); show(R.downs, pop(601));
      if (ux) FX.push({ kind: "cross", pos: [-1.72, 1.9, -4.3], size: 0.25 * pop(509) });
      if (dx) FX.push({ kind: "cross", pos: [-1.72, 1.4, -4.3], size: 0.25 * pop(620) });
      const annoyed = (ux && !d) || dx;
      A.push({ id: "boss", pos: [-1.4, 0, -3.5], st: st(1, { face: annoyed ? "angry" : "talk", arms: annoyed ? "cross" : "point", look: -0.8, talk: annoyed ? 0 : E.talk(f, 475, 640) }) });
      if (annoyed) FX.push({ kind: "anger", pos: [-1.15, 2.25, -3.4], size: 0.25 });
      cam = E.camAt(f, [{ f: 475, pos: [-1.95, 1.75, 0.4], look: [-1.95, 1.55, -4.3], fov: 46 }, { f: 651, pos: [-1.95, 1.75, 0.0], look: [-1.95, 1.55, -4.3], fov: 46 }]);
      dof = { focus: [-1.7, 1.6, -4.0], amount: 2 }; focusPt = [-1.6, 0, -3.8];
      break;
    }
    case "sowhat": {
      show(R.unprod, 1); show(R.downs, 1);
      A.push({ id: "boss", pos: [-0.85, 0, -3.5], st: st(1, { face: "think", arms: "chin", look: 0.2 }) });
      if (f >= 662) FX.push({ kind: "question", pos: [-0.45, 2.3, -3.4], size: 0.3 * pop(662) });
      cam = E.camAt(f, [{ f: 652, pos: [-0.9, 1.75, -1.6], look: [-0.9, 1.65, -3.5], fov: 40 }, { f: 702, pos: [-0.9, 1.72, -1.9], look: [-0.9, 1.65, -3.5], fov: 40 }]);
      dof = { focus: [-0.85, 1.6, -3.5], amount: 8 };
      break;
    }
    case "boreout": {
      light = f >= 746 ? "dramatic" : "interior";
      show(R.unprod, 1); show(R.downs, 1);
      const idea = f >= 752;
      A.push({ id: "boss", pos: [-0.85, 0, -3.5], st: st(1, { face: idea ? "sly" : "think", arms: idea ? "up" : "chin", look: 0.0 }) });
      if (idea) FX.push({ kind: "idea", pos: [-0.85, 2.45, -3.4], size: 0.4 * pop(752) });
      cam = E.camAt(f, [{ f: 703, pos: [-0.9, 1.75, -1.9], look: [-0.9, 1.7, -3.5], fov: 40 }, { f: 779, pos: [-0.88, 1.95, -1.5], look: [-0.88, 2.05, -3.5], fov: 44 }]);
      dof = { focus: [-0.85, 1.7, -3.5], amount: 8 };
      break;
    }
    case "emptyroom": {
      const x = X.keyed(f, [[780, RX + 2.4], [832, RX + 0.6]]), walking = f < 830;
      A.push({ id: "tanaka", pos: [x, 0, -0.9], st: st(2, { legs: walking ? "walk" : "stand", phase: t / 20, face: walking ? "neutral" : "nervous", arms: walking ? "hang" : "hang", prop: { kind: "briefcase", hand: "r" }, look: walking ? -0.6 : -0.3 }) });
      if (f >= 853) FX.push({ kind: "sparkle", pos: [ED[0], 1.25, ED[1] + 0.2], size: 0.35, t: (f - 853) / 30 });
      if (f >= 869) FX.push({ kind: "sparkle", pos: [ED[0] - 0.25, 1.15, ED[1] - 0.7], size: 0.3, t: (f - 869) / 30 });
      if (f >= 812 && f < 850) FX.push({ kind: "lines", pos: [RX - 1.6, 1.8, -2.6], size: 0.6, t: X.span(f, 812, 850) });
      cam = E.camAt(f, [{ f: 780, pos: [RX + 0.1, 2.3, 4.2], look: [RX, 1.2, -1.6], fov: 52 }, { f: 888, pos: [RX - 0.1, 2.0, 3.3], look: [RX - 0.1, 1.15, -1.6], fov: 50 }]);
      dof = { focus: [RX, 1.2, -1.3], amount: 2, range: 4 }; focusPt = [RX, 0, -1.4];
      break;
    }
    case "nothing": {
      const ws = [889, 920, 947];
      R.noSigns.forEach((m, i) => show(m, pop(ws[i])));
      ws.forEach((w, i) => { if (f >= w + 7) FX.push({ kind: "cross", pos: [ED[0] + 1.05, 2.0 - i * 0.32, ED[1] + 0.25], size: 0.17 * pop(w + 7, 6) }); });
      const k = ws.filter((w) => f >= w).length;
      A.push(tanakaRoom({ face: k >= 3 ? "sad" : "nervous", arms: k >= 3 ? "shrug" : "hang", look: k % 2 ? 0.7 : -0.5 }));
      cam = E.camAt(f, [{ f: 889, pos: [ED[0] + 0.3, 1.75, 2.7], look: [ED[0] + 0.3, 1.4, ED[1] - 0.3], fov: 44 }, { f: 976, pos: [ED[0] + 0.3, 1.72, 2.3], look: [ED[0] + 0.3, 1.4, ED[1] - 0.3], fov: 44 }]);
      dof = { focus: [ED[0] + 0.3, 1.5, ED[1]], amount: 4 }; focusPt = [ED[0], 0, ED[1]];
      break;
    }
    case "name": {
      light = "interior";
      show(R.plate, pop(1007, 8)); show(R.plateSub, pop(1064, 8));
      A.push({ id: "boss", pos: [CX + 1.15, 0, -1.4], st: st(1, { face: f >= 1064 ? "grin" : "smug", arms: "present", look: -0.8 }) });
      cam = E.camAt(f, [{ f: 977, pos: [CX + 0.4, 1.7, 3.6], look: [CX + 0.3, 1.8, -2], fov: 46 }, { f: 1040, pos: [CX + 0.2, 2.3, 1.6], look: [CX + 0.1, 2.6, -2], fov: 44 }, { f: 1103, pos: [CX + 0.2, 2.25, 1.3], look: [CX + 0.1, 2.6, -2], fov: 44 }]);
      flash = flashIn(977, 4) * 0.4;
      dof = { focus: [CX, 2.5, -2], amount: 3 }; focusPt = [CX, 0, -1.6];
      break;
    }
    case "clock": {
      light = ["interior", "golden", X.span(f, 1104, 1264)];
      A.push(tanakaRoom({ face: "neutral", arms: "hang", look: 0, blink: f % 90 < 4 ? 1 : 0 }));
      cam = E.camAt(f, [{ f: 1104, pos: [RX - 0.85, 1.85, 2.2], look: [RX - 0.95, 1.8, -2.9], fov: 46 }, { f: 1191, pos: [RX - 0.85, 1.8, 1.7], look: [RX - 0.95, 1.75, -2.9], fov: 46 }]);
      dof = { focus: [RX - 1.2, 2.0, -2.6], amount: 3 }; focusPt = [RX - 0.8, 0, -2];
      break;
    }
    case "window": {
      light = ["interior", "golden", X.span(f, 1104, 1264)];
      const counting = f >= 1230;
      A.push(tanakaRoom({ face: counting ? "sleep" : "sad", arms: counting ? "count" : "chin", look: 0.8 }));
      if (counting) FX.push({ kind: "zzz", pos: [ED[0] - 0.05, 1.85, ED[1] - 0.5], size: 0.4, t: (f - 1230) / 40 });
      cam = E.camAt(f, [{ f: 1192, pos: [RX + 0.4, 1.75, 3.4], look: [RX + 0.45, 1.5, -2.6], fov: 50 }, { f: 1264, pos: [RX + 0.4, 1.7, 3.0], look: [RX + 0.45, 1.45, -2.6], fov: 50 }]);
      dof = { focus: [RX, 1.5, -2], amount: 2, range: 4 }; focusPt = [RX, 0, -2];
      break;
    }
    case "goal": {
      show(R.plate, 1); show(R.plateSub, 1);
      A.push({ id: "boss", pos: [CX + 0.95, 0, -1.4], st: st(1, { face: "sly", arms: "hip", look: -0.6 }) });
      A.push({ id: "c1", pos: [CX + 1.75, 0, -1.6], st: st(5, { face: "laugh", arms: "whisper", look: -0.8, bob: 6 * Math.abs(Math.sin(f / 4)) }) });
      cam = E.camAt(f, [{ f: 1265, pos: [CX + 1.2, 1.7, 2.0], look: [CX + 1.0, 1.6, -1.6], fov: 44 }, { f: 1303, pos: [CX + 1.25, 1.7, 1.6], look: [CX + 1.1, 1.6, -1.6], fov: 44 }]);
      dof = { focus: [CX + 1.2, 1.6, -1.5], amount: 5 };
      break;
    }
    case "bored": {
      light = "golden";
      const bored = f >= 1315, ashamed = f >= 1329, res = f >= 1351;
      R.letter.visible = res; R.letterTxt.visible = res;
      A.push(tanakaRoom({ face: res ? "sad" : ashamed ? "sad" : bored ? "sleep" : "neutral", arms: res ? "hang" : ashamed ? "facepalm" : "chin", blush: ashamed, look: res ? 0.4 : 0, headTilt: bored && !ashamed ? 10 : 0 }));
      if (bored && !ashamed) FX.push({ kind: "zzz", pos: [ED[0] - 0.05, 1.8, ED[1] - 0.5], size: 0.35, t: (f - 1315) / 30 });
      if (ashamed && !res) FX.push({ kind: "sweat", pos: [ED[0] - 0.5, 1.6, ED[1] - 0.5], size: 0.15 });
      if (res) FX.push({ kind: "exclaim", pos: [ED[0] + 0.3, 1.45, ED[1] + 0.2], size: 0.18 * pop(1353) });
      cam = E.camAt(f, [{ f: 1304, pos: [ED[0] - 0.1, 1.5, 0.9], look: [ED[0] - 0.15, 1.2, ED[1] - 0.6], fov: 42 }, { f: 1345, pos: [ED[0] - 0.1, 1.45, 0.6], look: [ED[0] - 0.15, 1.2, ED[1] - 0.6], fov: 42 }, { f: 1390, pos: [ED[0] + 0.05, 1.7, 0.4], look: [ED[0], 0.95, ED[1]], fov: 44 }]);
      dof = { focus: res ? [ED[0], 1.0, ED[1]] : [ED[0] - 0.2, 1.2, ED[1] - 0.6], amount: 5 };
      break;
    }
    case "otherside": {
      const hand = f >= 1463, tough = f >= 1474;
      A.push(bossAtDesk({ face: tough ? "angry" : "neutral", arms: "cross", look: 0.7 }));
      A.push({ id: "yuki", pos: [BD[0] + 1.25, 0, BD[1] + 0.95], st: st(6, { face: "nervous", arms: hand ? "reach" : "hold", prop: { kind: "letter", hand: "r" }, look: -0.8, sweat: true }) });
      if (tough) FX.push({ kind: "anger", pos: [BD[0] + 0.45, 2.2, BD[1] - 0.6], size: 0.25 * pop(1474) });
      cam = E.camAt(f, [{ f: 1391, pos: [BD[0] + 0.85, 1.75, 2.6], look: [BD[0] + 0.6, 1.35, BD[1] - 0.2], fov: 46 }, { f: 1513, pos: [BD[0] + 0.8, 1.7, 1.9], look: [BD[0] + 0.6, 1.35, BD[1] - 0.2], fov: 46 }]);
      flash = flashIn(1391, 5) * 0.6;
      dof = { focus: [BD[0] + 0.6, 1.4, BD[1]], amount: 3 }; focusPt = [BD[0] + 0.6, 0, BD[1]];
      break;
    }
    case "tears": {
      const torn = f >= 1528;
      A.push(bossAtDesk({ face: torn ? "smug" : "angry", arms: torn ? "up" : "hold", prop: torn ? null : { kind: "letter", hand: "l" }, look: 0.6 }));
      if (torn) {
        R.bits.forEach((p, i) => { const k = (f - 1528) / 30, a = i * 2.4; p.visible = true; p.position.set(BD[0] + 0.2 + Math.cos(a) * (0.25 + 0.5 * k), 2.1 + 1.2 * k - 2.6 * k * k + (i % 3) * 0.1, BD[1] - 0.5 + Math.sin(a) * 0.3); p.rotation.set(k * (3 + i), k * (2 + i * 0.5), i); });
        FX.push({ kind: "puff", pos: [BD[0] + 0.2, 2.05, BD[1] - 0.4], size: 0.6, t: X.span(f, 1528, 1548) });
      }
      cam = E.camAt(f, [{ f: 1514, pos: [BD[0] + 0.25, 1.75, 0.6], look: [BD[0] + 0.2, 1.65, BD[1] - 0.75], fov: 42 }, { f: 1580, pos: [BD[0] + 0.25, 1.75, 0.3], look: [BD[0] + 0.2, 1.7, BD[1] - 0.75], fov: 42 }]);
      dof = { focus: [BD[0] + 0.2, 1.6, BD[1] - 0.75], amount: 6 };
      break;
    }
    case "team": {
      A.push({ id: "boss", pos: [-1.6, 0, -0.9], st: st(1, { face: f < 1630 ? "talk" : "smug", arms: f < 1630 ? "present" : "hip", look: 0.6, talk: E.talk(f, 1581, 1628) }) });
      A.push({ id: "yuki", pos: [-2.5, 0, -0.5], st: st(6, { face: "sad", arms: "hang", look: 0.6 }) });
      A.push({ id: "c1", pos: [-0.2, 0, -2.0], st: st(5, { face: "sad", arms: "hang", look: -0.6 }) });
      A.push({ id: "c2", pos: [0.5, 0, -2.4], st: st(8, { face: "sad", arms: "chin", look: -0.6 }) });
      A.push(tanakaDesk({ face: "nervous", arms: "hang", look: -0.7 }));
      if (f >= 1594) FX.push({ kind: "sweat", pos: [0.0, 2.1, -1.9], size: 0.2 });
      cam = E.camAt(f, [{ f: 1581, pos: [-1.1, 2.1, 3.4], look: [-0.7, 1.3, -1.5], fov: 50 }, { f: 1659, pos: [-1.0, 2.0, 2.8], look: [-0.7, 1.3, -1.5], fov: 50 }]);
      dof = { focus: [-1.0, 1.4, -1.2], amount: 3, range: 4 }; focusPt = [-0.8, 0, -1.4];
      break;
    }
    case "pay": {
      A.push({ id: "agent", pos: [AX + 0.4, 0, -1.95], st: st(9, { face: f >= 1674 ? "grin" : "happy", arms: f >= 1674 ? "reach" : "hip", look: -0.6 }) });
      A.push({ id: "yuki", pos: [AX - 0.75, 0, -0.35], st: st(6, { face: "determined", arms: "reach", prop: { kind: "money", hand: "r" }, look: 0.7 }) });
      if (f >= 1674) FX.push({ kind: "money", pos: [AX - 0.1, 1.8, -0.8], size: 0.9, t: (f - 1674) / 30 });
      cam = E.camAt(f, [{ f: 1660, pos: [AX - 0.2, 1.75, 3.0], look: [AX - 0.2, 1.4, -1.4], fov: 46 }, { f: 1722, pos: [AX - 0.2, 1.75, 2.6], look: [AX - 0.2, 1.45, -1.4], fov: 46 }]);
      flash = flashIn(1660, 4) * 0.5;
      dof = { focus: [AX - 0.1, 1.4, -1.0], amount: 3 };
      break;
    }
    case "agency": {
      const s = 1 + 0.12 * Math.max(0, 1 - Math.abs(f - 1752) / 8); R.agSign.scale.setScalar(s);
      A.push({ id: "agent", pos: [AX + 0.4, 0, -1.95], st: st(9, { face: "grin", arms: "present", look: -0.3 }) });
      if (f >= 1750) FX.push({ kind: "sparkle", pos: [AX + 1.2, 2.9, -3.3], size: 0.5, t: (f - 1750) / 30 }, { kind: "sparkle", pos: [AX - 1.3, 2.3, -3.3], size: 0.4, t: (f - 1750) / 30 + 0.3 });
      cam = E.camAt(f, [{ f: 1723, pos: [AX + 0.1, 1.7, 2.0], look: [AX + 0.2, 1.6, -2.0], fov: 46 }, { f: 1771, pos: [AX + 0.05, 2.0, 2.2], look: [AX, 2.25, -3.4], fov: 46 }]);
      dof = { focus: [AX, 2.0, -2.8], amount: 2 };
      break;
    }
    case "call": {
      A.push({ id: "agent", pos: [AX + 0.4, 0, -1.95], st: st(9, { face: "talk", arms: "holdR", prop: { kind: "phone", hand: "r" }, look: -0.2, talk: E.talk(f, 1772, 1806) }) });
      cam = E.camAt(f, [{ f: 1772, pos: [AX + 0.35, 1.65, 0.7], look: [AX + 0.4, 1.5, -1.95], fov: 40 }, { f: 1806, pos: [AX + 0.35, 1.65, 0.45], look: [AX + 0.4, 1.55, -1.95], fov: 40 }]);
      dof = { focus: [AX + 0.4, 1.55, -1.95], amount: 8 };
      break;
    }
    case "bosscall": {
      const shock = f >= 1813;
      A.push(bossAtDesk({ face: shock ? "shock" : "neutral", arms: "holdR", prop: { kind: "phone", hand: "r" }, look: 0.3, sweat: shock }));
      if (shock) FX.push({ kind: "exclaim", pos: [BD[0] + 0.55, 2.25, BD[1] - 0.6], size: 0.3 * pop(1813) });
      cam = { pos: [BD[0] + 0.25, 1.75, 0.5 - 0.15 * X.smooth(X.span(f, 1807, 1845))], look: [BD[0] + 0.2, 1.65, BD[1] - 0.75], fov: 42 };
      shake(cam, 1813, 0.04, 10);
      dof = { focus: [BD[0] + 0.2, 1.6, BD[1] - 0.75], amount: 6 };
      break;
    }
    case "year": {
      R.stack.forEach((m) => (m.visible = true));
      flash = flashIn(1846, 6);
      overlay = bigCard("2024", Math.min(1, X.span(f, 1848, 1858)) * (1 - X.span(f, 1900, 1915)));
      const quit = f >= 1945;
      A.push({ id: "agent", pos: [AX + 0.4, 0, -1.95], st: st(9, { face: quit ? "determined" : "sad", arms: quit ? "up" : "chin", look: -0.2, sweat: !quit }) });
      if (!quit && f >= 1886) FX.push({ kind: "lines", pos: [AX - 0.3, 1.4, -1.0], size: 0.4, t: (t / 15) % 1 });
      if (quit) FX.push({ kind: "exclaim", pos: [AX + 0.75, 2.15, -1.9], size: 0.3 * pop(1946) });
      if (f >= 1890 && !quit) overlay = nameCard("A resignation agency employee", "2024");
      cam = E.camAt(f, [{ f: 1846, pos: [AX + 0.1, 1.85, 2.4], look: [AX + 0.1, 1.4, -1.6], fov: 46 }, { f: 1978, pos: [AX + 0.2, 1.7, 1.3], look: [AX + 0.25, 1.45, -1.8], fov: 44 }]);
      dof = { focus: [AX + 0.2, 1.4, -1.6], amount: 4 };
      break;
    }
    case "guess": {
      R.stack.forEach((m) => (m.visible = true));
      A.push({ id: "agent", pos: [AX + 0.4, 0, -1.95], st: st(9, { face: "sly", arms: "whisper", look: 0 }) });
      if (f >= 1983) FX.push({ kind: "question", pos: [AX + 0.75, 2.15, -1.9], size: 0.25 * pop(1983) });
      cam = E.camAt(f, [{ f: 1979, pos: [AX + 0.4, 1.62, 0.5], look: [AX + 0.4, 1.5, -1.95], fov: 40 }, { f: 2010, pos: [AX + 0.4, 1.62, 0.25], look: [AX + 0.4, 1.57, -1.95], fov: 40 }]);
      dof = { focus: [AX + 0.4, 1.55, -1.95], amount: 8 };
      break;
    }
    case "hired": {
      light = "day";
      show(R.ag2Sign, pop(2024, 10));
      const deal = f >= 2034;
      A.push({ id: "agent2", pos: [BX + 0.45, 0, -1.95], st: st(12, { face: deal ? "grin" : "happy", arms: deal ? "holdR" : "present", prop: deal ? { kind: "phone", hand: "r" } : null, look: -0.6, talk: deal ? E.talk(f, 2040, 2075) : 0 }) });
      A.push({ id: "agent", pos: [BX - 0.75, 0, -0.35], st: st(9, { face: "happy", arms: "reach", prop: { kind: "money", hand: "r" }, look: 0.7 }) });
      if (f >= 2026) FX.push({ kind: "stars", pos: [BX, 3.0, -3.2], size: 1.3, t: (f - 2026) / 30 });
      cam = E.camAt(f, [{ f: 2011, pos: [BX - 0.1, 1.9, 3.2], look: [BX, 1.8, -2.4], fov: 50 }, { f: 2082, pos: [BX - 0.1, 1.9, 2.4], look: [BX, 1.85, -2.4], fov: 50 }]);
      flash = flashIn(2011, 5) * 0.6;
      dof = { focus: [BX, 1.8, -2.0], amount: 2, range: 4 };
      break;
    }
    case "yeah": {
      light = "golden";
      A.push(tanakaRoom({ face: f >= 2086 ? "smug" : "neutral", arms: f >= 2086 ? "shrug" : "hang", look: 0 }));
      cam = E.camAt(f, [{ f: 2083, pos: [ED[0] - 0.25, 1.6, 1.4], look: [ED[0] - 0.25, 1.25, ED[1] - 0.7], fov: 44 }, { f: END, pos: [ED[0] - 0.25, 1.5, 0.8], look: [ED[0] - 0.25, 1.2, ED[1] - 0.7], fov: 42 }]);
      flash = flashIn(2083, 4) * 0.4;
      dof = { focus: [ED[0] - 0.25, 1.3, ED[1] - 0.65], amount: 5 };
      break;
    }
  }
  return { cam, light, dof, actors: A, fx: FX, flash, overlay, focusPt };
}
