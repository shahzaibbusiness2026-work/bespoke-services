import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          id="size-guide-modal-content"
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-neutral-900 text-white">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Bedding & Mattress Size Guide
                </h3>
                <p className="text-xs text-neutral-500">
                  Precise dimensions for our sheets, duvets, and pillows
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white text-xs">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setCategoryTab('sheets')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryTab === 'sheets' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Sheet Sets
              </button>
              <button
                onClick={() => setCategoryTab('duvets')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryTab === 'duvets' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Duvets & Covers
              </button>
              <button
                onClick={() => setCategoryTab('pillows')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryTab === 'pillows' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Pillows & Shams
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center border border-neutral-200 rounded-lg p-0.5">
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                  unit === 'in' ? 'bg-neutral-900 text-white' : 'text-neutral-500'
                }`}
              >
                IN
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                  unit === 'cm' ? 'bg-neutral-900 text-white' : 'text-neutral-500'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Content Table */}
          <div className="p-6 overflow-y-auto flex-1">
            {categoryTab === 'sheets' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Mattress Fit</th>
                    <th className="pb-3 font-semibold">Fitted Pocket</th>
                    <th className="pb-3 font-semibold">Flat Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {sheetsData.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50">
                      <td className="py-3 font-medium text-neutral-950">{row.size}</td>
                      <td className="py-3 text-neutral-600">
                        {unit === 'in' ? row.mattressIn : row.mattressCm}
                      </td>
                      <td className="py-3 text-neutral-600">{row.fittedIn}</td>
                      <td className="py-3 text-neutral-600">{row.flatIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {categoryTab === 'duvets' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Duvet Size</th>
                    <th className="pb-3 font-semibold">Dimensions</th>
                    <th className="pb-3 font-semibold">Compatible Bed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {duvetsData.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50">
                      <td className="py-3 font-medium text-neutral-950">{row.size}</td>
                      <td className="py-3 text-neutral-600">
                        {unit === 'in' ? row.duvetIn : row.duvetCm}
                      </td>
                      <td className="py-3 text-neutral-600">{row.fits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {categoryTab === 'pillows' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Pillow / Sham Type</th>
                    <th className="pb-3 font-semibold">Dimensions</th>
                    <th className="pb-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {pillowsData.map((row) => (
                    <tr key={row.type} className="hover:bg-neutral-50">
                      <td className="py-3 font-medium text-neutral-950">{row.type}</td>
                      <td className="py-3 text-neutral-600">
                        {unit === 'in' ? row.dimIn : row.dimCm}
                      </td>
                      <td className="py-3 text-neutral-500">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-6 p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 text-xs text-neutral-600 space-y-1">
              <p className="font-semibold text-neutral-900">Atelier Deep-Pocket Guarantee:</p>
              <p>
                All fitted sheets feature our continuous 360° elastic hem accommodating mattress profiles up to 18" thick, including plush pillow-tops and natural latex toppers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
