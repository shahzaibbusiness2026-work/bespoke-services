import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductColor } from '../types';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ChevronDown,
  Sparkles,
  Share2,
  Check,
  Eye,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForQuickView,
    setSelectedProductForQuickView,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    openARView,
    showToast,
  } = useShop();

  const product = selectedProductForQuickView;

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Initialize or reset when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setSelectedImageIndex(0);
      setQuantity(1);
      setOpenAccordion('details');
    }
  }, [product]);

  if (!product || !selectedColor) return null;

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      showToast('Link Copied', 'Product link saved to clipboard', 'info');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const imagesToDisplay = [
    selectedColor.image,
    ...product.images.filter((img) => img !== selectedColor.image),
  ];

  return (
    <AnimatePresence>
      <div
        id="product-detail-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
        onClick={() => setSelectedProductForQuickView(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          id="product-detail-modal-content"
          className="bg-[#FAF9F6] w-full max-w-5xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar for Mobile Close */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white sm:hidden">
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Product Overview
            </span>
            <button
              onClick={() => setSelectedProductForQuickView(null)}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
            {/* Left Image Gallery (Cols 1-7) */}
            <div className="lg:col-span-7 p-6 lg:p-8 bg-neutral-100/60 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col gap-4">
              {/* Main Featured Image */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-200/50 shadow-inner group">
                <img
                  src={imagesToDisplay[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isBestSeller && (
                    <span className="px-3 py-1 rounded-md bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1 rounded-md bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                      New In
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="px-3 py-1 rounded-md bg-rose-600 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                      -{product.discountPercent}% Off
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 hidden sm:block">
                  <button
                    onClick={() => setSelectedProductForQuickView(null)}
                    className="p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md backdrop-blur-sm transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {imagesToDisplay.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-img-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-neutral-950 ring-2 ring-neutral-950/20 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Specifications & Actions (Cols 8-12) */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-white overflow-y-auto">
              <div className="space-y-5">
                {/* Header Information */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="uppercase tracking-[0.2em] font-semibold text-neutral-400">
                      {product.category} &bull; SKU: {product.sku}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-neutral-400 font-normal">({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-medium">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-light">
                    {product.subtitle}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-100">
                  <span className="text-2xl sm:text-3xl font-bold text-neutral-950">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-neutral-400 line-through font-light">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Save {formatPrice(product.originalPrice! - product.price)}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Color: <span className="font-normal text-neutral-600">{selectedColor.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => {
                          setSelectedColor(col);
                          setSelectedImageIndex(0);
                        }}
                        className={`group relative p-1 rounded-full transition-all ${
                          selectedColor.name === col.name
                            ? 'ring-2 ring-neutral-950 ring-offset-2 scale-110'
                            : 'hover:scale-105'
                        }`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection & Guide Trigger */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Select Size
                    </span>
                    <button
                      id="modal-open-size-guide-btn"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-neutral-500 hover:text-neutral-950 flex items-center gap-1 font-medium underline underline-offset-2"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        id={`modal-size-${sz}`}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 text-xs rounded-xl font-bold uppercase tracking-wider transition-all border ${
                          selectedSize === sz
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Scarcity Alert */}
                {product.stockCount <= 6 && (
                  <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Low stock: Only <strong>{product.stockCount} pieces</strong> remaining in Atelier vault.
                    </span>
                  </div>
                )}

                {/* Quantity & CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 px-2 py-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2 py-1 text-sm font-bold text-neutral-600 hover:text-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                        className="px-2 py-1 text-sm font-bold text-neutral-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      id="modal-add-to-bag-btn"
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag &bull; {formatPrice(product.price * quantity)}</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      id="modal-wishlist-toggle-btn"
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        isLiked
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
                      aria-label="Share product"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* 'View in Room' AR Interactive Button */}
                  <button
                    id="modal-view-in-room-btn"
                    onClick={() => openARView(product)}
                    className="w-full py-3 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 hover:from-black hover:to-neutral-900 border border-neutral-800 text-amber-300 font-bold text-xs uppercase tracking-[0.18em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:border-amber-400/50 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>View in Room &bull; Augmented Reality Simulation</span>
                  </button>
                </div>

                {/* Collapsible Accordion Sections */}
                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  {/* Details Accordion */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                      className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50"
                    >
                      <span>Craftsmanship & Details</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          openAccordion === 'details' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordion === 'details' && (
                      <div className="px-4 py-3 text-xs text-neutral-600 space-y-2 bg-white">
                        <p className="leading-relaxed font-light">{product.description}</p>
                        <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                          {product.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Sourcing & Sustainability Accordion */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === 'sustainability' ? '' : 'sustainability')}
                      className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50"
                    >
                      <span>Material & Sustainability</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          openAccordion === 'sustainability' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordion === 'sustainability' && (
                      <div className="px-4 py-3 text-xs text-neutral-600 space-y-2 bg-white">
                        <p><strong>Primary Material:</strong> {product.material}</p>
                        <p><strong>Care:</strong> {product.careInstructions}</p>
                        <p><strong>Impact:</strong> {product.sustainability}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping & Concierge Returns */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                      className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50"
                    >
                      <span>Complimentary Global Delivery</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          openAccordion === 'shipping' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openAccordion === 'shipping' && (
                      <div className="px-4 py-3 text-xs text-neutral-600 space-y-2 bg-white">
                        <p>
                          Orders dispatched within 24 business hours from our European and North American fulfillment vaults via express courier.
                        </p>
                        <p>
                          Includes 30-day doorstep pickup returns and complimentary gift packaging with embossed note card.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
