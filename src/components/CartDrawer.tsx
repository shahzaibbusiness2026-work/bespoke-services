'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FALLBACK_IMAGE } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    getTotals,
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    appliedGiftWrap,
    setAppliedGiftWrap,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const totals = getTotals();

  const handlePromoApply = () => {
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput.trim().toUpperCase());
    if (!result.success) {
      setPromoError(result.message);
      setTimeout(() => setPromoError(''), 3000);
    } else {
      setPromoInput('');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isCartOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
      }`}
    >
      {/* Backdrop overlay with smooth fade */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel — with hardware-accelerated slide */}
      <div
        id="cart-drawer"
        className={`fixed inset-y-0 right-0 z-10 flex flex-col p-6 sm:p-8 bg-[#faf9f7] h-full w-full max-w-[480px] border-l border-[#c4c7c7]/40 shadow-2xl transition-transform duration-300 ease-out will-change-transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h2
              className="text-headline-sm text-[#000000]"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Your Bag
            </h2>
            <p className="text-body-sm text-[#444748] mt-1">
              {totals.amountToFreeShipping > 0
                ? `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`
                : 'You have free shipping!'}
            </p>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-[#444748] hover:text-[#000000] transition-colors"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Free shipping bar indicator */}
        <div className="w-full bg-[#e3e2e0] h-1 mb-6 shrink-0">
          <div
            className="bg-[#000000] h-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.round(((totals.freeShippingThreshold - totals.amountToFreeShipping) / totals.freeShippingThreshold) * 100)
              )}%`,
            }}
          />
        </div>

        {/* Cart Items Scroll Container */}
        <div className="flex-grow overflow-y-auto pr-1 space-y-6 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <span
                className="material-symbols-outlined text-6xl text-[#c4c7c7]"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                shopping_bag
              </span>
              <h3
                className="text-headline-sm text-[#1a1c1b]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Your bag is empty
              </h3>
              <p className="text-body-sm text-[#444748]">
                Discover our curated natural linen collections.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-8 py-3.5 border border-[#c4c7c7] text-label-caps text-[#000000] hover:bg-[#f4f3f1] transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex gap-4 border-b border-[#e3e2e0] pb-6"
              >
                {/* Product Image */}
                <div className="w-20 h-24 sm:w-24 sm:h-32 bg-[#efeeec] overflow-hidden shrink-0">
                  <img
                    src={item.selectedColor?.image || item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <h3 className="text-body-md text-[#000000] font-medium leading-snug truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-body-sm text-[#444748] mt-1">
                      {item.selectedColor?.name} / {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#c4c7c7]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-[#444748] hover:text-[#000000] transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 text-body-sm text-[#000000] border-l border-r border-[#c4c7c7]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#444748] hover:text-[#000000] transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-body-md text-[#000000] font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-left text-label-caps text-[#444748] hover:text-[#ba1a1a] transition-colors mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#e3e2e0] flex flex-col gap-3 shrink-0">
            {/* Promo Code */}
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-[#f4f3f1] px-3 py-2 border border-[#e3e2e0]">
                <span className="text-body-sm text-[#675d50] font-medium">
                  {appliedPromo.code} — {appliedPromo.discountPercent}% off
                </span>
                <button onClick={removePromoCode} className="text-label-caps text-[#ba1a1a] hover:opacity-70">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex border-b border-[#c4c7c7] pb-1 gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (try LUXE20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePromoApply()}
                  className="flex-grow bg-transparent text-body-sm text-[#000000] placeholder-[#444748]/50 py-1 focus:outline-none"
                />
                <button
                  onClick={handlePromoApply}
                  className="text-label-caps text-[#000000] hover:opacity-70 font-semibold"
                >
                  Apply
                </button>
              </div>
            )}
            {promoError && <p className="text-label-caps text-[#ba1a1a]">{promoError}</p>}

            {/* Gift Wrap */}
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={appliedGiftWrap}
                onChange={(e) => setAppliedGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              <span className="text-body-sm text-[#444748]">Bespoke gift wrapping (+$15)</span>
            </label>

            {/* Totals */}
            <div className="space-y-1.5 pt-1">
              {appliedPromo && (
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-[#444748]">Discount</span>
                  <span className="text-[#675d50]">−{formatPrice(totals.discount)}</span>
                </div>
              )}
              {totals.shipping > 0 && (
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-[#444748]">Shipping</span>
                  <span className="text-[#000000]">{formatPrice(totals.shipping)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#e3e2e0]">
                <span className="text-body-lg text-[#000000] font-bold">Subtotal</span>
                <span className="text-body-lg text-[#000000] font-bold">{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="checkout-now-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-[#000000] text-white py-4 px-8 text-label-caps uppercase tracking-wider hover:bg-[#2f3130] transition-colors duration-200 mt-1"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
