'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useShop, PageView } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';
import { Sun, Moon } from 'lucide-react';

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
    isDarkMode,
    toggleTheme,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'bedding' | 'curtains' | 'currency' | 'account' | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<'bedding' | 'curtains' | null>(null);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Guard against SSR hydration mismatches for client-stored cart and user states
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
        id="main-sticky-navbar"
        className={`w-full sticky top-0 z-40 transition-all duration-300 ease-out backdrop-blur-md ${
          isDarkMode
            ? isScrolled
              ? 'bg-[#111312]/95 border-b border-[#2A2E2C] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] h-[72px]'
              : 'bg-[#111312]/90 border-b border-[#2A2E2C]/50 h-[80px]'
            : isScrolled
              ? 'bg-[#faf9f7]/95 border-b border-[#c4c7c7] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] h-[72px]'
              : 'bg-[#faf9f7]/95 border-b border-[#c4c7c7]/35 h-[80px]'
        }`}
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
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
                className={`text-[17px] sm:text-[22px] lg:text-[25px] tracking-[0.10em] sm:tracking-[0.16em] font-normal uppercase group-hover:opacity-75 transition-opacity whitespace-nowrap ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}
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
                activePage === 'home'
                  ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                  : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                } ${
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
                activePage === 'new-arrivals'
                  ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                  : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              New Arrivals
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                } ${
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
                activePage === 'shop'
                  ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                  : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Shop
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                } ${
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
                  activePage === 'bedding'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
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
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                    isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                  } ${
                    activePage === 'bedding' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </button>

              {/* Bedding Dropdown Flyout */}
              {activeDropdown === 'bedding' && (
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 border shadow-lg py-3 px-2 z-50 animate-fadeIn normal-case transition-colors ${
                  isDarkMode ? 'bg-[#1A1D1C] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                }`}>
                  <div className="flex flex-col gap-0.5 text-body-sm">
                    <button
                      onClick={() => handleNavClick('bedding')}
                      className={`text-left px-3 py-2 font-semibold transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      All Bedding
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'sheets')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      Sheet Sets (Sateen &amp; Percale)
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'duvets')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      Stonewashed Linen Duvet Covers
                    </button>
                    <button
                      onClick={() => handleNavClick('bedding', 'pillows')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
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
                  activePage === 'curtains'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
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
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                    isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                  } ${
                    activePage === 'curtains' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </button>

              {/* Curtains Dropdown Flyout */}
              {activeDropdown === 'curtains' && (
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 border shadow-lg py-3 px-2 z-50 animate-fadeIn normal-case transition-colors ${
                  isDarkMode ? 'bg-[#1A1D1C] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                }`}>
                  <div className="flex flex-col gap-0.5 text-body-sm">
                    <button
                      onClick={() => handleNavClick('curtains')}
                      className={`text-left px-3 py-2 font-semibold transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      All Curtains &amp; Drapery
                    </button>
                    <button
                      onClick={() => handleNavClick('curtains', 'curtains')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      Belgian Linen Drapery Panels
                    </button>
                    <button
                      onClick={() => handleNavClick('curtains', 'sheer')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
                    >
                      Airy Sheer Linen Weaves
                    </button>
                    <button
                      onClick={() => handleNavClick('bespoke')}
                      className={`text-left px-3 py-2 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#242826]' : 'text-[#2b2d2c] hover:text-[#000000] hover:bg-[#efeeec]'
                      }`}
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
                activePage === 'towels'
                  ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                  : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Towels
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                } ${
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
                activePage === 'throws-blankets'
                  ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                  : isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
              }`}
            >
              Throws &amp; Blankets
              <span
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'
                } ${
                  activePage === 'throws-blankets' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'center' }}
              />
            </button>
          </nav>

          {/* RIGHT: Luxury Utilities Cluster (Search, Wishlist, Theme Toggle, User Profile with Currency, Shopping Bag) */}
          <div className={`flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'}`}>
            
            {/* 1. Quick Search (Desktop >=1024px) */}
            <button
              id="search-btn"
              onClick={() => setIsSearchOpen(true)}
              className={`hidden lg:flex w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center hover:opacity-60 transition-opacity cursor-pointer focus:outline-none ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
              }`}
              aria-label="Search collection"
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                search
              </span>
            </button>

            {/* 2. Wishlist Icon (Desktop >=1024px) */}
            <button
              id="wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className={`hidden lg:flex relative w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center hover:opacity-60 transition-opacity cursor-pointer focus:outline-none ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
              }`}
              aria-label={wishlistCount > 0 ? `My Wishlist, ${wishlistCount} items saved` : "My Wishlist, empty"}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-semibold flex items-center justify-center animate-scaleIn pointer-events-none ${
                  isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                }`}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. Dark Mode / Bright Mode Switch Button (Always visible on Desktop and Mobile) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center transition-all cursor-pointer focus:outline-none border rounded-none ${
                isDarkMode
                  ? 'border-[#383D3A] bg-[#1A1D1C] text-[#C5A059] hover:border-[#C5A059] hover:bg-[#242826]'
                  : 'border-[#E5DFD7] bg-[#FAF8F5] text-[#141615] hover:border-[#141615] hover:bg-[#F0EEEA]'
              }`}
              aria-label={`Switch to ${isDarkMode ? 'Bright' : 'Dark'} Mode`}
              title={`Switch to ${isDarkMode ? 'Bright' : 'Dark'} Mode`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#C5A059]" />
              ) : (
                <Moon className="w-4 h-4 text-[#141615]" />
              )}
            </button>

            {/* 4. User Profile Icon with Integrated Currency Switcher (Desktop >=1024px) */}
            <div
              className="relative hidden lg:block"
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
                className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer focus:outline-none ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
                }`}
                aria-label={
                  mounted && currentUser
                    ? `Account: ${currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`}`
                    : 'Account: Eleanor Vance'
                }
                suppressHydrationWarning
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                  person
                </span>
              </button>

              {/* User Profile Dropdown Flyout */}
              {activeDropdown === 'account' && (
                <div className={`absolute right-0 top-full mt-2 w-64 border shadow-xl p-4 z-50 animate-fadeIn normal-case transition-colors ${
                  isDarkMode ? 'bg-[#1A1D1C] border-[#2A2E2C] text-[#FAF8F5]' : 'bg-[#faf9f7] border-[#c4c7c7] text-[#1a1c1b]'
                }`}>
                  {currentUser ? (
                    <div className="flex flex-col gap-3">
                      <div className={`border-b pb-2.5 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
                        <p className={`text-body-sm font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{currentUser.name}</p>
                        <p className={`text-[11.5px] truncate ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'}`}>{currentUser.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[9.5px] uppercase tracking-wider font-semibold ${
                          isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                        }`}>
                          VIP Atelier Member
                        </span>
                      </div>

                      <button
                        onClick={() => handleNavClick('account')}
                        className={`text-left py-1 text-body-sm transition-colors flex items-center justify-between cursor-pointer ${
                          isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                        }`}
                      >
                        <span>Client Dashboard &amp; Orders</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>

                      {/* Currency Selection inside User Profile */}
                      <div className={`border-t pt-3 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
                        <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${
                          isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
                        }`}>
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
                                  ? isDarkMode
                                    ? 'border-[#C5A059] bg-[#C5A059] text-black font-bold'
                                    : 'border-[#000000] bg-[#000000] text-white font-bold'
                                  : isDarkMode
                                    ? 'border-[#383D3A] text-[#A8A49C] bg-[#141615] hover:border-[#C5A059]'
                                    : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] bg-white'
                              }`}
                            >
                              {c.symbol} {c.code}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`border-t pt-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
                        <button
                          onClick={() => {
                            logout();
                            setActiveDropdown(null);
                          }}
                          className="text-left py-1 text-body-sm text-[#c0392b] hover:underline transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className={`text-body-sm font-light ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>
                        Sign in to access your atelier orders, bespoke measurements &amp; wishlist.
                      </p>
                      <button
                        onClick={() => {
                          setIsAuthOpen(true);
                          setAuthMode('login');
                          setActiveDropdown(null);
                        }}
                        className={`w-full py-2.5 text-label-caps uppercase tracking-wider transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                            : 'bg-[#000000] text-white hover:bg-[#252726]'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsAuthOpen(true);
                          setAuthMode('signup');
                          setActiveDropdown(null);
                        }}
                        className={`w-full py-2 border text-label-caps uppercase tracking-wider transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'border-[#383D3A] text-[#FAF8F5] hover:border-[#C5A059]'
                            : 'border-[#c4c7c7] text-[#000000] hover:border-[#000000]'
                        }`}
                      >
                        Create Account
                      </button>

                      {/* Currency Selection inside User Profile when logged out */}
                      <div className={`border-t pt-3 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
                        <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${
                          isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
                        }`}>
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
                                  ? isDarkMode
                                    ? 'border-[#C5A059] bg-[#C5A059] text-black font-bold'
                                    : 'border-[#000000] bg-[#000000] text-white font-bold'
                                  : isDarkMode
                                    ? 'border-[#383D3A] text-[#A8A49C] bg-[#141615] hover:border-[#C5A059]'
                                    : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] bg-white'
                              }`}
                            >
                              {c.symbol} {c.code}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Direct link to Atelier Admin Portal */}
                      <div className={`border-t pt-2.5 mt-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
                        <a
                          href="/admin"
                          onClick={(e) => {
                            setActiveDropdown(null);
                            handleNavClick('admin');
                          }}
                          className={`text-left py-1 text-[11.5px] font-mono uppercase tracking-wider flex items-center justify-between transition-colors ${
                            isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-[#8c9a86] hover:text-[#000000]'
                          }`}
                        >
                          <span>⚙ Atelier Portal (Admin)</span>
                          <span className="material-symbols-outlined text-[15px]">lock</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. Shopping Bag (Desktop >=1024px) */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className={`hidden lg:flex relative w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center hover:opacity-60 transition-opacity cursor-pointer focus:outline-none ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
              }`}
              aria-label={
                mounted && cartCount > 0
                  ? `Shopping bag, ${cartCount} items`
                  : 'Shopping bag, 2 items'
              }
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'wght' 300" }}>
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span
                  className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-semibold flex items-center justify-center animate-scaleIn pointer-events-none ${
                    isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                  }`}
                  suppressHydrationWarning
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* 6. Mobile & Tablet Hamburger Button (<1024px) */}
            <button
              id="mobile-menu-btn"
              className={`lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
              }`}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu with search, cart, wishlist, and account"
            >
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'wght' 300" }}>
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
          className={`fixed inset-y-0 left-0 z-10 w-full max-w-[360px] shadow-2xl flex flex-col h-full transition-transform duration-300 ease-out will-change-transform ${
            isDarkMode
              ? 'bg-[#141615] border-r border-[#2A2E2C] text-[#FAF8F5]'
              : 'bg-[#faf9f7] border-r border-[#c4c7c7] text-[#1a1c1b]'
          } ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Top Header */}
          <div className={`flex justify-between items-center p-5 border-b shrink-0 ${
            isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
          }`}>
            <span
              className={`text-[20px] font-normal tracking-[0.14em] uppercase ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#1a1c1b]'
              }`}
              aria-label="Close navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Dedicated Theme Toggle Bar in Mobile Drawer */}
          <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-[#2A2E2C] bg-[#1A1D1C]' : 'border-[#e3e2e0] bg-[#FAF8F5]'}`}>
            <button
              onClick={toggleTheme}
              className={`w-full py-2 px-3 border text-xs uppercase font-mono tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-[#383D3A] bg-[#141615] text-[#FAF8F5] hover:border-[#C5A059]'
                  : 'border-[#c4c7c7] bg-white text-[#141615] hover:border-[#141615]'
              }`}
            >
              <span className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4 text-[#141615]" />}
                <span className="font-sans font-medium text-[11px]">Theme: {isDarkMode ? 'Dark Mode' : 'Bright Mode'}</span>
              </span>
              <span className="text-[10px] text-[#C5A059] font-medium tracking-normal">Switch to {isDarkMode ? 'Bright' : 'Dark'}</span>
            </button>
          </div>

          {/* Quick Utility Icon Cluster in Mobile Hamburger Menu: Search, Wishlist, Bag, Profile */}
          <div className={`grid grid-cols-4 gap-2 px-5 py-3.5 border-b shrink-0 ${
            isDarkMode ? 'border-[#2A2E2C] bg-[#161817]' : 'border-[#c4c7c7] bg-[#f4f3f1]'
          }`}>
            {/* Quick Search */}
            <button
              id="mobile-drawer-search-btn"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsSearchOpen(true);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1A1D1C] border-[#2A2E2C] text-[#FAF8F5] hover:bg-[#242826]'
                  : 'bg-white border-[#c4c7c7] text-[#000000] hover:bg-[#efeeec]'
              }`}
              aria-label="Search collections"
            >
              <span className="material-symbols-outlined text-[21px]">search</span>
              <span className="text-[10px] uppercase font-medium tracking-wider mt-1">Search</span>
            </button>

            {/* Quick Wishlist */}
            <button
              id="mobile-drawer-wishlist-btn"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsWishlistOpen(true);
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-1 border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1A1D1C] border-[#2A2E2C] text-[#FAF8F5] hover:bg-[#242826]'
                  : 'bg-white border-[#c4c7c7] text-[#000000] hover:bg-[#efeeec]'
              }`}
              aria-label="View saved wishlist"
            >
              <span className="material-symbols-outlined text-[21px]">favorite</span>
              <span className="text-[10px] uppercase font-medium tracking-wider mt-1">Wishlist</span>
              {wishlistCount > 0 && (
                <span
                  className={`absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-semibold flex items-center justify-center ${
                    isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                  }`}
                  suppressHydrationWarning
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Quick Bag */}
            <button
              id="mobile-drawer-cart-btn"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsCartOpen(true);
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-1 border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1A1D1C] border-[#2A2E2C] text-[#FAF8F5] hover:bg-[#242826]'
                  : 'bg-white border-[#c4c7c7] text-[#000000] hover:bg-[#efeeec]'
              }`}
              aria-label="View shopping bag"
            >
              <span className="material-symbols-outlined text-[21px]">shopping_bag</span>
              <span className="text-[10px] uppercase font-medium tracking-wider mt-1">Bag</span>
              {cartCount > 0 && (
                <span
                  className={`absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-semibold flex items-center justify-center ${
                    isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                  }`}
                  suppressHydrationWarning
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Account */}
            <button
              id="mobile-drawer-account-btn"
              onClick={() => {
                setIsSidebarOpen(false);
                if (!currentUser) {
                  setIsAuthOpen(true);
                  setAuthMode('login');
                } else {
                  handleNavClick('account');
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1A1D1C] border-[#2A2E2C] text-[#FAF8F5] hover:bg-[#242826]'
                  : 'bg-white border-[#c4c7c7] text-[#000000] hover:bg-[#efeeec]'
              }`}
              aria-label="User Account"
            >
              <span className="material-symbols-outlined text-[21px]">person</span>
              <span className="text-[10px] uppercase font-medium tracking-wider mt-1 truncate max-w-[55px]">
                {currentUser ? 'Profile' : 'Sign In'}
              </span>
            </button>
          </div>

          {/* Navigation Links in Exact Order */}
          <div className={`flex-grow overflow-y-auto px-6 py-6 space-y-2 divide-y ${
            isDarkMode ? 'divide-[#2A2E2C]' : 'divide-[#e3e2e0]/60'
          }`}>
            
            {/* 1. Home */}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  activePage === 'home'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  activePage === 'new-arrivals'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  activePage === 'shop'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#2b2d2c]'
                }`}
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
                <div className={`pl-4 pb-3 space-y-2 border-l-2 ml-1 my-1 animate-fadeIn ${
                  isDarkMode ? 'border-[#C5A059]' : 'border-[#000000]'
                }`}>
                  <button
                    onClick={() => handleNavClick('bedding')}
                    className={`w-full text-left py-1 text-body-sm font-medium cursor-pointer ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}
                  >
                    All Bedding
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'sheets')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
                  >
                    Sheet Sets
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'duvets')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
                  >
                    Duvet Covers
                  </button>
                  <button
                    onClick={() => handleNavClick('bedding', 'pillows')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#2b2d2c]'
                }`}
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
                <div className={`pl-4 pb-3 space-y-2 border-l-2 ml-1 my-1 animate-fadeIn ${
                  isDarkMode ? 'border-[#C5A059]' : 'border-[#000000]'
                }`}>
                  <button
                    onClick={() => handleNavClick('curtains')}
                    className={`w-full text-left py-1 text-body-sm font-medium cursor-pointer ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}
                  >
                    All Curtains &amp; Drapery
                  </button>
                  <button
                    onClick={() => handleNavClick('curtains', 'curtains')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
                  >
                    Belgian Linen Panels
                  </button>
                  <button
                    onClick={() => handleNavClick('curtains', 'sheer')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
                  >
                    Sheer Weaves
                  </button>
                  <button
                    onClick={() => handleNavClick('bespoke')}
                    className={`w-full text-left py-1 text-body-sm cursor-pointer ${
                      isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#2b2d2c] hover:text-[#000000]'
                    }`}
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  activePage === 'towels'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  activePage === 'throws-blankets'
                    ? isDarkMode ? 'text-[#FAF8F5] font-semibold' : 'text-[#000000] font-semibold'
                    : isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
                }`}
              >
                <span>Throws &amp; Blankets</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 8. Shopping Bag */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsCartOpen(true);
                }}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#2b2d2c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>Shopping Bag</span>
                </div>
                {cartCount > 0 ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                    }`}
                    suppressHydrationWarning
                  >
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                ) : (
                  <span className={`text-body-sm ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#8e908f]'}`}>Empty</span>
                )}
              </button>
            </div>

            {/* 9. My Wishlist */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsWishlistOpen(true);
                }}
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#2b2d2c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  <span>My Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-[#000000] text-white'
                  }`}>
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* 10. User Profile / Account */}
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
                className={`w-full text-left py-3 text-body-lg flex justify-between items-center cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#2b2d2c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span>{currentUser ? currentUser.name : 'Sign In / My Account'}</span>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* 11. Currency: Default GBP */}
            <div className="pt-4">
              <span className={`text-label-caps uppercase tracking-wider block mb-2 font-semibold ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
              }`}>
                Currency (Default GBP)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className={`py-2 px-2 text-label-caps border text-center transition-all cursor-pointer ${
                      currency.code === c.code
                        ? isDarkMode
                          ? 'border-[#C5A059] bg-[#C5A059] text-black font-bold'
                          : 'border-[#000000] bg-[#000000] text-white font-bold'
                        : isDarkMode
                          ? 'border-[#383D3A] text-[#A8A49C] bg-[#1A1D1C] hover:border-[#C5A059]'
                          : 'border-[#c4c7c7] text-[#2b2d2c] hover:border-[#000000] bg-white'
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Bottom Concierge & Admin */}
          <div className={`p-6 border-t shrink-0 space-y-3 ${
            isDarkMode ? 'border-[#2A2E2C] bg-[#161817]' : 'border-[#c4c7c7] bg-[#f4f3f1]'
          }`}>
            <div>
              <p className={`text-label-caps uppercase mb-1 font-semibold ${
                isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'
              }`}>Concierge Support</p>
              <a href="tel:+447738761016" className={`text-body-sm font-medium block hover:underline ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}>
                +44 7738 761016
              </a>
              <a href="mailto:boskilimited@boskilimited.info" className={`text-body-sm text-xs block mt-0.5 hover:underline ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
              }`}>
                boskilimited@boskilimited.info
              </a>
              <p className={`text-[11px] mt-1 leading-snug ${
                isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'
              }`}>
                Unit 4, Balmoral Trading Estate, 113 River Road, Barking, IG11 0EG
              </p>
            </div>

            <div className={`pt-2 border-t ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/50'}`}>
              <a
                href="/admin"
                onClick={(e) => {
                  setIsSidebarOpen(false);
                  handleNavClick('admin');
                }}
                className={`w-full py-2.5 px-3 text-label-caps tracking-wider uppercase text-[11px] flex items-center justify-center gap-2 border transition-colors ${
                  isDarkMode
                    ? 'bg-[#1A1D1C] border-[#383D3A] text-[#FAF8F5] hover:border-[#C5A059]'
                    : 'bg-[#1a1c1b] border-[#1a1c1b] text-white hover:bg-[#252726]'
                }`}
              >
                <span>⚙ Atelier Portal (Admin)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
