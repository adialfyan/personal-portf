"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import type { ShelfItem } from "@/lib/queries/types";

interface HyalineCarouselProps {
  items: ShelfItem[];
  className?: string;
  path?: "rise" | "fall";
}

const BASE_FRAME = 700;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const approach = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const wrapIndex = (i: number, n: number) => ((i % n) + n) % n;

export function HyalineCarousel({
  items,
  className = "",
  path = "rise",
}: HyalineCarouselProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shellsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ w: BASE_FRAME, h: BASE_FRAME });

  const n = items.length;

  // Configuration adapted strictly to monochromatic aesthetic
  const isFall = path === "fall";
  const drift = isFall ? -110 : 110;
  const rise = -14;
  const gap = 115;
  const yaw = isFall ? 24 : -24;
  const elevation = -8;
  const perspective = 1600;
  const cardWidth = 220;
  const cardAspect = 1.35; // height / width ratio approx
  const cardHeight = Math.round(cardWidth * cardAspect);

  // Physics state
  const stateRef = useRef({
    pos: 0,
    target: 0,
    down: false,
    dragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    vel: 0,
    hoverIdx: -1,
    raf: 0,
    lastFrame: 0,
  });

  // Total visible shells on stage
  const visibleShells = useMemo(() => {
    return Math.min(Math.max(n * 2, 12), 24);
  }, [n]);

  // Handle ResizeObserver
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight || 580;
      setDimensions({ w, h });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = Math.min(dimensions.w, dimensions.h) / BASE_FRAME;

  // Main Animation Loop
  useEffect(() => {
    if (n === 0) return;
    const state = stateRef.current;

    const loop = (now: number) => {
      const dt = state.lastFrame ? Math.min(0.05, (now - state.lastFrame) / 1000) : 1 / 60;
      state.lastFrame = now;

      // Autoplay smooth glide if not dragging and not hovering
      if (!state.down && !state.dragging && state.hoverIdx === -1) {
        state.target += 0.28 * dt;
      }

      // Smooth approach
      const rate = 14;
      const diff = state.target - state.pos;
      if (Math.abs(diff) < 0.0005) {
        state.pos = state.target;
      } else {
        state.pos += diff * approach(rate, dt);
      }

      const active = wrapIndex(Math.round(state.pos), n);
      setActiveItemIndex(active);

      // Render cards
      const half = visibleShells / 2;
      for (let j = 0; j < visibleShells; j++) {
        const el = shellsRef.current[j];
        if (!el) continue;

        let d = j - state.pos;
        // wrap position around total shells
        d -= visibleShells * Math.floor((d + half) / visibleShells);

        // Calculate 3D position
        const x = d * drift;
        const y = d * rise;
        const z = -d * gap;

        // Depth fade: ultra-smooth quadratic dissipation into distance
        const dist = Math.abs(d);
        // Start fading gradually at 1.0, reaching 0 smoothly at ~3.4
        const fadeProgress = clamp((dist - 1.0) / 2.4, 0, 1);
        const alpha = Math.pow(1 - fadeProgress, 1.8);

        if (alpha <= 0.005) {
          el.style.display = "none";
          continue;
        }

        const isHovered = state.hoverIdx === j;
        const liftY = isHovered ? -35 : 0;

        el.style.display = "block";
        el.style.transform = `translate3d(${x}px, ${y + liftY}px, ${z}px) scale(1)`;
        el.style.opacity = String(alpha);
        el.style.zIndex = String(Math.round(1000 - z + (isHovered ? 400 : 0)));
        el.style.pointerEvents = alpha > 0.4 ? "auto" : "none";
      }

      state.raf = requestAnimationFrame(loop);
    };

    state.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(state.raf);
  }, [n, drift, gap, rise, visibleShells]);

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const state = stateRef.current;
    state.down = true;
    state.dragging = false;
    state.startX = e.clientX;
    state.lastX = e.clientX;
    state.lastTime = performance.now();
    state.vel = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = stateRef.current;
    if (!state.down) return;
    const dx = e.clientX - state.lastX;
    const totalDx = e.clientX - state.startX;

    if (!state.dragging && Math.abs(totalDx) > 5) {
      state.dragging = true;
      state.hoverIdx = -1;
    }

    if (state.dragging) {
      const now = performance.now();
      const dt = Math.max(1, now - state.lastTime);
      const step = -(dx / 95); // sensitivity
      state.target += step;
      state.vel = lerp(state.vel, step / dt, 0.4);
      state.lastX = e.clientX;
      state.lastTime = now;
    }
  };

  const handlePointerUp = () => {
    const state = stateRef.current;
    if (state.dragging) {
      const carry = state.vel * 180;
      state.target += clamp(carry, -3, 3);
    }
    state.down = false;
    state.dragging = false;
  };

  // Wheel horizontal & vertical scrub
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    stateRef.current.target += clamp(delta * 0.003, -1.5, 1.5);
  };

  if (n === 0) return null;

  const currentActive = items[activeItemIndex] || items[0];

  return (
    <div
      className={`relative w-full select-none overflow-hidden ${className}`}
      style={{ minHeight: "560px" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* 3D Perspective Stage with Perimeter Vignette Dissolve */}
      <div
        ref={rootRef}
        className="relative w-full h-[540px] sm:h-[580px] md:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: `${perspective * fit}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${clamp(fit * 1.05, 0.72, 1.15)}) rotateX(${elevation}deg) rotateY(${yaw}deg)`,
          }}
        >
          {Array.from({ length: visibleShells }).map((_, shellIndex) => {
            const itemIndex = shellIndex % n;
            const item = items[itemIndex];
            const isFilm = item.media_type === "film";
            const isMusic = item.media_type === "music";

            return (
              <div
                key={shellIndex}
                ref={(el) => {
                  shellsRef.current[shellIndex] = el;
                }}
                className="absolute flex flex-col items-center justify-center transition-shadow duration-300"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
                onPointerEnter={() => {
                  if (!stateRef.current.dragging) {
                    stateRef.current.hoverIdx = shellIndex;
                  }
                }}
                onPointerLeave={() => {
                  stateRef.current.hoverIdx = -1;
                }}
                onClick={() => {
                  if (!stateRef.current.dragging && item.external_url) {
                    window.open(item.external_url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {/* Physical Object Card Shell */}
                <div className="relative w-full h-full bg-[#0d0d0d] rounded-[3px] border border-neutral-800 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer group">
                  {/* Subtle Top Metadata Bar */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80 text-[8px] font-mono tracking-widest text-neutral-400 uppercase">
                    <span>{isFilm ? "35MM ARCHIVE" : isMusic ? "12\" VINYL LP" : "EDITION"}</span>
                    <span>{item.year || "HISTORIC"}</span>
                  </div>

                  {/* Artwork Image */}
                  <div className="relative w-full flex-1 my-1.5 overflow-hidden bg-black rounded-[1px]">
                    <Image
                      src={item.cover_image_path || "/shelf/data-intensive.jpg"}
                      alt={item.title}
                      fill
                      sizes="220px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Bottom Title Bar */}
                  <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between">
                    <p className="text-[11px] font-medium text-white truncate max-w-[130px]">
                      {item.title}
                    </p>
                    <span className="text-[9px] text-neutral-400 font-mono tracking-wider">
                      ★ 5.0
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Soft Perimeter Dissolve: Melts edges into #ffffff background seamlessly without hard cutoffs */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background: [
              "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.85) 6%, rgba(255,255,255,0.4) 14%, transparent 25%)",
              "linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0.85) 6%, rgba(255,255,255,0.4) 14%, transparent 25%)",
              "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.7) 4%, transparent 12%)",
              "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.7) 4%, transparent 12%)",
            ].join(", "),
          }}
        />
      </div>

      {/* Editorial Control & Currently Active Item Details */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest uppercase text-muted">
            {String(activeItemIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted">&bull;</span>
          <h4
            className="text-base sm:text-lg font-normal text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {currentActive.title} <span className="text-muted text-sm font-sans">({currentActive.creator}, {currentActive.year})</span>
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              stateRef.current.target -= 1;
            }}
            className="p-2 border border-border bg-background text-foreground hover:bg-surface hover:border-foreground/30 transition-colors cursor-pointer"
            aria-label="Previous item"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              stateRef.current.target += 1;
            }}
            className="p-2 border border-border bg-background text-foreground hover:bg-surface hover:border-foreground/30 transition-colors cursor-pointer"
            aria-label="Next item"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {currentActive.external_url && (
            <a
              href={currentActive.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-[0.14em] uppercase border border-border bg-background text-foreground hover:bg-surface hover:border-foreground/40 transition-colors"
            >
              <span>Explore</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
