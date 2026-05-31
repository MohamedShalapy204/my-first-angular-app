---
name: Lumina Studio
description: Intentional design for deeper focus.
colors:
  background: "oklch(0.98 0.003 150)"
  surface: "oklch(1 0 0)"
  on-surface: "oklch(0.2 0.01 150)"
  on-surface-variant: "oklch(0.55 0.01 150)"
  primary: "oklch(0.38 0.06 145)"
  on-primary: "oklch(1 0 0)"
  primary-container: "oklch(0.55 0.06 145)"
  secondary: "oklch(0.45 0.08 145)"
  tertiary: "oklch(0.45 0.14 35)"
  tertiary-container: "oklch(0.6 0.12 35)"
  outline: "oklch(0.5 0.01 150)"
  outline-variant: "oklch(0.82 0.01 150)"
  error: "oklch(0.55 0.2 25)"
  surface-variant: "oklch(0.85 0.02 210)"
typography:
  display:
    fontFamily: "'Playfair Display', serif"
    fontWeight: 500
    lineHeight: 1.05
  headline:
    fontFamily: "'Playfair Display', serif"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "'Public Sans', system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  body-dark:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "0.125rem"
  default: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1.5rem"
  3xl: "2rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  base: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
  2xl: "6.5rem"
  section-gap: "7.5rem"
  3xl: "10rem"
components:
  button-solid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
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

Material Design 3 token system with OKLCH values. Tinted neutrals throughout, never pure white or black.

### Primary
- **Sage Green** (`--primary`): The brand anchor. Used for CTAs, active states, focus indicators.

### Tertiary
- **Warm Terracotta** (`--tertiary`): Pricing, urgency badges, warm contrast accents.

### Surface System
Six-tier tonal layering for depth without shadows:
- `--surface-container-lowest` through `--surface-container-highest`
- `--surface` for base cards, `--background` for page

### Named Rules
**The Tinted Neutral Rule.** Never use pure white (#ffffff) or pure black (#000000). All backgrounds and text colors are tinted toward the brand hue (oklch hue 145-150).

## 3. Typography

**Display Font:** 'Playfair Display', serif (light + dark)
**Body Font (Light):** 'Public Sans', system-ui, sans-serif
**Body Font (Dark):** 'Inter', system-ui, sans-serif

### Hierarchy
- **Display** (500, clamp(2.5rem-9rem), 1.05): Hero sections, major headers.
- **Headline** (500, 1.953rem-3.052rem, 1.2): Product titles, card headers.
- **Body** (400, 1rem, 1.6): Paragraph text. Cap at 70ch.
- **Label** (600, 0.75rem-0.875rem, uppercase): Tags, metadata, button text.

### Named Rules
**The Editorial Contrast Rule.** Headlines feel like a high-end magazine. Tight letter-spacing (-0.02em) and italicized accents create rhythm.

## 4. Elevation

Flat by default. Depth via tonal layers, not shadows.

### Shadow Vocabulary
- **Hover Lift** (`0 25px 50px -12px oklch(0 0 0 / 0.25)`): Only on hover for feature cards.

### Named Rules
**The Ambient Depth Rule.** Surfaces rest flat. Shadows are earned through interaction or structural float (sticky headers).

## 5. Components

### Buttons
- **Shape:** Pill (9999px) for solid/outline. Ghost: no radius.
- **Solid:** Primary background, on-primary text.
- **Outline:** Transparent, primary border + text.
- **Ghost:** No background, primary text, underline on hover.

### Cards
- **Radius:** 1.5rem to 2rem.
- **Background:** Surface containers with subtle borders.
- **Interaction:** Image scale on hover (duration-700).

### Navigation
- Sticky header with backdrop blur.
- Active: color shift or dot indicator.

## 6. Do's and Don'ts

### Do:
- Use tinted neutrals like `--surface-container` instead of pure white.
- Create rhythm with asymmetric grids and varied spacing.
- Use smooth transitions (0.5s-0.8s) with ease-out curves.

### Don't:
- No gradient text, hero-metric templates, or "tech blue" cliches.
- No side-stripe borders (>1px) for emphasis.
- No glassmorphism as default card background.
