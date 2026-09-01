import React, { useState } from 'react';
import { useShop, PageView } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActivePage, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Enter valid email', 'Please provide a valid email address', 'info');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed', 'Welcome to BOSKI LIMITED. Check your inbox for private release invitations.', 'success');
  };

  const navigate = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="w-full bg-[#f4f3f1] border-t border-[#c4c7c7] mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-5 md:px-16 py-[96px] max-w-[1440px] mx-auto">

        {/* Brand Column — BOSKI LIMITED */}
        <div className="col-span-1 flex flex-col gap-4">
          <button
            onClick={() => navigate('home')}
            className="text-left focus:outline-none"
          >
            <span
              className="text-[24px] font-normal tracking-[0.14em] text-[#000000] uppercase block"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
          </button>
          <p className="text-body-sm text-[#444748] max-w-[280px] leading-relaxed">
            Handcrafted luxury textiles, pure organic flax linens, and bespoke architectural drapery for quiet, refined sanctuaries.
          </p>

          {/* Newsletter */}
          <div className="mt-6 flex flex-col gap-3">
            <span className="text-label-caps text-[#000000] tracking-widest uppercase">
              Private Newsletter
            </span>
            {subscribed ? (
              <p className="text-body-sm text-[#675d50]">Thank you — you have joined the Boski registry.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-[#000000] pb-2 max-w-[320px]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-none p-0 text-body-sm text-[#1a1c1b] placeholder-[#444748]/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-[#000000] hover:opacity-60 transition-opacity ml-2"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Collections Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1">Collections</span>
          <button
            onClick={() => navigate('new-arrivals')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            New Arrivals
          </button>
          <button
            onClick={() => navigate('bedding')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Bedding &amp; Sheet Sets
          </button>
          <button
            onClick={() => navigate('curtains')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Belgian Linen Curtains
          </button>
          <button
            onClick={() => navigate('throws')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Artisan Throws
          </button>
          <button
            onClick={() => navigate('blankets')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Waffle Blankets &amp; Quilts
          </button>
        </div>

        {/* Bespoke & Trade Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1">Services &amp; Journal</span>
          <button
            onClick={() => navigate('bespoke')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left font-medium"
          >
            Bespoke Services
          </button>
          <button
            onClick={() => navigate('trade')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left font-medium"
          >
            Trade &amp; Hospitality
          </button>
          <button
            onClick={() => navigate('canvas')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            The Canvas (Our Stories)
          </button>
          <button
            onClick={() => navigate('account')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Client Portal &amp; Orders
          </button>
        </div>

        {/* Legal / Social Column */}
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1">Inquiries</span>
            <p className="text-body-sm text-[#444748]">concierge@boskilimited.com</p>
            <p className="text-body-sm text-[#444748]">+1 (800) 555-0199</p>
            <p className="text-body-sm text-[#444748]">Monday – Friday, 9am – 6pm EST</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#c4c7c7]/60">
            <p className="text-body-sm text-[#444748] text-xs">
              © 2025 BOSKI LIMITED. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
