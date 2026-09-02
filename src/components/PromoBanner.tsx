'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useVaultCountdown } from '../hooks/useVaultCountdown';

interface PromoBannerProps {
  promoCode?: string;
  discountPercent?: number;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promoCode = 'LUXE20',
  discountPercent = 20,
}) => {
  const { showToast, applyPromoCode, setActivePage } = useShop();
  const [copied, setCopied] = useState(false);
  const { formattedHours, formattedMinutes, formattedSeconds, isExpired } = useVaultCountdown();

  const handleClaimCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
    }
    applyPromoCode(promoCode);
    setCopied(true);
    showToast(
      `Promo Code ${promoCode} Applied!`,
      `${discountPercent}% discount will be reflected in your bag`,
      'success'
    );
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="limited-drop-vault-banner"
      className="w-full max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16 py-12"
      aria-label="Private Vault Promotion"
    >
      <div className="relative bg-[#1a1c1b] text-white p-8 sm:p-12 lg:p-16 border border-[#383838] shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-white text-label-caps uppercase tracking-[0.2em] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Private Vault Access · {discountPercent}% Off</span>
            </div>

            <h2
              className="text-[32px] sm:text-[42px] lg:text-[48px] font-normal leading-tight text-white"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Private Vault Privilege: 20% Off Your Entire Order
            </h2>

            <p className="text-body-md text-white/85 font-light max-w-xl leading-relaxed">
              Unlock exclusive archive pieces, Belgian linen curtains, and master-loom bedding collections. Use code{' '}
              <strong className="text-white font-semibold">{promoCode}</strong> at checkout or claim below to apply 20% off directly to your shopping bag.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                id="claim-vault-code-btn"
                onClick={handleClaimCode}
                className="px-7 py-4 bg-white hover:bg-[#efeeec] text-[#000000] font-medium text-label-caps uppercase tracking-[0.16em] transition-all duration-200 flex items-center gap-2 cursor-pointer rounded-none active:opacity-85 shadow-md"
                aria-label={`Claim promo code ${promoCode} for ${discountPercent}% off`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Code Applied to Bag' : `Claim ${promoCode} (${discountPercent}% Off)`}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-label-caps uppercase tracking-[0.16em] transition-all duration-200 border border-white/60 flex items-center gap-2 cursor-pointer rounded-none active:opacity-85"
              >
                <span>Explore Vault Pieces</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Live Countdown Timer Display (Synchronized via useVaultCountdown) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <div className="bg-[#121313] border border-[#383838] p-6 sm:p-8 text-center w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-center gap-2 text-label-caps uppercase tracking-widest text-white/80 font-medium mb-5">
                <span className="material-symbols-outlined text-[18px] text-white">timer</span>
                <span suppressHydrationWarning>{isExpired ? 'Drop Concluded' : 'Vault Access Closes In'}</span>
              </div>

              {/* Digits Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#212322] border border-[#383838] p-3.5">
                  <span
                    className="text-[32px] sm:text-[38px] font-normal text-white block"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    suppressHydrationWarning
                  >
                    {formattedHours}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/70 font-medium block mt-1">
                    Hours
                  </span>
                </div>

                <div className="bg-[#212322] border border-[#383838] p-3.5">
                  <span
                    className="text-[32px] sm:text-[38px] font-normal text-white block"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    suppressHydrationWarning
                  >
                    {formattedMinutes}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/70 font-medium block mt-1">
                    Mins
                  </span>
                </div>

                <div className="bg-[#212322] border border-[#383838] p-3.5">
                  <span
                    className="text-[32px] sm:text-[38px] font-normal text-white block"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    suppressHydrationWarning
                  >
                    {formattedSeconds}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/70 font-medium block mt-1">
                    Secs
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/70 mt-4 font-light leading-normal">
                *Limited quantities per client. 20% discount applies across all ready-to-wear collections.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
