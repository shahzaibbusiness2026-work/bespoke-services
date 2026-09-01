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
    isMiniAccountOpen,
    setIsMiniAccountOpen,
    orderHistory,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'bedding' | 'curtains' | 'currency' | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<'bedding' | 'curtains' | null>(null);
  
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const recentOrder = orderHistory[0];

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

  const handleMouseEnterDropdown = (menu: 'bedding' | 'curtains' | 'currency') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleMouseEnterAccount = () => {
    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
    setIsMiniAccountOpen(true);
  };

  const handleMouseLeaveAccount = () => {
    accountTimeoutRef.current = setTimeout(() => {
      setIsMiniAccountOpen(false);
    }, 200);
  };

  return (
    <>
      <header
        className={`w-full top-0 sticky z-40 transition-all duration-500 ease-out bg-[#faf9f7]/95 backdrop-blur-md ${
          isScrolled
            ? 'border-b border-[#c4c7c7]/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]'
            : 'border-b border-[#c4c7c7]/30'
        }`}
      >
        <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1600px] mx-auto h-20">

          {/* FRONT: Brand Emblem & Horizontal Navigation */}
          <div className="flex items-center gap-6 xl:gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left focus:outline-none transition-transform duration-300 active:scale-[0.99] shrink-0"
              aria-label="BOSKI LIMITED Home"
            >
              <span
                className="text-[20px] sm:text-[24px] lg:text-[25px] tracking-[0.14em] font-normal text-[#000000] uppercase group-hover:opacity-75 transition-opacity"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                BOSKI LIMITED
              </span>
            </button>

            {/* Desktop Horizontal Navigation in Exact Requested Order:
                1. Home
                2. New Arrivals
                3. Shop
                4. Bedding (with dropdown)
                5. Curtains (with dropdown)
                6. Towels
                7. Throws & Blankets
                8. My Wishlist
                9. My Account
                10. Currency (default GBP)
            */}
            <nav
              className="hidden 2xl:flex items-center gap-5 xl:gap-6 text-label-caps"
              aria-label="Main Desktop Navigation"
            >
              {/* 1. Home */}
              <button
                id="nav-home"
                onClick={() => handleNavClick('home')}
                className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer ${
                  activePage === 'home' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
              >
                Home
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'home' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </button>

              {/* 2. New Arrivals */}
              <button
                id="nav-new-arrivals"
                onClick={() => handleNavClick('new-arrivals')}
                className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer ${
                  activePage === 'new-arrivals' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
              >
                New Arrivals
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'new-arrivals' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </button>

              {/* 3. Shop */}
              <button
                id="nav-shop"
                onClick={() => handleNavClick('shop')}
                className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer ${
                  activePage === 'shop' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
              >
                Shop
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'shop' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </button>

              {/* 4. Bedding with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('bedding')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  id="nav-bedding"
                  onClick={() => handleNavClick('bedding')}
                  className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer flex items-center gap-1 ${
                    activePage === 'bedding' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                  }`}
                  aria-expanded={activeDropdown === 'bedding'}
                >
                  <span>Bedding</span>
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                      activeDropdown === 'bedding' ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                      activePage === 'bedding' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                    }`}
                    style={{ transformOrigin: 'left' }}
                  />
                </button>

                {/* Bedding Dropdown Panel */}
                {activeDropdown === 'bedding' && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl p-4 z-50 animate-fadeIn">
                    <div className="flex flex-col gap-1 text-body-sm">
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

              {/* 5. Curtains with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('curtains')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  id="nav-curtains"
                  onClick={() => handleNavClick('curtains')}
                  className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer flex items-center gap-1 ${
                    activePage === 'curtains' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                  }`}
                  aria-expanded={activeDropdown === 'curtains'}
                >
                  <span>Curtains</span>
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                      activeDropdown === 'curtains' ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                      activePage === 'curtains' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                    }`}
                    style={{ transformOrigin: 'left' }}
                  />
                </button>

                {/* Curtains Dropdown Panel */}
                {activeDropdown === 'curtains' && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl p-4 z-50 animate-fadeIn">
                    <div className="flex flex-col gap-1 text-body-sm">
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
                className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer ${
                  activePage === 'towels' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
              >
                Towels
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'towels' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </button>

              {/* 7. Throws and Blankets */}
              <button
                id="nav-throws-blankets"
                onClick={() => handleNavClick('throws-blankets')}
                className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer ${
                  activePage === 'throws-blankets' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                }`}
              >
                Throws and Blankets
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                    activePage === 'throws-blankets' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </button>

              {/* 8. My Wishlist */}
              <button
                id="nav-wishlist-link"
                onClick={() => setIsWishlistOpen(true)}
                className="relative py-2 tracking-[0.14em] text-[#2b2d2c] hover:text-[#000000] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#000000] text-white text-[10px] font-medium">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* 9. My Account */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterAccount}
                onMouseLeave={handleMouseLeaveAccount}
              >
                <button
                  id="nav-account-link"
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthOpen(true);
                      setAuthMode('login');
                    } else {
                      handleNavClick('account');
                    }
                  }}
                  className={`relative py-2 tracking-[0.14em] transition-all cursor-pointer flex items-center gap-1 ${
                    activePage === 'account' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c] hover:text-[#000000]'
                  }`}
                >
                  <span>My Account</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#000000] transition-all duration-300 ${
                      activePage === 'account' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                    }`}
                    style={{ transformOrigin: 'left' }}
                  />
                </button>
              </div>

              {/* 10. Currency: Default GBP */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('currency')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  id="nav-currency-switcher"
                  className="px-2.5 py-1.5 border border-[#c4c7c7] text-label-caps text-[#000000] hover:border-[#000000] transition-colors flex items-center gap-1.5 cursor-pointer"
                  aria-label={`Selected currency: ${currency.code}`}
                >
                  <span className="font-semibold">{currency.symbol} {currency.code}</span>
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </button>

                {activeDropdown === 'currency' && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#faf9f7] border border-[#c4c7c7] shadow-xl py-2 z-50 animate-fadeIn">
                    {Object.values(CURRENCIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-body-sm flex justify-between items-center transition-colors ${
                          currency.code === c.code ? 'bg-[#000000] text-white font-semibold' : 'text-[#2b2d2c] hover:bg-[#efeeec]'
                        }`}
                      >
                        <span>{c.code}</span>
                        <span>{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Medium Screen Nav Summary (Viewports between 1024px and 1440px) */}
          <nav className="hidden lg:flex 2xl:hidden items-center gap-4 text-label-caps">
            <button onClick={() => handleNavClick('home')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Home</button>
            <button onClick={() => handleNavClick('new-arrivals')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">New Arrivals</button>
            <button onClick={() => handleNavClick('shop')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Shop</button>
            <button onClick={() => handleNavClick('bedding')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Bedding</button>
            <button onClick={() => handleNavClick('curtains')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Curtains</button>
            <button onClick={() => handleNavClick('towels')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Towels</button>
            <button onClick={() => handleNavClick('throws-blankets')} className="hover:text-[#000000] py-1 text-[#2b2d2c]">Throws</button>
          </nav>

          {/* Trailing Utility Actions: 44x44px touch targets with 16px gap */}
          <div className="flex items-center gap-4 text-[#1a1c1b]">
            {/* Quick Search */}
            <button
              id="search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none"
              aria-label="Search collection"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                search
              </span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-60 transition-opacity cursor-pointer rounded-none focus:outline-none"
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

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              id="mobile-menu-btn"
              className="2xl:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1a1c1b] hover:opacity-70 transition-opacity rounded-none focus:outline-none"
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

      {/* Responsive Hamburger Sidebar Slide-Over Drawer
          Accurately renders all items in requested order:
          1. Home
          2. New Arrivals
          3. Shop
          4. Bedding (with dropdown accordion)
          5. Curtains (with dropdown accordion)
          6. Towels
          7. Throws & Blankets
          8. My Wishlist
          9. My Account
          10. Currency: GBP
      */}
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

            {/* 7. Throws and Blankets */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('throws-blankets')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center ${
                  activePage === 'throws-blankets' ? 'text-[#000000] font-semibold' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Throws and Blankets</span>
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

            {/* 9. My Account */}
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
                  <span>My Account</span>
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
