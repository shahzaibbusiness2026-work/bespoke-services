import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

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
    showToast('Subscribed', 'Welcome to LINEN & LOFT. Check your inbox for 10% off.', 'success');
  };

  const navigate = (page: 'home' | 'bespoke' | 'trade' | 'canvas' | 'account') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="w-full bg-[#f4f3f1] border-t border-[#c4c7c7]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto">

        {/* Brand Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <span
            className="text-headline-sm text-[#000000]"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            LINEN &amp; LOFT
          </span>
          <p className="text-body-sm text-[#444748] max-w-[250px]">
            Curated textiles for a considered home. Designed with quiet luxury and minimalist precision.
          </p>

          {/* Newsletter */}
          <div className="mt-4 flex flex-col gap-4">
            <span className="text-label-caps text-[#444748] mb-2">Newsletter</span>
            {subscribed ? (
              <p className="text-body-sm text-[#675d50]">Thank you — 10% off is on its way to your inbox.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-[#c4c7c7] pb-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-sm text-[#1a1c1b] placeholder-[#444748]/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-[#000000] hover:opacity-70 transition-opacity ml-2"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Customer Care Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <span className="text-label-caps text-[#444748] mb-2">Customer Care</span>
          <button
            onClick={() => navigate('home')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Shipping &amp; Returns
          </button>
          <button
            onClick={() => navigate('account')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            My Account
          </button>
          <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
            Contact Us
          </a>
          <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
            Size Guide
          </a>
        </div>

        {/* Company Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <span className="text-label-caps text-[#444748] mb-2">Company</span>
          <button
            onClick={() => navigate('canvas')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Our Story
          </button>
          <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
            Sustainability
          </a>
          <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
            Journal
          </a>
          <button
            onClick={() => navigate('bespoke')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Bespoke Services
          </button>
          <button
            onClick={() => navigate('trade')}
            className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors text-left"
          >
            Trade &amp; Hospitality
          </button>
        </div>

        {/* Legal / Social Column */}
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <span className="text-label-caps text-[#444748] mb-2">Legal</span>
            <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors">
              Cookie Preferences
            </a>
          </div>

          <div className="mt-auto pt-8">
            <p className="text-body-sm text-[#444748] opacity-80">
              © 2024 LINEN &amp; LOFT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
