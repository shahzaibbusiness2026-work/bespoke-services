import React, { useState, useEffect, useRef } from 'react';
import { useShop, PageView } from '../context/ShopContext';

interface HeaderProps {
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectCategory }) => {
  const {
    activePage,
    setActivePage,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    currentUser,
    logout,
    setIsAuthOpen,
    setAuthMode,
    isMiniAccountOpen,
    setIsMiniAccountOpen,
    orderHistory,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const recentOrder = orderHistory[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnterProfile = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMiniAccountOpen(true);
  };
  const handleMouseLeaveProfile = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsMiniAccountOpen(false), 200);
  };

  const navLinks: { label: string; page: PageView; category?: string }[] = [
    { label: 'New Arrivals', page: 'new-arrivals', category: 'all' },
    { label: 'Bedding', page: 'bedding', category: 'sheets' },
    { label: 'Curtains', page: 'curtains', category: 'curtains' },
    { label: 'Throws', page: 'throws', category: 'throws' },
    { label: 'Blankets', page: 'blankets', category: 'blankets' },
    { label: 'Bespoke Services', page: 'bespoke' },
    { label: 'Trade & Hospitality', page: 'trade' },
    { label: 'The Canvas', page: 'canvas' },
  ];

  const handleNavClick = (page: PageView, category?: string) => {
    setActivePage(page);
    if (category && onSelectCategory) onSelectCategory(category);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`w-full top-0 sticky z-40 transition-all duration-500 ease-out bg-[#faf9f7]/95 backdrop-blur-md ${
        isScrolled
          ? 'border-b border-[#c4c7c7]/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]'
          : 'border-b border-[#c4c7c7]/30'
      }`}
    >
      <div className="flex justify-between items-center w-full px-5 md:px-10 lg:px-12 xl:px-16 max-w-[1520px] mx-auto h-20">

        {/* FRONT: Brand Emblem & Horizontal Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left focus:outline-none transition-transform duration-300 active:scale-[0.99] shrink-0"
            aria-label="BOSKI LIMITED Home"
          >
            <span
              className="text-[22px] sm:text-[25px] xl:text-[27px] tracking-[0.14em] font-normal text-[#000000] uppercase group-hover:opacity-75 transition-opacity"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
          </button>

          {/* Main Horizontal Navigation — Relied upon solely on viewports >= 1024px (hidden below 1024px) */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-7"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.label}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(link.page, link.category)}
                  className={`relative py-2 text-label-caps tracking-[0.14em] transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#000000] font-semibold'
                      : 'text-[#2b2d2c] hover:text-[#000000]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {/* Subtle editorial underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ease-out ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                    }`}
                    style={{ transformOrigin: 'left' }}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Trailing Utility Actions: minimum 44x44px touch targets with exactly 16px padding (gap-4) between icons */}
        <div className="flex items-center gap-4 text-[#1a1c1b]">
          {/* Search Trigger — 44x44px touch target */}
          <button
            id="search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            aria-label="Search collection"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              search
            </span>
          </button>

          {/* Wishlist Trigger — 44x44px touch target */}
          <button
            id="wishlist-btn"
            onClick={() => setIsWishlistOpen(true)}
            className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} saved items` : "Wishlist, empty"}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              favorite
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#000000] text-white text-[10px] font-medium flex items-center justify-center animate-scaleIn pointer-events-none">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Profile Trigger with Mini-Overlay — 44x44px touch target */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnterProfile}
            onMouseLeave={handleMouseLeaveProfile}
          >
            <button
              id="account-btn"
              onClick={() => {
                if (!currentUser) {
                  setIsAuthOpen(true);
                  setAuthMode('login');
                } else {
                  setActivePage('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label={currentUser ? `Account profile for ${currentUser.firstName} ${currentUser.lastName}` : "Sign in or create an account"}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                person
              </span>
            </button>

            {/* Mini Account Overlay Menu */}
            {isMiniAccountOpen && (
              <div
                id="mini-account-dropdown"
                className="absolute right-0 top-full mt-1 w-72 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl p-6 z-50 animate-fadeIn"
              >
                {currentUser ? (
                  <>
                    <div className="border-b border-[#c4c7c7]/40 pb-4 mb-4">
                      <p className="text-body-md text-[#000000] font-semibold">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-body-sm text-[#2b2d2c] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#f4f3f1] border border-[#c4c7c7] text-label-caps text-[#2b2d2c]">
                        {currentUser.vipTier} Member
                      </span>
                    </div>

                    {recentOrder && (
                      <div className="border-b border-[#c4c7c7]/40 pb-4 mb-4">
                        <p className="text-label-caps text-[#2b2d2c] mb-1">Recent Order</p>
                        <div className="flex justify-between items-center text-body-sm mb-2">
                          <span className="font-medium text-[#000000]">#{recentOrder.orderId}</span>
                          <span className="text-[#2b2d2c] text-xs font-semibold">{recentOrder.status}</span>
                        </div>
                        <div className="w-full bg-[#efeeec] h-1">
                          <div
                            className="bg-[#000000] h-1 transition-all duration-300"
                            style={{ width: recentOrder.status === 'Processing' ? '33%' : recentOrder.status === 'Shipped' ? '66%' : '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={() => { setActivePage('account'); setIsMiniAccountOpen(false); }}
                        className="w-full text-left text-body-sm text-[#000000] hover:underline py-1"
                      >
                        Order History
                      </button>
                      <button
                        onClick={() => { setActivePage('account'); setIsMiniAccountOpen(false); }}
                        className="w-full text-left text-body-sm text-[#000000] hover:underline py-1"
                      >
                        Saved Addresses
                      </button>
                      <button
                        onClick={() => { logout(); setIsMiniAccountOpen(false); }}
                        className="w-full text-left text-body-sm text-[#ba1a1a] hover:underline py-1 pt-2 border-t border-[#c4c7c7]/30"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-body-sm text-[#2b2d2c]">
                      Sign in for order tracking, saved addresses, and private vault drops.
                    </p>
                    <button
                      onClick={() => { setIsAuthOpen(true); setAuthMode('login'); setIsMiniAccountOpen(false); }}
                      className="w-full py-2.5 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setIsAuthOpen(true); setAuthMode('signup'); setIsMiniAccountOpen(false); }}
                      className="w-full py-2.5 border border-[#c4c7c7] text-[#000000] text-label-caps hover:bg-[#f4f3f1] transition-colors text-center"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag Trigger — 44x44px touch target */}
          <button
            id="cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            aria-label={cartCount > 0 ? `Shopping bag, ${cartCount} items` : "Shopping bag, empty"}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              shopping_bag
            </span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#000000] text-white text-[10px] font-medium flex items-center justify-center animate-scaleIn pointer-events-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu Toggle — HIDDEN on viewports wider than 1024px (lg:hidden) */}
          <button
            id="mobile-menu-btn"
            className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-70 transition-opacity rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu — Exclusively for viewports < 1024px (lg:hidden) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="lg:hidden bg-[#faf9f7] border-b border-[#c4c7c7] px-6 py-8 flex flex-col gap-6 animate-fadeIn"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page, link.category)}
                className={`text-left text-body-lg py-2 border-b border-[#c4c7c7]/20 flex justify-between items-center ${
                  activePage === link.page ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {!currentUser ? (
              <button
                onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full py-3.5 bg-[#000000] text-white text-label-caps uppercase tracking-wider"
              >
                Sign In / Join
              </button>
            ) : (
              <button
                onClick={() => { setActivePage('account'); setIsMobileMenuOpen(false); }}
                className="w-full py-3.5 border border-[#c4c7c7] text-[#000000] text-label-caps uppercase tracking-wider"
              >
                My Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
