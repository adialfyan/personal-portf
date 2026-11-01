"use client";

import { useEffect, useRef, useState } from "react";
import { OceanEngine } from "./engine";
import type { KoiKind } from "./world";
import type { Theme } from "./renderer";

const VARIETY_OPTIONS: { id: KoiKind | "all"; label: string; desc: string }[] = [
  { id: "all", label: "Mixed Pond", desc: "Nishikigoi School • Kohaku, Tancho & Butterfly" },
  { id: "kohaku", label: "Kohaku", desc: "紅白 • Coral red plates over crisp white skin" },
  { id: "tancho", label: "Tancho", desc: "丹頂 • Pure white with an iconic round red crown" },
  { id: "butterfly", label: "Butterfly", desc: "鰭長鯉 • Extended flowing pectoral and veil fins" },
  { id: "orange", label: "Orange Ogon", desc: "山吹黄金 • Warm amber-gold with cream saddles" },
  { id: "benigoi", label: "Benigoi", desc: "紅鯉 • Deep solid crimson red body" },
];

const POND_MASKS: Record<Theme, string> = {
  dark: "radial-gradient(ellipse 50% 48% at 50% 50%, #000000 0%, #000000 28%, rgba(0,0,0,0.96) 40%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.65) 66%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0.06) 95%, transparent 100%)",
  light: "radial-gradient(ellipse 50% 48% at 50% 50%, #000000 0%, #000000 26%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.62) 64%, rgba(0,0,0,0.38) 76%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.04) 96%, transparent 100%)",
};

export function AsciiAquarium() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OceanEngine | null>(null);

  const [activeVariety, setActiveVariety] = useState<KoiKind | "all">("all");
  const [theme, setTheme] = useState<Theme>("dark");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OceanEngine(canvas, undefined, "dark");
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleSelectVariety = (kind: KoiKind | "all") => {
    setActiveVariety(kind);
    if (engineRef.current) {
      engineRef.current.setVariety(kind);
    }
  };

  const handleToggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (engineRef.current) {
      engineRef.current.setTheme(newTheme);
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
    <section className="relative w-full py-16 md:py-24 border-t border-border bg-background text-foreground overflow-hidden">
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

          {/* Action Tools & Theme Selector */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Theme Toggle (Washi vs Midnight) */}
            <div className="flex items-center border border-border p-0.5 rounded-sm bg-surface">
              <button
                type="button"
                onClick={() => handleToggleTheme("light")}
                className={`px-3 py-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                  theme === "light"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Washi Paper
              </button>
              <button
                type="button"
                onClick={() => handleToggleTheme("dark")}
                className={`px-3 py-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Midnight Ink
              </button>
            </div>

            <button
              type="button"
              onClick={handleManualSplash}
              className="px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase border border-border bg-background text-foreground hover:bg-surface transition-colors cursor-pointer"
            >
              Feed &bull; Splash
            </button>
            <button
              type="button"
              onClick={handleTogglePause}
              className={`px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase border transition-colors cursor-pointer ${
                isPaused
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-surface"
              }`}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>

        {/* Variety Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-muted mr-2">
            Nishikigoi Variety:
          </span>
          {VARIETY_OPTIONS.map((opt) => {
            const isSelected = activeVariety === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectVariety(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-all cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-muted hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Organic Oval Zen Pond with Smooth Radial Gradient Blend (Zero harsh box borders) */}
        <div className="relative mx-auto w-full max-w-5xl flex items-center justify-center my-4">
          <div
            className="relative w-full aspect-[2/1] min-h-[380px] max-h-[500px] overflow-hidden transition-all duration-500"
            style={{
              maskImage: POND_MASKS[theme],
              WebkitMaskImage: POND_MASKS[theme],
            }}
          >
            <canvas
              ref={canvasRef}
              className="block w-full h-full cursor-crosshair touch-none select-none"
              aria-label="Interactive ASCII Nishikigoi Pond canvas"
            />
          </div>
        </div>

        {/* Quiet Editorial Caption (No telemetry clutter) */}
        <div className="mt-4 text-center text-xs font-medium tracking-[0.2em] uppercase text-muted">
          <span className="text-foreground">{currentOption?.label}</span>
          <span className="mx-2.5">&bull;</span>
          <span>{currentOption?.desc}</span>
        </div>
      </div>
    </section>
  );
}
