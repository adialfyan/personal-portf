# 05 — UI/UX Direction

## Concept

> **Editorial Tech** — inspired by Studio Freight, but not a clone.

A developer portfolio with an editorial/creative edge: oversized serif display,
uppercase tracked metadata, an editorial project index, and a sumi-e sakura
branch with bouncy-line dividers as the signature interaction.

## Reference Composition

```text
40%  Linear / Vercel       — structure, hierarchy, minimalism
25%  Basement / Studio Freight — typography, editorial composition
20%  Resend               — developer aesthetic, technical details
15%  Active Theory / Lusion — atmospheric motion and dither
```

## Color Palette

```css
--background: #ffffff;   /* pure white */
--surface:    #f5f5f5;
--foreground: #0a0a0a;
--muted:      #737373;
--border:     #e5e5e5;
--accent:     #000000;
--dark:       #0a0a0a;
--ivory:      #ffffff;
```

Pure white background with crisp black typography. No signal orange — the
contact CTA inverts to a dark section instead. See `app/globals.css`.

## Typography

| Role | Font |
|---|---|
| Display | Newsreader (serif, normal + italic) |
| Body/UI | Geist Sans |

Strict two-font system — no third mono font. Small uppercase labels use Geist
Sans with wide tracking (`tracking-[0.2em]`); headlines, section titles, and
large CTAs use Newsreader. All fonts are free and loaded via `next/font`
(see `app/layout.tsx`).

## Layout System

- Desktop: 12 columns.
- Tablet: 8 columns.
- Mobile: 4 columns.
- Max content width ~1440px.
- Hairline horizontal borders divide sections.
- Generous spacing for a premium, minimal feel.

## Homepage Composition

### Header

Right-aligned uppercase nav: Work, Writing, Shelf, About, Contact. Sticky
without a boxed navbar, hairline bouncy-line divider at the bottom
(`components/public/site-header.tsx`).

### Hero

Clean editorial statement in Newsreader at large size with morphing adjectives,
plus a sakura corner branch (grows and blooms on hover) and a Table of Contents
directory linking to Selected Work, Writing, Cultural Shelf, and Contact.
No portrait, no year labels, no location labels.

### Selected Work

Editorial project index (`components/public/editorial-project-index.tsx`):
numbered ledger rows with role, stack, and year. Uppercase sans for metadata,
Newsreader serif for the title. No rounded cards or shadows.

### Practice & Capabilities

Two-column: small label left, large statement right, followed by a 6-item
ledger grid (Product Development through Deployment & Maintenance) and a link
to the full biography. No skill bars or moving logo walls.

### Contact Footer

Inverted to dark background with ivory text and a large Newsreader CTA.

## Project Detail Page

```text
PROJECT NAME
Brief statement

ROLE / YEAR / STACK / LINKS

[LARGE HERO IMAGE]

01 / CONTEXT
02 / APPROACH
03 / OUTCOME

PREVIOUS / NEXT PROJECT
```

Large sharp imagery, readable case study width, technical metadata, dither used only
on cover or separators.

## Navigation & Micro-Detail

- Bouncy-line physics dividers between sections.
- Index numbers `01`, `02`, `03`.
- Captions on imagery.
- Typographic arrow `↗`.
- No fake coordinates, no decorative slashes or brackets in labels.

## UX Guardrails

- Navigation stays easy to find.
- No custom cursor replacing the native pointer.
- No hidden scrollbar.
- No intro/loading screen (or extremely short if used).
- Projects usable without hover.
- Main text stays HTML, not canvas.
- Keyboard-usable form and navigation.
- Animations reduced or disabled on weak devices.
- Respect `prefers-reduced-motion`.
- Touch targets at least 44px on mobile.
