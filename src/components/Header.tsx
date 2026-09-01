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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnterProfile = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMiniAccountOpen(true);
  };
  const handleMouseLeaveProfile = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsMiniAccountOpen(false), 250);
  };

  const navLinks = [
    { label: 'New Arrivals', page: 'home' as PageView, category: 'all' },
    { label: 'Bedding', page: 'home' as PageView, category: 'sheets' },
    { label: 'Curtains', page: 'home' as PageView, category: 'curtains' },
    { label: 'Throws', page: 'home' as PageView, category: 'throws' },
    { label: 'Blankets', page: 'home' as PageView, category: 'blankets' },
    { label: 'Our Story', page: 'canvas' as PageView },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setActivePage(link.page);
    if (link.category && onSelectCategory) onSelectCategory(link.category);
    setIsMobileMenuOpen(false);
    if (link.page === 'home' && link.category && link.category !== 'all') {
      setTimeout(() => {
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`w-full top-0 sticky z-50 transition-all duration-300 ease-in-out bg-[#faf9f7] ${
        isScrolled ? 'border-b border-[#c4c7c7]/50' : 'border-b border-[#c4c7c7]/30'
      }`}
    >
      <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1440px] mx-auto h-20">

        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-btn"
          className="md:hidden text-[#1a1c1b] hover:opacity-70 transition-opacity p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.label}
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleNavClick(link)}
              className={`nav-link text-label-caps text-[#444748] hover:text-[#000000] transition-colors duration-300 ${
                activePage === link.page && (link.page !== 'home' || link.label === 'New Arrivals')
                  ? 'text-[#000000]'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            id="nav-bespoke"
            onClick={() => { setActivePage('bespoke'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`nav-link text-label-caps text-[#444748] hover:text-[#000000] transition-colors duration-300 ${activePage === 'bespoke' ? 'text-[#000000]' : ''}`}
          >
            Bespoke Services
          </button>
          <button
            id="nav-trade"
            onClick={() => { setActivePage('trade'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`nav-link text-label-caps text-[#444748] hover:text-[#000000] transition-colors duration-300 ${activePage === 'trade' ? 'text-[#000000]' : ''}`}
          >
            Trade
          </button>
        </nav>

        {/* Brand Logo — center */}
        <button
          onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 focus:outline-none"
          aria-label="LINEN & LOFT — Home"
        >
          <span
            className="text-headline-md text-[#000000] tracking-widest whitespace-nowrap"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontSize: '28px', letterSpacing: '0.1em' }}
          >
            LINEN &amp; LOFT
          </span>
        </button>

        {/* Right Action Icons */}
        <div className="flex gap-4 md:gap-5 items-center">

          {/* Search */}
          <button
            id="search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="text-[#1a1c1b] hover:opacity-70 transition-opacity"
            aria-label="Search"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>search</span>
          </button>

          {/* Wishlist */}
          <button
            id="wishlist-btn"
            onClick={() => setIsWishlistOpen(true)}
            className="text-[#1a1c1b] hover:opacity-70 transition-opacity relative hidden md:block"
            aria-label="Wishlist"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#000000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account / Profile with dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnterProfile}
            onMouseLeave={handleMouseLeaveProfile}
          >
            <button
              id="account-btn"
              onClick={() => {
                if (currentUser) {
                  setActivePage('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }
              }}
              className="text-[#1a1c1b] hover:opacity-70 transition-opacity"
              aria-label="Account"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>person</span>
            </button>

            {/* Mini Account Overlay — matches user_profile_card reference */}
            {isMiniAccountOpen && (
              <div
                id="mini-account-overlay"
                className="absolute right-0 top-full mt-4 w-[380px] bg-[#faf9f7] border border-[#c4c7c7]/30 shadow-2xl opacity-100 visible transition-all duration-300 z-50 text-left"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
              >
                {currentUser ? (
                  <>
                    {/* Header */}
                    <div className="p-8 border-b border-[#c4c7c7]/20">
                      <h2 className="text-headline-sm text-[#1a1c1b] mb-1">
                        Welcome, {currentUser.firstName}
                      </h2>
                      <p className="text-body-sm text-[#444748]">{currentUser.email}</p>
                    </div>

                    {/* Recent Order */}
                    <div className="p-8 border-b border-[#c4c7c7]/20 bg-[#f4f3f1]/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-label-caps text-[#1a1c1b]">Recent Order</span>
                        <span className="text-label-caps text-[#675d50]">
                          #{recentOrder?.orderId || 'OH-9482'}
                        </span>
                      </div>
                      <p className="text-body-sm text-[#444748] mb-4">
                        {recentOrder?.items[0]?.product.name || 'Linen Duvet Cover - Ivory'}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-[#675d50] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] text-[#675d50]" style={{ fontVariationSettings: "'wght' 300" }}>local_shipping</span>
                        </div>
                        <div className="flex-grow">
                          <div className="w-full bg-[#efeeec] h-1 mb-1">
                            <div className="bg-[#675d50] h-1 w-2/3" />
                          </div>
                          <span className="text-label-caps text-[#675d50] opacity-70">
                            {recentOrder?.status || 'In Transit — Expected Tomorrow'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="py-4">
                      {[
                        { label: 'Overview', icon: 'dashboard', page: 'account' as PageView },
                        { label: 'Orders', icon: 'inventory_2', page: 'account' as PageView },
                        { label: 'Wishlist', icon: 'favorite_border', page: 'account' as PageView, badge: wishlistCount > 0 ? `${wishlistCount} Items` : undefined },
                        { label: 'Settings', icon: 'settings', page: 'account' as PageView },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { setActivePage(item.page); setIsMiniAccountOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="flex items-center gap-4 px-8 py-3 text-[#1a1c1b] hover:bg-[#f4f3f1] transition-colors w-full text-left group"
                        >
                          <span className="material-symbols-outlined text-[#444748] group-hover:text-[#1a1c1b]" style={{ fontVariationSettings: "'wght' 200" }}>{item.icon}</span>
                          <span className="text-body-md flex-grow">{item.label}</span>
                          {item.badge && (
                            <span className="text-label-caps bg-[#675d50]/10 text-[#675d50] px-2 py-0.5 rounded-full">{item.badge}</span>
                          )}
                        </button>
                      ))}
                    </nav>

                    {/* Sign Out */}
                    <div className="p-6 border-t border-[#c4c7c7]/20 bg-[#f4f3f1]/30">
                      <button
                        id="mini-signout-btn"
                        onClick={() => { logout(); setIsMiniAccountOpen(false); }}
                        className="w-full py-3 text-label-caps text-[#1a1c1b] border border-[#c4c7c7] hover:bg-[#efeeec] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-8 border-b border-[#c4c7c7]/20">
                      <h2 className="text-headline-sm text-[#1a1c1b] mb-2">Welcome</h2>
                      <p className="text-body-sm text-[#444748]">Sign in to access your account, orders, and wishlist.</p>
                    </div>
                    <div className="p-8 space-y-4">
                      <button
                        id="mini-signin-btn"
                        onClick={() => { setAuthMode('login'); setIsAuthOpen(true); setIsMiniAccountOpen(false); }}
                        className="w-full py-4 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        id="mini-create-account-btn"
                        onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); setIsMiniAccountOpen(false); }}
                        className="w-full py-4 border border-[#c4c7c7] text-[#000000] text-label-caps hover:bg-[#f4f3f1] transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Payments / Trade */}
          <button
            id="payments-btn"
            onClick={() => { setActivePage('trade'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-[#1a1c1b] hover:opacity-70 transition-opacity hidden md:block"
            aria-label="Trade & Payments"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>payments</span>
          </button>

          {/* Shopping Bag */}
          <button
            id="cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="text-[#1a1c1b] hover:opacity-70 transition-opacity relative"
            aria-label="Shopping Bag"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>shopping_bag</span>
            {cartCount > 0 && (
              <span
                id="cart-count-badge"
                className="absolute -top-1 -right-2 bg-[#000000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#faf9f7] border-t border-[#c4c7c7]/30">
          <nav className="px-5 py-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="block w-full text-left py-3 text-body-md text-[#444748] hover:text-[#000000] transition-colors border-b border-[#efeeec]"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setActivePage('bespoke'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0 }); }}
              className="block w-full text-left py-3 text-body-md text-[#444748] hover:text-[#000000] transition-colors border-b border-[#efeeec]"
            >
              Bespoke Services
            </button>
            <button
              onClick={() => { setActivePage('trade'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0 }); }}
              className="block w-full text-left py-3 text-body-md text-[#444748] hover:text-[#000000] transition-colors border-b border-[#efeeec]"
            >
              Trade &amp; Hospitality
            </button>
            <div className="pt-4 flex gap-4 items-center">
              <button
                onClick={() => { setIsWishlistOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-body-sm text-[#444748]"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>favorite</span>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
              {currentUser ? (
                <button
                  onClick={() => { setActivePage('account'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0 }); }}
                  className="flex items-center gap-2 text-body-sm text-[#444748]"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>person</span>
                  {currentUser.firstName}
                </button>
              ) : (
                <button
                  onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-body-sm text-[#444748]"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>person</span>
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
