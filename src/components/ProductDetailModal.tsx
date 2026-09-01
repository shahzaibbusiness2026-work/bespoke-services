import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductColor } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForQuickView,
    setSelectedProductForQuickView,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
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
        className="bg-[#faf9f7] w-full max-w-5xl shadow-2xl border border-[#c4c7c7] overflow-hidden flex flex-col my-auto max-h-[96vh] md:max-h-[90vh] text-[#1a1c1b] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar for Close */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e3e2e0] bg-[#faf9f7] shrink-0">
          <span className="text-label-caps text-[#444748] uppercase tracking-widest">
            {product.category}
          </span>
          <button
            onClick={() => setSelectedProductForQuickView(null)}
            className="p-1 text-[#444748] hover:text-[#000000] transition-colors"
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
                    className={`w-16 h-20 md:w-full md:h-24 shrink-0 border relative overflow-hidden transition-all ${
                      selectedImageIndex === idx ? 'border-[#000000]' : 'border-transparent hover:border-[#c4c7c7]'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="order-1 md:order-2 w-full h-[360px] md:h-[480px] bg-[#efeeec] relative overflow-hidden">
                <img
                  src={imagesToDisplay[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10 bg-[#ffffff] px-2.5 py-1 border border-[#c4c7c7]">
                    <span className="text-label-caps text-[#000000] uppercase">New</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <h1
                className="text-headline-md text-[#000000] mb-2 leading-tight"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-body-lg text-[#000000] font-semibold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-body-sm text-[#444748] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.rating && (
                  <div className="flex items-center gap-1 text-[#675d50] text-body-sm ml-auto">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>star</span>
                    <span>{product.rating}</span>
                    <span className="text-[#444748]">({product.reviewsCount})</span>
                  </div>
                )}
              </div>

              <p className="text-body-md text-[#444748] mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-label-caps text-[#000000] uppercase tracking-widest">
                      Color: {selectedColor?.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          const idx = imagesToDisplay.indexOf(color.image);
                          if (idx !== -1) setSelectedImageIndex(idx);
                        }}
                        className={`w-8 h-8 rounded-full border p-[2px] transition-all ${
                          selectedColor?.name === color.name
                            ? 'border-[#000000] scale-105'
                            : 'border-transparent hover:border-[#c4c7c7]'
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
                    <span className="text-label-caps text-[#000000] uppercase tracking-widest">
                      Size: {selectedSize}
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-body-sm text-[#444748] underline hover:text-[#000000] transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 border text-label-caps uppercase transition-all ${
                          selectedSize === size
                            ? 'border-[#000000] bg-[#000000] text-white'
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
              <div className="flex gap-3 mb-6">
                <div className="flex items-center border border-[#c4c7c7] px-3 py-2 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#000000] hover:opacity-70 transition-opacity px-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="text-body-md px-3 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#000000] hover:opacity-70 transition-opacity px-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#000000] text-white text-label-caps tracking-widest uppercase hover:bg-[#2f3130] transition-colors py-3.5"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="px-4 border border-[#c4c7c7] hover:border-[#000000] text-[#000000] transition-colors flex items-center justify-center shrink-0"
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

              {/* Accordions */}
              <div className="border-t border-[#e3e2e0] text-body-sm divide-y divide-[#e3e2e0]">
                <div className="py-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                    className="flex justify-between items-center w-full text-left font-medium text-[#000000]"
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
                    <ul className="pt-2 pl-4 list-disc text-[#444748] space-y-1">
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
                    className="flex justify-between items-center w-full text-left font-medium text-[#000000]"
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
                    <p className="pt-2 text-[#444748] leading-relaxed">
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
