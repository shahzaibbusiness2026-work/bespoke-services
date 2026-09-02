'use client';

import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProductForQuickView,
    formatPrice,
    isDarkMode,
  } = useShop();

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isWishlistOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
      }`}
    >
      {/* Smooth Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isWishlistOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        id="wishlist-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-drawer-heading"
        className={`fixed inset-y-0 right-0 z-10 w-full max-w-[480px] flex flex-col shadow-2xl transition-transform duration-300 ease-out will-change-transform border-l ${
          isDarkMode
            ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
            : 'bg-[#faf9f7] border-[#c4c7c7]/40 text-[#000000]'
        } ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-start p-6 sm:p-8 border-b shrink-0 ${
          isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
        }`}>
          <div>
            <h2
              id="wishlist-drawer-heading"
              className={`text-headline-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              My Wishlist
            </h2>
            <p className={`text-body-sm mt-1 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={() => setIsWishlistOpen(false)}
            className={`p-2 -mr-2 transition-colors cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
            }`}
            aria-label="Close wishlist"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto scrollbar-thin">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
              <span
                className={`material-symbols-outlined text-6xl mb-6 ${isDarkMode ? 'text-[#383D3A]' : 'text-[#c4c7c7]'}`}
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                favorite_border
              </span>
              <h3
                className={`text-headline-sm mb-3 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Your wishlist is empty
              </h3>
              <p className={`text-body-sm mb-8 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                Discover our curated collection and save your favourites.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className={`px-8 py-4 border text-label-caps transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'border-[#383D3A] text-[#FAF8F5] hover:bg-[#1A1D1C]'
                    : 'border-[#c4c7c7] text-[#000000] hover:bg-[#f4f3f1]'
                }`}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className={`divide-y ${isDarkMode ? 'divide-[#2A2E2C]' : 'divide-[#e3e2e0]'}`}>
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex gap-5 p-6 transition-colors group ${
                    isDarkMode ? 'hover:bg-[#1A1D1C]/60' : 'hover:bg-[#f4f3f1]/50'
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`w-20 h-24 sm:w-24 sm:h-28 overflow-hidden shrink-0 cursor-pointer ${
                      isDarkMode ? 'bg-[#181B1A]' : 'bg-[#efeeec]'
                    }`}
                    onClick={() => {
                      setSelectedProductForQuickView(product);
                      setIsWishlistOpen(false);
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover product-img group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <button
                        onClick={() => {
                          setSelectedProductForQuickView(product);
                          setIsWishlistOpen(false);
                        }}
                        className="text-left w-full cursor-pointer"
                      >
                        <h3 className={`text-body-md hover:underline underline-offset-2 leading-snug truncate ${
                          isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-body-sm mt-1 truncate ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{product.subtitle}</p>
                      </button>

                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-body-md font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className={`text-body-sm line-through ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#444748]'}`}>
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Color Swatches */}
                      {product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3">
                          {product.colors.slice(0, 4).map((c) => (
                            <div
                              key={c.name}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-[#c4c7c7]"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <button
                        id={`wishlist-add-to-cart-${product.id}`}
                        onClick={() => {
                          addToCart(product, product.colors[0], product.sizes[0], 1);
                          toggleWishlist(product.id);
                        }}
                        className={`flex-grow py-2.5 text-label-caps transition-colors cursor-pointer font-medium ${
                          isDarkMode
                            ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                            : 'bg-[#000000] text-white hover:bg-[#2f3130]'
                        }`}
                      >
                        Add to Bag
                      </button>
                      <button
                        id={`wishlist-remove-${product.id}`}
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 border transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'border-[#383D3A] text-[#A8A49C] hover:text-[#f87171] hover:border-[#f87171]'
                            : 'border-[#c4c7c7] text-[#444748] hover:text-[#ba1a1a] hover:border-[#ba1a1a]'
                        }`}
                        aria-label="Remove from wishlist"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 300" }}>delete</span>
                      </button>
                    </div>
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
