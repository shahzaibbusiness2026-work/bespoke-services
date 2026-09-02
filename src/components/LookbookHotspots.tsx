'use client';

import React, { useState } from 'react';
import { LOOKBOOKS, PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Plus, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LookbookHotspots: React.FC = () => {
  const { setSelectedProductForQuickView, addToCart, formatPrice } = useShop();
  const [activeLookbookIndex, setActiveLookbookIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const lookbook = LOOKBOOKS[activeLookbookIndex];

  return (
    <section id="lookbook-section" className="py-24 bg-[#121313] text-white overflow-hidden scroll-mt-20 border-t border-[#252726]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-label-caps uppercase tracking-[0.25em] text-[#efe0cf] font-semibold mb-3 block">
              Editorial Curation &bull; Season 2026
            </span>
            <h2
              className="text-[34px] sm:text-[46px] leading-[42px] sm:leading-[54px] font-normal text-white"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Shop The Runway Curation
            </h2>
          </div>

          {/* Lookbook Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#1c1b1b] p-1 border border-[#383838] rounded-none">
            {LOOKBOOKS.map((lb, idx) => (
              <button
                key={lb.id}
                id={`lookbook-tab-${lb.id}`}
                onClick={() => {
                  setActiveLookbookIndex(idx);
                  setActiveHotspotId(null);
                }}
                className={`px-4 py-2 text-label-caps font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                  activeLookbookIndex === idx
                    ? 'bg-white text-[#000000] shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lb.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Lookbook Container */}
        <div className="relative rounded-none overflow-hidden bg-[#1a1c1b] border border-[#383838] shadow-2xl aspect-[16/10] sm:aspect-[21/10] max-h-[700px]">
          <img
            src={lookbook.image}
            alt={lookbook.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Bottom Narrative */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-lg space-y-2 pointer-events-none">
            <span className="text-label-caps uppercase tracking-[0.3em] font-semibold text-[#efe0cf] block">
              {lookbook.season}
            </span>
            <h3
              className="text-[26px] sm:text-[38px] text-white font-normal leading-tight"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {lookbook.title}
            </h3>
            <p className="text-body-sm text-white/80 font-light leading-relaxed">
              {lookbook.subtitle}
            </p>
          </div>

          {/* Interactive Hotspot Pins */}
          {lookbook.hotspots.map((spot) => {
            const product = PRODUCTS.find((p) => p.id === spot.productId);
            const isOpen = activeHotspotId === spot.id;

            return (
              <div
                key={spot.id}
                style={{ top: `${spot.yPercent}%`, left: `${spot.xPercent}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Pin Button with Ambient Luxury Pulse Ring */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-none bg-[#C9A227]/30 animate-ambient-pulse pointer-events-none" />
                  <button
                    id={`hotspot-pin-${spot.id}`}
                    onClick={() => setActiveHotspotId(isOpen ? null : spot.id)}
                    className={`relative w-8 h-8 flex items-center justify-center shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border cursor-pointer rounded-none ${
                      isOpen
                        ? 'bg-[#C9A227] text-black border-[#C9A227] scale-110 shadow-[0_0_20px_rgba(201,162,39,0.5)]'
                        : 'bg-white/90 backdrop-blur-sm text-black border-white/80 hover:bg-[#C9A227] hover:border-[#C9A227] hover:scale-115'
                    }`}
                    aria-label={`View ${spot.title}`}
                  >
                    <Plus className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                </div>

                {/* Floating Product Popover Card */}
                <AnimatePresence>
                  {isOpen && product && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.2 }}
                      id={`hotspot-card-${spot.id}`}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-68 bg-[#faf9f7] text-[#1a1c1b] rounded-none p-4 shadow-2xl border border-[#c4c7c7] z-40"
                    >
                      <div className="flex gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-20 object-cover rounded-none bg-[#efeeec] shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#675d50] block truncate">
                              {product.category}
                            </span>
                            <h4
                              className="text-body-sm font-medium text-[#000000] line-clamp-1"
                              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                            >
                              {product.name}
                            </h4>
                          </div>
                          <span className="text-body-sm font-semibold text-[#000000]">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-3 border-t border-[#e3e2e0] flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductForQuickView(product);
                            setActiveHotspotId(null);
                          }}
                          className="flex-1 py-2 bg-white hover:bg-[#efeeec] border border-[#c4c7c7] text-[#000000] text-label-caps uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product);
                            setActiveHotspotId(null);
                          }}
                          className="flex-1 py-2 bg-[#000000] hover:bg-[#252726] text-white text-label-caps uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
