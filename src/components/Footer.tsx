import React from 'react';
import { useShop, PageView } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useShop();

  const navigate = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="w-full bg-[#f4f3f1] border-t border-[#c4c7c7] mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-5 md:px-12 lg:px-16 py-16 sm:py-20 max-w-[1440px] mx-auto">

        {/* Brand & Heritage Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <button
            onClick={() => navigate('home')}
            className="text-left focus:outline-none cursor-pointer"
            aria-label="BOSKI LIMITED Home"
          >
            <span
              className="text-[24px] font-normal tracking-[0.14em] text-[#000000] uppercase block hover:opacity-75 transition-opacity"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
          </button>
          <p className="text-body-sm text-[#2b2d2c] max-w-[280px] leading-relaxed">
            Handcrafted luxury textiles, pure organic flax linens, and bespoke architectural drapery for quiet, restorative sanctuaries.
          </p>
          <div className="pt-2 text-body-sm text-[#505252]">
            <p className="font-medium text-[#000000]">Loom Studio &amp; Atelier</p>
            <p>Porto &middot; Normandy &middot; New York</p>
          </div>
        </div>

        {/* Collections Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1 font-semibold">
            Collections
          </span>
          <button
            onClick={() => navigate('new-arrivals')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            New Arrivals
          </button>
          <button
            onClick={() => navigate('bedding')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            Bedding &amp; Sheet Sets
          </button>
          <button
            onClick={() => navigate('curtains')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            Belgian Linen Curtains
          </button>
          <button
            onClick={() => navigate('throws')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            Artisan Throws
          </button>
          <button
            onClick={() => navigate('blankets')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            Waffle Blankets &amp; Quilts
          </button>
        </div>

        {/* Bespoke & Journal Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1 font-semibold">
            Services &amp; Journal
          </span>
          <button
            onClick={() => navigate('bespoke')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1 font-medium"
          >
            Bespoke Services
          </button>
          <button
            onClick={() => navigate('trade')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1 font-medium"
          >
            Trade &amp; Hospitality
          </button>
          <button
            onClick={() => navigate('canvas')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            The Canvas (Our Stories)
          </button>
          <button
            onClick={() => navigate('account')}
            className="text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors text-left py-1"
          >
            Client Portal &amp; Orders
          </button>
        </div>

        {/* Concierge & Legal Column */}
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-label-caps text-[#000000] uppercase tracking-widest mb-1 font-semibold">
              Concierge
            </span>
            <p className="text-body-sm text-[#2b2d2c]">concierge@boskilimited.com</p>
            <p className="text-body-sm text-[#2b2d2c]">+1 (800) 555-0199</p>
            <p className="text-body-sm text-[#505252]">Monday &ndash; Friday, 9:00am &ndash; 6:00pm EST</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#c4c7c7]/60">
            <p className="text-body-sm text-[#505252] text-xs">
              &copy; 2025 BOSKI LIMITED. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
