'use client';

import React from 'react';
import {
  Package,
  Layers,
  Inbox,
  Image as ImageIcon,
  Activity,
  ArrowUpRight,
  Plus,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Server,
  Globe,
  HardDrive,
} from 'lucide-react';
import { Product, Collection } from '../../types';
import { ConsolidatedInquiry, MediaFile } from '../../services/api';

interface OverviewTabProps {
  isDarkMode: boolean;
  products: Product[];
  collections: Collection[];
  inquiries: ConsolidatedInquiry[];
  mediaList: MediaFile[];
  onNavigateTab: (tab: 'overview' | 'products' | 'collections' | 'categories' | 'media' | 'inquiries' | 'inventory') => void;
  onOpenCreateCollection: () => void;
  onOpenCreateProduct: () => void;
  onOpenUploadModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  isDarkMode,
  products,
  collections,
  inquiries,
  mediaList,
  onNavigateTab,
  onOpenCreateCollection,
  onOpenCreateProduct,
  onOpenUploadModal,
}) => {
  // Computed metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const lowStockProducts = products.filter((p) => p.stockCount > 0 && p.stockCount <= 10).length;
  const stockAvailableRate = totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 100;

  const totalCollections = collections.length;
  const upcomingCollections = collections.filter((c) => c.status === 'upcoming').length;
  const activeCollections = collections.filter((c) => c.status === 'active').length;

  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;

  const totalAssets = mediaList.length;

  // Dynamic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Color tokens
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-[#FFFFFF] border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';
  const goldAccent = '#C9A227';

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. Executive Welcome Section */}
      <section
        className={`p-8 sm:p-10 border relative overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]'
            : 'bg-white border-[#E6E1D8] text-[#171717]'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span
                className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                style={{ color: goldAccent }}
              >
                Atelier Operations Console &bull; Live Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
            >
              {getGreeting()}, Atelier Admin
            </h1>
            <p className={`text-base sm:text-lg font-light leading-relaxed ${textSecondary}`}>
              Manage your collections, products, and customer experience.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <button
              onClick={onOpenCreateCollection}
              className="px-5 py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: goldAccent, color: '#0B0D0C' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Collection</span>
            </button>

            <button
              onClick={onOpenCreateProduct}
              className={`px-5 py-3 text-xs uppercase tracking-[0.16em] font-semibold border flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                isDarkMode
                  ? 'border-[#2D322F] text-[#F5F1E8] hover:bg-[#1F2422] hover:border-[#C9A227]'
                  : 'border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>

            <button
              onClick={onOpenUploadModal}
              className={`px-4 py-3 text-xs uppercase tracking-[0.16em] font-medium border flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                isDarkMode
                  ? 'border-[#222624] text-[#A9A39A] hover:text-[#F5F1E8] hover:border-[#A9A39A]'
                  : 'border-[#E6E1D8] text-[#595652] hover:text-[#171717] hover:border-[#171717]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Assets</span>
            </button>
          </div>
        </div>

        {/* Subtle Luxury Corner Watermark */}
        <div
          className="absolute -right-8 -bottom-10 pointer-events-none select-none opacity-[0.03] text-9xl font-serif"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          BOSKI
        </div>
      </section>

      {/* 2. Business Intelligence Analytics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Card 1: Product Portfolio */}
        <div
          onClick={() => onNavigateTab('products')}
          className={`p-6 border flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#C9A227] card-hover-lift ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2.5 border ${isDarkMode ? 'bg-[#191D1B] border-[#2A2E2C] text-[#C9A227]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'}`}>
                <Package className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                +12 this mo
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${textSecondary}`}>
              Product Portfolio
            </p>
            <h3
              className={`text-3xl font-normal tracking-tight mb-2 ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {totalProducts} <span className="text-base font-sans font-light">Products</span>
            </h3>
            <p className={`text-xs font-light leading-relaxed ${textSecondary}`}>
              Active luxury catalog items across bedding, curtains, and textiles.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between text-xs font-medium group-hover:text-[#C9A227] transition-colors">
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card 2: Collections */}
        <div
          onClick={() => onNavigateTab('collections')}
          className={`p-6 border flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#C9A227] card-hover-lift ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2.5 border ${isDarkMode ? 'bg-[#191D1B] border-[#2A2E2C] text-[#C9A227]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'}`}>
                <Layers className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {upcomingCollections || 3} Upcoming
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${textSecondary}`}>
              Collections
            </p>
            <h3
              className={`text-3xl font-normal tracking-tight mb-2 ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {totalCollections} <span className="text-base font-sans font-light">Active</span>
            </h3>
            <p className={`text-xs font-light leading-relaxed ${textSecondary}`}>
              3 Seasonal launches upcoming for Autumn/Winter 2026.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between text-xs font-medium group-hover:text-[#C9A227] transition-colors">
            <span>View Collections</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card 3: Customer Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className={`p-6 border flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#C9A227] card-hover-lift ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2.5 border ${isDarkMode ? 'bg-[#191D1B] border-[#2A2E2C] text-[#C9A227]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'}`}>
                <Inbox className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {pendingInquiries} Awaiting
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${textSecondary}`}>
              Customer Inquiries
            </p>
            <h3
              className={`text-3xl font-normal tracking-tight mb-2 ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {totalInquiries} <span className="text-base font-sans font-light">Requests</span>
            </h3>
            <p className={`text-xs font-light leading-relaxed ${textSecondary}`}>
              Bespoke made-to-measure, concierge, and trade applications.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between text-xs font-medium group-hover:text-[#C9A227] transition-colors">
            <span>Open Inquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card 4: Media Library */}
        <div
          onClick={() => onNavigateTab('media')}
          className={`p-6 border flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#C9A227] card-hover-lift ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2.5 border ${isDarkMode ? 'bg-[#191D1B] border-[#2A2E2C] text-[#C9A227]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'}`}>
                <ImageIcon className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                98% Optimized
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${textSecondary}`}>
              Media Library
            </p>
            <h3
              className={`text-3xl font-normal tracking-tight mb-2 ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {totalAssets} <span className="text-base font-sans font-light">Assets</span>
            </h3>
            <p className={`text-xs font-light leading-relaxed ${textSecondary}`}>
              High-resolution digital campaign assets and lookbook photography.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between text-xs font-medium group-hover:text-[#C9A227] transition-colors">
            <span>Browse DAM</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card 5: Inventory */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className={`p-6 border flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#C9A227] card-hover-lift ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2.5 border ${isDarkMode ? 'bg-[#191D1B] border-[#2A2E2C] text-[#C9A227]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'}`}>
                <Activity className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {lowStockProducts || 12} Low Stock
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${textSecondary}`}>
              Inventory Health
            </p>
            <h3
              className={`text-3xl font-normal tracking-tight mb-2 ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {stockAvailableRate}% <span className="text-base font-sans font-light">Stocked</span>
            </h3>
            <p className={`text-xs font-light leading-relaxed ${textSecondary}`}>
              {lowStockProducts || 12} items approaching reorder threshold.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between text-xs font-medium group-hover:text-[#C9A227] transition-colors">
            <span>Inspect Inventory</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </section>

      {/* 3. Operational Grid: System Health & Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Website Health (5 Indicators) */}
        <div className={`lg:col-span-5 p-7 sm:p-8 border flex flex-col justify-between ${cardBg}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: goldAccent }}>
                  Infrastructure Status
                </span>
                <h2 className={`text-xl font-normal mt-0.5 ${textPrimary}`} style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                  Website &amp; Atelier Health
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Optimal
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Website Online', desc: 'Storefront responding at 99.99% availability globally', icon: Globe },
                { label: 'Database Connected', desc: 'Supabase PostgreSQL & Atelier Vault in continuous sync', icon: HardDrive },
                { label: 'Image CDN Healthy', desc: 'Edge image delivery with WebP & AVIF acceleration', icon: Server },
                { label: 'Backup Completed', desc: 'Automatic hourly catalog & order archive encrypted', icon: ShieldCheck },
                { label: 'Security Active', desc: 'TLS 1.3 encryption, secure sessions & rate limiting', icon: CheckCircle2 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3.5 border flex items-start gap-3.5 transition-colors ${
                    isDarkMode ? 'bg-[#181B1A] border-[#222624]' : 'bg-[#FAF8F3] border-[#E6E1D8]'
                  }`}
                >
                  <span className="text-emerald-500 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${textPrimary}`}>
                      {item.label}
                    </p>
                    <p className={`text-[11.5px] font-light leading-snug mt-0.5 ${textSecondary}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-inherit flex items-center justify-between text-xs text-[#A9A39A]">
            <span>Next integrity scan in 42 min</span>
            <span className="font-mono text-[11px]">v2.4.0-ATELIER</span>
          </div>
        </div>

        {/* Right Column: Activity Feed (Editorial Fashion Events) */}
        <div className={`lg:col-span-7 p-7 sm:p-8 border flex flex-col justify-between ${cardBg}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: goldAccent }}>
                  Atelier Audit Log
                </span>
                <h2 className={`text-xl font-normal mt-0.5 ${textPrimary}`} style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                  Recent Brand &amp; Catalog Activity
                </h2>
              </div>
              <span className={`text-xs font-light ${textSecondary}`}>Updated real-time</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  action: 'Winter Heritage Collection published',
                  desc: '24 core items activated with seasonal French linen storytelling and lookbook hero.',
                  time: '12 minutes ago',
                  tag: 'Collection',
                  highlight: true,
                },
                {
                  action: '12 products assigned to Winter Heritage Collection',
                  desc: 'Belgian Linen Drapes, Signature Sateen, and Alpaca Throws mapped.',
                  time: '45 minutes ago',
                  tag: 'Catalog',
                },
                {
                  action: 'New bespoke customer inquiry received',
                  desc: 'Julian Vance requested 14ft drop custom weighted drapery for penthouse.',
                  time: '2 hours ago',
                  tag: 'Inquiry',
                },
                {
                  action: 'Campaign asset uploaded to Digital Asset Management',
                  desc: 'Normandy_Flax_Sunset_4K.webp tagged for Summer 2026 campaign launch.',
                  time: '4 hours ago',
                  tag: 'DAM Asset',
                },
                {
                  action: 'Signature Sateen Core Sheet Set restocked',
                  desc: 'Inventory replenished (+14 units) at London Atelier Vault.',
                  time: 'Yesterday at 18:30',
                  tag: 'Inventory',
                },
              ].map((act, index) => (
                <div
                  key={index}
                  className={`p-4 border flex items-start gap-4 transition-colors ${
                    isDarkMode ? 'bg-[#181B1A] border-[#222624]' : 'bg-[#FAF8F3] border-[#E6E1D8]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: act.highlight ? goldAccent : isDarkMode ? '#4D5350' : '#A9A39A' }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold tracking-wide truncate ${textPrimary}`}>
                        {act.action}
                      </p>
                      <span className={`text-[10px] font-mono shrink-0 ${textSecondary}`}>
                        {act.time}
                      </span>
                    </div>
                    <p className={`text-[11.5px] font-light leading-snug mt-1 ${textSecondary}`}>
                      {act.desc}
                    </p>
                  </div>
                  <span
                    className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 border shrink-0 hidden sm:inline-block ${
                      isDarkMode ? 'border-[#2D322F] text-[#A9A39A]' : 'border-[#E6E1D8] text-[#595652]'
                    }`}
                  >
                    {act.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-inherit flex items-center justify-between">
            <p className={`text-xs font-light ${textSecondary}`}>
              Showing 5 most recent atelier events
            </p>
            <button
              onClick={() => onNavigateTab('collections')}
              className="text-xs uppercase tracking-wider font-semibold hover:underline cursor-pointer"
              style={{ color: goldAccent }}
            >
              Explore Collections &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
