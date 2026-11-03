"use client";

import Image from "next/image";
import type { ShelfItem } from "@/lib/queries/types";

export interface CulturalShelfShowcaseProps {
  items: ShelfItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const COLUMNS_CLASS: Record<2 | 3 | 4, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/** Link label from the host, so it never advertises the wrong service. */
function sourceLabel(url: string | null): string {
  if (!url) return "Reference";
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Reference";
  }
  if (host.includes("letterboxd")) return "Letterboxd";
  if (host.includes("bandcamp")) return "Bandcamp";
  if (host.includes("spotify")) return "Spotify";
  if (host.includes("apple.com")) return "Apple Music";
  if (host.includes("goodreads")) return "Goodreads";
  if (host.includes("youtube")) return "YouTube";
  return host;
}

export function CulturalShelfShowcase({
  items,
  className = "",
  columns = 4,
}: CulturalShelfShowcaseProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${COLUMNS_CLASS[columns]} gap-8 md:gap-10`}
      >
        {items.map((item, index) => {
          const isFilm = item.media_type === "film";
          const isMusic = item.media_type === "music";
          const isBook = item.media_type === "book";

          const coverSrc = item.cover_image_path || "/shelf/stalker.jpg";
          const itemNumber = String(index + 1).padStart(2, "0");

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between"
            >
              {/* ——— Physical Media Object Container ——— */}
              <div className="relative mb-6 flex items-center justify-center p-2 sm:p-4 overflow-visible">
                {/* 1. CINEMA: 35mm Analog Film Roll Frame */}
                {isFilm && (
                  <div className="relative w-full max-w-[240px] aspect-[2/3] bg-[#0d0d0d] p-3 rounded-[3px] shadow-xl border border-neutral-800 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5 group-hover:shadow-2xl">
                    {/* Top Sprocket Perforations */}
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
                        KODAK 5219
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                      </div>
                    </div>

                    {/* Film Cell Poster Display */}
                    <div className="relative my-2 w-full h-[calc(100%-44px)] overflow-hidden rounded-[1px] bg-black">
                      <Image
                        src={coverSrc}
                        alt={item.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                      {/* Subtle Analog Film Grain & Flare Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-amber-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    {/* Bottom Sprocket Perforations */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-amber-500/80 uppercase">
                        35MM • 24A
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-neutral-900 border border-neutral-700/60" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MUSIC: 12" Vinyl Record Jacket with Sliding Grooved Disc */}
                {isMusic && (
                  <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                    {/* The Sliding Grooved Vinyl Disc */}
                    <div
                      className="absolute w-[92%] h-[92%] rounded-full shadow-2xl border border-neutral-800 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[42%] group-hover:rotate-90 z-0"
                      style={{
                        background: `
                          radial-gradient(circle at center,
                            transparent 18%,
                            #1c1c1c 18%,
                            #0f0f0f 19%,
                            #1c1c1c 21%,
                            #0f0f0f 23%,
                            #1a1a1a 26%,
                            #0e0e0e 30%,
                            #181818 35%,
                            #0d0d0d 42%,
                            #191919 50%,
                            #0e0e0e 60%,
                            #1a1a1a 75%,
                            #0a0a0a 100%
                          )
                        `,
                      }}
                    >
                      {/* Vinyl Specular Light Reflection */}
                      <div
                        className="absolute inset-0 rounded-full opacity-40 mix-blend-screen"
                        style={{
                          background: `conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.18) 45deg, transparent 90deg, rgba(255,255,255,0.18) 225deg, transparent 270deg)`,
                        }}
                      />

                      {/* Center Spindle Label */}
                      <div className="absolute inset-0 m-auto h-16 w-16 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center shadow-inner">
                        <div className="h-3.5 w-3.5 rounded-full bg-[#0a0a0a] border border-neutral-600" />
                      </div>
                    </div>

                    {/* The Album Jacket Sleeve */}
                    <div className="relative z-10 w-full h-full rounded-[2px] bg-[#141414] border border-border shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                      <Image
                        src={coverSrc}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                      {/* Subtle Vinyl Jacket Ringwear Texture */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.3)_72%,transparent_75%)] opacity-60" />
                    </div>
                  </div>
                )}

                {/* 3. LITERATURE: Hardcover Clothbound Book */}
                {isBook && (
                  <div className="relative w-full max-w-[240px] aspect-[2/3] bg-neutral-900 rounded-r-[4px] rounded-l-[1px] shadow-xl border border-neutral-800 transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1.5 overflow-hidden flex">
                    {/* Spine Ridge */}
                    <div className="w-5 h-full bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 border-r border-neutral-700/50 shrink-0" />

                    {/* Book Cover Face */}
                    <div className="relative flex-1 h-full overflow-hidden bg-neutral-950">
                      <Image
                        src={coverSrc}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                      {/* Clothbound foil sheen */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>
                )}
              </div>

              {/* ——— Monograph Metadata & Source Link ——— */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-xs text-muted/70 font-normal tabular-nums"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {itemNumber}
                  </span>
                  {item.is_favorite && (
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                      Essential
                    </span>
                  )}
                </div>

                <h3
                  className="mt-1.5 text-xl sm:text-2xl font-normal tracking-tight text-foreground line-clamp-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-muted font-normal">
                  {item.creator}
                  {item.year ? ` \u2022 ${item.year}` : ""}
                </p>

                {item.external_url && (
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.18em] uppercase text-foreground underline-offset-4 hover:underline transition-colors"
                  >
                    <span>{sourceLabel(item.external_url)}</span>
                    <span aria-hidden="true">&#8599;</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
