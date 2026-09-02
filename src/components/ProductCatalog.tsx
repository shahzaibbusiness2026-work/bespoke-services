'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';

interface ProductCatalogProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const DEFAULT_CATALOG_CATEGORIES = [
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
  const { products, categories, isDarkMode } = useShop();
  const [sort, setSort] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(8);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Dynamically assemble categories from context (includes newly added categories)
  const catalogCategories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Collections' }];
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        if (!list.some((item) => item.id === c.category)) {
          list.push({ id: c.category, label: c.label });
        }
      });
    } else {
      DEFAULT_CATALOG_CATEGORIES.forEach((c) => {
        if (!list.some((item) => item.id === c.id)) {
          list.push(c);
        }
      });
    }
    return list;
  }, [categories]);

  const activeCategory_label =
    catalogCategories.find((c) => c.id === activeCategory)?.label || 'All Collections';

  const filteredProducts = useMemo(() => {
    let result = (products && products.length > 0 ? products : PRODUCTS).filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesStock = !onlyInStock || (p.inStock ?? true);
      const matchesSale = !onlyOnSale || (p.isSale ?? false);
      return matchesCategory && matchesStock && matchesSale;
    });

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8)); break;
      case 'new': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, sort, onlyInStock, onlyOnSale]);

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
          className={`text-label-caps mb-4 sm:mb-6 uppercase tracking-widest flex items-center gap-2 ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}
          aria-label="Breadcrumbs"
        >
          <button
            onClick={() => onCategoryChange('all')}
            className={`transition-colors cursor-pointer ${
              isDarkMode ? 'hover:text-[#FAF8F5]' : 'hover:text-[#000000]'
            }`}
          >
            Home
          </button>
          <span className={isDarkMode ? 'text-[#6E6B65]' : 'text-[#8e908f]'}>/</span>
          <span className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
            {activeCategory_label}
          </span>
        </nav>

        <div className="max-w-2xl">
          <h2
            className={`text-[34px] sm:text-[48px] lg:text-[58px] leading-[42px] sm:leading-[56px] lg:leading-[66px] tracking-[-0.02em] mb-4 ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
          >
            {activeCategory_label}
          </h2>
          <p className={`text-body-md sm:text-body-lg font-light leading-relaxed ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}>
            Elevate your rest with our collection of master-loom, sustainably sourced linens and architectural drapery. Designed for enduring tactile elegance.
          </p>
        </div>
      </div>

      {/* Interactive Responsive Filters & Sorting Bar */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-y mb-12 gap-5 ${
        isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
      }`}>
        {/* Filter Buttons Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <span className={`text-label-caps uppercase font-semibold text-[11px] mr-1 hidden sm:inline ${
            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
          }`}>
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
              className={`min-h-[44px] px-4 py-2.5 border text-body-sm transition-colors flex items-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'border-[#383D3A] bg-[#1A1D1C] text-[#FAF8F5] hover:border-[#C5A059]'
                  : 'border-[#c4c7c7] bg-white text-[#000000] hover:border-[#000000]'
              }`}
            >
              <span>Category ({activeCategory_label})</span>
              <span className="material-symbols-outlined text-[16px]">
                {isCategoryDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isCategoryDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-1 border shadow-xl z-30 py-1.5 min-w-[210px] animate-fadeIn normal-case ${
                  isDarkMode ? 'bg-[#1A1D1C] border-[#383D3A]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                }`}
                role="listbox"
                aria-label="Category list"
              >
                {catalogCategories.map((cat) => (
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
                        ? isDarkMode
                          ? 'bg-[#C5A059] text-black font-semibold'
                          : 'bg-[#000000] text-white font-medium'
                        : isDarkMode
                          ? 'text-[#A8A49C] hover:bg-[#242826] hover:text-[#FAF8F5]'
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

          {/* In Stock Toggle Button */}
          <button
            type="button"
            id="filter-in-stock-btn"
            onClick={() => setOnlyInStock(!onlyInStock)}
            aria-pressed={onlyInStock}
            aria-label="Toggle In Stock products only"
            className={`min-h-[44px] px-4 py-2.5 text-body-sm transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium border ${
              onlyInStock
                ? isDarkMode
                  ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-xs'
                  : 'bg-[#000000] text-white border-[#000000] shadow-xs'
                : isDarkMode
                  ? 'bg-[#1A1D1C] text-[#A8A49C] border-[#383D3A] hover:border-[#C5A059] hover:text-[#FAF8F5]'
                  : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000] hover:text-[#000000]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                onlyInStock ? (isDarkMode ? 'bg-black' : 'bg-white') : 'bg-[#1b6b3e]'
              }`}
            />
            <span>In Stock</span>
            {onlyInStock && (
              <span className="material-symbols-outlined text-[15px]">check</span>
            )}
          </button>

          {/* On Sale Toggle Button */}
          <button
            type="button"
            id="filter-on-sale-btn"
            onClick={() => setOnlyOnSale(!onlyOnSale)}
            aria-pressed={onlyOnSale}
            aria-label="Toggle On Sale products only"
            className={`min-h-[44px] px-4 py-2.5 text-body-sm transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium border ${
              onlyOnSale
                ? isDarkMode
                  ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-xs'
                  : 'bg-[#000000] text-white border-[#000000] shadow-xs'
                : isDarkMode
                  ? 'bg-[#1A1D1C] text-[#A8A49C] border-[#383D3A] hover:border-[#C5A059] hover:text-[#FAF8F5]'
                  : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000] hover:text-[#000000]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[14px] ${
                onlyOnSale ? (isDarkMode ? 'text-black' : 'text-white') : 'text-[#c0392b]'
              }`}
            >
              sell
            </span>
            <span>On Sale</span>
            {onlyOnSale && (
              <span className="material-symbols-outlined text-[15px]">check</span>
            )}
          </button>

          {/* Clear Filters */}
          {(onlyInStock || onlyOnSale || activeCategory !== 'all') && (
            <button
              onClick={() => {
                onCategoryChange('all');
                setOnlyInStock(false);
                setOnlyOnSale(false);
              }}
              className={`text-body-sm underline ml-1 cursor-pointer py-2 ${
                isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-[#383838] hover:text-[#000000]'
              }`}
              aria-label="Reset all product filters"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sort & Count Section */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className={`text-body-sm font-medium ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>
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
              className={`min-h-[44px] px-3.5 py-2.5 border text-body-sm transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent ${
                isDarkMode
                  ? 'border-transparent text-[#FAF8F5] hover:border-[#383D3A]'
                  : 'border-transparent text-[#000000] hover:border-[#c4c7c7]'
              }`}
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
                className={`absolute top-full right-0 mt-1 border shadow-xl z-30 py-1.5 min-w-[200px] animate-fadeIn normal-case ${
                  isDarkMode ? 'bg-[#1A1D1C] border-[#383D3A]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                }`}
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
                        ? isDarkMode
                          ? 'bg-[#C5A059] text-black font-semibold'
                          : 'bg-[#000000] text-white font-medium'
                        : isDarkMode
                          ? 'text-[#A8A49C] hover:bg-[#242826] hover:text-[#FAF8F5]'
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

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className={`text-center py-20 sm:py-28 border px-6 ${
          isDarkMode ? 'bg-[#161817] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
        }`}>
          <span className={`material-symbols-outlined text-[44px] mb-3 block ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
          }`}>
            search_off
          </span>
          <p className={`text-headline-sm mb-2 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`} style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
            No Matching Archive Pieces
          </p>
          <p className={`text-body-md max-w-md mx-auto mb-6 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>
            We couldn't find items matching your current filters. Try resetting the filters or exploring our full catalog.
          </p>
          <button
            onClick={() => {
              onCategoryChange('all');
              setOnlyInStock(false);
              setOnlyOnSale(false);
            }}
            className={`px-8 py-4 text-label-caps uppercase tracking-widest transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                : 'bg-[#000000] text-white hover:bg-[#252726]'
            }`}
          >
            View All Collections
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16"
        >
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-16 sm:mt-24 flex justify-center">
          <button
            id="load-more-products-btn"
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className={`min-h-[48px] text-label-caps px-10 py-4 uppercase tracking-[0.18em] transition-colors cursor-pointer font-medium shadow-sm border ${
              isDarkMode
                ? 'bg-[#1A1D1C] border-[#383D3A] text-[#FAF8F5] hover:border-[#C5A059] hover:bg-[#242826]'
                : 'bg-[#000000] border-[#000000] text-white hover:bg-[#252726]'
            }`}
            aria-label="Load more archival products"
          >
            Load More Pieces ({filteredProducts.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </section>
  );
};
