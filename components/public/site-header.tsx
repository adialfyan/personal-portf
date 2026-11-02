"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BouncyLine } from "@/components/public/bouncy-line";
import { SakuraCornerBranch } from "@/components/public/sakura-corner-branch";

const NAV_LINKS = [
  { href: "/#work", label: "Work", number: "01" },
  { href: "/writing", label: "Writing", number: "02" },
  { href: "/shelf", label: "Shelf", number: "03" },
  { href: "/about", label: "About", number: "04" },
  { href: "/contact", label: "Contact", number: "05" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on Escape key and lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu();
    if (href.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        suppressHydrationWarning
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
      >
        <div
          suppressHydrationWarning
          className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-10"
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-muted transition-colors"
          >
            Adi Alfian Hafis
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] uppercase"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button with smooth state toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-xs font-medium tracking-[0.2em] uppercase text-foreground py-1.5 px-3 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
        <BouncyLine className="absolute bottom-0 left-0 right-0" />
      </header>

      {/* Mobile Editorial Navigation Drawer with Smooth Opening Transition & Sakura Bloom */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-background p-6 sm:p-10 md:hidden overflow-y-auto transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Top-Right Sakura Branch Blooming Inside Mobile Drawer */}
        <div className="absolute top-0 right-0 pointer-events-none overflow-visible z-0">
          <SakuraCornerBranch className="pointer-events-none w-[180px] h-[180px] sm:w-[240px] sm:h-[240px]" />
        </div>

        {/* Drawer Header Bar */}
        <div className="relative z-30 flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground"
          >
            Adi Alfian Hafis
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground py-1.5 px-3 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Main Navigation Links with Sequential Staggered Styling */}
        <nav
          aria-label="Mobile Navigation"
          className="relative z-10 my-auto py-6 sm:py-8 flex flex-col gap-4 sm:gap-6"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="group flex items-baseline justify-between border-b border-border/50 pb-3"
            >
              <span
                className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground group-hover:text-muted transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.label}
              </span>
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted group-hover:text-foreground transition-colors">
                {item.number}
              </span>
            </Link>
          ))}
        </nav>

        {/* Drawer Footer Metadata */}
        <div className="relative z-10 pt-4 pb-6 sm:pb-4 border-t border-border flex items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase text-muted">
          <span>Frontend &amp; Full-Stack Developer</span>
          <span>Portfolio</span>
        </div>
      </div>
    </>
  );
}
