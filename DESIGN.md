---
name: Lumina Studio
description: Intentional design for deeper focus.
colors:
  bg-base: "oklch(0.98 0.005 150)"
  bg-surface: "oklch(1 0 0)"
  fg-base: "oklch(0.25 0.01 150)"
  fg-muted: "oklch(0.55 0.01 150)"
  accent: "oklch(0.65 0.06 160)"
  brand-moss: "oklch(0.45 0.08 145)"
  brand-clay: "oklch(0.65 0.15 35)"
  brand-mist: "oklch(0.85 0.03 210)"
typography:
  display:
    fontFamily: "'Baskervville', serif"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "'Baskervville', serif"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "'Public Sans', system-ui, sans-serif"
    fontWeight: 300
    lineHeight: 1.6
rounded:
  full: "9999px"
  3xl: "2.5rem"
  2xl: "1.5rem"
  lg: "1rem"
  md: "0.75rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  base: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
  2xl: "6.5rem"
  3xl: "10rem"
components:
  button-solid:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-base}"
    rounded: "{rounded.full}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.fg-base}"
    rounded: "{rounded.full}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brand-moss}"
    rounded: "0px"
---

# Design System: Lumina Studio

## 1. Overview

**Creative North Star: "The Quiet Workshop"**

Lumina Studio embodies the quiet precision of a well-ordered workshop. It is a space where technical excellence lives alongside organic warmth. The aesthetic philosophy is rooted in removing noise to let the products speak, using sharp alignments and intentional empty space to create a distraction-free discovery experience. We reject noisy SaaS cliches, generic AI marketing aesthetics, and overstimulating interfaces. 

**Key Characteristics:**
- **Minimal:** Radical removal of unnecessary UI chrome.
- **Precise:** Razor-sharp typography and exact layout grids.
- **Organic:** Natural color palettes that soften the digital harshness.

## 2. Colors

The palette balances technical grays with earthy, calming natural tones.

### Primary
- **Calm Sage** (oklch(0.65 0.06 160)): Used sparingly for primary interactions, hover states, and key accents. Its subtle desaturation keeps it from feeling demanding.

### Secondary
- **Deep Slate Moss** (oklch(0.45 0.08 145)): Used for success states, secondary accents, and active ghost button states.
- **Warm Terracotta** (oklch(0.65 0.15 35)): Provides a stark, warm contrast for errors and specific typographic punctuation.
- **Nordic Blue Mist** (oklch(0.85 0.03 210)): Used for subtle glassmorphism backgrounds and informational states.

### Neutral
- **Soft Bone** (oklch(0.98 0.005 150)): The foundational light theme background. A tinted neutral, never stark white.
- **Obsidian Mist** (oklch(0.18 0.01 160)): The foundational dark theme background.
- **Mist Gray** (oklch(0.55 0.01 150)): Used for secondary text, borders, and subtle UI lines.

### Named Rules
**The Tinted Neutral Rule.** Never use pure white (#ffffff) or pure black (#000000). All backgrounds and text colors must be tinted toward the brand hue (oklch hue 150/160) to maintain an organic feel.

## 3. Typography

**Display Font:** 'Baskervville', serif
**Body Font:** 'Public Sans', system-ui, sans-serif

**Character:** A high-contrast pairing. The elegant, historic structure of Baskervville provides an editorial voice, while the ultra-light weight of Public Sans grounds the interface in modern utility.

### Hierarchy
- **Display** (400, clamp(2.5rem, 7vw, 9rem), 1.05): Used exclusively for hero sections and major section headers.
- **Headline** (400, 1.953rem - 3.052rem, 1.2): Used for primary product titles and card headers.
- **Body** (300, 1rem, 1.6): Used for all paragraph text. Cap line length at 70ch for readability.
- **Label** (700, 0.64rem, uppercase): Used for tags, microcopy, and button text with wide tracking (0.15em - 0.3em).

### Named Rules
**The Editorial Contrast Rule.** Headlines should feel like a high-end magazine. Use tight letter-spacing (-0.02em) and italicized accents within display text to create rhythm.

## 4. Elevation

The system is flat by default, relying on subtle borders and layout spacing for structure.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`): A deep, diffuse shadow applied only on hover to feature cards, combined with a subtle negative Y-translation.

### Named Rules
**The Ambient Depth Rule.** Surfaces rest flat on the background. Shadows are earned through interaction (hover) or when elements must float structurally (sticky headers).

## 5. Components

Components follow a philosophy of "restrained and organic" — utilizing pill shapes, light typography weights, and motion triggered strictly on interaction.

### Buttons
- **Shape:** Fully rounded pill (9999px) for solid and outline variants.
- **Solid:** Surface background with dark text. Subtle shadow. Hover triggers a slight background shift and increased shadow.
- **Outline:** Transparent background with subtle border. Hover fills the background and deepens the border.
- **Ghost:** No background, no radius. A simple underline that expands or darkens on hover.

### Cards / Containers
- **Corner Style:** Large radii (1rem to 2.5rem) to soften the interface.
- **Background:** Subtle surface colors or transparent with delicate borders.
- **Interaction:** Product cards scale their internal imagery slowly (duration-700) on hover, rather than scaling the entire card frame aggressively.

### Navigation
- **Style:** Sticky header with a subtle backdrop blur.
- **Links:** Active states use a dot indicator or color shift. Hover states utilize organic scale/rotate micro-interactions (e.g., the rotating brand logo).

## 6. Do's and Don'ts

### Do:
- **Do** use organic, tinted neutrals like Soft Bone (oklch(0.98 0.005 150)) instead of pure white.
- **Do** create rhythm by varying spacing and using asymmetric grids.
- **Do** use smooth, slow transitions (0.5s - 0.8s) with ease-out curves for hover states.

### Don't:
- **Don't** use standard SaaS cliches like gradient text, hero-metric templates, or generic "tech blue" colors.
- **Don't** use side-stripe borders (border-left or border-right > 1px) for emphasis on cards or callouts.
- **Don't** apply glassmorphism as a default card background; reserve it for sticky headers or highly specific atmospheric overlays.
