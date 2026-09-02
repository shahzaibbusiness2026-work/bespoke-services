'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export type CollectionPageType =
  | 'new-arrivals'
  | 'shop'
  | 'bedding'
  | 'curtains'
  | 'towels'
  | 'throws-blankets'
  | 'throws'
  | 'blankets';

interface CollectionPageProps {
  pageType: CollectionPageType;
  initialCategory?: string;
}

const PAGE_CONFIG: Record<
  CollectionPageType,
  {
    title: string;
    subtitle: string;
    description: string;
    bannerImage: string;
    badgeText: string;
    filterCategories: { id: string; label: string }[];
  }
> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'Autumn / Winter Atelier Release',
    description:
      'The latest iterations of our signature organic linens, bespoke jacquard weaves, and garment-washed Egyptian sateen. Designed for calm, refined sanctuaries.',
    bannerImage:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Curated 2025 Release',
    filterCategories: [
      { id: 'all', label: 'All New Arrivals' },
      { id: 'sheets', label: 'Sheet Sets' },
      { id: 'duvets', label: 'Duvet Covers' },
      { id: 'towels', label: 'Bath Linens' },
      { id: 'throws', label: 'Artisan Throws' },
    ],
  },
  shop: {
    title: 'Complete Collection',
    subtitle: 'The Full Boski Limited Catalogue',
    description:
      'Explore all master-loom bedding, stonewashed flax duvets, Belgian linen drapery, plush Turkish bath sheets, and artisan throws.',
    bannerImage:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Atelier Catalogue',
    filterCategories: [
      { id: 'all', label: 'All Pieces' },
      { id: 'sheets', label: 'Sheet Sets' },
      { id: 'duvets', label: 'Duvet Covers' },
      { id: 'curtains', label: 'Curtains' },
      { id: 'towels', label: 'Towels' },
      { id: 'throws', label: 'Throws' },
      { id: 'blankets', label: 'Blankets' },
    ],
  },
  bedding: {
    title: 'Bedding & Sheet Sets',
    subtitle: 'Washed European Flax & Egyptian Cotton',
    description:
      'Generational loom heritage meets whisper-soft modern weaves. From crisp 480-thread-count percale to breathable Normandy flax linen duvet sets.',
    bannerImage:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Master Loom Bedding',
    filterCategories: [
      { id: 'all', label: 'All Bedding' },
      { id: 'sheets', label: 'Core Sheets' },
      { id: 'duvets', label: 'Duvet Covers' },
      { id: 'pillows', label: 'Pillows & Shams' },
    ],
  },
  curtains: {
    title: 'Curtains & Drapery',
    subtitle: 'Belgian Linen & Custom Weighted Hems',
    description:
      'Tailored window coverings crafted from 280 GSM pure flax linen. Designed to gently diffuse natural light while framing rooms with architectural presence.',
    bannerImage:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Belgian Flax Drapery',
    filterCategories: [
      { id: 'all', label: 'All Curtains' },
      { id: 'curtains', label: 'Belgian Linen Drapes' },
    ],
  },
  towels: {
    title: 'Towels & Bath Linens',
    subtitle: '700 GSM Aegean Cotton & Organic Honeycomb Weave',
    description:
      'Indulgently plush Turkish bath sheets and ultra-absorbent honeycomb waffle towels woven from certified organic long-staple cotton for hotel-grade daily rituals.',
    bannerImage:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Luxury Bath Linens',
    filterCategories: [
      { id: 'all', label: 'All Bath Linens' },
      { id: 'towels', label: 'Turkish Terry' },
    ],
  },
  'throws-blankets': {
    title: 'Throws & Blankets',
    subtitle: 'Textured Layering & Artisan Fringe Weaves',
    description:
      'Dimensional honeycomb waffle quilts, baby alpaca bed runners, and hand-fringed stonewashed linen throws designed for year-round warmth and sensory depth.',
    bannerImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Layering Collection',
    filterCategories: [
      { id: 'all', label: 'All Layers' },
      { id: 'throws', label: 'Artisan Throws' },
      { id: 'blankets', label: 'Waffle Blankets' },
    ],
  },
  throws: {
    title: 'Throws & Accents',
    subtitle: 'Hand-Fringed Linen & Alpaca Blends',
    description:
      'Sensory layers for beds, armchairs, and living spaces. Woven on traditional shuttle looms in limited seasonal batches for understated warmth.',
    bannerImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Artisan Accents',
    filterCategories: [
      { id: 'all', label: 'All Throws' },
      { id: 'throws', label: 'Bed Throws' },
    ],
  },
  blankets: {
    title: 'Blankets & Quilts',
    subtitle: 'Honeycomb Waffle & Stonewashed Covers',
    description:
      'Heavyweight Turkish cotton and textured waffle weaves that balance breathable insulation with comforting weight across all seasons.',
    bannerImage:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Textured Layering',
    filterCategories: [
      { id: 'all', label: 'All Blankets' },
      { id: 'blankets', label: 'Waffle Quilts' },
    ],
  },
};

export const CollectionPage: React.FC<CollectionPageProps> = ({ pageType, initialCategory }) => {
  const { products, categories, setActivePage } = useShop();
  const config = PAGE_CONFIG[pageType] || PAGE_CONFIG.shop;

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialCategory || 'all');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedSubCategory(initialCategory);
    } else {
      setSelectedSubCategory('all');
    }
  }, [pageType, initialCategory]);

  const filteredProducts = useMemo(() => {
    const sourceProducts = products && products.length > 0 ? products : PRODUCTS;
    let list = [...sourceProducts];

    if (pageType === 'new-arrivals') {
      list = list.filter((p) => p.isNew || p.featured);
    } else if (pageType === 'bedding') {
      list = list.filter((p) => p.category === 'bedding' || p.category === 'sheets' || p.category === 'duvets' || p.category === 'pillows');
    } else if (pageType === 'curtains') {
      list = list.filter((p) => p.category === 'curtains');
    } else if (pageType === 'towels') {
      list = list.filter((p) => p.category === 'towels');
    } else if (pageType === 'throws-blankets') {
      list = list.filter((p) => p.category === 'throws' || p.category === 'blankets');
    } else if (pageType === 'throws') {
      list = list.filter((p) => p.category === 'throws');
    } else if (pageType === 'blankets') {
      list = list.filter((p) => p.category === 'blankets');
    }
    // 'shop' shows everything

    if (selectedSubCategory !== 'all') {
      list = list.filter((p) => p.category === selectedSubCategory);
    }

    if (onlyInStock) list = list.filter((p) => p.inStock);
    if (onlyOnSale) list = list.filter((p) => p.isSale);

    switch (selectedSort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [pageType, selectedSubCategory, selectedSort, onlyInStock, onlyOnSale]);

  return (
    <main className="flex-grow bg-[#faf9f7] animate-fadeIn pb-24">
      {/* Editorial Collection Hero Banner */}
      <section className="relative w-full h-[48vh] min-h-[380px] flex items-end justify-start overflow-hidden bg-[#efeeec]">
        <img
          src={config.bannerImage}
          alt={config.title}
          className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-1000 scale-100 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16 pb-12 text-white">
          {/* Breadcrumbs */}
          <nav className="text-label-caps tracking-widest text-white/70 mb-4 uppercase flex items-center gap-2 text-xs">
            <button
              onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <span className="text-white/40">/</span>
            <span className="text-white">{config.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-label-caps uppercase tracking-widest mb-3 border border-white/30">
            {config.badgeText}
          </span>
          <h1
            className="text-[34px] sm:text-[48px] md:text-[56px] leading-[42px] sm:leading-[56px] md:leading-[64px] tracking-[-0.02em] text-white max-w-2xl font-normal"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            {config.title}
          </h1>
          <p className="text-body-md text-white/90 max-w-xl mt-3 font-light">
            {config.description}
          </p>
        </div>
      </section>

      {/* Filter and Controls Toolbar */}
      <section className="w-full max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16 pt-10 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-y border-[#c4c7c7] gap-4">

          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-label-caps text-[#000000] uppercase tracking-wider mr-2 font-semibold">Filter:</span>
            {config.filterCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.id)}
                className={`px-4 py-2 border text-label-caps uppercase transition-all duration-200 cursor-pointer ${
                  selectedSubCategory === sub.id
                    ? 'border-[#000000] bg-[#000000] text-white shadow-sm'
                    : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] hover:text-[#000000] bg-transparent'
                }`}
              >
                {sub.label}
              </button>
            ))}

            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-4 py-2 border text-label-caps uppercase transition-all duration-200 cursor-pointer ${
                onlyInStock
                  ? 'border-[#000000] bg-[#000000] text-white'
                  : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] hover:text-[#000000]'
              }`}
            >
              In Stock Only
            </button>

            <button
              onClick={() => setOnlyOnSale(!onlyOnSale)}
              className={`px-4 py-2 border text-label-caps uppercase transition-all duration-200 cursor-pointer ${
                onlyOnSale
                  ? 'border-[#000000] bg-[#000000] text-white'
                  : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] hover:text-[#000000]'
              }`}
            >
              On Sale
            </button>
          </div>

          {/* Count & Sorting Dropdown */}
          <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
            <span className="text-body-sm text-[#2b2d2c] tracking-wide font-medium">
              {filteredProducts.length} Pieces
            </span>

            <div className="flex items-center gap-2">
              <span className="text-label-caps text-[#2b2d2c]">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-transparent border-0 border-b border-[#000000] text-body-sm text-[#000000] font-medium py-1 px-1 outline-none cursor-pointer"
              >
                <option value="featured">Featured Selection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#c4c7c7] p-12">
            <span
              className="material-symbols-outlined text-5xl text-[#c4c7c7] mb-3"
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              inventory_2
            </span>
            <p
              className="text-headline-sm text-[#000000] mb-2"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              No matching pieces in this view
            </p>
            <p className="text-body-md text-[#2b2d2c] mb-6">
              Try adjusting your filters or explore all collections.
            </p>
            <button
              onClick={() => {
                setSelectedSubCategory('all');
                setOnlyInStock(false);
                setOnlyOnSale(false);
              }}
              className="px-8 py-3 bg-[#000000] text-white text-label-caps hover:bg-[#252726] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className="transition-transform duration-300 hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
