---
name: Atelier Home
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#675d50'
  on-secondary: '#ffffff'
  secondary-container: '#efe0cf'
  on-secondary-container: '#6e6355'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b18'
  on-tertiary-container: '#87837e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#efe0cf'
  secondary-fixed-dim: '#d3c4b4'
  on-secondary-fixed: '#221a10'
  on-secondary-fixed-variant: '#4f4539'
  tertiary-fixed: '#e7e2dc'
  tertiary-fixed-dim: '#cac6c0'
  on-tertiary-fixed: '#1d1b18'
  on-tertiary-fixed-variant: '#494642'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system is built for a premium e-commerce experience that prioritizes white space, editorial pacing, and a high-end tactile feel. The visual personality is sophisticated and minimal, leaning into a **Modern Editorial** aesthetic that blends the precision of minimalism with the warmth of a luxury lifestyle magazine.

The design language focuses on:
- **Quiet Luxury:** Avoiding loud decorative elements in favor of perfect proportions and subtle transitions.
- **Intentional Friction:** Using generous whitespace to slow the user down, encouraging them to appreciate high-resolution textile photography.
- **Minimalist Precision:** Utilizing thin lines and high-contrast typography to create a sense of architectural structure.
- **Warmth:** Offsetting the minimalism with a palette of warm ivories and sands to ensure the digital experience feels as soft as the physical products.

## Colors

The color palette is rooted in refined neutrals to allow product photography to take center stage. 

- **Primary (#1A1A1A):** A deep charcoal used for all primary typography, icons, and high-emphasis interactive elements. It provides a stark, authoritative contrast against the soft background.
- **Secondary (#A89B8C):** A warm taupe used for accents, subtle dividers, and state indicators. This color bridges the gap between the dark text and light surfaces.
- **Surface/Neutral (#F9F8F6):** A warm ivory that serves as the base background. This is softer on the eyes than pure white and reinforces the natural, high-end textile theme.
- **Tertiary (#E5E0DA):** A soft sand used for secondary containers, hover states, and structural separation where lines would be too harsh.

## Typography

The typography system relies on the interplay between a classic, literary serif and a low-contrast, geometric sans-serif.

- **Headlines:** Use `Libre Caslon Text` for all editorial headings. The weights should remain light or regular. Use generous letter spacing for larger titles to evoke a high-fashion masthead feel.
- **Body Text:** Use `DM Sans` for all functional information and long-form descriptions. It is modern, unobtrusive, and highly legible.
- **Labels:** Small labels and navigational elements should use `label-caps` to create a structured, organized look that contrasts with the fluid serif headers.
- **Scaling:** On mobile, high-impact serifs should scale down significantly while maintaining their leading to prevent the screen from feeling cluttered.

## Layout & Spacing

This design system uses a **Fixed Grid** philosophy for desktop to maintain strict editorial control over line lengths and image placement, and a **Fluid Grid** for mobile.

- **The Grid:** A 12-column grid on desktop with wide 32px gutters to allow elements "room to breathe." 
- **Margins:** Desktop margins are intentionally large (64px) to frame the content like a page in an art book.
- **Rhythm:** Use a base 8px increment for small components, but transition to much larger gaps (80px, 120px) between homepage sections to reinforce the premium, unhurried brand position.
- **Reflow:** On tablet and mobile, the 12-column grid collapses to 4 columns. Spacing between cards should decrease, but the external margins should remain generous enough to keep the "magazine" frame feel.

## Elevation & Depth

To maintain a minimal and high-end aesthetic, the design system avoids traditional shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Levels:** 
  - Base: Warm Ivory (#F9F8F6)
  - Secondary Container: Sand (#E5E0DA)
- **Outlines:** Use very thin (1px) borders in Sand (#E5E0DA) or Soft Taupe (#A89B8C) to define input fields and secondary buttons. 
- **Transitions:** Instead of depth through Z-index shadows, use opacity shifts and subtle "lift" animations (0.5rem translate-Y) on product cards during hover.
- **Overlays:** Modals and menus should use a subtle backdrop blur with a 40% opacity Ivory tint to maintain a sense of environmental continuity.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI element—from buttons and input fields to product images and notification toasts—uses 90-degree corners. This evokes a sense of architectural precision, custom tailoring, and high-end stationery. Roundness is reserved exclusively for the products themselves (the curves of a linen throw or a ceramic vase) to provide a natural contrast against the rigid digital framework.

## Components

- **Buttons:** 
  - *Primary:* Solid Charcoal (#1A1A1A) with White or Ivory text. Sharp corners. No shadow.
  - *Secondary:* Transparent background with a 1px Charcoal border.
  - *Tertiary:* Text-only with a thin underline (1px) that expands on hover.
- **Product Cards:** No borders or shadows. The image should fill the container. Typography (Title and Price) should be left-aligned below the image using `body-md` and `label-caps`.
- **Input Fields:** 1px bottom-border only for a minimal, "signature-line" look. Labels should be `label-caps` placed above the line.
- **Chips/Filters:** Rectangular boxes with 1px Sand borders. Active state switches to a solid Sand background with Charcoal text.
- **Lists:** Separated by thin, full-width 1px lines in #E5E0DA. Generous vertical padding (24px+) between list items.
- **Icons:** Use ultra-lightweight (1px stroke) linear icons. Icons should never be filled; they should appear as delicate wireframes.
- **Additional Elements:** Large "Quick Add" drawers that slide in from the right, maintaining the 0px border-radius and using a full-height ivory background.