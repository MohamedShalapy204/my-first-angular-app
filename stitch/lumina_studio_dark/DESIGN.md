---
name: Lumina Studio Dark
colors:
  surface: '#101412'
  surface-dim: '#101412'
  surface-bright: '#353a37'
  surface-container-lowest: '#0a0f0d'
  surface-container-low: '#181d1a'
  surface-container: '#1c211e'
  surface-container-high: '#262b28'
  surface-container-highest: '#313633'
  on-surface: '#dfe4de'
  on-surface-variant: '#c6c8b8'
  inverse-surface: '#dfe4de'
  inverse-on-surface: '#2c322e'
  outline: '#909284'
  outline-variant: '#46483c'
  surface-tint: '#bdce89'
  primary: '#bdce89'
  on-primary: '#283501'
  primary-container: '#8a9a5b'
  on-primary-container: '#253000'
  inverse-primary: '#56642b'
  secondary: '#c2c8c3'
  on-secondary: '#2c322f'
  secondary-container: '#444a47'
  on-secondary-container: '#b4bab5'
  tertiary: '#eab6e6'
  on-tertiary: '#472249'
  tertiary-container: '#b384b1'
  on-tertiary-container: '#431e44'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9eaa3'
  primary-fixed-dim: '#bdce89'
  on-primary-fixed: '#161f00'
  on-primary-fixed-variant: '#3e4c16'
  secondary-fixed: '#dee4df'
  secondary-fixed-dim: '#c2c8c3'
  on-secondary-fixed: '#171d1a'
  on-secondary-fixed-variant: '#424845'
  tertiary-fixed: '#ffd6fa'
  tertiary-fixed-dim: '#eab6e6'
  on-tertiary-fixed: '#300c32'
  on-tertiary-fixed-variant: '#603961'
  background: '#101412'
  on-background: '#dfe4de'
  surface-variant: '#313633'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style

This design system is defined by a sophisticated, minimalist aesthetic tailored for high-end creative environments. The shift to dark mode emphasizes depth and focus, transforming the interface into a "digital gallery" where content is framed by deep, recessive tones.

The brand personality is intentional, quiet, and premium. It utilizes a **Minimalist** style with elements of **Tonal Layering** to create a sense of architectural structure. By using a restricted palette and expansive white space (or "dark space"), the UI evokes a feeling of calm authority and artistic precision. The target audience includes gallery owners, high-end photographers, and luxury brand managers who value a tool that recedes to let their work shine.

## Colors

The color palette is anchored in **Deep Slate (#1a1f1c)**, providing a high-end, immersive background that reduces eye strain and enhances imagery. 

- **Primary:** Sage Green (#8a9a5b) is used sparingly for call-to-actions, active states, and focus indicators, providing a natural, muted contrast against the slate.
- **Surface Tiers:** UI surfaces use increments of the slate base (e.g., #242a27 for cards, #2a302d for floating elements) to create a sense of physical layering.
- **Contrast:** Typography relies on Off-White (#f5f5f5) for maximum readability, while secondary information is rendered in a desaturated Light Gray (#a0a5a2) to maintain visual hierarchy without competing for attention.

## Typography

The typography system pairs the editorial elegance of **Playfair Display** with the functional precision of **Inter**.

Large headlines utilize Playfair Display with tight letter-spacing to mimic high-end fashion mastheads. For readability in a dark environment, body text uses Inter at a slightly increased line-height to prevent "halation" (where light text appears to bleed into dark backgrounds). Labels and metadata are set in uppercase Inter with generous letter-spacing to ensure clarity at small scales.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain the "framed" look of a studio portfolio, switching to a **Fluid Grid** for mobile devices.

- **Desktop:** 12-column grid with a 1440px max-width, 24px gutters, and 64px outer margins to provide significant "breathing room."
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** All vertical spacing must be a multiple of 8px. Use larger gaps (80px+) between major sections to reinforce the minimalist brand narrative.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** rather than heavy shadows. In this dark mode environment:
- **Level 0 (Base):** Deep Slate (#1a1f1c) for the global background.
- **Level 1 (Cards/Sections):** A slightly lighter slate (#242a27) with no shadow, but a 1px "inner glow" or subtle border (#ffffff 5% opacity) to define the edge.
- **Level 2 (Modals/Popovers):** Elevated Slate (#2a302d) accompanied by a soft, large-radius black shadow (40% opacity) to provide a clear separation from the background.
- **Interactions:** Hover states should involve a subtle shift in surface luminosity rather than a change in shadow depth.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the brutalist tendencies of a dark slate UI, making the interface feel more approachable and modern without losing its professional, architectural structure. Buttons and input fields should strictly adhere to this radius.

## Components

- **Buttons:** Primary buttons are filled with Sage Green (#8a9a5b) with Dark Slate text. Secondary buttons are outlined with a 1px border of the Sage Green.
- **Input Fields:** Use a subtle background fill (#242a27) with a bottom-only border for an "editorial form" look. The cursor and focus state should utilize the primary Sage color.
- **Cards:** Cards should be borderless, distinguished only by their slightly lighter surface tone. Content within cards should have generous internal padding (min 32px).
- **Lists:** Use thin, low-contrast separators (#2a302d). Hover states should trigger a subtle background tint change to #242a27.
- **Chips:** Small, pill-shaped elements with a secondary surface fill (#2a302d) and light gray text, used for tags or categories.
- **Navigation:** Top-tier navigation uses high-contrast text with an understated underline indicator in Sage for active states.