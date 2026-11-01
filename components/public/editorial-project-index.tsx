"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { ProjectCard, ProjectDetail } from "@/lib/queries/types";

export interface EditorialProjectIndexProps {
  projects: (ProjectCard | ProjectDetail)[];
}

const BESPOKE_SECONDARY_TEXTS: Record<string, string> = {
  "simman-e-budgeting": "Host-to-Host Banking ERP",
  "kanso-core-erp": "Event Logistics Engine",
  "erp-event-organizers": "Event Logistics Engine",
  "aethel-clearing": "Decentralized Protocol",
  "deployed-project-03": "Decentralized Protocol",
  "vespera-audio-engine": "Real-Time Audio DSP",
  "deployed-project-04": "Real-Time Audio DSP",
  "komorebi-space": "Spatial Architecture CMS",
  "rastera-engine": "2D WebGL Graphics Core",
};

export function EditorialProjectIndex({ projects }: EditorialProjectIndexProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const [isDesktopActive, setIsDesktopActive] = useState(false);

  // Single shared lightweight SVG filter refs for optimal GPU performance
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const colorMatrixRef = useRef<SVGFEColorMatrixElement | null>(null);

  // DOM node references for each project row
  const containerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const text1Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const text2Refs = useRef<(HTMLSpanElement | null)[]>([]);

  // Active morph tracking
  const morphTweenRef = useRef<gsap.core.Tween | null>(null);
  const activeMorphIdxRef = useRef<number | null>(null);

  // Floating cursor preview refs
  const previewRef = useRef<HTMLDivElement | null>(null);
  const xToRef = useRef<((value: number) => void) | null>(null);
  const yToRef = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    xToRef.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.38,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.38,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (hoveredIndex !== null) {
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [hoveredIndex]);

  if (!projects || projects.length === 0) {
    return null;
  }

  const getSecondaryText = (project: ProjectCard | ProjectDetail) => {
    return (
      BESPOKE_SECONDARY_TEXTS[project.slug] ||
      project.project_type ||
      "Production Architecture"
    );
  };

  const runMorph = (idx: number, isEntering: boolean) => {
    const disp = displacementRef.current;
    const turb = turbulenceRef.current;
    const mat = colorMatrixRef.current;
    const c = containerRefs.current[idx];
    const t1 = text1Refs.current[idx];
    const t2 = text2Refs.current[idx];
    const project = projects[idx];

    if (!disp || !turb || !mat || !c || !t1 || !t2 || !project) return;

    // If another row was animating, finalize it instantly
    if (activeMorphIdxRef.current !== null && activeMorphIdxRef.current !== idx) {
      const prev = activeMorphIdxRef.current;
      const prevC = containerRefs.current[prev];
      const prevT1 = text1Refs.current[prev];
      const prevT2 = text2Refs.current[prev];
      if (prevC && prevT1 && prevT2 && projects[prev]) {
        prevC.style.filter = "none";
        prevT1.textContent = projects[prev].title;
        prevT1.style.opacity = "1";
        prevT2.textContent = "";
        prevT2.style.opacity = "0";
      }
    }

    if (morphTweenRef.current) {
      morphTweenRef.current.kill();
      morphTweenRef.current = null;
    }

    activeMorphIdxRef.current = idx;

    const primary = project.title;
    const secondary = getSecondaryText(project);

    const fromText = isEntering ? primary : secondary;
    const toText = isEntering ? secondary : primary;

    // Set up layers for transition
    t1.textContent = fromText;
    t1.style.opacity = "1";

    t2.textContent = toText;
    t2.style.opacity = "0";

    c.style.filter = "url(#editorial-morph-filter)";

    const progress = { val: 0 };
    morphTweenRef.current = gsap.to(progress, {
      val: 1,
      duration: 0.58,
      ease: "power2.out",
      onUpdate: () => {
        const p = progress.val;
        const bell = Math.sin(p * Math.PI);

        // Fluid crossfade between text layers
        t1.style.opacity = `${Math.max(0, 1 - p * 1.15).toFixed(3)}`;
        t2.style.opacity = `${Math.min(1, p * 1.15).toFixed(3)}`;

        // Dynamic fluid SVG turbulence and displacement
        turb.setAttribute(
          "baseFrequency",
          `${(0.035 + bell * 0.015).toFixed(4)} ${(0.045 + bell * 0.015).toFixed(4)}`
        );
        disp.setAttribute("scale", (bell * 8.5).toFixed(2));
        const a = 1 + bell * 12;
        const o = -(bell * 4.8);
        mat.setAttribute(
          "values",
          `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${a.toFixed(2)} ${o.toFixed(2)}`
        );
      },
      onComplete: () => {
        // Synchronous handoff: layer 1 takes target text, layer 2 is emptied
        t1.textContent = toText;
        t1.style.opacity = "1";

        t2.textContent = "";
        t2.style.opacity = "0";

        // Reset filter to identity and release GPU
        disp.setAttribute("scale", "0");
        mat.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0");
        c.style.filter = "none";

        morphTweenRef.current = null;
        if (!isEntering) {
          activeMorphIdxRef.current = null;
        }
      },
    });
  };

  const handleRowEnter = (idx: number) => {
    setHoveredIndex(idx);
    runMorph(idx, true);
  };

  const handleRowLeave = (idx: number) => {
    runMorph(idx, false);
  };

  const handleContainerLeave = () => {
    setHoveredIndex(null);
    if (activeMorphIdxRef.current !== null) {
      handleRowLeave(activeMorphIdxRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopActive) {
      setIsDesktopActive(true);
    }
    if (!xToRef.current || !yToRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const cardWidth = 320;
    const cardHeight = 230;
    const targetX =
      cursorX + cardWidth + 36 > rect.width
        ? cursorX - cardWidth - 24
        : cursorX + 32;
    const targetY =
      cursorY - cardHeight * 0.75 < 0
        ? cursorY + 24
        : cursorY - cardHeight * 0.75;

    xToRef.current(targetX);
    yToRef.current(targetY);
  };

  return (
    <div
      className="relative w-full py-6 md:py-10 bg-background text-foreground select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleContainerLeave}
    >
      {/* Floating Cursor Thumbnail Preview (Active on desktop pointer devices) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-30 hidden md:block w-[320px] opacity-0 scale-95 overflow-hidden rounded-sm border border-border bg-background shadow-2xl"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
          {isDesktopActive &&
            projects.map((p, i) =>
              p.cover_image_path ? (
                <Image
                  key={p.id || p.slug}
                  src={p.cover_image_path}
                  alt={p.title}
                  fill
                  sizes="320px"
                  className={`object-cover filter grayscale contrast-125 transition-opacity duration-300 ${
                    hoveredIndex === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null
            )}
        </div>
        {hoveredIndex !== null && projects[hoveredIndex] && (
          <div className="px-4 py-3 border-t border-border bg-background">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="text-sm font-normal text-foreground tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {projects[hoveredIndex].title}
              </span>
              <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] uppercase text-muted">
                {projects[hoveredIndex].year
                  ? projects[hoveredIndex].year.slice(0, 4)
                  : "2026"}
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium tracking-[0.18em] uppercase text-muted">
              {projects[hoveredIndex].project_type || "Production System"}
            </p>
          </div>
        )}
      </div>
      {/* Single, shared lightweight SVG filter for the entire section */}
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter
            id="editorial-morph-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.035 0.045"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur
              in="displaced"
              stdDeviation="0.4"
              result="blurred"
            />
            <feColorMatrix
              ref={colorMatrixRef}
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col justify-center">
        {projects.map((project, idx) => {
          const isHovered = hoveredIndex === idx;
          const isAnyHovered = hoveredIndex !== null;
          const isDimmed = isAnyHovered && !isHovered;

          // Scope / Category
          const category =
            project.project_type ||
            (project.technologies && project.technologies[0]?.name) ||
            "Production";

          // Year
          const year =
            project.year?.replace(/[^0-9]/g, "").slice(0, 4) ||
            (project.published_at ? project.published_at.slice(0, 4) : "2026");

          const isMobileExpanded = mobileExpandedIndex === idx;

          const handleRowClick = (e: React.MouseEvent) => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              e.preventDefault();
              setMobileExpandedIndex((prev) => (prev === idx ? null : idx));
            }
          };

          return (
            <div key={project.id || project.slug} className="flex flex-col w-full">
              <Link
                href={`/work/${project.slug}`}
                onClick={handleRowClick}
                onMouseEnter={() => handleRowEnter(idx)}
                onMouseLeave={() => handleRowLeave(idx)}
                onFocus={() => handleRowEnter(idx)}
                onBlur={() => handleRowLeave(idx)}
                className="group relative flex w-full items-center py-4 sm:py-5 md:py-6 transition-opacity duration-300"
                style={{
                  opacity: isDimmed ? 0.32 : 1,
                }}
              >
                {/* Desktop 5-column layout with liquid morph */}
                <div className="hidden md:flex w-full items-center">
                  {/* Left Column: Scope / Category */}
                  <div className="w-48 shrink-0 text-left">
                    <span className="block text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-200 text-muted group-hover:text-foreground">
                      {category}
                    </span>
                  </div>

                  {/* Left Solid Hairline Rule */}
                  <div className="flex-1 mx-8 border-b border-solid transition-colors duration-200 border-border group-hover:border-foreground/50" />

                  {/* Center Column: Liquid Gooey Morphing Title in Newsreader Serif */}
                  <div className="shrink-0 px-4 text-center">
                    <span
                      ref={(el) => {
                        containerRefs.current[idx] = el;
                      }}
                      className="relative inline-grid place-items-center"
                      style={{ willChange: "transform" }}
                    >
                      {/* Layer 1: Active visible text */}
                      <span
                        ref={(el) => {
                          text1Refs.current[idx] = el;
                        }}
                        className="whitespace-nowrap text-center text-5xl lg:text-6xl font-normal tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.01]"
                        style={{
                          fontFamily: "var(--font-display)",
                          gridArea: "1 / 1",
                        }}
                      >
                        {project.title}
                      </span>

                      {/* Layer 2: Incoming morph text */}
                      <span
                        ref={(el) => {
                          text2Refs.current[idx] = el;
                        }}
                        aria-hidden="true"
                        className="whitespace-nowrap text-center italic text-5xl lg:text-6xl font-normal tracking-tight text-foreground pointer-events-none"
                        style={{
                          fontFamily: "var(--font-display)",
                          gridArea: "1 / 1",
                          opacity: 0,
                        }}
                      />
                    </span>
                  </div>

                  {/* Right Solid Hairline Rule */}
                  <div className="flex-1 mx-8 border-b border-solid transition-colors duration-200 border-border group-hover:border-foreground/50" />

                  {/* Right Column: Year */}
                  <div className="w-28 shrink-0 text-right">
                    <span className="block text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-200 text-muted group-hover:text-foreground">
                      {year}
                    </span>
                  </div>
                </div>

                {/* Mobile clean editorial layout (Tap to expand) */}
                <div className="flex md:hidden w-full items-baseline justify-between gap-4 py-1 border-b border-border/40">
                  <span
                    className="text-xl sm:text-2xl font-normal tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-muted">
                      {year}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      {isMobileExpanded ? "−" : "+"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Mobile Tap-to-Reveal Accordion Panel */}
              {isMobileExpanded && (
                <div className="md:hidden pb-6 pt-1 animate-in fade-in duration-200">
                  <div className="border border-border bg-background p-4">
                    {project.cover_image_path && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface mb-3 border border-border/50">
                        <Image
                          src={project.cover_image_path}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover filter grayscale contrast-125"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                        {category} &bull; {year}
                      </span>
                      <Link
                        href={`/work/${project.slug}`}
                        className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-muted transition-colors underline underline-offset-4"
                      >
                        View Project &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
