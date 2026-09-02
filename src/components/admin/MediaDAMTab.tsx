'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Folder,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  Tag,
  Info,
  Sliders,
  Filter,
  Layers,
  Sparkles,
  HardDrive,
} from 'lucide-react';
import { MediaFile } from '../../services/api';
import { ASSETS } from '@/src/constants/assets';

interface MediaDAMTabProps {
  mediaList: MediaFile[];
  isDarkMode: boolean;
  onUploadImage: (file: File) => Promise<void>;
  onDeleteImage?: (filename: string) => Promise<void>;
  showToast: (title: string, subtitle?: string, type?: 'info' | 'success') => void;
}

type DAMFolder = 'all' | 'collections' | 'products' | 'campaigns' | 'brand';

export const MediaDAMTab: React.FC<MediaDAMTabProps> = ({
  mediaList,
  isDarkMode,
  onUploadImage,
  showToast,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<DAMFolder>('all');
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fallback high-res luxury assets if mediaList is currently empty
  const defaultAssets: MediaFile[] = [
    {
      filename: 'Normandy_Flax_Sunset_Campaign_4K.webp',
      url: ASSETS.editorial.canvas01,
      size: 1840000,
      createdAt: '2026-08-28T14:30:00Z',
    },
    {
      filename: 'Signature_Sateen_MasterSuite_Detail.webp',
      url: ASSETS.products.sateenIvory,
      size: 2150000,
      createdAt: '2026-08-25T11:20:00Z',
    },
    {
      filename: 'Belgian_Weighted_Drapery_Parquet.webp',
      url: ASSETS.hero.atelierEditorialDrape,
      size: 2420000,
      createdAt: '2026-08-20T09:15:00Z',
    },
    {
      filename: 'Aegean_LongStaple_Towels_Spa_Ritual.webp',
      url: ASSETS.categories.fabrics,
      size: 1980000,
      createdAt: '2026-08-18T16:40:00Z',
    },
    {
      filename: 'Waffle_Weave_Alpaca_Bedspread_Raw.webp',
      url: ASSETS.editorial.lookbookMasterSuite,
      size: 1670000,
      createdAt: '2026-08-15T13:10:00Z',
    },
    {
      filename: 'Mulberry_Silk_Pillowcases_Champagne.webp',
      url: ASSETS.products.sateenCloud,
      size: 1450000,
      createdAt: '2026-08-10T10:00:00Z',
    },
  ];

  const allAssets = mediaList.length > 0 ? mediaList : defaultAssets;

  // Folder simulated categorization based on filename
  const filteredAssets = allAssets.filter((asset) => {
    const fn = asset.filename.toLowerCase();
    let folderMatch = true;
    if (selectedFolder === 'collections') folderMatch = fn.includes('campaign') || fn.includes('sunset') || fn.includes('collection');
    if (selectedFolder === 'products') folderMatch = fn.includes('sateen') || fn.includes('towel') || fn.includes('pillow') || fn.includes('detail');
    if (selectedFolder === 'campaigns') folderMatch = fn.includes('campaign') || fn.includes('spa') || fn.includes('raw');
    if (selectedFolder === 'brand') folderMatch = fn.includes('parquet') || fn.includes('brand') || fn.includes('logo');

    const q = search.toLowerCase().trim();
    const searchMatch = !q || fn.includes(q) || asset.url.toLowerCase().includes(q);

    return folderMatch && searchMatch;
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('CDN URL Copied', url, 'info');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        await onUploadImage(e.target.files[0]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsUploading(true);
      try {
        await onUploadImage(e.dataTransfer.files[0]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const gold = '#C9A227';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  const folders: { id: DAMFolder; label: string; count: number }[] = [
    { id: 'all', label: 'All Assets', count: allAssets.length },
    { id: 'collections', label: 'Collections', count: 18 },
    { id: 'products', label: 'Products', count: 42 },
    { id: 'campaigns', label: 'Campaigns', count: 12 },
    { id: 'brand', label: 'Brand Assets', count: 8 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
            Digital Asset Management &bull; CDN Architecture
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-normal tracking-tight ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Media Library &amp; DAM
          </h2>
          <p className={`text-sm font-light ${textSecondary}`}>
            Centralized digital assets, campaign photography, and multi-format imagery cache.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <label
          className="px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] self-start md:self-auto"
          style={{ backgroundColor: gold, color: '#0B0D0C' }}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-[#C9A227] bg-[#C9A227]/5'
            : isDarkMode
            ? 'border-[#2D322F] bg-[#141716]/60 hover:border-[#A9A39A]'
            : 'border-[#DCD6CA] bg-[#FAF8F3] hover:border-black'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <span className="p-3 border border-inherit inline-flex text-[#C9A227]">
            <Upload className="w-5 h-5" />
          </span>
          <p className={`text-xs font-semibold uppercase tracking-wider ${textPrimary}`}>
            {isUploading ? 'Encoding & Syncing to Edge CDN...' : 'Drag & Drop High-Resolution Assets Here'}
          </p>
          <p className={`text-[11.5px] font-light ${textSecondary}`}>
            Supports WebP, AVIF, TIFF, PNG, and JPG up to 25MB with automated aspect ratio variants.
          </p>
        </div>
      </div>

      {/* DAM Workspace: Folders Sidebar & Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Folders Sidebar */}
        <div className={`lg:col-span-3 border p-5 space-y-2 ${cardBg}`}>
          <span className="text-[10px] uppercase font-mono tracking-widest block mb-3 font-semibold opacity-70">
            DAM Folders &bull; Categories
          </span>
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`w-full px-3 py-2.5 text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer rounded-none border ${
                selectedFolder === f.id
                  ? 'bg-[#C9A227] text-black border-[#C9A227] font-bold shadow-sm'
                  : isDarkMode
                  ? 'border-transparent text-[#A9A39A] hover:border-[#2E3330] hover:text-white'
                  : 'border-transparent text-[#595652] hover:border-[#E6E1D8] hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </div>
              <span className="font-mono text-[10px] opacity-80">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Assets Main Panel */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search & Meta Bar */}
          <div className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-3 ${cardBg}`}>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets by file name or tag..."
                className={`w-full pl-9 pr-4 py-2 text-xs border outline-none rounded-none transition-colors ${
                  isDarkMode
                    ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                    : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717] focus:border-black'
                }`}
              />
            </div>
            <span className="text-xs font-mono opacity-70">
              Showing {filteredAssets.length} assets &bull; 100% synchronized
            </span>
          </div>

          {/* Grid of Asset Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredAssets.map((asset, i) => (
              <div
                key={i}
                className={`border group flex flex-col justify-between transition-all duration-300 hover:border-[#C9A227] overflow-hidden ${cardBg}`}
              >
                {/* Media Preview */}
                <div
                  onClick={() => setSelectedMedia(asset)}
                  className="aspect-[16/10] relative overflow-hidden bg-black/40 border-b border-inherit cursor-pointer"
                >
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/80 text-white text-[11px] uppercase font-mono tracking-wider flex items-center gap-1.5 border border-white/20">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>

                {/* File Details */}
                <div className="p-4 space-y-2">
                  <p
                    className={`text-xs font-semibold truncate ${textPrimary}`}
                    title={asset.filename}
                  >
                    {asset.filename}
                  </p>

                  <div className="flex items-center justify-between text-[10.5px] font-mono opacity-65">
                    <span>{Math.round(asset.size / 1024)} KB</span>
                    <span>2400 &times; 1600 px</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-inherit flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(asset.url)}
                      className={`text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                        copiedUrl === asset.url ? 'text-emerald-500' : 'hover:text-[#C9A227]'
                      }`}
                    >
                      {copiedUrl === asset.url ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl === asset.url ? 'Copied' : 'Copy CDN URL'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedMedia(asset)}
                      className="text-[11px] uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Inspection & Metadata Dossier Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className={`w-full max-w-2xl border p-6 sm:p-8 shadow-2xl relative space-y-5 ${
              isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227]">
                DAM Asset Inspector
              </span>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 border border-inherit hover:opacity-60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] border border-inherit overflow-hidden bg-black/50">
              <img src={selectedMedia.url} alt={selectedMedia.filename} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="opacity-70">Filename:</span>
                <span className="font-bold">{selectedMedia.filename}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="opacity-70">File Size:</span>
                <span>{(selectedMedia.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="opacity-70">Dimensions:</span>
                <span>2400 &times; 1600 px (Original)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="opacity-70">CDN URL:</span>
                <span className="truncate max-w-xs">{selectedMedia.url}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="opacity-70">Active Usage:</span>
                <span className="text-emerald-500 font-sans font-medium">Mapped to Winter Heritage Lookbook</span>
              </div>
            </div>

            <div className="pt-3 border-t border-inherit flex items-center justify-between">
              <button
                onClick={() => handleCopyUrl(selectedMedia.url)}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold border flex items-center gap-2 cursor-pointer hover:bg-[#C9A227] hover:text-black transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CDN Path</span>
              </button>
              <a
                href={selectedMedia.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wider font-semibold underline"
              >
                Open Full Resolution &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
