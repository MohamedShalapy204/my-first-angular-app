---
name: Lumina Studio
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#46483c'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#76786b'
  outline-variant: '#c6c8b8'
  surface-tint: '#56642b'
  primary: '#56642b'
  on-primary: '#ffffff'
  primary-container: '#8a9a5b'
  on-primary-container: '#253000'
  inverse-primary: '#bdce89'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dd'
  on-secondary-container: '#656461'
  tertiary: '#a93700'
  on-tertiary: '#ffffff'
  tertiary-container: '#f6662c'
  on-tertiary-container: '#541700'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9eaa3'
  primary-fixed-dim: '#bdce89'
  on-primary-fixed: '#161f00'
  on-primary-fixed-variant: '#3e4c16'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system is anchored in the concept of **Quiet Luxury**. It targets a discerning audience of creators and professionals who value intentionality over excess. The aesthetic is strictly minimalist yet editorial, favoring the "white space" of a high-end gallery. 

The emotional response should be one of calm focus and sophisticated curation. By utilizing an editorial layout philosophy, the design system elevates studio gear from mere utility to objects of craft. Every element is placed with purpose, avoiding visual noise to let product photography and typography lead the experience.

## Colors

The palette is inspired by natural materials and tactile studio environments. 
- **Primary (Sage Green):** Used for primary actions and subtle brand moments. It represents growth and creative harmony.
- **Secondary (Soft Bone):** This is the foundation of the UI. It replaces pure white to reduce eye strain and provide a premium, paper-like texture to the interface.
- **Tertiary (Terracotta):** Reserved strictly for pricing, alerts, or specific "add to cart" accents to provide a warm, earthy contrast that demands attention without being aggressive.
- **Neutral (Dark Charcoal):** Used for all typography and structural iconography to ensure high legibility and a grounded feel.

## Typography

The typography strategy relies on the tension between a high-contrast serif and a highly legible, institutional sans-serif. 

**Playfair Display** is used for storytelling and hero moments. It should be typeset with generous leading to maintain its editorial character. **Public Sans** provides the functional backbone, used for all interface elements, descriptions, and metadata. To maintain the sophisticated tone, avoid using bold weights for body text; instead, use slight shifts in color or size to create hierarchy.

## Layout & Spacing

This design system utilizes an **Asymmetric Fluid Grid**. While based on a standard 12-column foundation for desktop, elements are encouraged to sit "off-center" or span uneven column counts (e.g., a 5-column image next to a 3-column text block with a 4-column gap) to create visual interest.

**Whitespace is a core component**, not a byproduct. Margins are intentionally wide to frame content like a printed monograph.
- **Desktop:** 12 columns, 64px margins.
- **Tablet:** 8 columns, 40px margins.
- **Mobile:** 4 columns, 20px margins.

Spacing between sections should be aggressive (120px+) to ensure each product or story feels independent and significant.

## Elevation & Depth

To maintain the minimalist and "flat" editorial aesthetic, depth is conveyed through **Tonal Layering** and **Thin Outlines** rather than heavy shadows.

- **Surface Levels:** The primary background is the Soft Bone (#F5F2ED). Secondary containers or cards should use a slightly darker tint of the background or a 1px border in #2D2D2D at 10% opacity.
- **Outlines:** Use 0.5px to 1px charcoal borders for structural elements like input fields and image frames. 
- **Shadows:** Avoid drop shadows for standard UI. A very soft, highly diffused "ambient" shadow (0px 20px 40px rgba(0,0,0,0.04)) may be used only for floating modals or menus to separate them from the content layer.

## Shapes

The shape language is a blend of hard architectural lines and soft, organic interaction points. 

- **Containers & Images:** Maintain sharp, 0px corners to reflect the professional and "studio" nature of the brand.
- **Interactive Elements:** Buttons, chips, and tags utilize a **Pill-shaped** (Level 3) rounding. This contrast between sharp-edged containers and soft interactive elements makes the UI feel approachable while remaining sophisticated.

## Components

### Buttons
Primary buttons are pill-shaped, filled with Sage (#8A9A5B) or Charcoal (#2D2D2D) and use centered Public Sans (Label-md) text in white or bone. Secondary buttons are ghost-style with a 1px thin charcoal border.

### Input Fields
Inputs should be minimalist: a single 1px bottom border or a very thin surrounding stroke. Labels sit above the field in Label-sm (uppercase). Focus states are indicated by a slight thickening of the border or a shift to Sage green.

### Cards & Asymmetric Grids
Product cards do not use shadows. They rely on high-quality photography and "floating" typography. In product listings, alternate between large "feature" cards (spanning 8 columns) and smaller "detail" cards (spanning 4 columns) to create a rhythmic, editorial flow.

### Chips & Tags
Used for categories like "Limited Edition" or "New Arrival." These are small, pill-shaped, and use the Soft Bone background with Charcoal text to remain unobtrusive.

### Pricing
Pricing is a critical brand moment. Always use **Terracotta (#C04000)** for the price value, typeset in Public Sans with a medium weight to ensure it is the first thing the eye finds after the headline.