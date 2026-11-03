"use client";

import { useState } from "react";
import Image from "next/image";

interface MagazineSectionTagProps {
  initial: string;
  label: string;
  sublabel?: string;
  className?: string;
}

/**
 * Editorial section kicker badge (modeled after GQ's iconic boxed letter badge).
 * Features a solid ink square with single monogram initial and tracked uppercase metadata.
 */
export function MagazineSectionTag({
  initial,
  label,
  sublabel,
  className = "",
}: MagazineSectionTagProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-dark text-ivory text-xs font-semibold tracking-wider select-none">
        {initial}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-foreground">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] text-muted tracking-[0.14em] uppercase">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

interface MagazinePortraitProps {
  src: string;
  alt: string;
  name?: string;
  role?: string;
  caption?: string;
  credit?: string;
  className?: string;
}

/**
 * Editorial Magazine Portrait Card.
 * Displays high-contrast monochrome photography with subtle duotone grain,
 * vertical margin photography credit, and figure caption footnotes.
 * Includes interactive monochrome / natural tone toggle.
 */
export function MagazinePortrait({
  src,
  alt,
  caption = "Full-stack developer building web applications, internal tools, and database systems.",
  credit = "PHOTOGRAPHY • EDITORIAL ARCHIVE",
  className = "",
}: MagazinePortraitProps) {
  const [isMonochrome, setIsMonochrome] = useState(false);

  return (
    <figure className={`relative flex flex-col ${className}`}>
      {/* Top Editorial Folio Tag for Figure with Pill Badge and Toggle Button */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase rounded-[3px] border border-neutral-200/90 bg-white text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
          <span>Figure 01 &bull; Portrait</span>
        </span>
        <button
          type="button"
          onClick={() => setIsMonochrome((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
          title="Toggle between natural tone and editorial monochrome"
        >
          <span>{isMonochrome ? "Natural Tone" : "Monochrome"}</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* Main Image Frame with Vertical Margin Credit */}
      <div className="relative border border-border bg-surface overflow-hidden group">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            priority
            className={`object-cover object-top transition-all duration-300 ${
              isMonochrome ? "grayscale" : ""
            }`}
          />
        </div>

        {/* Rotated Vertical Side Credit Stamp (Eve Arnold / Zeitläufte style) */}
        <div className="absolute top-4 right-2 pointer-events-none select-none origin-top-right rotate-90 translate-x-full">
          <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-ivory/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {credit}
          </span>
        </div>
      </div>

      {/* Editorial Caption Footnote */}
      <figcaption className="mt-3.5 border-t border-border pt-3">
        <div className="flex items-baseline justify-between text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground mb-1">
          <span>{alt}</span>
          <span className="text-muted font-normal text-[10px]">PLATE I</span>
        </div>
        <p className="text-xs text-muted leading-relaxed font-normal">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}

interface MagazinePullQuoteProps {
  quote: string;
  attribution?: string;
  role?: string;
  className?: string;
}

/**
 * Editorial Pull Quote component.
 * Features Newsreader display serif italics, generous spacing, and fine hairline accents.
 */
export function MagazinePullQuote({
  quote,
  attribution,
  role,
  className = "",
}: MagazinePullQuoteProps) {
  return (
    <aside
      className={`relative my-10 py-8 border-y border-border ${className}`}
      aria-label="Editorial Pull Quote"
    >
      <blockquote className="space-y-4">
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-normal italic leading-[1.2] tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        {(attribution || role) && (
          <footer className="text-xs font-medium tracking-[0.18em] uppercase text-muted flex items-center gap-2 pt-2">
            {attribution && <cite className="not-italic text-foreground">{attribution}</cite>}
            {attribution && role && <span aria-hidden="true">&bull;</span>}
            {role && <span>{role}</span>}
          </footer>
        )}
      </blockquote>
    </aside>
  );
}

interface MagazineDropCapProps {
  letter: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Editorial Drop Cap paragraph.
 * Large display serif initial letter that integrates cleanly into multi-line body prose.
 */
export function MagazineDropCap({
  letter,
  children,
  className = "",
}: MagazineDropCapProps) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="float-left pr-3.5 pt-1 text-[4.2rem] sm:text-[4.8rem] leading-[0.78] font-normal text-foreground select-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {letter}
      </span>
      <div className="leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

interface MagazineDossierTableProps {
  items: Array<{
    label: string;
    value: React.ReactNode;
  }>;
  className?: string;
}

/**
 * Editorial Spec Sheet / Dossier Table.
 * Swiss grid detailing role, availability, communication channels, and credentials.
 */
export function MagazineDossierTable({
  items,
  className = "",
}: MagazineDossierTableProps) {
  return (
    <dl className={`border-t border-border divide-y divide-border ${className}`}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-3 text-xs"
        >
          <dt className="font-medium tracking-[0.18em] uppercase text-muted">
            {item.label}
          </dt>
          <dd className="font-medium tracking-[0.06em] text-foreground text-left sm:text-right">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
