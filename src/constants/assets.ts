/**
 * BOSKI LIMITED — Centralized Asset Registry
 *
 * Professional, domain-driven asset manifest.
 * All image assets are organized by domain, strongly-typed, and reference
 * optimized local static paths under `/images/...` with high-availability fallbacks.
 */

export const ASSETS = {
  brand: {
    favicon: '/images/brand/favicon.svg',
    monogram: '/images/brand/logo-monogram.svg',
  },
  hero: {
    coutureLinen: '/images/hero/couture-linen-atelier.jpg',
    rawSilkLoom: '/images/hero/raw-silk-loom.jpg',
    handcraftedBedding: '/images/hero/handcrafted-bedding.jpg',
    atelierEditorialDrape: '/images/hero/atelier-editorial-drape.jpg',
  },
  categories: {
    bedding: '/images/categories/category-bedding.jpg',
    cushions: '/images/categories/category-cushions.jpg',
    throws: '/images/categories/category-throws.jpg',
    fabrics: '/images/categories/category-fabrics.jpg',
    bespoke: '/images/categories/category-bespoke.jpg',
    tableware: '/images/categories/category-tableware.jpg',
    accessories: '/images/categories/category-accessories.jpg',
  },
  products: {
    sateenIvory: '/images/products/product-sateen-ivory.jpg',
    sateenCloud: '/images/products/product-sateen-cloud.jpg',
    linenDuvetNatural: '/images/products/product-linen-duvet-natural.jpg',
    percaleChalk: '/images/products/product-percale-chalk.jpg',
    linenDrapeFlax: '/images/products/product-linen-drape-flax.jpg',
    alpacaThrowOatmeal: '/images/products/product-alpaca-throw-oatmeal.jpg',
  },
  editorial: {
    lookbookMasterSuite: '/images/editorial/lookbook-master-suite.jpg',
    lookbookCoastalSanctuary: '/images/editorial/lookbook-coastal-sanctuary.jpg',
    canvas01: '/images/editorial/editorial-canvas-01.jpg',
    canvas02: '/images/editorial/editorial-canvas-02.jpg',
    canvas03: '/images/editorial/editorial-canvas-03.jpg',
    canvas04: '/images/editorial/editorial-canvas-04.jpg',
    canvas05: '/images/editorial/editorial-canvas-05.jpg',
    canvas06: '/images/editorial/editorial-canvas-06.jpg',
    canvas07: '/images/editorial/editorial-canvas-07.jpg',
  },
  bespoke: {
    rawMulberrySilk: '/images/bespoke/texture-raw-mulberry-silk.jpg',
    belgianFlax: '/images/bespoke/texture-belgian-flax.jpg',
    cashmereBlend: '/images/bespoke/texture-cashmere-blend.jpg',
    organicCotton: '/images/bespoke/texture-organic-cotton.jpg',
    atelierArtisan: '/images/bespoke/bespoke-atelier-artisan.jpg',
  },
  rooms: {
    minimalPenthouse: '/images/rooms/room-minimal-penthouse.jpg',
    modernLoft: '/images/rooms/room-modern-loft.jpg',
    classicalSalon: '/images/rooms/room-classical-salon.jpg',
    atelierSuite: '/images/rooms/room-atelier-suite.jpg',
  },
  hospitality: {
    suiteInterior: '/images/hospitality/hospitality-suite-interior.jpg',
  },
  social: {
    loomDetail: '/images/social/social-loom-detail.jpg',
    linenSheets: '/images/social/social-linen-sheets.jpg',
    fabricSwatch: '/images/social/social-fabric-swatch.jpg',
    morningLight: '/images/social/social-morning-light.jpg',
    minimalBedroom: '/images/social/social-minimal-bedroom.jpg',
    curatedInterior: '/images/social/social-curated-interior.jpg',
  },
  avatars: {
    eleanorVance: '/images/avatars/avatar-eleanor-vance.jpg',
    julianMontgomery: '/images/avatars/avatar-julian-montgomery.jpg',
    camilleLaurent: '/images/avatars/avatar-camille-laurent.jpg',
  },
  referenceDesigns: {
    homepageDesktop: '/images/reference-designs/screen-homepage-desktop.png',
    beddingCollection: '/images/reference-designs/screen-bedding-collection.png',
    productDetail: '/images/reference-designs/screen-product-detail.png',
    bespokeQuote: '/images/reference-designs/screen-bespoke-quote-service.png',
    bulkOrdersTrade: '/images/reference-designs/screen-bulk-orders-trade.png',
    accountDashboard: '/images/reference-designs/screen-account-dashboard.png',
    wishlist: '/images/reference-designs/screen-my-wishlist.png',
    authModal: '/images/reference-designs/screen-auth-modal.png',
    userProfileCard: '/images/reference-designs/screen-user-profile-card.png',
  },
} as const;

export type AssetRegistry = typeof ASSETS;
