<div align="center">

# BOSKI LIMITED
### High-End Bespoke Textiles, Architectural Drapery & 3D Spatial Room Visualizer

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2D0?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.2-FF0055?style=flat-square&logo=framer)](https://motion.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.2_AA%2FAAA-emerald?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-Proprietary-black?style=flat-square)](LICENSE)

*An industrial-grade, ultra-luxury e-commerce web platform crafted with architectural precision, strictly adhering to the Atelier Home zero-radius sharp design philosophy.*

</div>

---

## 🏛️ Architectural Overview

**BOSKI LIMITED** is an editorial e-commerce experience engineered for discerning clientele and trade hospitality partners. Designed to modern web standards, it merges performance-optimized React architecture with tactile luxury aesthetics.

### Key Capabilities

- **Spatial 3D / AR Room Visualizer (`ViewInRoomModal.tsx`)**:
  - Multi-room spatial environments (Minimalist Villa, Parisian Haussmann Apartment, Brutalist Penthouse, Kyoto Ryokan).
  - 1:1 scale true-matrix adjustments, 360° orbital rotation, real-time lighting physics (Daylight, Golden Hour, Gallery Spot, Evening Ambience), and live WebRTC camera integration.
- **Strict 0px Sharp-Corner Atelier Design System**:
  - Enforces pure architectural geometry (0px border-radius) across cards, dialogs, inputs, toasts, popovers, and navigation. Circular radii are strictly isolated to material color swatches.
- **VIP Client Sanctuary & Account Console (`MyAccountPage.tsx`)**:
  - Tiered membership status (Heritage Tier, Silver Reserve, Atelier Gold, Imperial Platinum).
  - Live order tracking, dispatch milestones, saved address book, and concierge styling request manager.
- **Bespoke Made-to-Measure Estimator (`BespokePage.tsx`)**:
  - Real-time custom quotation engine for custom drapery drops, extra-deep bedding fitted pockets (up to 24"), and silk/linen blends.
- **Trade & Hospitality Portal (`TradeHospitalityPage.tsx`)**:
  - Specialized enterprise procurement portal for interior designers, boutique luxury hotels, and high-volume commercial architectural projects.
- **WCAG 2.2.2 Compliant Hero Slider (`HeroSlider.tsx`)**:
  - Calibrated 6-second editorial pacing, pause-on-hover / focus, accessible navigation controls, play/pause toggles, and fluid staggered typography transitions via `motion`.

---

## 🎨 Design System & Tokens

| Token Category | Value / Specification | Application |
| :--- | :--- | :--- |
| **Headline Serif** | `Libre Caslon Text`, Georgia, serif | Editorial banners, hero headlines, luxury product titles |
| **Sans Typography** | `DM Sans`, system-ui, sans-serif | Body prose, table specifications, account metadata |
| **Label Caps** | Uppercase `tracking-[0.16em] - [0.25em]` | Micro-copy, category badges, button CTAs, navigation links |
| **Corner Radius** | `0px` (`rounded-none` strictly enforced) | All surfaces, buttons, modals, input elements, toasts |
| **Primary Palette** | `#FAF9F7` (Ivory), `#1A1C1B` (Charcoal) | Core surfaces, high-contrast backgrounds |
| **Secondary Accents** | `#EFE0CF` (Champagne Sand), `#C4C7C7` (Silver Outline) | Borders, badges, subtle elevation fills |

---

## 📂 Repository Structure

```
boski-limited/
├── docs/
│   └── reference-designs/       # Archived design specifications & tokens
├── public/
│   ├── favicon.svg              # Bespoke luxury serif vector monogram
│   ├── uploads/                 # Dynamic atelier and user media uploads
│   └── images/                  # Structured domain-driven static image assets
│       ├── brand/               # Favicons, vector monograms, marks
│       ├── hero/                # Atmospheric hero banners & editorial drops
│       ├── categories/          # Category tiles & curated foundations
│       ├── products/            # High-resolution textile & collection photography
│       ├── editorial/           # Lookbook canvas & craftsmanship archives
│       ├── bespoke/             # Loom texture swatches & tailoring imagery
│       ├── rooms/               # Spatial room visualizer background plates
│       ├── hospitality/         # Trade & contract procurement photography
│       ├── social/              # Curated community UGC & editorial feeds
│       ├── avatars/             # Verified client testimonial portraits
│       └── reference-designs/   # Web-optimized reference design screenshots
├── src/
│   ├── components/              # Atomic & composite luxury UI components
│   ├── constants/
│   │   └── assets.ts            # Strongly-typed centralized asset manifest
│   ├── context/
│   │   └── ShopContext.tsx      # Global unified e-commerce state machine
│   ├── data/
│   │   └── products.ts          # Master product catalog, lookbooks & presets
│   ├── types/
│   │   └── index.ts             # Type definitions for products, cart, & orders
│   ├── App.tsx                  # Root application router & view manager
│   ├── index.css                # Luxury theme definitions & typography utilities
│   └── main.tsx                 # React DOM root entrypoint
├── package.json                 # Project manifest, dependencies, and build scripts
├── tsconfig.json                # Strict TypeScript configuration
└── next.config.mjs              # Next.js production build configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/shahzaibbusiness2026-work/bespoke-services.git

# Navigate to project directory
cd bespoke-services

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
The application will boot at `http://localhost:5173`.

### Production Build & Code Quality
```bash
# Run strict TypeScript lint check
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Production Bundle Architecture

Configured via `vite.config.ts` with dedicated Rollup manual chunk partitioning:
- **`vendor-react`**: Core React 19 runtime dependencies.
- **`vendor-motion`**: Hardware-accelerated Motion animations.
- **`vendor-icons`**: Lucide SVG icons.
- Monolithic chunk size warnings: **0 warnings** (all chunks under 460 kB).

---

## ⚖️ License & Attribution

Designed and engineered for **BOSKI LIMITED**. All rights reserved.
