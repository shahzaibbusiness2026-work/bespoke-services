import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Search, X, ArrowRight, Sparkles, Star, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setSelectedProductForQuickView, formatPrice } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedFilterCategory === 'all' || product.category === selectedFilterCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const popularSearches = ['Cashmere Overcoat', 'Leather Tote', 'Merino Blazer', 'Chelsea Boot', 'Swiss Watch', 'Perfume'];

  const categories = [
    { label: 'All Items', key: 'all' },
    { label: 'Outerwear', key: 'outerwear' },
    { label: 'Tailoring', key: 'tailoring' },
    { label: 'Bags', key: 'bags' },
    { label: 'Footwear', key: 'footwear' },
    { label: 'Accessories', key: 'accessories' },
    { label: 'Fragrance', key: 'fragrance' },
  ];

  return (
    <AnimatePresence>
      <div id="search-modal-overlay" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          id="search-modal-content"
          className="bg-[#FAF9F6] w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Search Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 bg-white flex items-center gap-3">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              id="search-input-field"
              type="text"
              placeholder="Search products, materials, or collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-base sm:text-lg text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-search-modal-btn"
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 text-xs uppercase tracking-widest font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-6 py-3 bg-neutral-100/70 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                id={`search-filter-${cat.key}`}
                onClick={() => setSelectedFilterCategory(cat.key)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                  selectedFilterCategory === cat.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200/80 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {searchTerm === '' && (
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Trending Client Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchTerm(term)}
                      className="text-xs bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Search className="w-3 h-3 text-neutral-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      id={`search-result-${product.id}`}
                      onClick={() => {
                        setSelectedProductForQuickView(product);
                        setIsSearchOpen(false);
                      }}
                      className="bg-white p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-all cursor-pointer flex gap-3 group"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
                              {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-neutral-500 truncate mt-0.5">{product.subtitle}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                          <span className="text-sm font-bold text-neutral-950">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-base font-serif text-neutral-700">No matching creations found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Try searching for "Cashmere", "Bag", "Tailoring", or "Watches".
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
