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
    /* Product Card — exactly matches bedding_collection/code.html */
    <div
      className="product-card group cursor-pointer block"
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f3f1] mb-4">
        <img
          src={product.images[0] || product.colors[0]?.image}
          alt={product.name}
          className="product-img object-cover w-full h-full"
          loading="lazy"
          onClick={handleCardClick}
        />

        {/* NEW / SALE Badge — top left, matches reference */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-[#ffffff] px-2 py-1 border border-[#c4c7c7]">
            <span className="text-label-caps text-[#000000] uppercase">New</span>
          </div>
        )}
        {product.isSale && !product.isNew && product.discountPercent && (
          <div className="absolute top-4 left-4 z-10 bg-[#000000] px-2 py-1">
            <span className="text-label-caps text-white uppercase">−{product.discountPercent}%</span>
          </div>
        )}

        {/* Wishlist Icon — top right, matches reference */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-4 right-4 z-10 text-[#000000] hover:text-[#444748] transition-colors"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span
            className="material-symbols-outlined font-light"
            style={{ fontVariationSettings: inWishlist ? "'FILL' 1, 'wght' 300" : "'FILL' 0, 'wght' 200" }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add to Cart — appears on hover, at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
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
            className="w-full bg-[#000000] text-white text-label-caps uppercase tracking-wider py-3 hover:bg-[#2f3130] transition-colors duration-200"
          >
            {product.sizes.length > 1 ? 'Select Size' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Info — exactly matches bedding_collection reference */}
      <div className="flex flex-col gap-1" onClick={handleCardClick}>
        <h3 className="text-body-md text-[#000000]">{product.name}</h3>
        <p className="text-body-sm text-[#444748]">
          {product.colors[0]?.name || product.category}
          {product.sizes[0] && ` / ${product.sizes[0]}`}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-label-caps text-[#000000]">{formatPrice(product.price)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-label-caps text-[#444748] line-through">
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
                className="material-symbols-outlined text-[12px] text-[#675d50]"
                style={{ fontVariationSettings: `'FILL' ${product.rating >= star ? 1 : 0}, 'wght' 400` }}
              >
                star
              </span>
            ))}
            <span className="text-label-caps text-[#444748] ml-1">({product.reviewsCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};
