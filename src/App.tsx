'use client';

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { LookbookHotspots } from './components/LookbookHotspots';
import { CustomerReviews } from './components/CustomerReviews';
import { InstagramFeed } from './components/InstagramFeed';
import { Footer } from './components/Footer';
import { BespokeServicesPage } from './components/BespokeServicesPage';
import { TradeHospitalityPage } from './components/TradeHospitalityPage';
import { TheCanvasPage } from './components/TheCanvasPage';
import { CollectionPage } from './components/CollectionPage';
import { MyAccountPage } from './components/MyAccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import { NewsletterSubscription } from './components/NewsletterSubscription';

import { AllCollectionsPage } from './components/AllCollectionsPage';

// Luxury Homepage Editorial Sections
import { BrandPhilosophy } from './components/home/BrandPhilosophy';
import { CraftsmanshipSection } from './components/home/CraftsmanshipSection';
import { EditorialJournalSection } from './components/home/EditorialJournalSection';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ViewInRoomModal } from './components/ViewInRoomModal';
import { ContactModal } from './components/ContactModal';
import { Toast } from './components/Toast';

export const MainLayout: React.FC = () => {
  const { activePage, currentUser, setActivePage, isContactOpen, setIsContactOpen, isDarkMode } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
  };

  if (activePage === 'admin') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#faf9f7] text-[#1a1c1b]'}`}>
        <AdminDashboard />
        <Toast />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#faf9f7] text-[#1a1c1b]'
      }`}
      style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
    >
      {/* Navigation Header — always visible with BOSKI LIMITED on front */}
      <Header onSelectCategory={handleSelectCategory} />

      {/* Page Routing — each navbar button opens its dedicated page */}
      {activePage === 'home' && (
        <main className="flex-1 animate-fadeIn">
          {/* 1. Hero Section — 85-90vh cinematic full-screen editorial photography */}
          <HeroSlider onSelectCategory={handleSelectCategory} />

          {/* 2. Brand Philosophy — Provenance, natural fibers, and quiet luxury */}
          <BrandPhilosophy />

          {/* 3. The Textile Sanctuary — Featured Bedding Suite + 7 luxury categories */}
          <CategoryGrid onSelectCategory={handleSelectCategory} />

          {/* 4. Craftsmanship Storytelling — Loom techniques & fiber honesty */}
          <CraftsmanshipSection />

          {/* 5. Lookbook Hotspots — Interactive room view */}
          <LookbookHotspots />

          {/* 7. Editorial Journal — Magazine-grade essays on restful living */}
          <EditorialJournalSection />

          {/* 8. Customer Reviews */}
          <CustomerReviews />

          {/* 9. Instagram / UGC Visual Diary */}
          <InstagramFeed />
        </main>
      )}

      {/* All Collections Page — Full Collection Suites */}
      {activePage === 'collections' && (
        <AllCollectionsPage />
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

      {/* Account Dashboard Page — Full Editorial Architecture */}
      {activePage === 'account' && (
        <MyAccountPage />
      )}

      {/* Refined Single Subscription Component with Multi-State Validation */}
      <NewsletterSubscription />

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Overlays */}
      <ProductDetailModal />
      <ViewInRoomModal />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
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
