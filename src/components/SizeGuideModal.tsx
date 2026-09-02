'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, isDarkMode } = useShop();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [categoryTab, setCategoryTab] = useState<'sheets' | 'duvets' | 'pillows'>('sheets');

  if (!isSizeGuideOpen) return null;

  const sheetsData = [
    { size: 'Twin', mattressIn: '39" x 75"', mattressCm: '99 x 190 cm', fittedIn: '39" x 75" x 16"', flatIn: '71" x 102"' },
    { size: 'Full', mattressIn: '54" x 75"', mattressCm: '137 x 190 cm', fittedIn: '54" x 75" x 18"', flatIn: '86" x 102"' },
    { size: 'Queen', mattressIn: '60" x 80"', mattressCm: '152 x 203 cm', fittedIn: '60" x 80" x 18"', flatIn: '96" x 108"' },
    { size: 'King', mattressIn: '76" x 80"', mattressCm: '193 x 203 cm', fittedIn: '76" x 80" x 18"', flatIn: '114" x 108"' },
    { size: 'Cal King', mattressIn: '72" x 84"', mattressCm: '183 x 213 cm', fittedIn: '72" x 84" x 18"', flatIn: '110" x 112"' },
  ];

  const duvetsData = [
    { size: 'Twin', duvetIn: '70" x 90"', duvetCm: '178 x 228 cm', fits: 'Twin Mattress' },
    { size: 'Full / Queen', duvetIn: '90" x 92"', duvetCm: '228 x 234 cm', fits: 'Full & Queen Mattresses' },
    { size: 'King / Cal King', duvetIn: '106" x 92"', duvetCm: '269 x 234 cm', fits: 'Standard King & Cal King' },
  ];

  const pillowsData = [
    { type: 'Standard Pillowcase', dimIn: '20" x 26"', dimCm: '51 x 66 cm', notes: 'Fits standard sleeping pillows' },
    { type: 'Queen Pillowcase', dimIn: '20" x 30"', dimCm: '51 x 76 cm', notes: 'Included in Queen sheet sets' },
    { type: 'King Pillowcase', dimIn: '20" x 36"', dimCm: '51 x 91 cm', notes: 'Generous length for King beds' },
    { type: 'Euro Square Sham', dimIn: '26" x 26"', dimCm: '66 x 66 cm', notes: 'Architectural back accent pillows' },
  ];

  return (
    <AnimatePresence>
      <div
        id="size-guide-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsSizeGuideOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          id="size-guide-modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-modal-title"
          className={`w-full max-w-2xl rounded-none shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
            isDarkMode
              ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
              : 'bg-[#faf9f7] border-[#c4c7c7] text-[#1a1c1b]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#161817] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-none ${isDarkMode ? 'bg-[#C5A059] text-black font-bold' : 'bg-[#000000] text-white'}`}>
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="size-guide-modal-title"
                  className={`text-headline-sm font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Bedding &amp; Mattress Size Guide
                </h3>
                <p className={`text-body-sm font-light ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                  Precise architectural dimensions for our linens, duvet covers, and pillows
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className={`p-2 rounded-none transition-colors cursor-pointer ${
                isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5] hover:bg-[#1A1D1C]' : 'text-[#444748] hover:text-[#000000] hover:bg-[#efeeec]'
              }`}
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar */}
          <div className={`p-4 border-b flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-[#1A1D1C] border-[#2A2E2C]' : 'bg-[#f4f3f1] border-[#e3e2e0]'
          }`}>
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setCategoryTab('sheets')}
                className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  categoryTab === 'sheets'
                    ? isDarkMode
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#000000] text-white'
                    : isDarkMode
                      ? 'text-[#A8A49C] hover:bg-[#252827]'
                      : 'text-[#444748] hover:bg-[#efeeec]'
                }`}
              >
                Sheet Sets
              </button>
              <button
                onClick={() => setCategoryTab('duvets')}
                className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  categoryTab === 'duvets'
                    ? isDarkMode
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#000000] text-white'
                    : isDarkMode
                      ? 'text-[#A8A49C] hover:bg-[#252827]'
                      : 'text-[#444748] hover:bg-[#efeeec]'
                }`}
              >
                Duvets &amp; Covers
              </button>
              <button
                onClick={() => setCategoryTab('pillows')}
                className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  categoryTab === 'pillows'
                    ? isDarkMode
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#000000] text-white'
                    : isDarkMode
                      ? 'text-[#A8A49C] hover:bg-[#252827]'
                      : 'text-[#444748] hover:bg-[#efeeec]'
                }`}
              >
                Pillows &amp; Shams
              </button>
            </div>

            {/* Unit Toggle */}
            <div className={`flex items-center border rounded-none p-0.5 ${
              isDarkMode ? 'border-[#383D3A] bg-[#161817]' : 'border-[#c4c7c7] bg-white'
            }`}>
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded-none text-[11px] font-semibold cursor-pointer ${
                  unit === 'in'
                    ? isDarkMode
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#000000] text-white'
                    : isDarkMode
                      ? 'text-[#A8A49C]'
                      : 'text-[#505252]'
                }`}
              >
                IN
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-none text-[11px] font-semibold cursor-pointer ${
                  unit === 'cm'
                    ? isDarkMode
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#000000] text-white'
                    : isDarkMode
                      ? 'text-[#A8A49C]'
                      : 'text-[#505252]'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Content Table */}
          <div className={`p-6 overflow-y-auto flex-1 ${isDarkMode ? 'bg-[#161817]' : 'bg-white'}`}>
            {categoryTab === 'sheets' && (
              <table className="w-full text-left text-body-sm border-collapse">
                <thead>
                  <tr className={`border-b uppercase text-label-caps ${
                    isDarkMode ? 'border-[#2A2E2C] text-[#C5A059]' : 'border-[#c4c7c7] text-[#505252]'
                  }`}>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Mattress Fit</th>
                    <th className="pb-3 font-semibold">Fitted Pocket</th>
                    <th className="pb-3 font-semibold">Flat Sheet</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-[#2A2E2C]' : 'divide-[#e3e2e0]'}`}>
                  {sheetsData.map((row) => (
                    <tr key={row.size} className={`transition-colors ${isDarkMode ? 'hover:bg-[#1A1D1C]' : 'hover:bg-[#faf9f7]'}`}>
                      <td className={`py-3.5 font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{row.size}</td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                        {unit === 'in' ? row.mattressIn : row.mattressCm}
                      </td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{row.fittedIn}</td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{row.flatIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {categoryTab === 'duvets' && (
              <table className="w-full text-left text-body-sm border-collapse">
                <thead>
                  <tr className={`border-b uppercase text-label-caps ${
                    isDarkMode ? 'border-[#2A2E2C] text-[#C5A059]' : 'border-[#c4c7c7] text-[#505252]'
                  }`}>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Duvet Dimensions</th>
                    <th className="pb-3 font-semibold">Fits Mattress</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-[#2A2E2C]' : 'divide-[#e3e2e0]'}`}>
                  {duvetsData.map((row) => (
                    <tr key={row.size} className={`transition-colors ${isDarkMode ? 'hover:bg-[#1A1D1C]' : 'hover:bg-[#faf9f7]'}`}>
                      <td className={`py-3.5 font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{row.size}</td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                        {unit === 'in' ? row.duvetIn : row.duvetCm}
                      </td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{row.fits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {categoryTab === 'pillows' && (
              <table className="w-full text-left text-body-sm border-collapse">
                <thead>
                  <tr className={`border-b uppercase text-label-caps ${
                    isDarkMode ? 'border-[#2A2E2C] text-[#C5A059]' : 'border-[#c4c7c7] text-[#505252]'
                  }`}>
                    <th className="pb-3 font-semibold">Item Style</th>
                    <th className="pb-3 font-semibold">Dimensions</th>
                    <th className="pb-3 font-semibold">Usage &amp; Layering</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-[#2A2E2C]' : 'divide-[#e3e2e0]'}`}>
                  {pillowsData.map((row) => (
                    <tr key={row.type} className={`transition-colors ${isDarkMode ? 'hover:bg-[#1A1D1C]' : 'hover:bg-[#faf9f7]'}`}>
                      <td className={`py-3.5 font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{row.type}</td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                        {unit === 'in' ? row.dimIn : row.dimCm}
                      </td>
                      <td className={`py-3.5 ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className={`mt-8 pt-4 border-t text-body-sm space-y-1 ${
              isDarkMode ? 'border-[#2A2E2C] text-[#A8A49C]' : 'border-[#e3e2e0] text-[#505252]'
            }`}>
              <p className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>Need custom drops or tailored measurements?</p>
              <p>
                Our master atelier produces custom drapery drops, extra-deep mattress pockets (up to 24"), and bespoke dimensions upon request.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
