import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductForQuickView, toggleWishlist, isInWishlist, formatPrice, addToCart, showToast } = useShop();
  const inWishlist = isInWishlist(product.id);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close size dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
    };
    if (isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSizeDropdownOpen]);

  const handleCardClick = () => {
    setSelectedProductForQuickView(product);
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.colors[0], size, 1);
    setIsSizeDropdownOpen(false);
    showToast('Added to Shopping Bag', `${product.name} (${size}) was added`, 'success');
  };

  // Generate responsive srcSet from image URL
  const primaryImage = product.images[0] || product.colors[0]?.image || '';
  const generateSrcSet = (url: string) => {
    if (!url || !url.includes('unsplash.com')) return undefined;
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=400&q=80 400w, ${base}?auto=format&fit=crop&w=600&q=80 600w, ${base}?auto=format&fit=crop&w=800&q=80 800w`;
  };

  const srcSet = generateSrcSet(primaryImage);

  return (
    <article
      className="product-card group cursor-pointer flex flex-col justify-between card-hover-lift relative"
      id={`product-card-${product.id}`}
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Image Container with Exact Aspect Ratio and Dimensions to Prevent CLS */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f3f1] mb-4">
        <img
          src={primaryImage}
          srcSet={srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          width="400"
          height="533"
          alt={product.name}
          className="product-img object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
          loading="lazy"
          decoding="async"
          onClick={handleCardClick}
        />

        {/* NEW / SALE Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-[#ffffff] px-2.5 py-1 border border-[#c4c7c7] shadow-xs">
            <span className="text-label-caps text-[#000000] uppercase font-semibold text-[10.5px] tracking-wider">
              New
            </span>
          </div>
        )}
        {product.isSale && !product.isNew && product.discountPercent && (
          <div className="absolute top-3 left-3 z-10 bg-[#000000] px-2.5 py-1 shadow-xs">
            <span className="text-label-caps text-white uppercase font-semibold text-[10.5px] tracking-wider">
              &minus;{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Accessible Wishlist Icon Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="w-11 h-11 min-w-[44px] min-h-[44px] absolute top-2 right-2 z-20 flex items-center justify-center text-[#000000] hover:text-[#252726] bg-white/75 hover:bg-white backdrop-blur-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={inWishlist}
        >
          <span
            className="material-symbols-outlined text-[21px]"
            style={{ fontVariationSettings: inWishlist ? "'FILL' 1, 'wght' 300" : "'FILL' 0, 'wght' 300" }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add / Select Size Interactive Trigger */}
        <div
          ref={dropdownRef}
          className="absolute bottom-0 inset-x-0 z-20 transition-all duration-300 ease-out"
        >
          {/* Functional Size Selection Dropdown Overlay */}
          {isSizeDropdownOpen && product.sizes.length > 1 && (
            <div
              className="bg-[#faf9f7] border-t border-x border-[#c4c7c7] p-3 shadow-2xl animate-fadeIn normal-case"
              role="listbox"
              aria-label={`Select size for ${product.name}`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#c4c7c7]/60">
                <span className="text-label-caps text-[#000000] uppercase font-semibold text-[10.5px]">
                  Select Dimension / Size:
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSizeDropdownOpen(false);
                  }}
                  className="text-[#000000] hover:opacity-60 text-xs px-1"
                  aria-label="Close size options"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={(e) => handleSelectSizeAndAdd(sz, e)}
                    className="py-2 px-2 text-center text-[11.5px] border border-[#c4c7c7] bg-white text-[#000000] font-medium hover:bg-[#000000] hover:text-white hover:border-[#000000] focus:bg-[#000000] focus:text-white transition-all cursor-pointer active:scale-95"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Button */}
          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (product.sizes.length <= 1) {
                addToCart(product, product.colors[0], product.sizes[0] || 'One Size', 1);
                showToast('Added to Bag', `${product.name} added to your bag`, 'success');
              } else {
                setIsSizeDropdownOpen(!isSizeDropdownOpen);
              }
            }}
            aria-haspopup={product.sizes.length > 1 ? 'listbox' : undefined}
            aria-expanded={product.sizes.length > 1 ? isSizeDropdownOpen : undefined}
            aria-label={
              product.sizes.length > 1
                ? `Select size for ${product.name}`
                : `Quick add ${product.name} to shopping bag`
            }
            className={`w-full bg-[#000000] text-white text-label-caps uppercase tracking-wider py-3.5 hover:bg-[#252726] transition-colors duration-200 cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
              isSizeDropdownOpen ? 'bg-[#252726]' : 'opacity-90 group-hover:opacity-100'
            }`}
          >
            <span>{product.sizes.length > 1 ? (isSizeDropdownOpen ? 'Close Sizes' : 'Select Size') : 'Quick Add'}</span>
            {product.sizes.length > 1 && (
              <span className="material-symbols-outlined text-[16px]">
                {isSizeDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Information Card with Proper H3 Architecture */}
      <div className="flex flex-col gap-1.5 pt-1" onClick={handleCardClick}>
        <h3
          className="text-[17px] font-normal text-[#000000] leading-snug group-hover:underline underline-offset-2 transition-colors"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          {product.name}
        </h3>

        {/* High Contrast Body Description */}
        <p className="text-body-sm text-[#2b2d2c] font-light">
          {product.colors[0]?.name || product.category}
          {product.sizes[0] && ` · ${product.sizes[0]}`}
        </p>

        {/* Price Row with WCAG AAA Contrast */}
        <div className="flex items-center gap-2.5 mt-1">
          <p className="text-body-sm text-[#000000] font-semibold tracking-wide">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-body-sm text-[#383838] line-through font-normal">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Rating Stars */}
        {product.rating && (
          <div
            className="flex items-center gap-1 mt-1 text-[#000000]"
            aria-label={`Rated ${product.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: `'FILL' ${product.rating >= star ? 1 : 0}, 'wght' 400` }}
              >
                star
              </span>
            ))}
            <span className="text-[11.5px] text-[#2b2d2c] ml-1 font-medium">
              ({product.ratingCount || 48})
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
