import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, Copy, Check, Timer, ArrowRight } from 'lucide-react';

export const CountdownBanner: React.FC = () => {
  const { showToast, applyPromoCode } = useShop();
  const [copied, setCopied] = useState(false);

  // Countdown timer state (e.g. 18 hours 42 mins remaining)
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('LUXE20');
    }
    applyPromoCode('LUXE20');
    setCopied(true);
    showToast('Promo Code LUXE20 Applied!', '20% discount will be reflected at checkout', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="limited-drop-vault-banner" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 border border-neutral-800 shadow-2xl">
        {/* Background Texture & Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/30 via-neutral-900 to-neutral-950" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs uppercase font-bold tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Vault Access</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              Complimentary 20% VIP Client Privilege
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl leading-relaxed">
              Unlock exclusive archive pieces and new season French linen and sateen bed sheet collections. Simply enter code <strong>LUXE20</strong> at checkout or click below to claim.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="claim-vault-code-btn"
                onClick={handleCopyCode}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-colors flex items-center gap-2 shadow-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Applied to Bag' : 'Claim LUXE20 (20% Off)'}</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-colors border border-white/20 flex items-center gap-2"
              >
                <span>Shop Vault Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Live Countdown Timer Display */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <div className="bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8 text-center w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-bold mb-4">
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Vault Closes In</span>
              </div>

              {/* Digits Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-white block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    Hours
                  </span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-white block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    Mins
                  </span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    Secs
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 mt-4 font-light">
                *Limited quantities per client. Applies to all ready-to-wear items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
