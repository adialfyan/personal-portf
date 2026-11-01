"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";
import type Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let lenisInstance: Lenis | null = null;
    let cleanupDesktop: (() => void) | null = null;
    let isCancelled = false;
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;

    // Smooth anchor navigation (e.g. /#work, #work)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("/#")) {
        const hash = href.includes("#") ? href.split("#")[1] : null;
        if (hash) {
          const targetEl = document.getElementById(hash);
          if (targetEl) {
            e.preventDefault();
            if (lenisInstance) {
              lenisInstance.scrollTo(targetEl, { offset: -60, duration: 1.0 });
            } else {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Initialize Lenis only on fine-pointer (desktop/laptop) devices
    // Touch devices use native 120Hz GPU compositor scrolling for optimal battery and latency
    if (isPointerFine) {
      Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]).then(([{ default: LenisConstructor }, { default: gsap }, { ScrollTrigger }]) => {
        if (isCancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new LenisConstructor({
          lerp: 0.1,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.0,
          smoothWheel: true,
          syncTouch: false,
        });
        lenisInstance = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        const onTick = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.refresh();

        cleanupDesktop = () => {
          gsap.ticker.remove(onTick);
          lenis.destroy();
        };
      });
    }

    return () => {
      isCancelled = true;
      document.removeEventListener("click", handleAnchorClick);
      if (cleanupDesktop) cleanupDesktop();
    };
  }, []);

  return null;
}
