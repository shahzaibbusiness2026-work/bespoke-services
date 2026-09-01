import React, { useState, useEffect, useRef } from 'react';
import { useShop, PageView } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';

interface HeaderProps {
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectCategory }) => {
  const {
    activePage,
    setActivePage,
    cart,
    wishlist,
    currency,
    setCurrency,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    currentUser,
    logout,
    setIsAuthOpen,
    setAuthMode,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'bedding' | 'curtains' | 'currency' | 'account' | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<'bedding' | 'curtains' | null>(null);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageView, category?: string) => {
    setActivePage(page);
    if (category && onSelectCategory) onSelectCategory(category);
    setIsSidebarOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = (menu: 'bedding' | 'curtains' | 'currency' | 'account') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <>
      <header
        className={`w-full top-0 sticky z-40 transition-all duration-300 ease-out bg-[#faf9f7]/95 backdrop-blur-md ${
          isScrolled
            ? 'border-b border-[#c4c7c7]/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] h-[74px]'
            : 'border-b border-[#c4c7c7]/35 h-[80px]'
        }`}
      >
        <div className="flex justify-between items-center w-full px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[1720px] mx-auto h-full">
          
          {/* LEFT: Brand Emblem (BOSKI LIMITED) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-none cursor-pointer group"
              aria-label="BOSKI LIMITED Home"
            >
              <span
                className="text-[17px] sm:text-[22px] lg:text-[25px] tracking-[0.10em] sm:tracking-[0.16em] font-normal text-[#000000] uppercase group-hover:opacity-75 transition-opacity whitespace-nowrap"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                BOSKI LIMITED
              </span>
            </button>
          </div>

          {/* CENTER: Editorial Horizontal Navigation (Desktop & Laptop >= 1024px) */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-9 text-[12.5px] xl:text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.12em] whitespace-nowrap"
            aria-label="Main Editorial Navigation"
          >
            {/* 1. Home */}
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                activePage === 'home' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                  activePage === 'home' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>

            {/* 2. New Arrivals */}
            <button
              id="nav-new-arrivals"
              onClick={() => handleNavClick('new-arrivals')}
              className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                activePage === 'new-arrivals' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              New Arrivals
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                  activePage === 'new-arrivals' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>

            {/* 3. Shop */}
            <button
              id="nav-shop"
              onClick={() => handleNavClick('shop')}
              className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                activePage === 'shop' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Shop
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                  activePage === 'shop' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>

            {/* 4. Bedding (with Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('bedding')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-bedding"
                onClick={() => handleNavClick('bedding')}
                className={`relative py-2 transition-colors duration-200 cursor-pointer flex items-center gap-1 ${
                  activePage === 'bedding' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
                aria-expanded={activeDropdown === 'bedding'}
              >
                <span>Bedding</span>
                <span
                  className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${
                    activeDropdown === 'bedding' ? 'rotate-180' : ''
                  }`}
                  style={{ fontVariationSettings: "'wght' 300" }}
                >
                  expand_more
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'bedding' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </button>

              {/* Bedding Dropdown Flyout */}
              {activeDropdown === 'bedding' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-[#faf9f7] border border-[#c4c7c7] shadow-lg py-3 px-2 z-50 animate-fadeIn normal-case">
                  <div className="flex flex-col gap-0.5 text-body-sm">
                    <button
                      onClick={() => handleNavClick('bedding')}
                      className="text-left px-3 py-2 text-[#000000] font-semibold hover:bg-[#efeeec] transition-colors"
                    >
                      All Bedding
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'sheets')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Sheet Sets (Sateen &amp; Percale)
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'duvets')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Stonewashed Linen Duvet Covers
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'pillows')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Mulberry Silk Pillowcases &amp; Down
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Curtains (with Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('curtains')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-curtains"
                onClick={() => handleNavClick('curtains')}
                className={`relative py-2 transition-colors duration-200 cursor-pointer flex items-center gap-1 ${
                  activePage === 'curtains' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
                aria-expanded={activeDropdown === 'curtains'}
              >
                <span>Curtains</span>
                <span
                  className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${
                    activeDropdown === 'curtains' ? 'rotate-180' : ''
                  }`}
                  style={{ fontVariationSettings: "'wght' 300" }}
                >
                  expand_more
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'curtains' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </button>

              {/* Curtains Dropdown Flyout */}
              {activeDropdown === 'curtains' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-[#faf9f7] border border-[#c4c7c7] shadow-lg py-3 px-2 z-50 animate-fadeIn normal-case">
                  <div className="flex flex-col gap-0.5 text-body-sm">
                    <button
                      onClick={() => handleNavClick('curtains')}
                      className="text-left px-3 py-2 text-[#000000] font-semibold hover:bg-[#efeeec] transition-colors"
                    >
                      All Curtains &amp; Drapery
                    </button>
                    <button
                      onClick={() => handleNavClick('curtains', 'curtains')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Belgian Linen Drapery Panels
                    </button>
                    <button
                      onClick={() => handleNavClick('curtains', 'sheer')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Airy Sheer Linen Weaves
                    </button>
                    <button
                      onClick={() => handleNavClick('bespoke')}
                      className="text-left px-3 py-2 text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
                    >
                      Custom Drop &amp; Weighted Hems
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Towels */}
            <button
              id="nav-towels"
              onClick={() => handleNavClick('towels')}
              className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                activePage === 'towels' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Towels
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                  activePage === 'towels' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>

            {/* 7. Throws & Blankets */}
            <button
              id="nav-throws-blankets"
              onClick={() => handleNavClick('throws-blankets')}
              className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                activePage === 'throws-blankets' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Throws &amp; Blankets
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                  activePage === 'throws-blankets' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>
          </nav>

          {/* RIGHT: Luxury Utilities Cluster (Search, Wishlist, User Profile with Currency, Shopping Bag) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 text-[#1a1c1b]">
            
            {/* 1. Quick Search */}
            <button
              id="search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
              aria-label="Search collection"
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                search
              </span>
            </button>

            {/* 2. Wishlist Icon */}
            <button
              id="wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
              aria-label={wishlistCount > 0 ? `My Wishlist, ${wishlistCount} items saved` : "My Wishlist, empty"}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#000000] text-white text-[10px] font-semibold flex items-center justify-center animate-scaleIn pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. User Profile Icon with Integrated Currency Switcher */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-user-account-btn"
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthOpen(true);
                    setAuthMode('login');
                  } else {
                    handleNavClick('account');
                  }
                }}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
                aria-label={currentUser ? `Account: ${currentUser.name}` : "Sign In & Settings"}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                  person
                </span>
              </button>

              {/* User Profile Dropdown Flyout */}
              {activeDropdown === 'account' && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl p-4 z-50 animate-fadeIn normal-case">
                  {currentUser ? (
                    <div className="flex flex-col gap-3">
                      <div className="border-b border-[#c4c7c7]/50 pb-2.5">
                        <p className="text-body-sm font-semibold text-[#000000]">{currentUser.name}</p>
                        <p className="text-[11.5px] text-[#505252] truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#000000] text-white text-[9.5px] uppercase tracking-wider font-semibold">
                          VIP Atelier Member
                        </span>
                      </div>

                      <button
                        onClick={() => handleNavClick('account')}
                        className="text-left py-1 text-body-sm text-[#2b2d2c] hover:text-[#000000] transition-colors flex items-center justify-between"
                      >
                        <span>Client Dashboard &amp; Orders</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>

                      {/* Currency Selection inside User Profile */}
                      <div className="border-t border-[#c4c7c7]/50 pt-3">
                        <label className="text-[11px] font-semibold text-[#505252] uppercase tracking-wider block mb-2">
                          Currency (Default GBP)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {Object.values(CURRENCIES).map((c) => (
                            <button
                              key={c.code}
                              onClick={() => {
                                setCurrency(c);
                                setActiveDropdown(null);
                              }}
                              className={`py-1.5 px-1 text-[11px] border text-center transition-all cursor-pointer font-medium ${
                                currency.code === c.code
                                  ? 'border-[#000000] bg-[#000000] text-white font-bold'
                                  : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] bg-white'
                              }`}
                            >
                              {c.symbol} {c.code}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#c4c7c7]/50 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setActiveDropdown(null);
                          }}
                          className="text-left py-1 text-body-sm text-[#c0392b] hover:underline transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-body-sm text-[#2b2d2c] font-light">
                        Sign in to access your atelier orders, bespoke measurements &amp; wishlist.
                      </p>
                      <button
                        onClick={() => {
                          setIsAuthOpen(true);
                          setAuthMode('login');
                          setActiveDropdown(null);
                        }}
                        className="w-full py-2.5 bg-[#000000] text-white text-label-caps uppercase tracking-wider hover:bg-[#252726] transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsAuthOpen(true);
                          setAuthMode('signup');
                          setActiveDropdown(null);
                        }}
                        className="w-full py-2 border border-[#c4c7c7] text-[#000000] text-label-caps uppercase tracking-wider hover:border-[#000000] transition-colors"
                      >
                        Create Account
                      </button>

                      {/* Currency Selection inside User Profile when logged out */}
                      <div className="border-t border-[#c4c7c7]/50 pt-3">
                        <label className="text-[11px] font-semibold text-[#505252] uppercase tracking-wider block mb-2">
                          Currency (Default GBP)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {Object.values(CURRENCIES).map((c) => (
                            <button
                              key={c.code}
                              onClick={() => {
                                setCurrency(c);
                                setActiveDropdown(null);
                              }}
                              className={`py-1.5 px-1 text-[11px] border text-center transition-all cursor-pointer font-medium ${
                                currency.code === c.code
                                  ? 'border-[#000000] bg-[#000000] text-white font-bold'
                                  : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] bg-white'
                              }`}
                            >
                              {c.symbol} {c.code}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Shopping Bag */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
              aria-label={cartCount > 0 ? `Shopping bag, ${cartCount} items` : "Shopping bag, empty"}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#000000] text-white text-[10px] font-semibold flex items-center justify-center animate-scaleIn pointer-events-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 5. Mobile / Tablet Hamburger Toggle (Hidden on Laptop & Desktop >= 1024px) */}
            <button
              id="mobile-menu-btn"
              className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-70 transition-opacity focus:outline-none cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'wght' 300" }}>
                menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Hamburger Sidebar Slide-Over Drawer for Mobile & Tablets (< 1024px) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        {/* Backdrop Overlay with smooth fade */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Drawer Panel */}
        <div
          id="mobile-sidebar-drawer"
          className={`fixed inset-y-0 left-0 z-10 w-full max-w-[360px] bg-[#faf9f7] border-r border-[#c4c7c7] shadow-2xl flex flex-col h-full transition-transform duration-300 ease-out will-change-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Top Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#c4c7c7] shrink-0">
            <span
              className="text-[20px] font-normal tracking-[0.14em] text-[#000000] uppercase"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Close navigation sidebar"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Navigation Links in Exact Order */}
          <div className="flex-grow overflow-y-auto px-6 py-6 space-y-2 divide-y divide-[#e3e2e0]/60">
            
            {/* 1. Home */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'home' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Home</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 2. New Arrivals */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('new-arrivals')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'new-arrivals' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>New Arrivals</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 3. Shop */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('shop')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'shop' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Shop</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 4. Bedding (with collapsible dropdowns) */}
            <div className="pt-2">
              <button
                onClick={() =>
                  setMobileExpandedDropdown(mobileExpandedDropdown === 'bedding' ? null : 'bedding')
                }
                className="w-full text-left py-3 text-body-lg flex justify-between items-center text-[#2b2d2c]"
              >
                <span className="font-medium">Bedding</span>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-200 ${
                    mobileExpandedDropdown === 'bedding' ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {mobileExpandedDropdown === 'bedding' && (
                <div className="pl-4 pb-3 space-y-2 border-l-2 border-[#000000] ml-1 my-1 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('bedding')}
                    className="w-full text-left py-1 text-body-sm text-[#000000] font-medium"
                  >
                    All Bedding
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'sheets')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Sheet Sets
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'duvets')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Duvet Covers
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'pillows')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Silk Pillowcases &amp; Down
                  </button>
                </div>
              )}
            </div>

            {/* 5. Curtains (with collapsible dropdowns) */}
            <div className="pt-2">
              <button
                onClick={() =>
                  setMobileExpandedDropdown(mobileExpandedDropdown === 'curtains' ? null : 'curtains')
                }
                className="w-full text-left py-3 text-body-lg flex justify-between items-center text-[#2b2d2c]"
              >
                <span className="font-medium">Curtains</span>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-200 ${
                    mobileExpandedDropdown === 'curtains' ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {mobileExpandedDropdown === 'curtains' && (
                <div className="pl-4 pb-3 space-y-2 border-l-2 border-[#000000] ml-1 my-1 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('curtains')}
                    className="w-full text-left py-1 text-body-sm text-[#000000] font-medium"
                  >
                    All Curtains &amp; Drapery
                  </button>
                  <button
                    onClick={() => handleNavClick('curtains', 'curtains')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Belgian Linen Panels
                  </button>
                  <button
                    onClick={() => handleNavClick('curtains', 'sheer')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Sheer Weaves
                  </button>
                  <button
                    onClick={() => handleNavClick('bespoke')}
                    className="w-full text-left py-1 text-body-sm text-[#2b2d2c]"
                  >
                    Custom Drop &amp; Weighted Hems
                  </button>
                </div>
              )}
            </div>

            {/* 6. Towels */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('towels')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'towels' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Towels</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 7. Throws & Blankets */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('throws-blankets')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'throws-blankets' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Throws &amp; Blankets</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 8. My Wishlist */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="w-full text-left py-3 text-body-lg flex justify-between items-center text-[#2b2d2c]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  <span>My Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#000000] text-white text-xs font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* 9. User Profile / Account */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  if (!currentUser) {
                    setIsAuthOpen(true);
                    setAuthMode('login');
                  } else {
                    handleNavClick('account');
                  }
                }}
                className="w-full text-left py-3 text-body-lg flex justify-between items-center text-[#2b2d2c]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span>{currentUser ? currentUser.name : 'Sign In / My Account'}</span>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 10. Currency: Default GBP */}
            <div className="pt-4">
              <span className="text-label-caps text-[#505252] uppercase tracking-wider block mb-2 font-semibold">
                Currency (Default GBP)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className={`py-2 px-2 text-label-caps border text-center transition-all ${
                      currency.code === c.code
                        ? 'border-[#000000] bg-[#000000] text-white font-bold'
                        : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000]'
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Bottom Concierge */}
          <div className="p-6 border-t border-[#c4c7c7] bg-[#f4f3f1] shrink-0">
            <p className="text-label-caps text-[#505252] uppercase mb-1 font-semibold">Concierge Support</p>
            <p className="text-body-sm text-[#000000] font-medium">+1 (800) 555-0199</p>
            <p className="text-body-sm text-[#505252] text-xs mt-1">concierge@boskilimited.com</p>
          </div>
        </div>
      </div>
    </>
  );
};
