"use client";

import { useState, useMemo } from "react";
import type { ShelfItem, ShelfMediaType } from "@/lib/queries/types";
import { CulturalShelfShowcase } from "@/components/public/cultural-shelf-showcase";
import { HyalineCarousel } from "@/components/public/hyaline-carousel";

interface ShelfGridProps {
  items: ShelfItem[];
}

type FilterOption = "all" | ShelfMediaType;
type ViewMode = "3d" | "gallery" | "table";

const MEDIA_LABELS: Record<ShelfMediaType, string> = {
  film: "Film",
  music: "Music",
  book: "Book",
  article: "Article",
};

export function ShelfGrid({ items }: ShelfGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");

  const counts = useMemo(() => {
    return {
      all: items.length,
      film: items.filter((i) => i.media_type === "film").length,
      music: items.filter((i) => i.media_type === "music").length,
      book: items.filter((i) => i.media_type === "book").length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.media_type === activeFilter);
  }, [items, activeFilter]);

  const filters: { key: FilterOption; label: string; count: number }[] = [
    { key: "all", label: "All Items", count: counts.all },
    { key: "film", label: "Cinema", count: counts.film },
    { key: "music", label: "Music & Records", count: counts.music },
    { key: "book", label: "Literature", count: counts.book },
  ];

  const getSourceLabel = (url: string | null) => {
    if (!url) return "Reference";
    if (url.includes("letterboxd.com")) return "Letterboxd";
    if (url.includes("spotify.com")) return "Spotify";
    if (url.includes("bandcamp.com")) return "Bandcamp";
    if (url.includes("goodreads.com")) return "Goodreads";
    return "View Source";
  };

  return (
    <div>
      {/* Filter Tabs & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`group inline-flex items-center justify-center px-3.5 py-2 min-h-[38px] text-[11px] font-medium tracking-[0.16em] uppercase rounded-[3px] border transition-all duration-150 cursor-pointer select-none ${
                  isActive
                    ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.24),0_1px_0_#000] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
                    : "bg-neutral-50/90 text-neutral-600 border-neutral-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:text-foreground hover:border-neutral-400/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-[1.5px] mr-2 shrink-0 border transition-all duration-150 ${
                    isActive
                      ? "bg-white border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                      : "bg-neutral-300 border-neutral-400/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] group-hover:bg-neutral-400"
                  }`}
                  aria-hidden="true"
                />
                <span>{filter.label}</span>
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono tracking-wider rounded-[2px] border transition-colors duration-150 ${
                    isActive
                      ? "bg-neutral-800 text-neutral-200 border-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "bg-white text-neutral-500 border-neutral-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] group-hover:text-foreground group-hover:border-neutral-300"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle Tray */}
        <div className="flex items-center gap-1.5 p-1 rounded-[4px] border border-neutral-300/80 bg-neutral-100/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-all duration-150 cursor-pointer rounded-[2px] border ${
              viewMode === "3d"
                ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.2)]"
                : "border-transparent text-neutral-500 hover:text-foreground hover:bg-white/70 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            }`}
          >
            3D Stream
          </button>
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            className={`px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-all duration-150 cursor-pointer rounded-[2px] border ${
              viewMode === "gallery"
                ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.2)]"
                : "border-transparent text-neutral-500 hover:text-foreground hover:bg-white/70 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            }`}
          >
            Physical Gallery
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-all duration-150 cursor-pointer rounded-[2px] border ${
              viewMode === "table"
                ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.2)]"
                : "border-transparent text-neutral-500 hover:text-foreground hover:bg-white/70 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            }`}
          >
            Ledger Index
          </button>
        </div>
      </div>

      {viewMode === "3d" ? (
        <HyalineCarousel key={activeFilter} items={filteredItems} path="rise" />
      ) : viewMode === "gallery" ? (
        <CulturalShelfShowcase items={filteredItems} />
      ) : (
        <>

      {/* Ledger Header */}
      <div className="hidden md:grid grid-cols-12 gap-6 pb-4 border-b border-border text-xs font-medium tracking-[0.2em] uppercase text-muted">
        <div className="col-span-1">No.</div>
        <div className="col-span-2">Medium</div>
        <div className="col-span-6">Title &amp; Reflection</div>
        <div className="col-span-3 text-right">Source</div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-border">
        {filteredItems.map((item, index) => {
          const sourceLabel = getSourceLabel(item.external_url);
          const mediaLabel = MEDIA_LABELS[item.media_type] ?? item.media_type;

          return (
            <article
              key={item.id}
              className="py-8 md:py-10 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-sm transition-colors duration-150 hover:bg-neutral-50/70 group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
                {/* Index Number */}
                <div className="col-span-1 text-xs font-medium tracking-[0.18em] uppercase text-muted pt-1">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Medium & Meta */}
                <div className="col-span-2">
                  <div className="flex flex-wrap md:flex-col gap-2 md:gap-1 text-xs font-medium tracking-[0.18em] uppercase">
                    <span className="text-foreground">{mediaLabel}</span>
                    {item.year && (
                      <span className="text-muted">{item.year}</span>
                    )}
                    {item.is_favorite && (
                      <span className="text-xs font-medium text-foreground tracking-wider mt-1 inline-block">
                        &bull; Essential
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-span-6 space-y-3">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium tracking-wide text-muted">
                      by {item.creator}
                    </p>
                  </div>

                  {item.notes && (
                    <p className="text-base text-foreground/85 leading-relaxed font-normal">
                      {item.notes}
                    </p>
                  )}

                  {item.rating && (
                    <div
                      className="flex items-center gap-1 text-xs text-foreground tracking-widest"
                      aria-label={`Rating: ${item.rating} stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i} className="text-sm leading-none">
                          &#9733;
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* External Link */}
                <div className="col-span-3 pt-1 md:text-right">
                  {item.external_url ? (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-neutral-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:text-foreground hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all"
                    >
                      <span>{sourceLabel}</span>
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="text-xs font-medium tracking-[0.18em] uppercase text-muted/50">
                      Archive Entry
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-muted">
            <p className="text-sm font-medium tracking-[0.18em] uppercase">
              No entries found in this category.
            </p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
