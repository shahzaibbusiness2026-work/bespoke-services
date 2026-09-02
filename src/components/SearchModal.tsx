'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setSelectedProductForQuickView, formatPrice } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const popularSearches = [
    'Washed Linen Duvet',
    'Percale Sheet Set',
    'Waffle Blanket',
    'Belgian Curtains',
    'Mulberry Silk Pillowcase',
    'Down Insert',
  ];

  const categories = [
    { label: 'All', key: 'all' },
    { label: 'Duvets', key: 'duvets' },
    { label: 'Sheets', key: 'sheets' },
    { label: 'Curtains', key: 'curtains' },
    { label: 'Blankets', key: 'blankets' },
    { label: 'Pillows', key: 'pillows' },
  ];

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="search-modal-content"
        className="bg-[#faf9f7] w-full max-w-3xl shadow-2xl border border-[#c4c7c7] overflow-hidden flex flex-col max-h-[82vh] will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-6 py-4 border-b border-[#c4c7c7] bg-[#faf9f7]">
          <span className="material-symbols-outlined text-[#444748] mr-3" style={{ fontVariationSettings: "'wght' 300" }}>
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search bedding, sheet sets, duvet covers, linen curtains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-[#000000] text-body-lg placeholder-[#444748]/50 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-body-sm text-[#444748] hover:text-[#000000] mr-3 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#444748] hover:text-[#000000] transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#e3e2e0] bg-[#f4f3f1] overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 text-label-caps uppercase whitespace-nowrap transition-colors border ${
                selectedCategory === cat.key
                  ? 'bg-[#000000] text-white border-[#000000]'
                  : 'bg-transparent text-[#444748] border-transparent hover:border-[#c4c7c7]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {searchTerm.trim() === '' ? (
            <div>
              <p className="text-label-caps text-[#444748] uppercase tracking-widest mb-3">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 border border-[#c4c7c7] text-body-sm text-[#1a1c1b] hover:border-[#000000] hover:bg-[#f4f3f1] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <p className="text-label-caps text-[#444748] uppercase tracking-widest mb-4">
                Popular Collections
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRODUCTS.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductForQuickView(product);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-4 p-3 border border-[#e3e2e0] hover:border-[#000000] cursor-pointer bg-[#ffffff] transition-colors group"
                  >
                    <div className="w-16 h-20 bg-[#efeeec] shrink-0 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-md text-[#000000] font-medium truncate">{product.name}</h4>
                      <p className="text-body-sm text-[#444748]">{product.category}</p>
                      <p className="text-label-caps text-[#000000] mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-[#c4c7c7] mb-3" style={{ fontVariationSettings: "'wght' 200" }}>
                search_off
              </span>
              <p className="text-body-lg text-[#1a1c1b] mb-1">No products found for "{searchTerm}"</p>
              <p className="text-body-sm text-[#444748]">Try another query or browse our collections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProductForQuickView(product);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 border border-[#e3e2e0] hover:border-[#000000] cursor-pointer bg-[#ffffff] transition-colors group"
                >
                  <div className="w-16 h-20 bg-[#efeeec] shrink-0 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-md text-[#000000] font-medium truncate">{product.name}</h4>
                    <p className="text-body-sm text-[#444748] truncate">{product.subtitle}</p>
                    <p className="text-label-caps text-[#000000] mt-1">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
