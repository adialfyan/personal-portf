export interface TechnicalHighlight {
  number: string;
  title: string;
  description: string;
}

export interface OutcomeHighlight {
  number: string;
  text: string;
}

export function parseTechnicalHighlights(
  text: string | null | undefined,
): TechnicalHighlight[] {
  if (!text) return [];
  const lines = text.split("\n");
  const items: TechnicalHighlight[] = [];
  let current: Partial<TechnicalHighlight> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    // Skip general header lines like "01 — Key Engineering Highlights:"
    if (line.toLowerCase().includes("engineering highlights")) continue;

    // Matches "01. Title" or "1. Title" or "01 — Title"
    const match = line.match(/^(\d{1,2})[\.\—\-]\s*(.+)$/);
    if (match) {
      if (current && current.title) {
        items.push({
          number: current.number || String(items.length + 1).padStart(2, "0"),
          title: current.title,
          description: (current.description || "").trim(),
        });
      }
      current = {
        number: match[1].padStart(2, "0"),
        title: match[2].trim(),
        description: "",
      };
    } else if (current) {
      current.description = current.description
        ? `${current.description} ${line}`
        : line;
    }
  }

  if (current && current.title) {
    items.push({
      number: current.number || String(items.length + 1).padStart(2, "0"),
      title: current.title,
      description: (current.description || "").trim(),
    });
  }

  return items;
}

export function parseOutcomeHighlights(
  text: string | null | undefined,
): OutcomeHighlight[] {
  if (!text) return [];
  const lines = text.split("\n");
  const items: OutcomeHighlight[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    // Skip intro title line e.g. "01 — Measurable Impact:" or "01 — Objectives & Impact:"
    if (
      line.toLowerCase().includes("impact") ||
      line.toLowerCase().includes("objectives")
    ) {
      continue;
    }

    const match = line.match(/^(\d{1,2})[\.\—\-]\s*(.+)$/);
    if (match) {
      items.push({
        number: match[1].padStart(2, "0"),
        text: match[2].trim(),
      });
    }
  }

  return items;
}
