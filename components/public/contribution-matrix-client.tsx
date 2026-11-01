"use client";

import { useState } from "react";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionMatrixClientProps {
  weeks: ContributionDay[][];
  totalContributions: number;
}

function formatDayDetails(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ContributionMatrixClient({
  weeks,
  totalContributions,
}: ContributionMatrixClientProps) {
  const [activeCell, setActiveCell] = useState<ContributionDay | null>(null);

  // Japanese Sumi-e ink shades: from subtle rice paper grain to rich carbon sumi black
  const getCellShade = (level: number) => {
    switch (level) {
      case 1:
        return "bg-neutral-200 border-neutral-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";
      case 2:
        return "bg-neutral-400 border-neutral-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";
      case 3:
        return "bg-neutral-700 border-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
      case 4:
        return "bg-[#0a0a0a] border-black shadow-[0_2px_4px_rgba(0,0,0,0.25)]";
      default:
        return "bg-neutral-100/50 border-neutral-200/40 hover:border-neutral-400/60";
    }
  };

  return (
    <div className="relative border border-border bg-white p-6 sm:p-8 mb-10 overflow-hidden">
      {/* Editorial Watermark & Top Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.25em] text-foreground font-semibold uppercase">
            CHRONICLE &bull; 38-WEEK LOG
          </span>
          <span className="text-muted text-xs">&bull;</span>
          <span className="text-[11px] font-mono tracking-wider text-muted">
            {totalContributions.toLocaleString()} UNITS RECORDED
          </span>
        </div>

        {/* Dynamic Telemetry / Hover Inspection Tooltip */}
        <div className="h-6 flex items-center">
          {activeCell ? (
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider animate-in fade-in duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              <span className="text-foreground font-medium">
                {activeCell.count} {activeCell.count === 1 ? "commit" : "commits"}
              </span>
              <span className="text-muted">&bull;</span>
              <span className="text-muted">{formatDayDetails(activeCell.date)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted">
              <span>INTENSITY</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="w-2.5 h-2.5 border border-neutral-200/40 bg-neutral-100/50" />
                <span className="w-2.5 h-2.5 border border-neutral-300/80 bg-neutral-200" />
                <span className="w-2.5 h-2.5 border border-neutral-500/80 bg-neutral-400" />
                <span className="w-2.5 h-2.5 border border-neutral-800 bg-neutral-700" />
                <span className="w-2.5 h-2.5 border border-black bg-[#0a0a0a]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Canvas with Day Legend */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        <div className="min-w-[700px] flex gap-3">
          {/* Day of Week Label Strip */}
          <div className="flex flex-col justify-between py-[3px] text-[8px] font-mono tracking-widest text-muted/80 uppercase select-none shrink-0 w-6">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
          </div>

          {/* Matrix Columns */}
          <div className="flex gap-[3.5px] py-1 flex-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3.5px] shrink-0">
                {week.map((day, dIdx) => {
                  const isHovered = activeCell?.date === day.date;
                  return (
                    <div
                      key={dIdx}
                      onPointerEnter={() => setActiveCell(day)}
                      onPointerLeave={() => {
                        if (activeCell?.date === day.date) setActiveCell(null);
                      }}
                      className={`w-[12px] h-[12px] rounded-[1.5px] border cursor-crosshair transition-all duration-200 ease-out ${getCellShade(
                        day.level
                      )} ${
                        isHovered
                          ? "scale-140 z-20 ring-1 ring-foreground ring-offset-1 ring-offset-background"
                          : "hover:scale-115"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiet Architectural Bottom Micro-Rule */}
      <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] uppercase text-muted/70">
        <span>SOURCE: GITHUB EVENT STREAM</span>
        <span>PULSE CADENCE &bull; MONOCHROME INK</span>
      </div>
    </div>
  );
}
