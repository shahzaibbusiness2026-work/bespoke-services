import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'sheets', label: 'Bedding' },
  { id: 'duvets', label: 'Duvet Covers' },
  { id: 'curtains', label: 'Curtains' },
  { id: 'towels', label: 'Towels & Bath' },
  { id: 'throws', label: 'Throws' },
  { id: 'blankets', label: 'Blankets' },
  { id: 'pillows', label: 'Pillowcases' },
];

const SORT_OPTIONS: { id: string; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Best Rated' },
  { id: 'new', label: 'New Arrivals' },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ activeCategory, onCategoryChange }) => {
  const [sort, setSort] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(8);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const activeCategory_label = CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Collections';

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    // Stock
    if (onlyInStock) result = result.filter((p) => p.inStock);
    // Sale
    if (onlyOnSale) result = result.filter((p) => p.isSale);

    // Sort
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'new': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, sort, onlyInStock, onlyOnSale]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section
      id="catalog-section"
      className="w-full max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16 py-12 md:py-20"
      aria-label="Product Collections"
    >
      {/* Breadcrumb & Section Header */}
      <div className="mb-10 md:mb-14">
        <nav
          className="text-label-caps text-[#2b2d2c] mb-4 sm:mb-6 uppercase tracking-widest flex items-center gap-2"
          aria-label="Breadcrumbs"
        >
          <button
            onClick={() => onCategoryChange('all')}
            className="hover:text-[#000000] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#8e908f]">/</span>
          <span className="text-[#000000] font-semibold">{activeCategory_label}</span>
        </nav>

        <div className="max-w-2xl">
          <h2
            className="text-[34px] sm:text-[48px] lg:text-[58px] leading-[42px] sm:leading-[56px] lg:leading-[66px] tracking-[-0.02em] text-[#000000] mb-4"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
          >
            {activeCategory_label}
          </h2>
          <p className="text-body-md sm:text-body-lg text-[#2b2d2c] font-light leading-relaxed">
            Elevate your rest with our collection of master-loom, sustainably sourced linens and architectural drapery. Designed for enduring tactile elegance.
          </p>
        </div>
      </div>

      {/* Interactive Responsive Filters & Sorting Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-y border-[#c4c7c7] mb-12 gap-5">
        {/* Filter Buttons Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <span className="text-label-caps text-[#000000] uppercase font-semibold text-[11px] mr-1 hidden sm:inline">
            Filter:
          </span>

          {/* Category Filter Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
          >
            <button
              type="button"
              id="filter-category-btn"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isCategoryDropdownOpen}
              aria-label={`Filter by category: currently ${activeCategory_label}`}
              className="min-h-[44px] px-4 py-2.5 border border-[#c4c7c7] bg-white text-body-sm text-[#000000] hover:border-[#000000] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Category ({activeCategory_label})</span>
              <span className="material-symbols-outlined text-[16px]">
                {isCategoryDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isCategoryDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl z-30 py-1.5 min-w-[210px] animate-fadeIn normal-case"
                role="listbox"
                aria-label="Category list"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    role="option"
                    aria-selected={activeCategory === cat.id}
                    onClick={() => {
                      onCategoryChange(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-body-sm transition-colors cursor-pointer flex items-center justify-between ${
                      activeCategory === cat.id
                        ? 'bg-[#000000] text-white font-medium'
                        : 'text-[#2b2d2c] hover:bg-[#efeeec]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {activeCategory === cat.id && (
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* In Stock Toggle Button with Visual Active State & ARIA */}
          <button
            type="button"
            id="filter-in-stock-btn"
            onClick={() => setOnlyInStock(!onlyInStock)}
            aria-pressed={onlyInStock}
            aria-label="Toggle In Stock products only"
            className={`min-h-[44px] px-4 py-2.5 text-body-sm transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium border ${
              onlyInStock
                ? 'bg-[#000000] text-white border-[#000000] shadow-xs'
                : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000] hover:text-[#000000]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                onlyInStock ? 'bg-white' : 'bg-[#1b6b3e]'
              }`}
            />
            <span>In Stock</span>
            {onlyInStock && (
              <span className="material-symbols-outlined text-[15px]">check</span>
            )}
          </button>

          {/* On Sale Toggle Button with Visual Active State & ARIA */}
          <button
            type="button"
            id="filter-on-sale-btn"
            onClick={() => setOnlyOnSale(!onlyOnSale)}
            aria-pressed={onlyOnSale}
            aria-label="Toggle On Sale products only"
            className={`min-h-[44px] px-4 py-2.5 text-body-sm transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium border ${
              onlyOnSale
                ? 'bg-[#000000] text-white border-[#000000] shadow-xs'
                : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000] hover:text-[#000000]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[14px] ${
                onlyOnSale ? 'text-white' : 'text-[#c0392b]'
              }`}
            >
              sell
            </span>
            <span>On Sale</span>
            {onlyOnSale && (
              <span className="material-symbols-outlined text-[15px]">check</span>
            )}
          </button>

          {/* Clear Filters (visible if any filter active) */}
          {(onlyInStock || onlyOnSale || activeCategory !== 'all') && (
            <button
              onClick={() => {
                onCategoryChange('all');
                setOnlyInStock(false);
                setOnlyOnSale(false);
              }}
              className="text-body-sm text-[#383838] hover:text-[#000000] underline ml-1 cursor-pointer py-2"
              aria-label="Reset all product filters"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sort & Count Section */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-body-sm text-[#2b2d2c] font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          <div
            className="relative"
            onMouseEnter={() => setIsSortDropdownOpen(true)}
            onMouseLeave={() => setIsSortDropdownOpen(false)}
          >
            <button
              type="button"
              id="sort-menu-btn"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isSortDropdownOpen}
              aria-label={`Sort by: ${SORT_OPTIONS.find((s) => s.id === sort)?.label || 'Featured'}`}
              className="min-h-[44px] px-3.5 py-2.5 border border-transparent text-body-sm text-[#000000] hover:border-[#c4c7c7] transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent"
            >
              <span>Sort:</span>
              <span className="font-semibold underline underline-offset-4">
                {SORT_OPTIONS.find((s) => s.id === sort)?.label || 'Featured'}
              </span>
              <span className="material-symbols-outlined text-[16px]">
                {isSortDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isSortDropdownOpen && (
              <div
                className="absolute top-full right-0 mt-1 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl z-30 py-1.5 min-w-[200px] animate-fadeIn normal-case"
                role="listbox"
                aria-label="Sort options"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    role="option"
                    aria-selected={sort === opt.id}
                    onClick={() => {
                      setSort(opt.id);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-body-sm transition-colors cursor-pointer flex items-center justify-between ${
                      sort === opt.id
                        ? 'bg-[#000000] text-white font-medium'
                        : 'text-[#2b2d2c] hover:bg-[#efeeec]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sort === opt.id && (
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid — Fully Responsive across Mobile, Tablet, Desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 sm:py-28 bg-[#faf9f7] border border-[#c4c7c7] px-6">
          <span className="material-symbols-outlined text-[44px] text-[#2b2d2c] mb-3 block">
            search_off
          </span>
          <p className="text-headline-sm text-[#000000] mb-2" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
            No Matching Archive Pieces
          </p>
          <p className="text-body-md text-[#2b2d2c] max-w-md mx-auto mb-6">
            We couldn't find items matching your current filters. Try resetting the filters or exploring our full catalog.
          </p>
          <button
            onClick={() => {
              onCategoryChange('all');
              setOnlyInStock(false);
              setOnlyOnSale(false);
            }}
            className="px-8 py-4 bg-[#000000] text-white text-label-caps uppercase tracking-widest hover:bg-[#252726] transition-colors cursor-pointer"
          >
            View All Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-16 sm:mt-24 flex justify-center">
          <button
            id="load-more-products-btn"
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="min-h-[48px] bg-[#000000] text-white text-label-caps px-10 py-4 uppercase tracking-[0.18em] hover:bg-[#252726] transition-colors cursor-pointer font-medium shadow-sm"
            aria-label="Load more archival products"
          >
            Load More Pieces ({filteredProducts.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </section>
  );
};
