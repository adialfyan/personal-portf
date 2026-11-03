"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WritingCard, WritingCategory } from "@/lib/queries/types";

interface WritingsFilterListProps {
  writings: WritingCard[];
}

type CategoryFilter = "all" | WritingCategory;

const CATEGORY_LABELS: Record<string, string> = {
  paper: "Paper",
  architecture: "Architecture",
  essay: "Essay",
  note: "Field Note",
};

export function WritingsFilterList({ writings }: WritingsFilterListProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const counts = useMemo(() => {
    return {
      all: writings.length,
      architecture: writings.filter((w) => w.category === "architecture").length,
      paper: writings.filter((w) => w.category === "paper").length,
      essay: writings.filter((w) => w.category === "essay").length,
      note: writings.filter((w) => w.category === "note").length,
    };
  }, [writings]);

  const filters: { key: CategoryFilter; label: string; count: number }[] = [
    { key: "all", label: "All Documents", count: counts.all },
    { key: "architecture", label: "Architecture", count: counts.architecture },
    { key: "paper", label: "Papers", count: counts.paper },
    { key: "essay", label: "Essays", count: counts.essay },
  ];

  if (counts.note > 0) {
    filters.push({ key: "note", label: "Field Notes", count: counts.note });
  }

  const filteredWritings = useMemo(() => {
    if (activeCategory === "all") return writings;
    return writings.filter((w) => w.category === activeCategory);
  }, [writings, activeCategory]);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {filters.map((filter) => {
            const isActive = activeCategory === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveCategory(filter.key)}
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

        {/* Dynamic telemetry index indicator */}
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-muted self-start sm:self-auto">
          <span>{filteredWritings.length} {filteredWritings.length === 1 ? "Document" : "Documents"}</span>
          <span>&bull;</span>
          <span className="text-foreground">
            {activeCategory === "all" ? "Full Archive" : CATEGORY_LABELS[activeCategory]}
          </span>
        </div>
      </div>

      {/* Writings Entries List */}
      <ol className="divide-y divide-border">
        {filteredWritings.map((writing, index) => {
          const dateStr = writing.published_at
            ? new Date(writing.published_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Recent";

          const categoryLabel =
            CATEGORY_LABELS[writing.category] ?? writing.category;

          return (
            <li key={writing.id} className="py-10 md:py-14 first:pt-4">
              <Link
                href={`/writing/${writing.slug}`}
                className="group block"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase text-muted">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>&bull;</span>
                    <span className="text-foreground">{categoryLabel}</span>
                    <span>&bull;</span>
                    <span>{writing.reading_time_minutes} min read</span>
                  </div>
                  <span className="text-xs font-medium tracking-wider text-muted md:text-right">
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-4xl">
                    <h2
                      className="text-2xl sm:text-3xl md:text-4xl text-foreground font-normal tracking-tight group-hover:underline transition-all"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {writing.title}
                    </h2>
                    {writing.subtitle && (
                      <p className="mt-3 text-base sm:text-lg text-muted/90 font-normal leading-relaxed">
                        {writing.subtitle}
                      </p>
                    )}
                    {writing.summary && (
                      <p className="mt-2 text-sm sm:text-base text-muted/70 font-normal leading-relaxed max-w-3xl">
                        {writing.summary}
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-xl text-muted group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 pt-1"
                  >
                    &rarr;
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {filteredWritings.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p className="text-lg">No documents in this category yet.</p>
        </div>
      )}
    </div>
  );
}
