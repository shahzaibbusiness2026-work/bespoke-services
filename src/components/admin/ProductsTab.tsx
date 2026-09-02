'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  ChevronDown,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Sliders,
  Tag,
} from 'lucide-react';
import { Product, Collection } from '../../types';

interface ProductsTabProps {
  products: Product[];
  collections: Collection[];
  isDarkMode: boolean;
  onOpenCreateProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => void;
  onQuickAdjustStock: (id: string, newStock: number) => void;
  onBulkUpdateStatus: (ids: string[], inStock: boolean) => void;
  onBulkAssignCollection: (ids: string[], collectionId: string) => void;
  onBulkDelete: (ids: string[]) => void;
  initialCollectionFilter?: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  collections,
  isDarkMode,
  onOpenCreateProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onQuickAdjustStock,
  onBulkUpdateStatus,
  onBulkAssignCollection,
  onBulkDelete,
  initialCollectionFilter = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(initialCollectionFilter);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'stock' | 'updated'>('updated');

  // Bulk selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkCollectionId, setBulkCollectionId] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Search
    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q);

    // Collection filter (support array of collectionIds)
    const pColIds = p.collectionIds || [];
    const matchesCol =
      selectedCollection === 'all' ||
      pColIds.includes(selectedCollection) ||
      (selectedCollection === 'unassigned' && pColIds.length === 0);

    // Category
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    // Availability
    let matchesAvail = true;
    if (selectedAvailability === 'instock') matchesAvail = p.inStock && p.stockCount > 10;
    if (selectedAvailability === 'lowstock') matchesAvail = p.stockCount > 0 && p.stockCount <= 10;
    if (selectedAvailability === 'outofstock') matchesAvail = !p.inStock || p.stockCount === 0;

    // Season
    const matchesSeason = selectedSeason === 'all' || (p.season && p.season.toLowerCase() === selectedSeason.toLowerCase());

    // Status
    const matchesStatus = selectedStatus === 'all' || (p.status || 'active').toLowerCase() === selectedStatus.toLowerCase();

    return matchesQ && matchesCol && matchesCat && matchesAvail && matchesSeason && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'stock':
        return a.stockCount - b.stockCount;
      case 'updated':
      default:
        return (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) - (a.updatedAt ? new Date(a.updatedAt).getTime() : 0);
    }
  });

  // Select all / toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(sortedProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]));
  };

  // Color tokens
  const gold = '#C9A227';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  // Category labels list
  const categoryOptions = [
    'all',
    'bedding',
    'sheets',
    'duvets',
    'curtains',
    'towels',
    'throws',
    'blankets',
    'pillows',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Create Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
            Master Atelier Catalog &bull; Inventory Matrix
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-normal tracking-tight ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Product Management
          </h2>
          <p className={`text-sm font-light ${textSecondary}`}>
            Editorial catalog administration with multi-collection attribution and live stock control.
          </p>
        </div>

        <button
          onClick={onOpenCreateProduct}
          className="px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] self-start md:self-auto"
          style={{ backgroundColor: gold, color: '#0B0D0C' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 sm:p-5 border space-y-4 ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, or material..."
              className={`w-full pl-10 pr-4 py-2 text-xs border outline-none rounded-none transition-colors ${
                isDarkMode
                  ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                  : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717] focus:border-black'
              }`}
            />
          </div>

          {/* Collection Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className={`w-full px-3 py-2 text-xs border outline-none rounded-none cursor-pointer ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2 text-xs border outline-none rounded-none cursor-pointer ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className={`w-full px-3 py-2 text-xs border outline-none rounded-none cursor-pointer ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <option value="all">All Availability</option>
              <option value="instock">In Stock (&gt;10 units)</option>
              <option value="lowstock">Low Stock (1-10 units)</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Season, Status, Sort & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-inherit text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] opacity-70">Filters:</span>

            {/* Season */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className={`px-2.5 py-1 text-xs border outline-none rounded-none ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <option value="all">All Seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-2.5 py-1 text-xs border outline-none rounded-none ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] opacity-70">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-2.5 py-1 text-xs border outline-none rounded-none font-medium ${
                isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock">Stock Quantity</option>
            </select>

            <span className="font-mono text-[11px] px-2 py-0.5 border border-inherit">
              {sortedProducts.length} Items
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedProductIds.length > 0 && (
        <div
          className={`p-3.5 border flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
            isDarkMode ? 'bg-[#191F1C] border-[#C9A227] text-white' : 'bg-[#FAF6EC] border-[#C9A227] text-black'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-ping" />
            <span className="text-xs font-mono font-bold">
              {selectedProductIds.length} Products Selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onBulkUpdateStatus(selectedProductIds, true)}
              className="px-3 py-1.5 text-xs font-semibold uppercase border border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
            >
              Mark In Stock
            </button>

            <button
              onClick={() => onBulkUpdateStatus(selectedProductIds, false)}
              className="px-3 py-1.5 text-xs font-semibold uppercase border border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
            >
              Mark Out of Stock
            </button>

            <div className="flex items-center gap-1">
              <select
                value={bulkCollectionId}
                onChange={(e) => setBulkCollectionId(e.target.value)}
                className={`px-2 py-1.5 text-xs border outline-none ${
                  isDarkMode ? 'bg-[#141716] border-[#2E3330] text-white' : 'bg-white border-[#E6E1D8] text-black'
                }`}
              >
                <option value="">Select Collection to Assign...</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                disabled={!bulkCollectionId}
                onClick={() => {
                  if (bulkCollectionId) {
                    onBulkAssignCollection(selectedProductIds, bulkCollectionId);
                    setBulkCollectionId('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold uppercase border hover:bg-[#C9A227] hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
              >
                Assign
              </button>
            </div>

            <button
              onClick={() => onBulkDelete(selectedProductIds)}
              className="px-3 py-1.5 text-xs font-semibold uppercase border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              Delete Selected
            </button>

            <button
              onClick={() => setSelectedProductIds([])}
              className="text-xs uppercase underline ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Editorial Luxury Product Table */}
      {sortedProducts.length > 0 ? (
        <div className={`border overflow-x-auto ${cardBg}`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b uppercase tracking-wider font-semibold ${
                  isDarkMode ? 'bg-[#181B1A] border-[#222624] text-[#A9A39A]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#595652]'
                }`}
              >
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProductIds.length === sortedProducts.length && sortedProducts.length > 0}
                    className="w-4 h-4 rounded-none accent-[#C9A227]"
                  />
                </th>
                <th className="p-4 w-20">Media</th>
                <th className="p-4 min-w-[200px]">Product &amp; SKU</th>
                <th className="p-4 min-w-[150px]">Collection</th>
                <th className="p-4 min-w-[110px]">Category</th>
                <th className="p-4 min-w-[150px]">Material</th>
                <th className="p-4 min-w-[100px]">Price</th>
                <th className="p-4 min-w-[110px]">Stock</th>
                <th className="p-4 min-w-[100px]">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {sortedProducts.map((prod) => {
                const isSelected = selectedProductIds.includes(prod.id);
                const assignedCollections = collections.filter((c) =>
                  (prod.collectionIds || []).includes(c.id)
                );

                return (
                  <tr
                    key={prod.id}
                    className={`transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/5 ${
                      isSelected ? (isDarkMode ? 'bg-[#1C221F]' : 'bg-[#FAF6EC]') : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(prod.id)}
                        className="w-4 h-4 rounded-none accent-[#C9A227]"
                      />
                    </td>

                    {/* Image */}
                    <td className="p-4">
                      <div className="w-14 h-14 bg-gray-200 border border-inherit overflow-hidden shrink-0">
                        <img
                          src={prod.colors?.[0]?.image || prod.images?.[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name & SKU */}
                    <td className="p-4">
                      <p className={`font-medium text-sm leading-snug ${textPrimary}`}>{prod.name}</p>
                      <span className="font-mono text-[10.5px] opacity-65">{prod.sku}</span>
                    </td>

                    {/* Collection Badges (Multi-collection supported) */}
                    <td className="p-4">
                      {assignedCollections.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedCollections.map((col) => (
                            <span
                              key={col.id}
                              className="px-2 py-0.5 text-[9.5px] uppercase font-mono tracking-wider border rounded-none"
                              style={{
                                borderColor: `${gold}40`,
                                backgroundColor: `${gold}15`,
                                color: isDarkMode ? '#F5F1E8' : '#171717',
                              }}
                            >
                              {col.name.replace(' Collection', '')}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10.5px] font-mono opacity-40 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="uppercase font-mono text-[11px] tracking-wider px-2 py-0.5 border border-inherit bg-black/5 dark:bg-white/5">
                        {prod.category}
                      </span>
                    </td>

                    {/* Material */}
                    <td className="p-4">
                      <p className="text-xs font-light truncate max-w-[160px]" title={prod.material || prod.fabric}>
                        {prod.material || prod.fabric || 'Natural European Flax'}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-medium text-sm">
                      ${prod.price}
                    </td>

                    {/* Stock with quick +/- buttons */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickAdjustStock(prod.id, Math.max(0, prod.stockCount - 1))}
                          className="w-5 h-5 border border-inherit flex items-center justify-center font-mono hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono text-xs font-bold ${
                            prod.stockCount <= 5
                              ? 'text-red-500'
                              : prod.stockCount <= 10
                              ? 'text-amber-500'
                              : textPrimary
                          }`}
                        >
                          {prod.stockCount}
                        </span>
                        <button
                          onClick={() => onQuickAdjustStock(prod.id, prod.stockCount + 1)}
                          className="w-5 h-5 border border-inherit flex items-center justify-center font-mono hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {prod.inStock && prod.stockCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenEditProduct(prod)}
                          className={`p-2 border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                            isDarkMode ? 'border-[#2D322F]' : 'border-[#E6E1D8]'
                          }`}
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteProduct(prod.id, prod.name)}
                          className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className={`p-12 sm:p-16 border text-center space-y-4 max-w-xl mx-auto ${cardBg}`}>
          <span className="w-14 h-14 mx-auto border flex items-center justify-center border-[#C9A227] text-[#C9A227]">
            <Package className="w-7 h-7" />
          </span>
          <h3
            className={`text-2xl font-normal ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            No Products Match Filter
          </h3>
          <p className={`text-xs font-light leading-relaxed max-w-md mx-auto ${textSecondary}`}>
            Adjust your collection, category, or search filters to inspect products, or create a new catalog piece.
          </p>
          <button
            onClick={onOpenCreateProduct}
            className="mt-4 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            style={{ backgroundColor: gold, color: '#0B0D0C' }}
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </button>
        </div>
      )}
    </div>
  );
};
