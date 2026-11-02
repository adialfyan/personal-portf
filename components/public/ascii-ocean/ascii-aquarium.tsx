"use client";

import { useEffect, useRef, useState } from "react";
import type { OceanEngine } from "./engine";
import type { KoiKind } from "./world";

const VARIETY_OPTIONS: { id: KoiKind | "all"; label: string; desc: string }[] = [
  { id: "all", label: "Mixed Pond", desc: "Nishikigoi School • Kohaku, Tancho & Butterfly" },
  { id: "kohaku", label: "Kohaku", desc: "紅白 • Coral red plates over crisp white skin" },
  { id: "tancho", label: "Tancho", desc: "丹頂 • Pure white with an iconic round red crown" },
  { id: "butterfly", label: "Butterfly", desc: "鰭長鯉 • Extended flowing pectoral and veil fins" },
  { id: "orange", label: "Orange Ogon", desc: "山吹黄金 • Warm amber-gold with cream saddles" },
  { id: "benigoi", label: "Benigoi", desc: "紅鯉 • Deep solid crimson red body" },
];

export function AsciiAquarium() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OceanEngine | null>(null);
  const [inView, setInView] = useState(false);

  const [activeVariety, setActiveVariety] = useState<KoiKind | "all">("all");
  const varietyRef = useRef(activeVariety);
  const [isPaused, setIsPaused] = useState(false);

  // Sync varietyRef outside render
  useEffect(() => {
    varietyRef.current = activeVariety;
  }, [activeVariety]);

  // Lazy-mount: Only instantiate canvas engine when within 350px of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let engine: OceanEngine | null = null;
    let active = true;

    import("./engine").then(({ OceanEngine: EngineClass }) => {
      if (!active || !canvasRef.current) return;
      engine = new EngineClass(canvasRef.current);
      engineRef.current = engine;
      if (varietyRef.current !== "all") {
        engine.setVariety(varietyRef.current);
      }
    });

    return () => {
      active = false;
      if (engine) {
        engine.destroy();
        engineRef.current = null;
      }
    };
  }, [inView]);

  const handleSelectVariety = (kind: KoiKind | "all") => {
    setActiveVariety(kind);
    if (engineRef.current) {
      engineRef.current.setVariety(kind);
    }
  };

  const handleTogglePause = () => {
    if (engineRef.current) {
      const paused = engineRef.current.togglePause();
      setIsPaused(paused);
    }
  };

  const handleManualSplash = () => {
    if (engineRef.current) {
      engineRef.current.triggerSplash();
    }
  };

  const currentOption = VARIETY_OPTIONS.find((s) => s.id === activeVariety);

  return (
    <section
      ref={sectionRef}
      id="ascii-aquarium"
      className="relative w-full py-16 md:py-24 border-t border-border bg-background text-foreground overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header Editorial Intro */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Digital Artifact &bull; Japanese Sumi-e Computing
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.02em] text-foreground text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ASCII Nishikigoi Pond
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted max-w-xl font-normal leading-relaxed">
              Living Japanese koi pond simulated with Reynolds flocking boids, soft kinematic body waves, and blooming water lilies rendered entirely in monospace typography.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleManualSplash}
              className="group inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-[0.15em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-[1.5px] bg-neutral-300 border border-neutral-400/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] group-hover:bg-neutral-400 transition-colors" />
              Feed &bull; Splash
            </button>
            <button
              type="button"
              onClick={handleTogglePause}
              className={`group inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-[0.15em] uppercase rounded-[3px] border transition-all cursor-pointer ${
                isPaused
                  ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.24),0_1px_0_#000] active:translate-y-[1px]"
                  : "border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-[1.5px] border transition-all ${
                  isPaused
                    ? "bg-white border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                    : "bg-neutral-300 border-neutral-400/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] group-hover:bg-neutral-400"
                }`}
              />
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>

        {/* Variety Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-muted mr-1 sm:mr-2 shrink-0">
            Nishikigoi Variety:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {VARIETY_OPTIONS.map((opt) => {
              const isSelected = activeVariety === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectVariety(opt.id)}
                  className={`group inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-[0.15em] uppercase rounded-[3px] border transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.24),0_1px_0_#000] active:translate-y-[1px]"
                      : "bg-neutral-50/90 text-neutral-600 border-neutral-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:text-foreground hover:border-neutral-400/90 active:translate-y-[1px]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-[1.5px] mr-1.5 shrink-0 border transition-all ${
                      isSelected
                        ? "bg-white border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                        : "bg-neutral-300 border-neutral-400/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] group-hover:bg-neutral-400"
                    }`}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Wide Zen Pond with Ultra-Smooth Perimeter Dissolve (No oval fog, no sharp borders) */}
        <div className="relative mx-auto w-full max-w-[1360px] flex items-center justify-center my-6 sm:my-8">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[2.2/1] min-h-[240px] sm:min-h-[340px] md:min-h-[420px] max-h-[560px] transition-all duration-500">
            <canvas
              ref={canvasRef}
              className="block w-full h-full cursor-crosshair touch-none select-none"
              aria-label="Interactive ASCII Nishikigoi Pond canvas"
            />
            {/* Eased Multi-Stop Perimeter Fade: ultra-soft watercolor dissipation into #ffffff with zero oval halo */}
            <div
              className="pointer-events-none absolute -inset-[2px] z-10"
              style={{
                background: [
                  "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.96) clamp(8px, 1.8vw, 14px), rgba(255,255,255,0.84) clamp(18px, 3.8vw, 30px), rgba(255,255,255,0.66) clamp(30px, 6vw, 48px), rgba(255,255,255,0.45) clamp(44px, 8.5vw, 68px), rgba(255,255,255,0.25) clamp(58px, 11vw, 88px), rgba(255,255,255,0.1) clamp(72px, 13.5vw, 108px), rgba(255,255,255,0.02) clamp(86px, 16vw, 124px), transparent clamp(98px, 18vw, 138px))",
                  "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.96) clamp(8px, 1.8vw, 14px), rgba(255,255,255,0.84) clamp(18px, 3.8vw, 30px), rgba(255,255,255,0.66) clamp(30px, 6vw, 48px), rgba(255,255,255,0.45) clamp(44px, 8.5vw, 68px), rgba(255,255,255,0.25) clamp(58px, 11vw, 88px), rgba(255,255,255,0.1) clamp(72px, 13.5vw, 108px), rgba(255,255,255,0.02) clamp(86px, 16vw, 124px), transparent clamp(98px, 18vw, 138px))",
                  "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.96) clamp(8px, 1.8vw, 14px), rgba(255,255,255,0.84) clamp(18px, 3.8vw, 30px), rgba(255,255,255,0.66) clamp(30px, 6vw, 48px), rgba(255,255,255,0.45) clamp(44px, 8.5vw, 68px), rgba(255,255,255,0.25) clamp(58px, 11vw, 88px), rgba(255,255,255,0.1) clamp(72px, 13.5vw, 108px), rgba(255,255,255,0.02) clamp(86px, 16vw, 124px), transparent clamp(98px, 18vw, 138px))",
                  "linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0.96) clamp(8px, 1.8vw, 14px), rgba(255,255,255,0.84) clamp(18px, 3.8vw, 30px), rgba(255,255,255,0.66) clamp(30px, 6vw, 48px), rgba(255,255,255,0.45) clamp(44px, 8.5vw, 68px), rgba(255,255,255,0.25) clamp(58px, 11vw, 88px), rgba(255,255,255,0.1) clamp(72px, 13.5vw, 108px), rgba(255,255,255,0.02) clamp(86px, 16vw, 124px), transparent clamp(98px, 18vw, 138px))",
                  "radial-gradient(circle clamp(75px, 14vw, 130px) at 0% 0%, #ffffff 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.15) 80%, transparent 100%)",
                  "radial-gradient(circle clamp(75px, 14vw, 130px) at 100% 0%, #ffffff 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.15) 80%, transparent 100%)",
                  "radial-gradient(circle clamp(75px, 14vw, 130px) at 0% 100%, #ffffff 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.15) 80%, transparent 100%)",
                  "radial-gradient(circle clamp(75px, 14vw, 130px) at 100% 100%, #ffffff 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.15) 80%, transparent 100%)",
                ].join(", "),
              }}
            />
          </div>
        </div>

        {/* Quiet Editorial Caption (No telemetry clutter) */}
        <div className="mt-4 text-center text-xs font-medium tracking-[0.2em] uppercase text-muted transition-opacity duration-300">
          <span className="text-foreground">{currentOption?.label}</span>
          <span className="mx-2.5">&bull;</span>
          <span>{currentOption?.desc}</span>
        </div>
      </div>
    </section>
  );
}
