import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductForQuickView, toggleWishlist, isInWishlist, formatPrice, addToCart } = useShop();
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductForQuickView(product);
  };

  return (
    <div
      className="product-card group cursor-pointer block card-hover-lift"
      id={`product-card-${product.id}`}
    >
      {/* Image Container with GPU Hover Zoom */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f3f1] mb-4">
        <img
          src={product.images[0] || product.colors[0]?.image}
          alt={product.name}
          className="product-img object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
          loading="lazy"
          onClick={handleCardClick}
        />

        {/* NEW / SALE Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-[#ffffff] px-2.5 py-1 border border-[#c4c7c7] shadow-sm">
            <span className="text-label-caps text-[#000000] uppercase font-semibold">New</span>
          </div>
        )}
        {product.isSale && !product.isNew && product.discountPercent && (
          <div className="absolute top-4 left-4 z-10 bg-[#000000] px-2.5 py-1">
            <span className="text-label-caps text-white uppercase font-semibold">−{product.discountPercent}%</span>
          </div>
        )}

        {/* Wishlist Icon Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="w-10 h-10 min-w-[40px] min-h-[40px] absolute top-3 right-3 z-10 flex items-center justify-center text-[#000000] hover:text-[#505252] bg-white/60 hover:bg-white/90 backdrop-blur-sm transition-all cursor-pointer"
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: inWishlist ? "'FILL' 1, 'wght' 300" : "'FILL' 0, 'wght' 300" }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add to Cart — appears smoothly on hover at bottom */}
        <div className="absolute bottom-0 inset-x-0 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (product.sizes.length <= 1) {
                addToCart(product, product.colors[0], product.sizes[0] || 'One Size', 1);
              } else {
                setSelectedProductForQuickView(product);
              }
            }}
            className="w-full bg-[#000000] text-white text-label-caps uppercase tracking-wider py-3.5 hover:bg-[#252726] transition-colors duration-200 cursor-pointer shadow-md"
          >
            {product.sizes.length > 1 ? 'Select Size' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1" onClick={handleCardClick}>
        <h3 className="text-body-md text-[#000000] font-medium leading-snug group-hover:underline underline-offset-2">
          {product.name}
        </h3>
        <p className="text-body-sm text-[#2b2d2c] font-light">
          {product.colors[0]?.name || product.category}
          {product.sizes[0] && ` / ${product.sizes[0]}`}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-label-caps text-[#000000] font-semibold">{formatPrice(product.price)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-label-caps text-[#505252] line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[13px] text-[#3d3b38]"
                style={{ fontVariationSettings: `'FILL' ${product.rating >= star ? 1 : 0}, 'wght' 400` }}
              >
                star
              </span>
            ))}
            <span className="text-label-caps text-[#505252] ml-1">({product.reviewsCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};
