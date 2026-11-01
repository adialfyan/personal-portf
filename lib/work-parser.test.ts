import { describe, expect, it } from "vitest";
import {
  parseOutcomeHighlights,
  parseTechnicalHighlights,
} from "./work-parser";

describe("work-parser", () => {
  it("handles empty or null values gracefully", () => {
    expect(parseTechnicalHighlights(null)).toEqual([]);
    expect(parseTechnicalHighlights("")).toEqual([]);
    expect(parseOutcomeHighlights(null)).toEqual([]);
    expect(parseOutcomeHighlights("")).toEqual([]);
  });

  it("parses technical decisions into numbered highlights", () => {
    const raw = `01 — Key Engineering Highlights:

01. Host-to-Host (H2H) Virtual Account Banking Integration
Direct webhook synchronization communicating with core banking partner systems.

02. Strict RKA Budgeting Engine
Total digitization of the institution's Work Plan and Budget.`;

    const parsed = parseTechnicalHighlights(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({
      number: "01",
      title: "Host-to-Host (H2H) Virtual Account Banking Integration",
      description:
        "Direct webhook synchronization communicating with core banking partner systems.",
    });
    expect(parsed[1].title).toBe("Strict RKA Budgeting Engine");
  });

  it("parses outcome metrics and statements", () => {
    const raw = `01 — Measurable Impact:

01. Eliminated 100% of manual teller payment verification.
02. Programmatically hard-locked division spending ceilings.`;

    const parsed = parseOutcomeHighlights(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({
      number: "01",
      text: "Eliminated 100% of manual teller payment verification.",
    });
    expect(parsed[1].number).toBe("02");
  });
});
