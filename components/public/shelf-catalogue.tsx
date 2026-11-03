import { BouncyLine } from "@/components/public/bouncy-line";
import { CulturalShelfShowcase } from "@/components/public/cultural-shelf-showcase";
import { HyalineCarousel } from "@/components/public/hyaline-carousel";
import type { ShelfItem, ShelfMediaType } from "@/lib/queries/types";

interface ShelfCatalogueProps {
  items: ShelfItem[];
}

interface Section {
  id: string;
  number: string;
  title: string;
  blurb: string;
  media: ShelfMediaType;
  columns: 2 | 3 | 4;
  unit: string;
}

const SECTIONS: Section[] = [
  {
    id: "cinema",
    number: "01",
    title: "Cinema",
    blurb:
      "Films that reward a second viewing — staging, performance, and the shape of a scene.",
    media: "film",
    columns: 3,
    unit: "films",
  },
  {
    id: "sound",
    number: "02",
    title: "Sound & Records",
    blurb: "Records kept within reach, and production choices worth studying.",
    media: "music",
    columns: 4,
    unit: "records",
  },
  {
    id: "literature",
    number: "03",
    title: "Literature",
    blurb: "Technical books that still hold up after the stack changes.",
    media: "book",
    columns: 3,
    unit: "books",
  },
  {
    id: "field-notes",
    number: "04",
    title: "Field Notes",
    blurb: "Papers and articles worth returning to.",
    media: "article",
    columns: 3,
    unit: "entries",
  },
];

export function ShelfCatalogue({ items }: ShelfCatalogueProps) {
  const sections = SECTIONS.map((section) => ({
    ...section,
    entries: items.filter((item) => item.media_type === section.media),
  })).filter((section) => section.entries.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div>
      {/* ——— The Reel ——— */}
      <div className="border-b border-border pb-10 md:pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Reel
          </h2>
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-muted">
            Drag or use the arrows
          </span>
        </div>
        <HyalineCarousel items={items} className="mt-4" />
      </div>

      {/* ——— Quick Jump ——— */}
      <nav
        aria-label="Shelf sections"
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group inline-flex items-center gap-2 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 px-3.5 py-2 text-[11px] font-medium tracking-[0.16em] uppercase text-neutral-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-neutral-400/90 hover:bg-neutral-100 hover:text-foreground active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
          >
            <span>{section.title}</span>
            <span className="text-muted/70 tabular-nums">
              {section.entries.length}
            </span>
          </a>
        ))}
      </nav>

      {/* ——— Sections ——— */}
      <div className="space-y-20 pt-14 md:space-y-28 md:pt-20">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <div className="flex items-baseline gap-4">
                <span
                  className="text-xs font-normal tabular-nums text-muted/70"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.number}
                </span>
                <h2
                  className="text-3xl font-normal tracking-[-0.01em] text-foreground sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.title}
                </h2>
              </div>
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted">
                {section.entries.length} {section.unit}
              </span>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted font-normal">
              {section.blurb}
            </p>

            <BouncyLine className="mt-6 mb-10" />

            <CulturalShelfShowcase
              items={section.entries}
              columns={section.columns}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
