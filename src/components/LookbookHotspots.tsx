import React, { useState } from 'react';
import { LOOKBOOKS, PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Plus, ShoppingBag, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LookbookHotspots: React.FC = () => {
  const { setSelectedProductForQuickView, addToCart, formatPrice } = useShop();
  const [activeLookbookIndex, setActiveLookbookIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const lookbook = LOOKBOOKS[activeLookbookIndex];

  return (
    <section id="lookbook-section" className="py-20 bg-neutral-950 text-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Lookbook</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white">
              Shop The Runway Look
            </h2>
          </div>

          {/* Lookbook Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4 md:mt-0 bg-neutral-900 p-1.5 rounded-full border border-neutral-800">
            {LOOKBOOKS.map((lb, idx) => (
              <button
                key={lb.id}
                id={`lookbook-tab-${lb.id}`}
                onClick={() => {
                  setActiveLookbookIndex(idx);
                  setActiveHotspotId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeLookbookIndex === idx
                    ? 'bg-white text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lb.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Lookbook Container */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl aspect-[16/10] sm:aspect-[21/10] max-h-[700px]">
          <img
            src={lookbook.image}
            alt={lookbook.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/30 pointer-events-none" />

          {/* Bottom Narrative */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-lg space-y-2 pointer-events-none">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-300">
              {lookbook.season}
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              {lookbook.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
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
                {/* Pin Button with Pulse Ring */}
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                  <button
                    id={`hotspot-pin-${spot.id}`}
                    onClick={() => setActiveHotspotId(isOpen ? null : spot.id)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 ${
                      isOpen
                        ? 'bg-amber-400 text-neutral-950 border-white scale-110'
                        : 'bg-white/90 text-neutral-950 border-amber-300 hover:scale-110 backdrop-blur-sm'
                    }`}
                    aria-label={`View ${spot.title}`}
                  >
                    <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                </div>

                {/* Floating Product Popover Card */}
                <AnimatePresence>
                  {isOpen && product && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.2 }}
                      id={`hotspot-card-${spot.id}`}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white text-neutral-900 rounded-2xl p-3.5 shadow-2xl border border-neutral-200 z-40"
                    >
                      <div className="flex gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-20 object-cover rounded-lg bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block truncate">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                              {product.name}
                            </h4>
                          </div>
                          <span className="text-xs font-bold text-neutral-950">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductForQuickView(product);
                            setActiveHotspotId(null);
                          }}
                          className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product);
                            setActiveHotspotId(null);
                          }}
                          className="flex-1 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
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
