import { angleDiff, clamp, current, rand, randInt, TAU } from "./math";
import { pickSpecies, SPECIES } from "./species";

export const KOI_NODES = 20;

export type KoiKind = "kohaku" | "orange" | "benigoi" | "tancho" | "butterfly";

export type KoiSpec = { kind: KoiKind; size: number };

const DEFAULT_KOIS: KoiSpec[] = [
  { kind: "kohaku", size: 1.05 },
  { kind: "orange", size: 0.96 },
  { kind: "tancho", size: 0.9 },
  { kind: "butterfly", size: 0.94 },
  { kind: "benigoi", size: 0.88 },
  { kind: "kohaku", size: 0.8 },
  { kind: "orange", size: 0.76 },
  { kind: "butterfly", size: 0.72 },
];

export interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  species: number;
  alarm: number;
  alive: boolean;
  respawnAt: number;
  phase: number;
  turn: number;
  depth: number;
  millDir: 1 | -1;
}

export interface Prey {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
}

export interface Koi {
  id: number;
  kind: KoiKind;
  length: number;
  nodes: Float32Array;
  heading: number;
  speed: number;
  phase: number;
  turn: number;
  hunger: number;
  wander: number;
  orbitDir: 1 | -1;
  orbitRadius: number;
  ring: number;
  target: Prey | null;
  retargetAt: number;
  depth: number;
}

export interface LilyPad {
  x: number;
  y: number;
  radius: number;
  notchAngle: number;
  hasFlower: boolean;
}

export interface WorldEvent {
  kind: "eat" | "splash" | "drop";
  x: number;
  y: number;
}

const FISH_SEPARATION_K = 420;
const FISH_ALIGN_K = 1.4;
const FISH_COHESION_K = 1;
const FISH_FLEE_K = 1100;
const BODY_CLEARANCE = 0.12;
const BLIND_COS = -0.6;

export class World {
  width = 0;
  height = 0;
  time = 0;
  fish: Fish[] = [];
  koi: Koi[] = [];
  lilyPads: LilyPad[] = [];
  events: WorldEvent[] = [];
  pointer = { x: 0, y: 0, active: false };

  private perception = 60;
  private sepX: number[] = [];
  private sepY: number[] = [];
  private foreignSep = 40;
  private bucketCols = 0;
  private bucketRows = 0;
  private bucketHead = new Int32Array(0);
  private bucketCount = new Uint16Array(0);
  private bucketNext = new Int32Array(0);
  private lastSpawn = 0;
  private nextDropTime = 1.6;
  private tmp = { x: 0, y: 0 };

  constructor(
    private koiSpecs: KoiSpec[] = DEFAULT_KOIS,
    private fishCount?: number,
  ) {}

  setVariety(kind: KoiKind | "all") {
    if (kind === "all") {
      this.koiSpecs = DEFAULT_KOIS;
    } else {
      this.koiSpecs = [
        { kind, size: 1.05 },
        { kind, size: 0.96 },
        { kind, size: 0.88 },
        { kind, size: 0.82 },
        { kind, size: 0.76 },
        { kind, size: 0.7 },
      ];
    }
    this.seed();
  }

  resize(width: number, height: number, cellW: number, cellH: number) {
    const first = this.width === 0;
    this.width = width;
    this.height = height;
    this.sepX = SPECIES.map((sp) => sp.spacing[0] * cellW);
    this.sepY = SPECIES.map((sp) => sp.spacing[1] * cellH);
    this.perception = Math.max(cellH * 3, cellW * 5.5);
    this.foreignSep = cellW * 3;

    if (first || this.fish.length === 0) {
      this.seed();
      this.generateLilyPads();
      return;
    }
    for (const f of this.fish) {
      f.x = clamp(f.x, 0, width);
      f.y = clamp(f.y, 0, height);
    }
    this.generateLilyPads();
  }

  generateLilyPads() {
    const { width: W, height: H } = this;
    if (W === 0 || H === 0) return;
    const isMobile = W < 500;
    const padScale = isMobile ? 0.065 : 0.085;
    this.lilyPads = isMobile
      ? [
          { x: W * 0.22, y: H * 0.26, radius: Math.min(W, H) * padScale, notchAngle: 0.8, hasFlower: true },
          { x: W * 0.78, y: H * 0.74, radius: Math.min(W, H) * padScale * 1.1, notchAngle: 2.4, hasFlower: true },
        ]
      : [
          { x: W * 0.18, y: H * 0.25, radius: Math.min(W, H) * 0.08, notchAngle: 0.8, hasFlower: true },
          { x: W * 0.82, y: H * 0.28, radius: Math.min(W, H) * 0.09, notchAngle: 2.4, hasFlower: true },
          { x: W * 0.35, y: H * 0.72, radius: Math.min(W, H) * 0.085, notchAngle: -1.2, hasFlower: false },
          { x: W * 0.75, y: H * 0.68, radius: Math.min(W, H) * 0.075, notchAngle: 3.1, hasFlower: true },
        ];
  }

  seed() {
    const { width: W, height: H } = this;
    if (W === 0 || H === 0) return;
    const minSide = Math.min(W, H);
    // Graceful proportional scaling on mobile screens
    const baseLength = W < 500 ? clamp(minSide * 0.28, 65, 115) : clamp(minSide * 0.34, 130, 220);
    const koiCount = this.koiSpecs.length;

    this.koi = [];
    for (let i = 0; i < koiCount; i++) {
      const { kind, size } = this.koiSpecs[i];
      const length = baseLength * size;
      const ring = koiCount > 1 ? (i * 0.618) % 1 : 0.5;
      const orbitRadius = this.ringRadius(ring, length);
      const a = (i / koiCount) * TAU + rand(-0.2, 0.2);
      const orbitDir: 1 | -1 = 1;
      const x = W / 2 + Math.cos(a) * orbitRadius * (W / minSide) * 0.9;
      const y = H / 2 + Math.sin(a) * orbitRadius;
      const heading = a + (orbitDir * Math.PI) / 2;
      const nodes = new Float32Array(KOI_NODES * 2);
      const seg = length / (KOI_NODES - 1);
      for (let n = 0; n < KOI_NODES; n++) {
        nodes[n * 2] = x - Math.cos(heading) * seg * n;
        nodes[n * 2 + 1] = y - Math.sin(heading) * seg * n;
      }
      this.koi.push({
        id: i + 1,
        kind,
        length,
        nodes,
        heading,
        speed: 30,
        phase: rand(0, TAU),
        turn: 0,
        hunger: rand(0.25, 0.75),
        wander: 0,
        orbitDir,
        orbitRadius,
        ring,
        target: null,
        retargetAt: 0,
        depth: size,
      });
    }
    this.koi.sort((a, b) => a.length - b.length);

    const total = this.fishCount ?? clamp(Math.round((W * H) / 5000), 50, 150);
    this.fish = [];
    while (this.fish.length < total) {
      const species = pickSpecies();
      const sp = SPECIES[species];
      const size = Math.min(randInt(sp.schoolSize[0], sp.schoolSize[1]), total - this.fish.length);
      const millDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      const cx = rand(W * 0.06, W * 0.94);
      const cy = rand(H * 0.08, H * 0.92);
      const dir = (Math.random() < 0.5 ? 0 : Math.PI) + rand(-0.5, 0.5);
      for (let k = 0; k < size; k++) {
        this.fish.push({
          x: cx + rand(-1, 1) * this.sepX[species] * Math.sqrt(size),
          y: cy + rand(-1, 1) * this.sepY[species] * Math.sqrt(size) * 0.6,
          vx: Math.cos(dir) * sp.cruise,
          vy: Math.sin(dir) * sp.cruise,
          species,
          alarm: 0,
          alive: true,
          respawnAt: 0,
          phase: rand(0, TAU),
          turn: 0,
          depth: rand(0.55, 1),
          millDir,
        });
      }
    }
    this.bucketNext = new Int32Array(this.fish.length);
  }

  splash(x: number, y: number) {
    this.events.push({ kind: "splash", x, y });
    this.events.push({ kind: "drop", x, y });
    const r = 240;
    for (const f of this.fish) {
      if (!f.alive) continue;
      const dx = f.x - x;
      const dy = f.y - y;
      const d = Math.hypot(dx, dy);
      if (d > r || d < 1e-3) continue;
      const k = (1 - d / r) * 260;
      f.vx += (dx / d) * k;
      f.vy += (dy / d) * k;
      f.alarm = 1;
    }
  }

  step(dt: number) {
    this.time += dt;

    // Autonomous gentle morning rain/dew droplets falling into the pond
    if (this.width > 0 && this.height > 0 && this.time >= this.nextDropTime) {
      const rx = rand(this.width * 0.22, this.width * 0.78);
      const ry = rand(this.height * 0.22, this.height * 0.78);
      this.events.push({ kind: "drop", x: rx, y: ry });
      this.nextDropTime = this.time + rand(1.4, 2.8);
    }

    this.rebuildHash();
    this.stepFish(dt);
    this.stepKoi(dt);
    this.separateBodies();
    this.keepInside();
    this.respawn();
  }

  private rebuildHash() {
    const size = this.perception;
    const pad = 2;
    this.bucketCols = Math.ceil(this.width / size) + pad * 2;
    this.bucketRows = Math.ceil(this.height / size) + pad * 2;
    const n = this.bucketCols * this.bucketRows;
    if (this.bucketHead.length !== n) {
      this.bucketHead = new Int32Array(n);
      this.bucketCount = new Uint16Array(n);
    }
    this.bucketHead.fill(-1);
    this.bucketCount.fill(0);
    if (this.bucketNext.length !== this.fish.length) {
      this.bucketNext = new Int32Array(this.fish.length);
    }
    for (let i = 0; i < this.fish.length; i++) {
      const f = this.fish[i];
      if (!f.alive) continue;
      const b = this.bucketOf(f.x, f.y);
      this.bucketNext[i] = this.bucketHead[b];
      this.bucketHead[b] = i;
      this.bucketCount[b]++;
    }
  }

  private bucketOf(x: number, y: number) {
    const size = this.perception;
    const c = clamp(Math.floor(x / size) + 2, 0, this.bucketCols - 1);
    const r = clamp(Math.floor(y / size) + 2, 0, this.bucketRows - 1);
    return r * this.bucketCols + c;
  }

  private stepFish(dt: number) {
    const { fish, koi, pointer, width: W, height: H, time } = this;
    const R = this.perception;
    const R2 = R * R;
    const foreignSep = this.foreignSep;
    const size = this.perception;
    const cols = this.bucketCols;
    const rows = this.bucketRows;
    const head = this.bucketHead;
    const next = this.bucketNext;
    const cur = this.tmp;
    const calmDecay = Math.exp(-dt * 0.7);
    const contagion = Math.min(1, dt * 6);

    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      if (!f.alive) continue;
      const sp = SPECIES[f.species];
      const spread = 1 + 1.8 * f.alarm;
      const sepX = this.sepX[f.species] * spread;
      const sepY = this.sepY[f.species] * spread;

      const speed = Math.hypot(f.vx, f.vy) || 1;
      const hx = f.vx / speed;
      const hy = f.vy / speed;

      let ax = 0;
      let ay = 0;
      let sx = 0;
      let sy = 0;
      let avx = 0;
      let avy = 0;
      let cx = 0;
      let cy = 0;
      let n = 0;
      let neighbourAlarm = 0;

      const bc = clamp(Math.floor(f.x / size) + 2, 0, cols - 1);
      const br = clamp(Math.floor(f.y / size) + 2, 0, rows - 1);
      for (let r = Math.max(0, br - 1); r <= Math.min(rows - 1, br + 1); r++) {
        for (let c = Math.max(0, bc - 1); c <= Math.min(cols - 1, bc + 1); c++) {
          let j = head[r * cols + c];
          while (j !== -1) {
            if (j !== i) {
              const o = fish[j];
              const dx = o.x - f.x;
              const dy = o.y - f.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < R2 && d2 > 1e-6) {
                const d = Math.sqrt(d2);
                if ((dx * hx + dy * hy) / d > BLIND_COS) {
                  const qx = dx / sepX;
                  const qy = dy / sepY;
                  const q2 = qx * qx + qy * qy;
                  if (q2 < 1) {
                    const q = Math.sqrt(q2) || 1e-3;
                    const k = (1 - q) / q;
                    sx -= qx * k;
                    sy -= qy * k;
                  }
                  if (o.species === f.species) {
                    avx += o.vx;
                    avy += o.vy;
                    cx += dx;
                    cy += dy;
                    n++;
                  } else if (d < foreignSep) {
                    const k = ((1 - d / foreignSep) / d) * 0.6;
                    sx -= dx * k;
                    sy -= dy * k;
                  }
                  if (o.alarm > neighbourAlarm) neighbourAlarm = o.alarm;
                }
              }
            }
            j = next[j];
          }
        }
      }

      ax += sx * FISH_SEPARATION_K;
      ay += sy * FISH_SEPARATION_K;
      if (n > 0) {
        const alignK = FISH_ALIGN_K * sp.align;
        const cohesionK = FISH_COHESION_K * sp.cohesion * (1 - 0.8 * f.alarm);
        ax += (avx / n - f.vx) * alignK + (cx / n) * cohesionK;
        ay += (avy / n - f.vy) * alignK + (cy / n) * cohesionK;
        if (sp.mill > 0) {
          const cl = Math.hypot(cx, cy) || 1;
          ax += (-cy / cl) * f.millDir * sp.mill * (1 - f.alarm);
          ay += (cx / cl) * f.millDir * sp.mill * (1 - f.alarm);
        }
      }

      let fear = 0;
      for (const sh of koi) {
        const fearR = sh.length * 0.6 + 60;
        let best = Infinity;
        let bx = 0;
        let by = 0;
        for (let k = 0; k <= 12; k += 3) {
          const nx = sh.nodes[k * 2];
          const ny = sh.nodes[k * 2 + 1];
          const d2 = (f.x - nx) ** 2 + (f.y - ny) ** 2;
          if (d2 < best) {
            best = d2;
            bx = nx;
            by = ny;
          }
        }
        const d = Math.sqrt(best);
        if (d >= fearR || d < 1e-3) continue;
        let w = 1 - d / fearR;
        w *= w;
        const awayX = (f.x - bx) / d;
        const awayY = (f.y - by) / d;
        const shx = Math.cos(sh.heading);
        const shy = Math.sin(sh.heading);
        const side = shx * (f.y - sh.nodes[1]) - shy * (f.x - sh.nodes[0]) >= 0 ? 1 : -1;
        ax += (awayX * 0.7 - shy * side * 0.9) * FISH_FLEE_K * w;
        ay += (awayY * 0.7 + shx * side * 0.9) * FISH_FLEE_K * w;
        fear = Math.max(fear, Math.sqrt(w));
      }

      if (pointer.active) {
        const pr = 130;
        const dx = f.x - pointer.x;
        const dy = f.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < pr && d > 1e-3) {
          const w = (1 - d / pr) ** 2;
          ax += (dx / d) * FISH_FLEE_K * w;
          ay += (dy / d) * FISH_FLEE_K * w;
          fear = Math.max(fear, Math.sqrt(w) * 0.8);
        }
      }

      let alarm = Math.max(f.alarm * calmDecay, fear);
      const relayed = neighbourAlarm * 0.86;
      if (relayed > alarm) alarm += (relayed - alarm) * contagion;
      f.alarm = alarm;

      const m = 36;
      if (f.x < m) ax += (m - f.x) * 7;
      else if (f.x > W - m) ax -= (f.x - (W - m)) * 7;
      if (f.y < m) ay += (m - f.y) * 7;
      else if (f.y > H - m) ay -= (f.y - (H - m)) * 7;

      current(f.x, f.y, time, cur);
      ax += cur.x * 0.5 + (Math.random() - 0.5) * sp.jitter;
      ay += cur.y * 0.5 + (Math.random() - 0.5) * sp.jitter;
      ay -= f.vy * sp.verticalDrag * (1 - 0.7 * f.alarm);

      const preferred = sp.cruise * (1 + 1.3 * f.alarm);
      ax += (preferred - speed) * hx * 1.6;
      ay += (preferred - speed) * hy * 1.6;

      const before = Math.atan2(f.vy, f.vx);
      f.vx += ax * dt;
      f.vy += ay * dt;
      const maxSpeed = sp.maxSpeed * (1 + 1.8 * f.alarm);
      const s = Math.hypot(f.vx, f.vy);
      if (s > maxSpeed) {
        f.vx *= maxSpeed / s;
        f.vy *= maxSpeed / s;
      } else if (s < sp.minSpeed && s > 1e-3) {
        f.vx *= sp.minSpeed / s;
        f.vy *= sp.minSpeed / s;
      }
      f.turn += (angleDiff(before, Math.atan2(f.vy, f.vx)) / dt - f.turn) * Math.min(1, dt * 8);
      f.phase += dt * (7 + Math.hypot(f.vx, f.vy) * 0.12);
      f.x = clamp(f.x + f.vx * dt, -60, W + 60);
      f.y = clamp(f.y + f.vy * dt, -60, H + 60);
    }
  }

  private stepKoi(dt: number) {
    const { koi, width: W, height: H, time } = this;
    const minSide = Math.min(W, H);
    const cxW = W / 2;
    const cyW = H / 2;

    for (const sh of koi) {
      const L = sh.length;
      const nodes = sh.nodes;
      const hx = nodes[0];
      const hy = nodes[1];

      sh.hunger = Math.min(1, sh.hunger + dt * 0.025);

      let dx = Math.cos(sh.heading);
      let dy = Math.sin(sh.heading);

      sh.wander = clamp(sh.wander + (Math.random() - 0.5) * dt * 3.2, -1.1, 1.1);
      dx += Math.cos(sh.heading + sh.wander) * 0.45;
      dy += Math.sin(sh.heading + sh.wander) * 0.45;

      let huntX = 0;
      let huntY = 0;
      if (time >= sh.retargetAt) {
        sh.target = this.findPrey(sh);
        sh.retargetAt = time + 0.45;
      }
      const t = sh.target;
      let hunting = false;
      let closing = 0;
      const edgeM = L * 0.35 + 30;
      const reachable = !!t && t.x > edgeM && t.x < W - edgeM && t.y > edgeM && t.y < H - edgeM;
      if (t && t.alive && reachable && sh.hunger > 0.3) {
        const tx = t.x + t.vx * 0.35 - hx;
        const ty = t.y + t.vy * 0.35 - hy;
        const d = Math.hypot(tx, ty) || 1;
        const w = 1.4 + 2.6 * sh.hunger;
        huntX = (tx / d) * w;
        huntY = (ty / d) * w;
        hunting = true;
        closing = clamp(1 - d / (L * 0.9), 0, 1);
      } else {
        const rx = (hx - cxW) / (W / minSide);
        const ry = hy - cyW;
        const r = Math.hypot(rx, ry) || 1;
        const radius = this.ringRadius(sh.ring, L) * (1 + 0.08 * Math.sin(time * 0.05 + sh.id));
        const radial = clamp((radius - r) / radius, -1, 1);
        dx += ((-ry / r) * sh.orbitDir + (rx / r) * radial * 0.9) * 0.55;
        dy += ((rx / r) * sh.orbitDir + (ry / r) * radial * 0.9) * 0.55;
      }

      let crowded = 0;
      let avoidX = 0;
      let avoidY = 0;
      const aheadX = hx + Math.cos(sh.heading) * sh.speed * 2.4;
      const aheadY = hy + Math.sin(sh.heading) * sh.speed * 2.4;
      for (const other of koi) {
        if (other === sh) continue;
        const range = (L + other.length) * BODY_CLEARANCE * 3 + 50;
        for (let k = 0; k < KOI_NODES; k += 2) {
          const qx = other.nodes[k * 2];
          const qy = other.nodes[k * 2 + 1];
          for (let p = 0; p < 2; p++) {
            const ox = (p === 0 ? hx : aheadX) - qx;
            const oy = (p === 0 ? hy : aheadY) - qy;
            const d = Math.hypot(ox, oy);
            if (d >= range || d < 1e-3) continue;
            const near = 1 - d / range;
            avoidX += (ox / d) * near;
            avoidY += (oy / d) * near;
            if (near > crowded) crowded = near;
          }
        }
      }
      dx += huntX * (1 - 0.85 * crowded);
      dy += huntY * (1 - 0.85 * crowded);
      const avoid = Math.hypot(avoidX, avoidY);
      if (avoid > 1e-3) {
        const w = Math.min(avoid * 1.4, 3);
        dx += (avoidX / avoid) * w;
        dy += (avoidY / avoid) * w;
      }

      // Avoid lily pads: steer smoothly around floating leaves
      for (const pad of this.lilyPads) {
        const pdx = hx - pad.x;
        const pdy = hy - pad.y;
        const dist = Math.hypot(pdx, pdy);
        const padRadius = pad.radius + L * 0.16 + 24;
        if (dist < padRadius && dist > 1e-3) {
          const near = Math.pow((padRadius - dist) / padRadius, 1.6);
          const tx = -pdy / dist;
          const ty = pdx / dist;
          const headingDot = Math.cos(sh.heading) * ty - Math.sin(sh.heading) * tx;
          const dir = headingDot >= 0 ? 1 : -1;
          dx += (pdx / dist) * near * 6 + tx * dir * near * 4.5;
          dy += (pdy / dist) * near * 6 + ty * dir * near * 4.5;
        }
      }

      const ex = (hx - cxW) / (W * 0.3);
      const ey = (hy - cyW) / (H * 0.16);
      const e2 = ex * ex + ey * ey;
      if (e2 < 1) {
        const e = Math.sqrt(e2) || 1e-3;
        const w = (1 - e) * (hunting ? 1 : 2.5);
        dx += (ex / e) * w;
        dy += (ey / e) * w;
      }

      let walled = 0;
      const margin = L * 0.45 + 30;
      const lookX = hx + Math.cos(sh.heading) * sh.speed * 1.2;
      const lookY = hy + Math.sin(sh.heading) * sh.speed * 1.2;
      const mid = Math.round(KOI_NODES * 0.4) * 2;
      const back = Math.round(KOI_NODES * 0.75) * 2;
      const probes: [number, number, number][] = [
        [hx, hy, margin],
        [lookX, lookY, margin],
        [nodes[mid], nodes[mid + 1], L * 0.25 + 20],
        [nodes[back], nodes[back + 1], L * 0.2 + 16],
      ];
      for (const [px, py, pm] of probes) {
        const edges: [number, number, number][] = [
          [px, 1, 0],
          [W - px, -1, 0],
          [py, 0, 1],
          [H - py, 0, -1],
        ];
        for (const [dist, nx, ny] of edges) {
          if (dist >= pm) continue;
          const near = clamp(1 - dist / pm, 0, 1.5);
          dx += nx * near * near * 6;
          dy += ny * near * near * 6;
          if (near > walled) walled = Math.min(1, near);
        }
      }

      const desired = Math.atan2(dy, dx);
      const agility = Math.max(
        Math.min(hunting ? 1.9 + closing : 1, sh.speed / (L * 0.18)),
        crowded * 1.7,
        walled * 1.6
      );
      const maxTurn = agility * dt;
      const turned = clamp(angleDiff(sh.heading, desired), -maxTurn, maxTurn);
      sh.heading += turned;
      sh.turn += (turned / dt - sh.turn) * Math.min(1, dt * 3);

      const cruise = 24 + L * 0.035;
      const targetSpeed = (hunting ? cruise * (1.3 + closing * 1.2) : cruise) * (1 - 0.25 * crowded);
      sh.speed += (targetSpeed - sh.speed) * Math.min(1, dt * 0.9);
      sh.phase += dt * (1.1 + sh.speed / 40);

      nodes[0] += Math.cos(sh.heading) * sh.speed * dt;
      nodes[1] += Math.sin(sh.heading) * sh.speed * dt;

      const seg = L / (KOI_NODES - 1);
      const maxBend = 0.24;
      let prevAngle = sh.heading + Math.PI;
      for (let k = 1; k < KOI_NODES; k++) {
        const px = nodes[(k - 1) * 2];
        const py = nodes[(k - 1) * 2 + 1];
        let angle = Math.atan2(nodes[k * 2 + 1] - py, nodes[k * 2] - px);
        angle = prevAngle + clamp(angleDiff(prevAngle, angle), -maxBend, maxBend);
        nodes[k * 2] = px + Math.cos(angle) * seg;
        nodes[k * 2 + 1] = py + Math.sin(angle) * seg;
        prevAngle = angle;
      }

      if (sh.hunger > 0.15) {
        const mouthR = L * 0.05 + 8;
        const mx = nodes[0];
        const my = nodes[1];
        for (const f of this.fish) {
          if (!f.alive) continue;
          if ((f.x - mx) ** 2 + (f.y - my) ** 2 < mouthR * mouthR) {
            f.alive = false;
            f.respawnAt = time + rand(3, 8);
            sh.hunger = Math.max(0, sh.hunger - 0.16);
            this.events.push({ kind: "eat", x: f.x, y: f.y });
          }
        }
      }
    }
  }

  private ringRadius(ring: number, L: number) {
    const minSide = Math.min(this.width, this.height);
    const inner = minSide * 0.16;
    const outer = Math.max(inner, minSide / 2 - L * 0.32 - 20);
    return inner + (outer - inner) * ring;
  }

  private keepInside() {
    const { width: W, height: H } = this;
    for (const sh of this.koi) {
      const n = sh.nodes;
      for (let k = 0; k < KOI_NODES; k++) {
        const pad = sh.length * BODY_CLEARANCE * (1.3 - (k / (KOI_NODES - 1)) * 0.9) + 4;
        const ease = k < 3 ? 0.3 : 1;
        n[k * 2] += (clamp(n[k * 2], pad, W - pad) - n[k * 2]) * ease;
        n[k * 2 + 1] += (clamp(n[k * 2 + 1], pad, H - pad) - n[k * 2 + 1]) * ease;

        // Lily pad buffer
        for (const lp of this.lilyPads) {
          const ldx = n[k * 2] - lp.x;
          const ldy = n[k * 2 + 1] - lp.y;
          const dist = Math.hypot(ldx, ldy);
          const limit = lp.radius + 14;
          if (dist < limit && dist > 1e-3) {
            const push = ((limit - dist) / dist) * 0.18;
            n[k * 2] += ldx * push;
            n[k * 2 + 1] += ldy * push;
          }
        }
      }
    }
  }

  private separateBodies() {
    const list = this.koi;
    const N = KOI_NODES;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const an = a.nodes;
        const bn = b.nodes;
        const reach = (a.length + b.length) * (1 + BODY_CLEARANCE);
        if (Math.hypot(an[0] - bn[0], an[1] - bn[1]) > reach) continue;
        for (let p = 3; p < N; p++) {
          const wa = a.length * BODY_CLEARANCE * (1.3 - (p / (N - 1)) * 0.9);
          for (let q = 3; q < N; q++) {
            const min = wa + b.length * BODY_CLEARANCE * (1.3 - (q / (N - 1)) * 0.9);
            const ox = bn[q * 2] - an[p * 2];
            const oy = bn[q * 2 + 1] - an[p * 2 + 1];
            const d2 = ox * ox + oy * oy;
            if (d2 >= min * min || d2 < 1e-6) continue;
            const d = Math.sqrt(d2);
            const k = ((min - d) / d) * 0.12;
            an[p * 2] -= ox * k;
            an[p * 2 + 1] -= oy * k;
            bn[q * 2] += ox * k;
            bn[q * 2 + 1] += oy * k;
          }
        }
      }
    }
  }

  private findPrey(sh: Koi): Prey | null {
    const range = sh.length * 0.9 + 160;
    const hx = sh.nodes[0];
    const hy = sh.nodes[1];
    const fx = Math.cos(sh.heading);
    const fy = Math.sin(sh.heading);
    let best: Prey | null = null;
    let bestScore = Infinity;
    let currentScore = Infinity;
    const m = sh.length * 0.35 + 30;
    const { width: W, height: H } = this;
    const reachable = (p: Prey) => p.x > m && p.x < W - m && p.y > m && p.y < H - m;

    for (const f of this.fish) {
      if (!f.alive || !reachable(f)) continue;
      const dx = f.x - hx;
      const dy = f.y - hy;
      const d = Math.hypot(dx, dy);
      if (d > range || d < 1e-3) continue;
      const cos = (dx * fx + dy * fy) / d;
      if (cos < 0.2) continue;
      const crowd = this.bucketCount[this.bucketOf(f.x, f.y)];
      const score = d * (1 + (1 - cos) * 0.8) * (1 + crowd * 0.07);
      if (score < bestScore) {
        bestScore = score;
        best = f;
      }
      if (f === sh.target) currentScore = score;
    }
    if (sh.target && reachable(sh.target) && currentScore < bestScore * 1.3) return sh.target;
    return best;
  }

  private respawn() {
    const { time, width: W, height: H } = this;
    const due: Fish[] = [];
    for (const f of this.fish) if (!f.alive && f.respawnAt <= time) due.push(f);
    if (due.length === 0) return;
    if (due.length < 6 && time - this.lastSpawn < 9) return;
    this.lastSpawn = time;

    const side = randInt(0, 3);
    const along = rand(0.15, 0.85);
    const x = side === 0 ? -20 : side === 1 ? W + 20 : along * W;
    const y = side === 2 ? -20 : side === 3 ? H + 20 : along * H;
    const inward = Math.atan2(H / 2 - y, W / 2 - x) + rand(-0.5, 0.5);
    const species = pickSpecies();
    const sp = SPECIES[species];
    const millDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    for (const f of due.slice(0, sp.schoolSize[1])) {
      f.alive = true;
      f.species = species;
      f.alarm = 0;
      f.turn = 0;
      f.millDir = millDir;
      f.x = x + rand(-1, 1) * this.perception;
      f.y = y + rand(-1, 1) * this.perception;
      f.vx = Math.cos(inward) * sp.cruise * 1.4;
      f.vy = Math.sin(inward) * sp.cruise * 1.4;
    }
  }
}
