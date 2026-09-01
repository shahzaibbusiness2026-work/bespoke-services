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
      className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-16"
    >
      {/* Breadcrumb & Header — matches bedding_collection reference exactly */}
      <div className="mb-12">
        <nav className="text-label-caps text-[#444748] mb-6 uppercase tracking-widest flex items-center gap-2">
          <button onClick={() => onCategoryChange('all')} className="hover:text-[#000000] transition-colors">Home</button>
          <span className="text-[#c4c7c7]">/</span>
          <span className="text-[#000000]">{activeCategory_label}</span>
        </nav>
        <div className="max-w-2xl">
          <h2
            className="text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-[#000000] mb-4"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
          >
            {activeCategory_label}
          </h2>
          <p className="text-body-lg text-[#444748]">
            Elevate your rest with our collection of premium, sustainably sourced linens. Designed for ultimate comfort and enduring elegance.
          </p>
        </div>
      </div>

      {/* Filters & Sorting Bar — matches bedding_collection reference */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-[#c4c7c7] mb-12 gap-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-label-caps text-[#000000] uppercase mr-2">Filter By:</span>

          {/* Category Filter */}
          <div className="relative group">
            <button className="px-4 py-2 border border-[#c4c7c7] text-body-sm text-[#444748] hover:border-[#000000] hover:text-[#000000] transition-colors flex items-center gap-2">
              Category
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 300" }}>expand_more</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl z-20 hidden group-hover:block min-w-[160px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`block w-full text-left px-4 py-2 text-body-sm hover:bg-[#f4f3f1] transition-colors ${activeCategory === cat.id ? 'text-[#000000] font-semibold' : 'text-[#444748]'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-4 py-2 border text-body-sm transition-colors ${onlyInStock ? 'border-[#000000] text-[#000000] bg-[#000000]/5' : 'border-[#c4c7c7] text-[#444748] hover:border-[#000000] hover:text-[#000000]'}`}
          >
            In Stock
          </button>

          {/* On Sale Toggle */}
          <button
            onClick={() => setOnlyOnSale(!onlyOnSale)}
            className={`px-4 py-2 border text-body-sm transition-colors ${onlyOnSale ? 'border-[#000000] text-[#000000] bg-[#000000]/5' : 'border-[#c4c7c7] text-[#444748] hover:border-[#000000] hover:text-[#000000]'}`}
          >
            On Sale
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-body-sm text-[#444748]">{filteredProducts.length} Products</span>
          <div className="relative group">
            <button className="px-4 py-2 border border-transparent text-body-sm text-[#000000] hover:text-[#444748] transition-colors flex items-center gap-2">
              Sort: <span className="font-medium underline underline-offset-4">
                {SORT_OPTIONS.find((s) => s.id === sort)?.label || 'Featured'}
              </span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 300" }}>expand_more</span>
            </button>
            <div className="absolute top-full right-0 mt-1 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl z-20 hidden group-hover:block min-w-[200px]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSort(opt.id)}
                  className={`block w-full text-left px-4 py-2 text-body-sm hover:bg-[#f4f3f1] transition-colors ${sort === opt.id ? 'text-[#000000] font-semibold' : 'text-[#444748]'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid — exactly matches bedding_collection reference: 4 columns */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-body-lg text-[#444748] mb-4">No products found</p>
          <button
            onClick={() => { onCategoryChange('all'); setOnlyInStock(false); setOnlyOnSale(false); }}
            className="px-8 py-4 border border-[#c4c7c7] text-label-caps text-[#000000] hover:bg-[#f4f3f1] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load More — matches bedding_collection reference */}
      {hasMore && (
        <div className="mt-20 flex justify-center">
          <button
            id="load-more-products-btn"
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="bg-[#000000] text-white text-label-caps px-8 py-4 uppercase tracking-widest hover:bg-[#2f3130] transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};
