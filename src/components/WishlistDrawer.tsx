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
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isWishlistOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        id="wishlist-drawer"
        className={`fixed inset-y-0 right-0 z-10 w-full max-w-[480px] bg-[#faf9f7] flex flex-col border-l border-[#c4c7c7]/40 shadow-2xl transition-transform duration-300 ease-out will-change-transform ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-[#e3e2e0] shrink-0">
          <div>
            <h2
              className="text-headline-sm text-[#000000]"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              My Wishlist
            </h2>
            <p className="text-body-sm text-[#444748] mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 -mr-2 text-[#444748] hover:text-[#000000] transition-colors"
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
                className="material-symbols-outlined text-6xl text-[#c4c7c7] mb-6"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                favorite_border
              </span>
              <h3
                className="text-headline-sm text-[#1a1c1b] mb-3"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Your wishlist is empty
              </h3>
              <p className="text-body-sm text-[#444748] mb-8">
                Discover our curated collection and save your favourites.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-8 py-4 border border-[#c4c7c7] text-label-caps text-[#000000] hover:bg-[#f4f3f1] transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#e3e2e0]">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-5 p-6 hover:bg-[#f4f3f1]/50 transition-colors group"
                >
                  {/* Product Image */}
                  <div
                    className="w-20 h-24 sm:w-24 sm:h-28 bg-[#efeeec] overflow-hidden shrink-0 cursor-pointer"
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
                        className="text-left w-full"
                      >
                        <h3 className="text-body-md text-[#000000] hover:underline underline-offset-2 leading-snug truncate">
                          {product.name}
                        </h3>
                        <p className="text-body-sm text-[#444748] mt-1 truncate">{product.subtitle}</p>
                      </button>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-body-md text-[#000000] font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-body-sm text-[#444748] line-through">
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
                        className="flex-grow py-2.5 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors"
                      >
                        Add to Bag
                      </button>
                      <button
                        id={`wishlist-remove-${product.id}`}
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 border border-[#c4c7c7] text-[#444748] hover:text-[#ba1a1a] hover:border-[#ba1a1a] transition-colors"
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
