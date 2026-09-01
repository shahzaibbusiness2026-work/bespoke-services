import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCatalog } from './components/ProductCatalog';
import { LookbookHotspots } from './components/LookbookHotspots';
import { CountdownBanner } from './components/CountdownBanner';
import { CustomerReviews } from './components/CustomerReviews';
import { InstagramFeed } from './components/InstagramFeed';
import { Footer } from './components/Footer';
import { BespokeServicesPage } from './components/BespokeServicesPage';
import { TradeHospitalityPage } from './components/TradeHospitalityPage';
import { TheCanvasPage } from './components/TheCanvasPage';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ViewInRoomModal } from './components/ViewInRoomModal';
import { Toast } from './components/Toast';

const MainLayout: React.FC = () => {
  const { activePage, currentUser, setActivePage } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div
      className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex flex-col"
      style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
    >
      {/* Navigation Header — always visible */}
      <Header onSelectCategory={handleSelectCategory} />

      {/* Page Content — driven by activePage state */}
      {activePage === 'home' && (
        <main className="flex-1">
          {/* Hero Section — 85vh full-bleed bedroom image */}
          <HeroSlider onSelectCategory={handleSelectCategory} />

          {/* Category Grid / Bento Grid */}
          <CategoryGrid onSelectCategory={handleSelectCategory} />

          {/* Product Catalog — filterable 4-column grid */}
          <ProductCatalog
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Lookbook Hotspots */}
          <LookbookHotspots />

          {/* Limited Drop Countdown Banner */}
          <CountdownBanner />

          {/* Customer Reviews */}
          <CustomerReviews />

          {/* Instagram / UGC Feed */}
          <InstagramFeed />
        </main>
      )}

      {activePage === 'bespoke' && (
        <BespokeServicesPage />
      )}

      {activePage === 'trade' && (
        <TradeHospitalityPage />
      )}

      {activePage === 'canvas' && (
        <TheCanvasPage />
      )}

      {activePage === 'account' && (
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 md:px-16 py-16">
          {currentUser ? (
            <>
              <h1
                className="text-[48px] leading-[56px] tracking-[0.01em] text-[#000000] mb-4"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
              >
                Welcome, {currentUser.firstName}
              </h1>
              <p className="text-body-md text-[#444748] mb-12">{currentUser.email}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border border-[#c4c7c7] p-8">
                  <p className="text-label-caps text-[#444748] mb-2">VIP Status</p>
                  <p className="text-headline-sm text-[#000000]" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                    {currentUser.vipTier}
                  </p>
                </div>
                <div className="border border-[#c4c7c7] p-8">
                  <p className="text-label-caps text-[#444748] mb-2">Member Since</p>
                  <p className="text-headline-sm text-[#000000]" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                    {currentUser.joinedDate}
                  </p>
                </div>
                <div className="border border-[#c4c7c7] p-8">
                  <p className="text-label-caps text-[#444748] mb-2">Points Balance</p>
                  <p className="text-headline-sm text-[#000000]" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                    {currentUser.pointsBalance.toLocaleString()} pts
                  </p>
                </div>
              </div>
              <div className="mt-16">
                <h2
                  className="text-headline-sm text-[#000000] mb-8"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Your Addresses
                </h2>
                {currentUser.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentUser.addresses.map((addr) => (
                      <div key={addr.id} className="border border-[#c4c7c7] p-6">
                        {addr.isDefault && (
                          <span className="text-label-caps text-[#675d50] mb-2 block">Default</span>
                        )}
                        <p className="text-body-md text-[#000000]">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-body-sm text-[#444748]">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-body-sm text-[#444748]">{addr.addressLine2}</p>}
                        <p className="text-body-sm text-[#444748]">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-body-sm text-[#444748]">{addr.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-md text-[#444748]">No addresses saved yet.</p>
                )}
              </div>
              <div className="mt-16 flex gap-4">
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0 }); }}
                  className="px-8 py-4 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => setActivePage('bespoke')}
                  className="px-8 py-4 border border-[#c4c7c7] text-[#000000] text-label-caps hover:bg-[#f4f3f1] transition-colors"
                >
                  Request Bespoke Service
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <h1
                className="text-headline-lg text-[#000000] mb-4"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Sign In to Continue
              </h1>
              <p className="text-body-md text-[#444748] mb-8">
                Access your orders, addresses, and wishlist.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Overlays */}
      <ProductDetailModal />
      <ViewInRoomModal />
      <AuthModal />
      <SizeGuideModal />
      <SearchModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
