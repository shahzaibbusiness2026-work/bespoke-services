'use client';

import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { Product } from '../../types';

interface InventoryTabProps {
  products: Product[];
  isDarkMode: boolean;
  onQuickAdjustStock: (id: string, newStock: number) => void;
  onOpenEditProduct: (p: Product) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  isDarkMode,
  onQuickAdjustStock,
  onOpenEditProduct,
}) => {
  const [search, setSearch] = useState('');
  const [filterStockState, setFilterStockState] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  // Metrics
  const totalUnits = products.reduce((acc, p) => acc + (p.stockCount || 0), 0);
  const lowStockItems = products.filter((p) => p.stockCount > 0 && p.stockCount <= 10);
  const outOfStockItems = products.filter((p) => !p.inStock || p.stockCount === 0);
  const healthyStockItems = products.filter((p) => p.stockCount > 10);
  const totalValuation = products.reduce((acc, p) => acc + p.price * (p.stockCount || 0), 0);

  const filteredProducts = products.filter((p) => {
    let stateMatch = true;
    if (filterStockState === 'low') stateMatch = p.stockCount > 0 && p.stockCount <= 10;
    if (filterStockState === 'out') stateMatch = !p.inStock || p.stockCount === 0;
    if (filterStockState === 'healthy') stateMatch = p.stockCount > 10;

    const q = search.toLowerCase().trim();
    const searchMatch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    return stateMatch && searchMatch;
  });

  const gold = '#C9A227';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
            Supply Chain &bull; Vault Inventory
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-normal tracking-tight ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Inventory Oversight
          </h2>
          <p className={`text-sm font-light ${textSecondary}`}>
            Real-time atelier stock telemetry, reorder thresholds, and warehouse valuation.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Units */}
        <div className={`p-6 border flex flex-col justify-between ${cardBg}`}>
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold opacity-70 block mb-1">
              Catalog Physical Units
            </span>
            <h3
              className={`text-3xl font-normal tracking-tight ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {totalUnits} <span className="text-sm font-sans font-light">Units</span>
            </h3>
            <p className={`text-xs font-light mt-1 ${textSecondary}`}>
              Across {products.length} distinct atelier SKU variations.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-inherit text-[11px] font-mono text-emerald-500">
            &bull; Live synchronized with atelier warehouse
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setFilterStockState('low')}
          className={`p-6 border flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-amber-500 ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-amber-500">
                Low Stock Warning
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <h3
              className="text-3xl font-normal tracking-tight text-amber-500"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {lowStockItems.length} <span className="text-sm font-sans font-light">Lines</span>
            </h3>
            <p className={`text-xs font-light mt-1 ${textSecondary}`}>
              Items with fewer than 10 units remaining in stock.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-inherit text-[11px] font-mono opacity-70">
            Click to isolate low stock items
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setFilterStockState('out')}
          className={`p-6 border flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-red-500 ${cardBg}`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-red-400">
                Sold Out Lines
              </span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <h3
              className="text-3xl font-normal tracking-tight text-red-400"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {outOfStockItems.length} <span className="text-sm font-sans font-light">Sold Out</span>
            </h3>
            <p className={`text-xs font-light mt-1 ${textSecondary}`}>
              Currently unavailable for online client checkout.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-inherit text-[11px] font-mono opacity-70">
            Click to review sold out lines
          </div>
        </div>

        {/* Valuation */}
        <div className={`p-6 border flex flex-col justify-between ${cardBg}`}>
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold opacity-70 block mb-1">
              Current Vault Valuation
            </span>
            <h3
              className={`text-3xl font-normal tracking-tight ${textPrimary}`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              ${totalValuation.toLocaleString()}
            </h3>
            <p className={`text-xs font-light mt-1 ${textSecondary}`}>
              Total retail inventory value currently stocked.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-inherit text-[11px] font-mono text-[#C9A227]">
            &bull; Assessed at active retail prices
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 sm:p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Items (${products.length})` },
            { id: 'low', label: `Low Stock (${lowStockItems.length})` },
            { id: 'out', label: `Sold Out (${outOfStockItems.length})` },
            { id: 'healthy', label: `Healthy (${healthyStockItems.length})` },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStockState(st.id as any)}
              className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-none border transition-colors cursor-pointer shrink-0 ${
                filterStockState === st.id
                  ? 'bg-[#C9A227] text-black border-[#C9A227] font-bold shadow-sm'
                  : isDarkMode
                  ? 'border-transparent text-[#A9A39A] hover:border-[#2E3330] hover:text-white'
                  : 'border-transparent text-[#595652] hover:border-[#E6E1D8] hover:text-black'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by title or SKU..."
            className={`w-full pl-9 pr-4 py-2 text-xs border outline-none rounded-none transition-colors ${
              isDarkMode
                ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717] focus:border-black'
            }`}
          />
        </div>
      </div>

      {/* Stock Adjustment Table */}
      <div className={`border overflow-x-auto ${cardBg}`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b uppercase tracking-wider font-semibold ${
                isDarkMode ? 'bg-[#181B1A] border-[#222624] text-[#A9A39A]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#595652]'
              }`}
            >
              <th className="p-4 w-16">Media</th>
              <th className="p-4 min-w-[200px]">Product &amp; SKU</th>
              <th className="p-4 min-w-[120px]">Category</th>
              <th className="p-4 min-w-[100px]">Unit Retail</th>
              <th className="p-4 min-w-[150px]">Vault Stock Count</th>
              <th className="p-4 min-w-[120px]">Total Valuation</th>
              <th className="p-4 min-w-[120px]">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filteredProducts.map((prod) => {
              const isLow = prod.stockCount > 0 && prod.stockCount <= 10;
              const isOut = !prod.inStock || prod.stockCount === 0;

              return (
                <tr
                  key={prod.id}
                  className="transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-200 border border-inherit overflow-hidden shrink-0">
                      <img
                        src={prod.colors?.[0]?.image || prod.images?.[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="p-4">
                    <p className={`font-medium text-sm leading-snug ${textPrimary}`}>{prod.name}</p>
                    <span className="font-mono text-[10.5px] opacity-65">{prod.sku}</span>
                  </td>

                  <td className="p-4">
                    <span className="uppercase font-mono text-[10.5px] tracking-wider px-2 py-0.5 border border-inherit bg-black/5 dark:bg-white/5">
                      {prod.category}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-medium text-sm">
                    ${prod.price}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onQuickAdjustStock(prod.id, Math.max(0, prod.stockCount - 1))}
                        className="w-7 h-7 border border-inherit flex items-center justify-center font-mono text-sm hover:bg-black/10 dark:hover:bg-white/10"
                      >
                        -
                      </button>
                      <span
                        className={`font-mono text-sm font-bold min-w-[30px] text-center ${
                          isOut ? 'text-red-500' : isLow ? 'text-amber-500' : textPrimary
                        }`}
                      >
                        {prod.stockCount}
                      </span>
                      <button
                        onClick={() => onQuickAdjustStock(prod.id, prod.stockCount + 1)}
                        className="w-7 h-7 border border-inherit flex items-center justify-center font-mono text-sm hover:bg-black/10 dark:hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-medium">
                    ${(prod.price * prod.stockCount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {isOut ? (
                      <span className="text-red-400 font-mono text-[10.5px] inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Sold Out</span>
                      </span>
                    ) : isLow ? (
                      <span className="text-amber-500 font-mono text-[10.5px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-mono text-[10.5px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Optimal</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onOpenEditProduct(prod)}
                      className="px-3 py-1 text-[11px] uppercase font-semibold border hover:bg-[#C9A227] hover:text-black transition-colors"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
