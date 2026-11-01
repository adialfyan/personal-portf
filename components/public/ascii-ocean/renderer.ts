import { clamp, hash3, smoothstep } from "./math";
import { KOI_NODES, type Koi, type KoiKind, type LilyPad, type World } from "./world";

type RGB = [number, number, number];

export type Theme = "light" | "dark";

interface Palette {
  bg: string;
  bgRgb: RGB;
  grid: string;
  fish: RGB;
  wake: RGB;
  haze: number;
}

const PALETTES: Record<Theme, Palette> = {
  light: {
    bg: "#edeae3",
    bgRgb: [237, 234, 227],
    grid: "rgba(35, 48, 62, 0.075)",
    fish: [36, 40, 48],
    wake: [55, 120, 145],
    haze: 0.18,
  },
  dark: {
    bg: "#08090c",
    bgRgb: [8, 9, 12],
    grid: "rgba(255,255,255,0.055)",
    fish: [230, 238, 255],
    wake: [110, 230, 255],
    haze: 0.3,
  },
};

const ALPHA_LEVELS = 6;
const FISH_ALPHAS = [0.28, 0.42, 0.58, 0.74, 0.9];
const GLINTS = ["#fffaf0", "#ffe7b8", "#ffd27a", "#fff3e2"];

const SKIN_RAMP = ":;t%SX8#@";
const FIN_GLYPHS = ":;'.:";
const EDGE_HEAVY = ":;";
const EDGE_LIGHT = ".',`";
const FLAG_BODY = 1;
const FLAG_EDGE = 2;
const FLAG_FIN = 3;
const FLAG_EYE = 4;

const WHITE = 0;
const RED = 1;
const ORANGE = 2;
const SUMI = 3;

const TONES: [RGB, RGB, RGB][] = [
  [[218, 222, 230], [248, 250, 254], [255, 255, 255]], // Lustrous White
  [[185, 30, 26],   [236, 52, 42],   [255, 110, 90]],   // Radiant Kohaku Vermilion Red
  [[210, 90, 18],   [248, 140, 30],  [255, 200, 100]],  // Warm Ogon Amber Orange
  [[14, 16, 22],    [32, 38, 48],    [68, 76, 92]],     // Deep Japanese Sumi Black
];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function tone(idx: number, shade: number): RGB {
  const [d, m, l] = TONES[idx];
  return shade < 0.5 ? mix(d, m, shade * 2) : mix(m, l, (shade - 0.5) * 2);
}

const css = (c: RGB) =>
  `rgb(${clamp(Math.round(c[0]), 0, 255)},${clamp(Math.round(c[1]), 0, 255)},${clamp(Math.round(c[2]), 0, 255)})`;

const SUBSAMPLES = [0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];

function koiBody(s: number, end: number) {
  const k = end / 0.72;
  const x = s / k;
  let w: number;
  if (x < 0.1) {
    w = 0.125 * Math.pow(Math.sin(((x / 0.1) * Math.PI) / 2), 0.55);
  } else if (x < 0.32) {
    w = 0.125 + 0.045 * smoothstep(0.1, 0.32, x);
  } else if (x < 0.72) {
    w = 0.038 + 0.132 * Math.pow(1 - (x - 0.32) / 0.4, 1.15);
  } else {
    w = 0.038 * (1 - smoothstep(0.72, 0.86, x)) + 0.009;
  }
  return w * Math.min(1.25, k * 1.18);
}

interface KoiShape {
  halfWidth: (s: number) => number;
  pectoral: [number, number, number, number];
  pelvic: [number, number, number, number];
  tail: [number, number, number];
  finBreadth: number;
  dorsal: [number, number];
  eyes: [number, number];
}

const STANDARD: KoiShape = {
  halfWidth: (s) => koiBody(s, 0.72),
  pectoral: [0.16, 0.22, 0.27, 0.25],
  pelvic: [0.44, 0.49, 0.53, 0.12],
  tail: [0.70, 0.21, 0.035],
  finBreadth: 0.85,
  dorsal: [0.14, 0.65],
  eyes: [0.065, 0.11],
};

const BUTTERFLY: KoiShape = {
  halfWidth: (s) => koiBody(s, 0.62),
  pectoral: [0.12, 0.19, 0.28, 0.29],
  pelvic: [0.36, 0.41, 0.47, 0.14],
  tail: [0.60, 0.24, 0.045],
  finBreadth: 0.75,
  dorsal: [0.11, 0.55],
  eyes: [0.06, 0.1],
};

const SHAPES: Record<KoiKind, KoiShape> = {
  kohaku: STANDARD,
  orange: STANDARD,
  benigoi: STANDARD,
  tancho: STANDARD,
  butterfly: BUTTERFLY,
};

function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash3(xi, yi, seed);
  const b = hash3(xi + 1, yi, seed);
  const c = hash3(xi, yi + 1, seed);
  const d = hash3(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function paintGrid(
  g: CanvasRenderingContext2D,
  W: number,
  H: number,
  cw: number,
  ch: number,
  dpr: number,
  color: string
) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.strokeStyle = color;
  g.lineWidth = 1;
  g.beginPath();
  for (let c = 0; c <= Math.ceil(W / cw); c++) {
    const x = Math.round(c * cw * dpr) + 0.5;
    g.moveTo(x, 0);
    g.lineTo(x, H * dpr);
  }
  for (let r = 0; r <= Math.ceil(H / ch); r++) {
    const y = Math.round(r * ch * dpr) + 0.5;
    g.moveTo(0, y);
    g.lineTo(W * dpr, y);
  }
  g.stroke();
}

interface RippleRing {
  x: number;
  y: number;
  born: number;
  duration: number;
  maxRadius: number;
}

export class AsciiRenderer {
  private ctx: CanvasRenderingContext2D;
  private bg: HTMLCanvasElement;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private cw = 12;
  private ch = 18;
  private cols = 0;
  private rows = 0;
  private fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  public palette: Palette;

  private energy = new Float32Array(0);
  private energyTmp = new Float32Array(0);
  private heat = new Float32Array(0);
  private wakeOf = new Int8Array(0);
  private wakeStyles: string[] = [];

  private koiFlag = new Uint8Array(0);
  private koiShade = new Float32Array(0);
  private koiKey = new Uint32Array(0);
  private koiDepth = new Float32Array(0);
  private koiColor = new Uint8Array(0);
  private koiShadow = new Float32Array(0);
  private spine = new Float32Array(KOI_NODES * 2);
  private arc = new Float32Array(KOI_NODES);
  private arcTotal = 1;
  private shape = STANDARD;
  private kind: KoiKind = "kohaku";
  private koiId = 0;
  private finTipLeft = 0;
  private finTipRight = 0;
  private finSwingLeft = 0;
  private finSwingRight = 0;

  private hitFlag = 0;
  private hitShade = 0;
  private hitColor = 0;
  private hitS = 0;
  private hitV = 0;
  private hitDist = 0;

  private fishStamp = new Uint32Array(0);
  private frameId = 0;
  private fishBuckets: number[][] = FISH_ALPHAS.map(() => []);
  private fishStyles: string[] = [];
  private ripples: RippleRing[] = [];

  constructor(private canvas: HTMLCanvasElement, theme: Theme = "light") {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    this.bg = document.createElement("canvas");
    this.palette = PALETTES[theme];
    this.setTheme(theme);
  }

  get cellWidth() {
    return this.cw;
  }

  get cellHeight() {
    return this.ch;
  }

  setFontFamily(family: string) {
    if (family) this.fontFamily = family;
  }

  setTheme(theme: Theme) {
    const p = (this.palette = PALETTES[theme]);
    const [fr, fg, fb] = p.fish;
    this.fishStyles = FISH_ALPHAS.map((a) => `rgba(${fr},${fg},${fb},${a})`);
    const [wr, wg, wb] = p.wake;
    this.wakeStyles = [];
    for (let l = 0; l < ALPHA_LEVELS; l++) {
      this.wakeStyles.push(`rgba(${wr},${wg},${wb},${((l + 1) / ALPHA_LEVELS).toFixed(3)})`);
    }
    if (this.cols) this.paintBackground();
  }

  resize(width: number, height: number, dpr: number) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.cw = clamp(Math.round(width / 136), 8, 12);
    this.ch = Math.round(this.cw * 1.45);
    this.cols = Math.ceil(width / this.cw);
    this.rows = Math.ceil(height / this.ch);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.bg.width = this.canvas.width;
    this.bg.height = this.canvas.height;

    const n = this.cols * this.rows;
    this.energy = new Float32Array(n);
    this.energyTmp = new Float32Array(n);
    this.heat = new Float32Array(n);
    this.wakeOf = new Int8Array(n);
    this.koiFlag = new Uint8Array(n);
    this.koiShade = new Float32Array(n);
    this.koiKey = new Uint32Array(n);
    this.koiDepth = new Float32Array(n);
    this.koiColor = new Uint8Array(n);
    this.koiShadow = new Float32Array(n);
    this.fishStamp = new Uint32Array(n);
    this.paintBackground();
  }

  private paintBackground() {
    const g = this.bg.getContext("2d");
    if (!g) return;
    const { width: W, height: H, dpr, cw, ch, palette } = this;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = palette.bg;
    g.fillRect(0, 0, W, H);
    paintGrid(g, W, H, cw, ch, dpr, palette.grid);
  }

  render(world: World, dt: number) {
    const { ctx, dpr, cols, ch } = this;
    if (cols === 0) return;
    const t = world.time;

    this.consumeEvents(world);
    this.rasterizeKoi(world.koi, t);
    this.depositWake(world);
    this.diffuse(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.drawKoiShadows();
    this.markFish(world);
    this.drawWake();
    this.drawRipples(t);

    ctx.font = `600 ${Math.round(ch * 0.74)}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    this.drawHeat();
    this.drawFish();
    this.drawKoi(t);
    this.drawLilyPads(world.lilyPads, t);
  }

  private drawRipples(t: number) {
    const { ctx, cw, ch, cols, rows, palette } = this;
    const light = palette === PALETTES.light;
    const alive: RippleRing[] = [];

    for (const r of this.ripples) {
      const age = t - r.born;
      if (age >= r.duration) continue;
      alive.push(r);

      const progress = age / r.duration;
      const currentRadius = progress * r.maxRadius;
      const alpha = Math.sin((1 - progress) * Math.PI) * (light ? 0.38 : 0.6);
      const strokeColor = light
        ? `rgba(50, 110, 130, ${alpha.toFixed(3)})`
        : `rgba(130, 225, 255, ${alpha.toFixed(3)})`;

      const numPoints = Math.max(8, Math.floor(currentRadius * 0.85));
      ctx.fillStyle = strokeColor;
      for (let p = 0; p < numPoints; p++) {
        const angle = (p / numPoints) * Math.PI * 2;
        const rx = r.x + Math.cos(angle) * currentRadius;
        const ry = r.y + Math.sin(angle) * currentRadius * 0.72;
        const c = Math.floor(rx / cw);
        const row = Math.floor(ry / ch);
        if (c >= 0 && c < cols && row >= 0 && row < rows) {
          const glyph = progress < 0.25 ? "°" : progress < 0.65 ? "·" : "~";
          ctx.fillText(glyph, (c + 0.5) * cw, (row + 0.5) * ch + 1);
        }
      }
    }
    this.ripples = alive;
  }

  private drawLilyPads(pads: LilyPad[], t: number) {
    const { ctx, cw, ch, cols, rows, palette } = this;
    const light = palette === PALETTES.light;
    const PAD_GLYPHS = "%8#@";
    const PAD_COLORS = light
      ? ["#2a5e38", "#387848", "#489258", "#5aa86b"]
      : ["#1c3e25", "#285834", "#346e42", "#428652"];

    for (const pad of pads) {
      const bobX = Math.sin(t * 0.7 + pad.notchAngle) * 1.2;
      const bobY = Math.cos(t * 0.6 + pad.notchAngle) * 1.2;
      const padX = pad.x + bobX;
      const padY = pad.y + bobY;

      const c0 = Math.max(0, Math.floor((padX - pad.radius) / cw));
      const c1 = Math.min(cols - 1, Math.floor((padX + pad.radius) / cw));
      const r0 = Math.max(0, Math.floor((padY - pad.radius) / ch));
      const r1 = Math.min(rows - 1, Math.floor((padY + pad.radius) / ch));

      // Under-leaf drop shadow
      ctx.fillStyle = light ? "rgba(25, 45, 30, 0.16)" : "rgba(0, 0, 0, 0.55)";
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const px = (c + 0.5) * cw;
          const py = (r + 0.5) * ch;
          const dist = Math.hypot(px - padX - 3, py - padY - 3);
          if (dist <= pad.radius) {
            ctx.fillRect(c * cw + 1, r * ch + 1, cw - 1, ch - 1);
          }
        }
      }

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const px = (c + 0.5) * cw;
          const py = (r + 0.5) * ch;
          const dx = px - padX;
          const dy = py - padY;
          const dist = Math.hypot(dx, dy);
          if (dist > pad.radius) continue;

          const angle = Math.atan2(dy, dx);
          let diff = angle - pad.notchAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          if (Math.abs(diff) < 0.28 && dist > pad.radius * 0.2) continue;

          const normDist = dist / pad.radius;
          const colorIdx = clamp(Math.floor(normDist * PAD_COLORS.length), 0, PAD_COLORS.length - 1);
          const key = hash3(c, r, 99);
          const glyph = PAD_GLYPHS[Math.floor(key * PAD_GLYPHS.length)];

          ctx.fillStyle = PAD_COLORS[colorIdx];
          ctx.fillRect(c * cw + 1, r * ch + 1, cw - 1, ch - 1);
          ctx.fillStyle = light ? "#15331e" : "#0f2615";
          ctx.fillText(glyph, px, py + 1);
        }
      }

      if (pad.hasFlower) {
        const fc = Math.floor(padX / cw);
        const fr = Math.floor(padY / ch);
        const offsets = [
          [0, 0, "#ffd13b", "*"],
          [-1, 0, "#e84a75", "%"],
          [1, 0, "#e84a75", "%"],
          [0, -1, "#f492b2", "o"],
          [0, 1, "#f492b2", "o"],
          [-1, -1, "#ffb8cf", "."],
          [1, 1, "#ffb8cf", "."],
        ];
        for (const [ox, oy, fill, glyph] of offsets) {
          const col = fc + (ox as number);
          const row = fr + (oy as number);
          if (col >= 0 && col < cols && row >= 0 && row < rows) {
            ctx.fillStyle = fill as string;
            ctx.fillText(glyph as string, (col + 0.5) * cw, (row + 0.5) * ch + 1);
          }
        }
      }
    }
  }

  private cellIndex(x: number, y: number) {
    const c = Math.floor(x / this.cw);
    const r = Math.floor(y / this.ch);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }

  private stamp(field: Float32Array, x: number, y: number, radius: number, amount: number) {
    const c0 = Math.floor(x / this.cw);
    const r0 = Math.floor(y / this.ch);
    for (let r = r0 - radius; r <= r0 + radius; r++) {
      for (let c = c0 - radius; c <= c0 + radius; c++) {
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue;
        const d = Math.hypot(c - c0, (r - r0) * 1.4);
        if (d > radius + 0.5) continue;
        const i = r * this.cols + c;
        field[i] = Math.min(1.6, field[i] + amount * (1 - d / (radius + 1)));
      }
    }
  }

  private consumeEvents(world: World) {
    for (const e of world.events) {
      if (e.kind === "eat") {
        this.stamp(this.heat, e.x, e.y, 2, 1);
        this.stamp(this.energy, e.x, e.y, 3, 0.9);
      } else if (e.kind === "drop") {
        this.stamp(this.energy, e.x, e.y, 3, 1.3);
        this.ripples.push({
          x: e.x,
          y: e.y,
          born: world.time,
          duration: 1.6,
          maxRadius: 55,
        });
      } else {
        this.stamp(this.energy, e.x, e.y, 6, 1.5);
        this.ripples.push({
          x: e.x,
          y: e.y,
          born: world.time,
          duration: 2.0,
          maxRadius: 90,
        });
      }
    }
    world.events.length = 0;
  }

  private depositWake(world: World) {
    const { energy } = this;
    for (const f of world.fish) {
      if (!f.alive) continue;
      const i = this.cellIndex(f.x, f.y);
      if (i >= 0) energy[i] = Math.min(1.6, energy[i] + 0.012 + f.alarm * 0.03);
    }
    for (const sh of world.koi) {
      for (let k = KOI_NODES - 6; k < KOI_NODES; k++) {
        const i = this.cellIndex(sh.nodes[k * 2], sh.nodes[k * 2 + 1]);
        if (i >= 0) energy[i] = Math.min(1.6, energy[i] + 0.05 + sh.speed * 0.0012);
      }
    }
    if (world.pointer.active) {
      this.stamp(energy, world.pointer.x, world.pointer.y, 1, 0.08);
    }
  }

  private diffuse(dt: number) {
    const { cols, rows, energy, energyTmp: tmp, heat } = this;
    const decay = Math.exp(-dt * 1.5);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const l = c > 0 ? energy[i - 1] : energy[i];
        const rt = c < cols - 1 ? energy[i + 1] : energy[i];
        const u = r > 0 ? energy[i - cols] : energy[i];
        const d = r < rows - 1 ? energy[i + cols] : energy[i];
        tmp[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay;
      }
    }
    this.energy = tmp;
    this.energyTmp = energy;
    const heatDecay = Math.exp(-dt * 2.2);
    for (let i = 0; i < heat.length; i++) heat[i] *= heatDecay;
  }

  private skinAt(s: number, vn: number, across: number) {
    const id = this.koiId * 13;
    const px = s * 4.6;
    const py = vn * 7;
    const band =
      0.16 -
      0.35 * smoothstep(0.58, 0.72, s) -
      0.22 * across * across -
      0.4 * (1 - smoothstep(0.015, 0.05, s));
    const steps = (freq: number, salt: number) =>
      0.5 + 0.5 * Math.cos((s * freq + hash3(this.koiId, salt, 17)) * Math.PI * 2);

    // Sumi ink patches (adds black patches like Sanke/Showa Japanese koi in Image 1)
    const isSumi =
      (this.kind === "kohaku" || this.kind === "butterfly") &&
      s > 0.18 &&
      s < 0.65 &&
      noise(px * 1.8 + 5, py * 2.2 + 3, id + 9) > 0.68;

    if (isSumi) return SUMI;

    switch (this.kind) {
      case "kohaku":
        return 0.45 * noise(px, py, id) + 0.55 * steps(2.6, 3) + band > 0.52 ? RED : WHITE;
      case "orange":
        if (s < 0.03 || across > 0.85) return WHITE;
        return 0.45 * noise(px, py, id + 3) + 0.55 * steps(2.2, 5) + band > 0.46 ? ORANGE : WHITE;
      case "benigoi":
        return s < 0.025 ? WHITE : RED;
      case "tancho": {
        const ds = (s - 0.1) / 0.06;
        const dv = vn / 0.05;
        return ds * ds + dv * dv < 1 ? RED : WHITE;
      }
      case "butterfly":
        if (s < 0.03 || across > 0.85) return WHITE;
        return 0.45 * noise(px, py, id + 7) + 0.55 * steps(2.4, 7) + band > 0.48 ? ORANGE : WHITE;
    }
  }

  private finAt(t: number) {
    switch (this.kind) {
      case "orange":
        return t < 0.75 ? ORANGE : WHITE;
      case "benigoi":
        return t < 0.6 ? RED : WHITE;
      case "butterfly":
        return t < 0.45 ? ORANGE : WHITE;
      case "kohaku":
        return t < 0.2 ? RED : WHITE;
      default:
        return WHITE;
    }
  }

  private inFin(u: number, a: number, rootU: number, tipU: number, tipA: number, breadth: number) {
    const dx = tipU - rootU;
    const dy = tipA;
    const len = Math.hypot(dx, dy) || 1;
    const ex = dx / len;
    const ey = dy / len;
    const half = len / 2;
    const qx = u - (rootU + dx / 2);
    const qy = a - dy / 2;
    const p = (qx * ex + qy * ey) / half;
    if (p < -1 || p > 1) return -1;
    const t = (p + 1) / 2;
    const width = half * breadth * (0.45 + 0.55 * Math.sin(t * Math.PI * 0.85));
    const q = (-qx * ey + qy * ex) / width;
    return p * p + q * q <= 1 ? t : -1;
  }

  private ray(du: number, a: number) {
    return Math.sin(Math.atan2(a, du) * 26) > 0.45 ? 0.1 : 0;
  }

  private sampleKoi(px: number, py: number, L: number) {
    const { spine, arc } = this;
    const N = KOI_NODES;
    let best = Infinity;
    let bestS = 0;
    let bestSign = 1;
    let bestTx = 1;
    let bestTy = 0;
    let bestOver = 0;
    for (let k = 0; k < N - 1; k++) {
      const ax = spine[k * 2];
      const ay = spine[k * 2 + 1];
      const sx = spine[(k + 1) * 2] - ax;
      const sy = spine[(k + 1) * 2 + 1] - ay;
      const len2 = sx * sx + sy * sy || 1;
      const raw = ((px - ax) * sx + (py - ay) * sy) / len2;
      const u = clamp(raw, 0, 1);
      const qx = ax + sx * u;
      const qy = ay + sy * u;
      const d2 = (px - qx) ** 2 + (py - qy) ** 2;
      if (d2 < best) {
        best = d2;
        const len = Math.sqrt(len2);
        bestS = (arc[k] + u * len) / this.arcTotal;
        bestSign = sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1;
        bestTx = sx / len;
        bestTy = sy / len;
        bestOver = k === N - 2 ? Math.max(0, raw - 1) * len : 0;
      }
    }

    const a = Math.sqrt(best);
    const s = bestS;
    const u = s * L;
    const shape = this.shape;
    const w = shape.halfWidth(s) * L;
    const vn = (a * bestSign) / L;
    const nx = -bestTy * bestSign;
    const ny = bestTx * bestSign;
    this.hitDist = a;
    this.hitS = s;
    this.hitV = a * bestSign;
    if (bestOver > L * 0.008) return false;

    if (a <= w) {
      const across = a / (w || 1);
      // Eye check on flanks of head
      if (s > shape.eyes[0] && s < shape.eyes[1] && across > 0.65) {
        this.hitFlag = FLAG_EYE;
        this.hitShade = 0;
        this.hitColor = SUMI;
        return true;
      }
      const facing = (nx * -0.65 + ny * -0.8) * across;
      let shade = 0.68 - across * across * 0.52 + facing * 0.28;
      if (s > shape.dorsal[0] && s < shape.dorsal[1] && across < 0.3) {
        shade += 0.18 * Math.pow(1 - across / 0.3, 1.4);
      }
      if (s < 0.05) shade = Math.max(shade, 0.75);
      this.hitFlag = FLAG_BODY;
      this.hitShade = shade;
      this.hitColor = this.skinAt(s, vn, across);
      return true;
    }

    const [t0, spread, fork] = shape.tail;
    if (s > t0) {
      const k = (s - t0) / (1 - t0);
      const round = k > 0.8 ? Math.sqrt(Math.max(0, 1 - ((k - 0.8) / 0.2) ** 2)) : 1;
      const outer = L * (0.014 + spread * Math.pow(smoothstep(0, 0.85, k), 0.75)) * round;
      const notch = L * fork * smoothstep(0.6, 1, k);
      if (a <= outer && a >= notch) {
        this.hitFlag = FLAG_FIN;
        this.hitShade = 0.4 + 0.3 * (1 - a / (outer || 1)) - this.ray(u - L * t0, a);
        this.hitColor = this.finAt(k);
        return true;
      }
    }

    const right = bestSign > 0;
    const [p0, p1, p2, pr] = shape.pectoral;
    const tip = right ? this.finTipRight : this.finTipLeft;
    const swing = right ? this.finSwingRight : this.finSwingLeft;
    let rootU = L * (p0 + p1) * 0.5;
    let ft = this.inFin(u, a, rootU, L * (p2 + swing), tip, shape.finBreadth);
    if (ft < 0) {
      const [v0, v1, v2, vr] = shape.pelvic;
      rootU = L * (v0 + v1) * 0.5;
      ft = this.inFin(u, a, rootU, L * (v2 + swing * 0.4), L * vr * (tip / (L * pr)), shape.finBreadth);
    }
    if (ft >= 0) {
      this.hitFlag = FLAG_FIN;
      this.hitShade = 0.38 + 0.3 * (1 - ft) - this.ray(u - rootU, a);
      this.hitColor = this.finAt(ft);
      return true;
    }
    return false;
  }

  private rasterizeKoi(koi: Koi[], t: number) {
    const { koiFlag, koiShade, koiKey, koiDepth, koiColor, spine, arc, cw, ch, cols, rows } = this;
    koiFlag.fill(0);
    this.koiShadow.fill(0);

    for (const sh of koi) {
      const L = sh.length;
      const N = KOI_NODES;
      const n = sh.nodes;
      const swim = clamp(sh.speed / 45, 0.55, 1.5);
      this.shape = SHAPES[sh.kind];
      this.kind = sh.kind;
      this.koiId = sh.id;
      const tailStart = this.shape.tail[0];

      for (let k = 0; k < N; k++) {
        const s = k / (N - 1);
        const a = Math.max(0, k - 1);
        const b = Math.min(N - 1, k + 1);
        let tx = n[a * 2] - n[b * 2];
        let ty = n[a * 2 + 1] - n[b * 2 + 1];
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        const trail = 1 + 0.25 * smoothstep(tailStart, 1, s);
        const amp = L * 0.045 * (0.06 + 0.94 * Math.pow(s, 1.8)) * swim * trail;
        const off = amp * Math.sin(sh.phase - s * 4.2);
        spine[k * 2] = n[k * 2] - ty * off;
        spine[k * 2 + 1] = n[k * 2 + 1] + tx * off;
      }
      arc[0] = 0;
      for (let k = 1; k < N; k++) {
        arc[k] =
          arc[k - 1] +
          Math.hypot(spine[k * 2] - spine[(k - 1) * 2], spine[k * 2 + 1] - spine[(k - 1) * 2 + 1]);
      }
      this.arcTotal = arc[N - 1] || 1;

      const bank = clamp(sh.turn * 0.45, -0.35, 0.35);
      const reachFin = this.shape.pectoral[3];
      const paddleR = Math.sin(sh.phase * 0.55);
      const paddleL = Math.sin(sh.phase * 0.55 + 1.9);
      this.finTipRight = L * reachFin * (1 + 0.12 * paddleR) * (1 - bank);
      this.finTipLeft = L * reachFin * (1 + 0.12 * paddleL) * (1 + bank);
      this.finSwingRight = 0.025 * paddleR;
      this.finSwingLeft = 0.025 * paddleL;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let k = 0; k < N; k++) {
        minX = Math.min(minX, spine[k * 2]);
        maxX = Math.max(maxX, spine[k * 2]);
        minY = Math.min(minY, spine[k * 2 + 1]);
        maxY = Math.max(maxY, spine[k * 2 + 1]);
      }
      const reach = L * 0.44;
      const c0 = Math.max(0, Math.floor((minX - reach) / cw));
      const c1 = Math.min(cols - 1, Math.floor((maxX + reach) / cw));
      const r0 = Math.max(0, Math.floor((minY - reach) / ch));
      const r1 = Math.min(rows - 1, Math.floor((maxY + reach) / ch));
      if (c0 > c1 || r0 > r1) continue;

      const skipBeyond = reach + Math.hypot(cw, ch);

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = c * cw;
          const y = r * ch;
          const centerHit = this.sampleKoi(x + cw / 2, y + ch / 2, L);
          if (!centerHit && this.hitDist > skipBeyond) continue;
          const flag = this.hitFlag;
          const shade = this.hitShade;
          let color = this.hitColor;
          const s = this.hitS;
          const v = this.hitV;

          let hits = centerHit ? 1 : 0;
          for (let k = 0; k < SUBSAMPLES.length; k += 2) {
            if (this.sampleKoi(x + SUBSAMPLES[k] * cw, y + SUBSAMPLES[k + 1] * ch, L)) {
              if (hits === 0) color = this.hitColor;
              hits++;
            }
          }
          if (hits === 0) continue;
          const coverage = hits / 5;

          const i = r * cols + c;
          const key = (hash3(Math.round(s * 52), Math.round(v / (cw * 0.9)), sh.id) * 4294967295) >>> 0;
          koiKey[i] = key;
          koiDepth[i] = sh.depth;
          koiColor[i] = color;

          if (centerHit && coverage >= 0.45) {
            koiFlag[i] = flag;
            const flicker = (hash3(c, r, Math.floor(t * 6)) - 0.5) * 0.06;
            koiShade[i] = clamp(shade + flicker, 0, 1);

            // Underwater soft drop shadow offset onto pond floor
            const shadowDc = Math.round((L * 0.045) / cw) + 1;
            const shadowDr = Math.round((L * 0.035) / ch) + 1;
            const sc = c + shadowDc;
            const sr = r + shadowDr;
            if (sc >= 0 && sc < cols && sr >= 0 && sr < rows) {
              const si = sr * cols + sc;
              this.koiShadow[si] = Math.max(this.koiShadow[si], coverage * 0.85);
            }
          } else {
            koiFlag[i] = FLAG_EDGE;
            koiShade[i] = coverage;
          }
        }
      }
    }
  }

  private drawKoiShadows() {
    const { ctx, cols, rows, cw, ch, koiShadow, koiFlag, palette } = this;
    const light = palette === PALETTES.light;
    const n = cols * rows;

    for (let i = 0; i < n; i++) {
      const s = koiShadow[i];
      if (s < 0.08 || koiFlag[i]) continue;
      const col = i % cols;
      const row = (i / cols) | 0;
      const x = col * cw;
      const y = row * ch;

      if (light) {
        ctx.fillStyle = `rgba(32, 48, 64, ${(s * 0.22).toFixed(3)})`;
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${(s * 0.85).toFixed(3)})`;
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
        if (s > 0.45) {
          ctx.fillStyle = "rgba(45, 55, 75, 0.45)";
          ctx.fillText(".", x + cw / 2, y + ch / 2 + 1);
        }
      }
    }
  }

  private drawKoi(t: number) {
    const { ctx, cols, rows, cw, ch, koiFlag, koiShade, koiKey, koiDepth, koiColor, palette } = this;
    const light = palette === PALETTES.light;
    const n = cols * rows;
    for (let i = 0; i < n; i++) {
      const flag = koiFlag[i];
      if (!flag) continue;
      const col = i % cols;
      const row = (i / cols) | 0;
      const x = col * cw;
      const y = row * ch;
      const key = koiKey[i];
      const shade = koiShade[i];
      const skin = koiColor[i];
      const haze = (1 - koiDepth[i]) * palette.haze;
      const sink = (c: RGB): RGB =>
        light && skin === WHITE ? c : mix(c, palette.bgRgb, haze);

      const tick = Math.floor(t * 2.4 + (key % 997) / 97);
      const roll = hash3(key, tick, 7);

      if (flag === FLAG_EDGE) {
        const set = shade >= 0.5 ? EDGE_HEAVY : EDGE_LIGHT;
        const c = sink(skin === WHITE ? [214, 178, 160] : tone(skin, 0.15));
        ctx.fillStyle = css(mix(c, palette.bgRgb, (1 - shade) * 0.35));
        ctx.fillText(set[(key >>> 8) % set.length], x + cw / 2, y + ch / 2 + 1);
        continue;
      }

      if (flag === FLAG_EYE) {
        ctx.fillStyle = light ? "#181a20" : "#08090c";
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
        ctx.fillStyle = light ? "#ffffff" : "#e0e4ec";
        ctx.fillText("o", x + cw / 2, y + ch / 2 + 1);
        continue;
      }

      let fill = tone(skin, shade);
      let glyph: string;
      if (flag === FLAG_FIN) {
        fill = mix(fill, palette.bgRgb, light ? 0.35 : 0.45);
        glyph = FIN_GLYPHS[(key >>> 8) % FIN_GLYPHS.length];
      } else {
        const jitter = ((key >>> 4) % 3) - 1;
        glyph = SKIN_RAMP[clamp(Math.floor((1 - shade) * 8.99) + jitter, 0, SKIN_RAMP.length - 1)];
      }

      let ink: RGB;
      if (skin === WHITE) {
        ink = light ? [130, 125, 120] : [190, 124, 98];
      } else if (skin === SUMI) {
        ink = [10, 12, 16];
      } else {
        ink = light ? [135, 20, 16] : mix(fill, tone(skin, 0), 0.6);
      }
      if (flag === FLAG_FIN) ink = mix(ink, fill, 0.35);
      fill = sink(fill);
      ctx.fillStyle = css(fill);
      ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);

      ctx.fillStyle = roll < 0.045 ? (light ? "#ffffff" : GLINTS[key % GLINTS.length]) : css(sink(ink));
      ctx.fillText(glyph, x + cw / 2, y + ch / 2 + 1);
    }
  }

  private markFish(world: World) {
    const { fishStamp, fishBuckets, koiFlag } = this;
    const frame = ++this.frameId;
    for (const bucket of fishBuckets) bucket.length = 0;
    for (let pass = 0; pass < 2; pass++) {
      for (const f of world.fish) {
        if (!f.alive || (f.depth > 0.78 ? 0 : 1) !== pass) continue;
        const i = this.cellIndex(f.x, f.y);
        if (i < 0 || fishStamp[i] === frame || koiFlag[i]) continue;
        fishStamp[i] = frame;
        const glint = clamp(Math.abs(f.turn) / 3.5, 0, 1);
        const v = 0.3 + (0.4 * (f.depth - 0.55)) / 0.45 + 0.3 * Math.max(glint, f.alarm);
        fishBuckets[clamp(Math.floor(v * FISH_ALPHAS.length), 0, FISH_ALPHAS.length - 1)].push(i);
      }
    }
  }

  private drawFish() {
    const { ctx, cw, ch, cols, fishBuckets } = this;
    for (let b = 0; b < fishBuckets.length; b++) {
      const bucket = fishBuckets[b];
      if (!bucket.length) continue;
      ctx.fillStyle = this.fishStyles[b];
      for (const i of bucket) {
        ctx.fillText("-", (i % cols) * cw + cw / 2, ((i / cols) | 0) * ch + ch / 2 + 1);
      }
    }
  }

  private drawHeat() {
    const { ctx, heat, cols, cw, ch } = this;
    for (let i = 0; i < heat.length; i++) {
      const h = heat[i];
      if (h < 0.08) continue;
      const col = i % cols;
      const row = (i / cols) | 0;
      ctx.fillStyle =
        h > 0.5
          ? `rgba(255,120,60,${h.toFixed(2)})`
          : `rgba(220,40,40,${(h * 1.6).toFixed(2)})`;
      ctx.fillText(h > 0.6 ? "*" : "·", col * cw + cw / 2, row * ch + ch / 2 + 1);
    }
  }

  private drawWake() {
    const { ctx, cols, rows, cw, ch, energy, koiFlag, fishStamp, frameId, wakeOf } = this;
    const n = cols * rows;
    const small = Math.max(2, Math.round(cw * 0.19));
    const size = small + 1;
    for (let i = 0; i < n; i++) {
      const e = energy[i];
      wakeOf[i] =
        e > 0.45 && !koiFlag[i] && fishStamp[i] !== frameId
          ? clamp(Math.floor((e - 0.45) * 5), 0, ALPHA_LEVELS - 1)
          : -1;
    }
    for (let l = 0; l < ALPHA_LEVELS; l++) {
      ctx.fillStyle = this.wakeStyles[l];
      for (let i = 0; i < n; i++) {
        if (wakeOf[i] !== l) continue;
        const col = i % cols;
        const row = (i / cols) | 0;
        ctx.fillRect(
          Math.round(col * cw + cw * 0.66 - size / 2),
          Math.round(row * ch + ch * 0.64 - size / 2),
          size,
          size
        );
      }
    }
  }
}
