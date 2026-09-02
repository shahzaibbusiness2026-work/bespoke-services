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
    showToast,
    isDarkMode,
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
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        className={`fixed inset-y-0 right-0 z-10 flex flex-col p-6 sm:p-8 h-full w-full max-w-[480px] shadow-2xl transition-transform duration-300 ease-out will-change-transform border-l ${
          isDarkMode
            ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
            : 'bg-[#faf9f7] border-[#c4c7c7]/40 text-[#000000]'
        } ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h2
              id="cart-drawer-heading"
              className={`text-headline-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Your Bag
            </h2>
            <p className={`text-body-sm mt-1 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
              {totals.amountToFreeShipping > 0
                ? `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`
                : 'You have free shipping!'}
            </p>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className={`p-2 -mr-2 transition-colors cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
            }`}
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Free shipping bar indicator */}
        <div className={`w-full h-1 mb-6 shrink-0 ${isDarkMode ? 'bg-[#2A2E2C]' : 'bg-[#e3e2e0]'}`}>
          <div
            className={`h-full transition-all duration-500 ${isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'}`}
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
                className={`material-symbols-outlined text-6xl ${isDarkMode ? 'text-[#383D3A]' : 'text-[#c4c7c7]'}`}
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                shopping_bag
              </span>
              <h3
                className={`text-headline-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Your bag is empty
              </h3>
              <p className={`text-body-sm ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                Discover our curated natural linen collections.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className={`mt-4 px-8 py-3.5 border text-label-caps transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'border-[#383D3A] text-[#FAF8F5] hover:bg-[#1A1D1C]'
                    : 'border-[#c4c7c7] text-[#000000] hover:bg-[#f4f3f1]'
                }`}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className={`flex gap-4 border-b pb-6 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'}`}
              >
                {/* Product Image */}
                <div className={`w-20 h-24 sm:w-24 sm:h-32 overflow-hidden shrink-0 ${
                  isDarkMode ? 'bg-[#181B1A]' : 'bg-[#efeeec]'
                }`}>
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
                    <h3 className={`text-body-md font-medium leading-snug truncate ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}>
                      {item.product.name}
                    </h3>
                    <p className={`text-body-sm mt-1 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                      {item.selectedColor?.name} / {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-3">
                    {/* Quantity Controls */}
                    <div className={`flex items-center border ${
                      isDarkMode ? 'border-[#383D3A] bg-[#1A1D1C]' : 'border-[#c4c7c7] bg-white'
                    }`}>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className={`px-2.5 py-1 transition-colors text-sm cursor-pointer ${
                          isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className={`px-3 text-body-sm border-l border-r ${
                        isDarkMode ? 'text-[#FAF8F5] border-[#383D3A]' : 'text-[#000000] border-[#c4c7c7]'
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className={`px-2.5 py-1 transition-colors text-sm cursor-pointer ${
                          isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
                        }`}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className={`text-body-md font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={`text-left text-label-caps transition-colors mt-2 cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#f87171]' : 'text-[#444748] hover:text-[#ba1a1a]'
                    }`}
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
          <div className={`mt-4 pt-4 border-t flex flex-col gap-3 shrink-0 ${
            isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
          }`}>
            {/* Promo Code */}
            {appliedPromo ? (
              <div className={`flex items-center justify-between px-3 py-2 border ${
                isDarkMode ? 'bg-[#1A1D1C] border-[#383D3A]' : 'bg-[#f4f3f1] border-[#e3e2e0]'
              }`}>
                <span className={`text-body-sm font-medium ${isDarkMode ? 'text-[#C5A059]' : 'text-[#675d50]'}`}>
                  {appliedPromo.code} — {appliedPromo.discountPercent}% off applied
                </span>
                <button onClick={removePromoCode} className="text-label-caps text-[#ba1a1a] hover:opacity-70 cursor-pointer">
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className={`flex border-b pb-1 gap-2 ${isDarkMode ? 'border-[#383D3A]' : 'border-[#c4c7c7]'}`}>
                  <input
                    type="text"
                    placeholder="Enter promotion or vault code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromoApply()}
                    className={`flex-grow bg-transparent text-body-sm py-1 focus:outline-none ${
                      isDarkMode ? 'text-[#FAF8F5] placeholder-[#6E6B65]' : 'text-[#000000] placeholder-[#444748]/50'
                    }`}
                  />
                  <button
                    onClick={handlePromoApply}
                    className={`text-label-caps hover:opacity-70 font-semibold cursor-pointer ${
                      isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
                    }`}
                  >
                    Apply
                  </button>
                </div>

                {/* Relocated Private Vault Privilege Banner */}
                <div className={`p-2.5 border flex items-center justify-between text-xs transition-colors ${
                  isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C] text-[#FAF8F5]' : 'bg-[#faf9f7] border-[#e3e2e0] text-[#1a1c1b]'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                    <span className="truncate">Private Vault Privilege: <strong>LUXE20</strong> (20% off)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoInput('LUXE20');
                      applyPromoCode('LUXE20');
                      showToast('Vault Privilege Applied', 'Code LUXE20 applied (20% off ready-to-wear)', 'success');
                    }}
                    className="ml-2 text-label-caps uppercase font-semibold text-[#C5A059] hover:underline cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
            {promoError && <p className="text-label-caps text-[#ba1a1a]">{promoError}</p>}

            {/* Gift Wrap */}
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={appliedGiftWrap}
                onChange={(e) => setAppliedGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-[#C5A059] cursor-pointer"
              />
              <span className={`text-body-sm ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>Bespoke gift wrapping (+$15)</span>
            </label>

            {/* Totals */}
            <div className="space-y-1.5 pt-1">
              {appliedPromo && (
                <div className="flex justify-between items-center text-body-sm">
                  <span className={isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}>Discount</span>
                  <span className={isDarkMode ? 'text-[#C5A059]' : 'text-[#675d50]'}>−{formatPrice(totals.discount)}</span>
                </div>
              )}
              {totals.shipping > 0 && (
                <div className="flex justify-between items-center text-body-sm">
                  <span className={isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}>Shipping</span>
                  <span className={isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}>{formatPrice(totals.shipping)}</span>
                </div>
              )}
              <div className={`flex justify-between items-center pt-2 border-t ${
                isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
              }`}>
                <span className={`text-body-lg font-bold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>Subtotal</span>
                <span className={`text-body-lg font-bold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="checkout-now-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className={`w-full py-4 px-8 text-label-caps uppercase tracking-wider transition-colors duration-200 mt-1 cursor-pointer font-medium ${
                isDarkMode
                  ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                  : 'bg-[#000000] text-white hover:bg-[#2f3130]'
              }`}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
