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
import { CollectionPage } from './components/CollectionPage';
import { NewsletterSubscription } from './components/NewsletterSubscription';

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
      {/* Navigation Header — always visible with BOSKI LIMITED on front */}
      <Header onSelectCategory={handleSelectCategory} />

      {/* Page Routing — each navbar button opens its dedicated page */}
      {activePage === 'home' && (
        <main className="flex-1 animate-fadeIn">
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

      {/* Dedicated Collection Pages for each Navbar button */}
      {activePage === 'new-arrivals' && (
        <CollectionPage pageType="new-arrivals" />
      )}

      {activePage === 'shop' && (
        <CollectionPage pageType="shop" />
      )}

      {activePage === 'bedding' && (
        <CollectionPage pageType="bedding" />
      )}

      {activePage === 'curtains' && (
        <CollectionPage pageType="curtains" />
      )}

      {activePage === 'towels' && (
        <CollectionPage pageType="towels" />
      )}

      {activePage === 'throws-blankets' && (
        <CollectionPage pageType="throws-blankets" />
      )}

      {activePage === 'throws' && (
        <CollectionPage pageType="throws" />
      )}

      {activePage === 'blankets' && (
        <CollectionPage pageType="blankets" />
      )}

      {/* Bespoke Services Page */}
      {activePage === 'bespoke' && (
        <BespokeServicesPage />
      )}

      {/* Trade & Hospitality Page */}
      {activePage === 'trade' && (
        <TradeHospitalityPage />
      )}

      {/* The Canvas (Journal / Our Story) */}
      {activePage === 'canvas' && (
        <TheCanvasPage />
      )}

      {/* Account Dashboard Page */}
      {activePage === 'account' && (
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 md:px-16 py-16 animate-fadeIn">
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
                <div className="border border-[#c4c7c7] p-8 bg-[#ffffff]">
                  <p className="text-label-caps text-[#444748] mb-2">VIP Status</p>
                  <p className="text-headline-sm text-[#000000]" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                    {currentUser.vipTier}
                  </p>
                </div>
                <div className="border border-[#c4c7c7] p-8 bg-[#ffffff]">
                  <p className="text-label-caps text-[#444748] mb-2">Member Since</p>
                  <p className="text-headline-sm text-[#000000]" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                    {currentUser.joinedDate}
                  </p>
                </div>
                <div className="border border-[#c4c7c7] p-8 bg-[#ffffff]">
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
                      <div key={addr.id} className="border border-[#c4c7c7] p-6 bg-[#ffffff]">
                        {addr.isDefault && (
                          <span className="text-label-caps text-[#675d50] mb-2 block font-semibold">Default</span>
                        )}
                        <p className="text-body-md text-[#000000] font-medium">
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
              <div className="mt-16 flex flex-wrap gap-4">
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-8 py-4 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => { setActivePage('bespoke'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-8 py-4 border border-[#c4c7c7] text-[#000000] text-label-caps hover:bg-[#f4f3f1] transition-colors"
                >
                  Request Bespoke Service
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#c4c7c7] p-12">
              <h1
                className="text-headline-lg text-[#000000] mb-4"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Sign In to Continue
              </h1>
              <p className="text-body-md text-[#444748] mb-8">
                Access your orders, addresses, and wishlist.
              </p>
              <button
                onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-8 py-3.5 bg-[#000000] text-white text-label-caps"
              >
                Return to Home
              </button>
            </div>
          )}
        </main>
      )}

      {/* Refined Single Subscription Component with Multi-State Validation */}
      <NewsletterSubscription />

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
