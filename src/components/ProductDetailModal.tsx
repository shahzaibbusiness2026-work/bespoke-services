'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductColor } from '../types';
import { FALLBACK_IMAGE } from '../data/products';

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
    isDarkMode,
  } = useShop();

  const product = selectedProductForQuickView;

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<string>('details');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes[0] || '');
      setSelectedImageIndex(0);
      setQuantity(1);
      setOpenAccordion('details');
    }
  }, [product]);

  if (!product) return null;

  const isLiked = isInWishlist(product.id);

  const imagesToDisplay = selectedColor?.image
    ? [selectedColor.image, ...product.images.filter((img) => img !== selectedColor.image)]
    : product.images;

  const handleAddToCart = () => {
    if (selectedColor) {
      addToCart(product, selectedColor, selectedSize || product.sizes[0] || 'Standard', quantity);
      setSelectedProductForQuickView(null);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto transition-opacity duration-300"
      onClick={() => setSelectedProductForQuickView(null)}
    >
      <div
        id="product-detail-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-modal-title"
        className={`w-full max-w-5xl shadow-2xl border overflow-hidden flex flex-col my-auto max-h-[96vh] md:max-h-[90vh] animate-fadeIn ${
          isDarkMode
            ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
            : 'bg-[#faf9f7] border-[#c4c7c7] text-[#1a1c1b]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar for Close */}
        <div className={`flex justify-between items-center px-6 py-4 border-b shrink-0 ${
          isDarkMode ? 'bg-[#161817] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#e3e2e0]'
        }`}>
          <span className={`text-label-caps uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'}`}>
            {product.category}
          </span>
          <button
            onClick={() => setSelectedProductForQuickView(null)}
            className={`p-1 transition-colors cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
            }`}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Modal Body: Product Grid layout matching product_detail_page reference */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Image Gallery (7 cols) */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full md:w-20 shrink-0">
                {imagesToDisplay.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 md:w-full md:h-24 shrink-0 border relative overflow-hidden transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? (isDarkMode ? 'border-[#C5A059]' : 'border-[#000000]')
                        : (isDarkMode ? 'border-transparent hover:border-[#383D3A]' : 'border-transparent hover:border-[#c4c7c7]')
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className={`order-1 md:order-2 w-full h-[360px] md:h-[480px] relative overflow-hidden ${
                isDarkMode ? 'bg-[#161817]' : 'bg-[#efeeec]'
              }`}>
                <img
                  src={imagesToDisplay[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                {product.isNew && (
                  <div className={`absolute top-4 left-4 z-10 px-2.5 py-1 border ${
                    isDarkMode ? 'bg-[#1A1D1C] border-[#383D3A] text-[#C5A059]' : 'bg-[#ffffff] border-[#c4c7c7] text-[#000000]'
                  }`}>
                    <span className="text-label-caps uppercase">New</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <h1
                id="product-detail-modal-title"
                className={`text-headline-md mb-2 leading-tight ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-body-lg font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className={`text-body-sm line-through ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#444748]'}`}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.rating && (
                  <div className={`flex items-center gap-1 text-body-sm ml-auto ${isDarkMode ? 'text-[#C5A059]' : 'text-[#675d50]'}`}>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>star</span>
                    <span className={isDarkMode ? 'text-[#FAF8F5]' : ''}>{product.rating}</span>
                    <span className={isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}>({product.reviewsCount})</span>
                  </div>
                )}
              </div>

              <p className={`text-body-md mb-6 leading-relaxed ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3">
                    <span className={`text-label-caps uppercase tracking-widest ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                      Color: {selectedColor?.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImageIndex(0);
                        }}
                        className={`w-8 h-8 rounded-full border p-[2px] transition-all cursor-pointer ${
                          selectedColor?.name === color.name
                            ? (isDarkMode ? 'border-[#C5A059] scale-105' : 'border-[#000000] scale-105')
                            : (isDarkMode ? 'border-transparent hover:border-[#383D3A]' : 'border-transparent hover:border-[#c4c7c7]')
                        }`}
                        title={color.name}
                      >
                        <div
                          className="w-full h-full rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3">
                    <span className={`text-label-caps uppercase tracking-widest ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                      Size: {selectedSize}
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className={`text-body-sm underline transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#C5A059]' : 'text-[#444748] hover:text-[#000000]'
                      }`}
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 border text-label-caps uppercase transition-all cursor-pointer ${
                          selectedSize === size
                            ? isDarkMode
                              ? 'border-[#C5A059] bg-[#C5A059] text-black font-bold'
                              : 'border-[#000000] bg-[#000000] text-white'
                            : isDarkMode
                              ? 'border-[#383D3A] text-[#A8A49C] hover:border-[#C5A059] hover:text-[#FAF8F5]'
                              : 'border-[#c4c7c7] text-[#444748] hover:border-[#000000] hover:text-[#000000]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-3">
                <div className={`flex items-center border px-3 py-2 shrink-0 ${
                  isDarkMode ? 'border-[#383D3A] bg-[#161817] text-[#FAF8F5]' : 'border-[#c4c7c7] text-[#000000]'
                }`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`transition-opacity px-1 cursor-pointer hover:opacity-70 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="text-body-md px-3 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`transition-opacity px-1 cursor-pointer hover:opacity-70 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 text-label-caps tracking-widest uppercase transition-colors py-3.5 cursor-pointer font-medium ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] text-white hover:bg-[#2f3130]'
                  }`}
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-4 border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                    isDarkMode
                      ? 'border-[#383D3A] hover:border-[#C5A059] text-[#C5A059]'
                      : 'border-[#c4c7c7] hover:border-[#000000] text-[#000000]'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isLiked ? "'FILL' 1, 'wght' 300" : "'FILL' 0, 'wght' 300" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* View in Room (3D AR Visualizer) Interactive Trigger */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProductForQuickView(null);
                  openARView(product);
                }}
                className={`w-full py-3 mb-6 border transition-colors flex items-center justify-center gap-2 text-label-caps uppercase tracking-wider cursor-pointer font-medium ${
                  isDarkMode
                    ? 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
                    : 'border-[#000000] bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Experience In Room (3D / AR)</span>
              </button>

              {/* Accordions */}
              <div className={`border-t text-body-sm divide-y ${
                isDarkMode ? 'border-[#2A2E2C] divide-[#2A2E2C]' : 'border-[#e3e2e0] divide-[#e3e2e0]'
              }`}>
                <div className="py-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                    className={`flex justify-between items-center w-full text-left font-medium cursor-pointer ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}
                  >
                    <span>Product Details</span>
                    <span
                      className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                        openAccordion === 'details' ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openAccordion === 'details' && (
                    <ul className={`pt-2 pl-4 list-disc space-y-1 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                      {product.details?.map((det, i) => (
                        <li key={i}>{det}</li>
                      )) || (
                        <>
                          <li>100% European Flax Linen</li>
                          <li>Pre-washed for exceptional softness</li>
                          <li>Hidden button closure</li>
                          <li>Oeko-Tex Standard 100 Certified</li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
                <div className="py-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                    className={`flex justify-between items-center w-full text-left font-medium cursor-pointer ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}
                  >
                    <span>Care Instructions</span>
                    <span
                      className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                        openAccordion === 'care' ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openAccordion === 'care' && (
                    <p className={`pt-2 leading-relaxed ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                      {product.careInstructions || 'Machine wash cold on gentle cycle. Tumble dry low or line dry.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
