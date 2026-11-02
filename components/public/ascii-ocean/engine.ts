import { AsciiRenderer } from "./renderer";
import { World, type KoiKind, type KoiSpec } from "./world";

const STEP = 1 / 60;
const MAX_STEPS = 4;

export class OceanEngine {
  public world: World;
  private renderer: AsciiRenderer;
  private raf = 0;
  private last = 0;
  private lastRender = 0;
  private readonly targetFrameDuration = 1000 / 30; // 30 FPS rendering budget
  private acc = 0;
  private visible = false;
  private isPaused = false;
  private reducedMotion: MediaQueryList;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement, koi?: KoiSpec[]) {
    this.world = new World(koi);
    this.renderer = new AsciiRenderer(canvas);
    this.renderer.setFontFamily("ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace");
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);

    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    canvas.addEventListener("pointermove", this.onPointerMove, { passive: true });
    canvas.addEventListener("pointerdown", this.onPointerDown, { passive: true });
    canvas.addEventListener("pointerup", this.onPointerLeave);
    canvas.addEventListener("pointercancel", this.onPointerLeave);
    canvas.addEventListener("pointerleave", this.onPointerLeave);

    this.resize();
    document.fonts?.load(`600 16px monospace`).then(() => {
      if (!this.disposed && this.reducedMotion.matches) this.drawStill();
    });
  }

  setVariety(kind: KoiKind | "all") {
    this.world.setVariety(kind);
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.world.resize(rect.width, rect.height, this.renderer.cellWidth, this.renderer.cellHeight);
    }
  }

  togglePause(): boolean {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.last = performance.now();
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(this.frame);
    } else {
      cancelAnimationFrame(this.raf);
    }
    return this.isPaused;
  }

  triggerSplash(clientX?: number, clientY?: number) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const y = clientY !== undefined ? clientY - rect.top : rect.height / 2;
    this.world.splash(x, y);
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerLeave);
    this.canvas.removeEventListener("pointercancel", this.onPointerLeave);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    // Cap DPR to 1.25: Monospace character cells remain ultra-crisp while eliminating 60% memory & overdraw on high-DPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.renderer.resize(rect.width, rect.height, dpr);
    this.world.resize(rect.width, rect.height, this.renderer.cellWidth, this.renderer.cellHeight);
    if (this.reducedMotion.matches) this.drawStill();
  }

  private schedule() {
    cancelAnimationFrame(this.raf);
    if (this.disposed || !this.visible || this.isPaused || this.reducedMotion.matches) return;
    this.last = performance.now();
    this.lastRender = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    if (this.isPaused || this.disposed || !this.visible) return;
    this.raf = requestAnimationFrame(this.frame);

    const elapsed = now - this.lastRender;
    if (elapsed < this.targetFrameDuration) return;
    this.lastRender = now - (elapsed % this.targetFrameDuration);

    const dt = Math.min(0.08, (now - this.last) / 1000);
    this.last = now;
    this.acc += dt;
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS) {
      this.world.step(STEP);
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    this.renderer.render(this.world, dt);
  };

  private drawStill() {
    if (this.world.time < 4) {
      for (let i = 0; i < 240; i++) this.world.step(STEP);
    }
    this.renderer.render(this.world, STEP);
  }

  private onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.raf);
      this.drawStill();
    } else {
      this.schedule();
    }
  };

  private toLocal(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    return { x, y, inside };
  }

  private onPointerMove = (e: PointerEvent) => {
    const { x, y, inside } = this.toLocal(e);
    const p = this.world.pointer;
    p.x = x;
    p.y = y;
    p.active = inside;
  };

  private onPointerDown = (e: PointerEvent) => {
    const { x, y, inside } = this.toLocal(e);
    if (inside && !this.reducedMotion.matches) this.world.splash(x, y);
  };

  private onPointerLeave = () => {
    this.world.pointer.active = false;
  };
}
