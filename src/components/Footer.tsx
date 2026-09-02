'use client';

import React from 'react';
import { useShop, PageView } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActivePage, setIsContactOpen, isDarkMode } = useShop();

  const navigate = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className={`w-full border-t mt-auto transition-colors ${
      isDarkMode ? 'bg-[#0E100F] border-[#2A2E2C]' : 'bg-[#f4f3f1] border-[#c4c7c7]'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-5 md:px-12 lg:px-16 py-16 sm:py-20 max-w-[1440px] mx-auto">

        {/* Brand & Heritage Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <button
            onClick={() => navigate('home')}
            className="text-left focus:outline-none cursor-pointer"
            aria-label="BOSKI LIMITED Home"
          >
            <span
              className={`text-[24px] font-normal tracking-[0.14em] uppercase block hover:opacity-75 transition-opacity ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
          </button>
          <p className={`text-body-sm max-w-[280px] leading-relaxed ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}>
            Handcrafted luxury textiles, pure organic flax linens, and bespoke architectural drapery for quiet, restorative sanctuaries.
          </p>
          <div className={`pt-2 text-body-sm ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'}`}>
            <p className={`font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>Registered Atelier &amp; Office</p>
            <p className="leading-snug">Unit 4, Balmoral Trading Estate<br />113 River Road, Barking, IG11 0EG</p>
          </div>
        </div>

        {/* Collections Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className={`text-label-caps uppercase tracking-widest mb-1 font-semibold ${
            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
          }`}>
            Collections
          </span>
          <button
            onClick={() => navigate('new-arrivals')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => navigate('bedding')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Bedding &amp; Sheet Sets
          </button>
          <button
            onClick={() => navigate('curtains')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Belgian Linen Curtains
          </button>
          <button
            onClick={() => navigate('throws')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Artisan Throws
          </button>
          <button
            onClick={() => navigate('blankets')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Waffle Blankets &amp; Quilts
          </button>
        </div>

        {/* Bespoke & Journal Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className={`text-label-caps uppercase tracking-widest mb-1 font-semibold ${
            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
          }`}>
            Services &amp; Journal
          </span>
          <button
            onClick={() => navigate('bespoke')}
            className={`text-body-sm transition-colors text-left py-1 font-medium cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Bespoke Services
          </button>
          <button
            onClick={() => navigate('trade')}
            className={`text-body-sm transition-colors text-left py-1 font-medium cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Trade &amp; Hospitality
          </button>
          <button
            onClick={() => navigate('canvas')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            The Canvas (Our Stories)
          </button>
          <button
            onClick={() => navigate('account')}
            className={`text-body-sm transition-colors text-left py-1 cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
            }`}
          >
            Client Portal &amp; Orders
          </button>
        </div>

        {/* Concierge & Legal Column */}
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <span className={`text-label-caps uppercase tracking-widest mb-1 font-semibold ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}>
              Concierge
            </span>
            <button
              onClick={() => setIsContactOpen(true)}
              className={`text-body-sm text-left underline underline-offset-4 transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-[#FAF8F5] hover:text-[#C5A059] decoration-[#C5A059]'
                  : 'text-[#2b2d2c] hover:text-[#000000] decoration-[#d7c7b3]'
              }`}
            >
              Contact Atelier Concierge
            </button>
            <a
              href="mailto:boskilimited@boskilimited.info"
              className={`text-body-sm transition-colors ${
                isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              boskilimited@boskilimited.info
            </a>
            <a
              href="tel:+447738761016"
              className={`text-body-sm transition-colors ${
                isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              +44 7738 761016
            </a>
            <p className={`text-body-sm ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'}`}>Monday &ndash; Saturday, 10:00am &ndash; 6:30pm GMT</p>

            <a
              href="/admin"
              onClick={(e) => {
                navigate('admin');
              }}
              className={`text-body-xs text-left pt-2 font-mono uppercase tracking-wider flex items-center gap-1 transition-colors ${
                isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-[#8c9a86] hover:text-[#1a1c1b]'
              }`}
            >
              <span>⚙ Atelier Portal (Admin)</span>
            </a>
          </div>

          <div className={`mt-8 pt-6 border-t ${
            isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/60'
          }`}>
            <p className={`text-body-sm text-xs ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'}`}>
              &copy; 2025 BOSKI LIMITED. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
