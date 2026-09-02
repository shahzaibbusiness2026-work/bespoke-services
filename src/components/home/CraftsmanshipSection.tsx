'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Feather, Layers } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const { isDarkMode, setActivePage } = useShop();

  const gold = '#C9A227';
  const sectionBg = isDarkMode ? 'bg-[#101312] text-[#F5F1E8]' : 'bg-[#FAF8F3] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  const craftPillars = [
    {
      title: 'Dew-Retting in Maritime Normandy',
      desc: 'Flax stalks rest naturally across open Normandy coastal fields for six weeks. Rain, dew, and ocean sunshine dissolve pectin naturally without the synthetic sulfur baths common in fast industrial textiles.',
    },
    {
      title: 'Combed Extra-Long Staple (Top 2%)',
      desc: 'Our Egyptian cotton and European flax are scrupulously combed to eliminate short broken strands. Only the longest 2% of fibers enter the spinning wheels, virtually eliminating pilling and fuzz across decades of laundering.',
    },
    {
      title: 'Weighted Architectural Selvedge Seams',
      desc: 'Inspired by haute couture tailoring, our drapery and heavy throws feature lead-weighted corner inserts and hand-finished mitered hems that maintain straight, gravitational lines against architectural glass.',
    },
    {
      title: 'Tensile Strength That Deepens with Age',
      desc: 'Cellulose fibers from long-staple flax uniquely strengthen when wet. With each laundering cycle, the microscopic pectin softens, making our linens smoother, more luminous, and increasingly supple as time passes.',
    },
  ];

  return (
    <section className={`py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 ${sectionBg} border-inherit`}>
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Split Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Macro Textile Photography */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] border overflow-hidden relative border-inherit">
              <img
                src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1600&q=90"
                alt="Master Loom Textile Weave Macro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227] block mb-1">
                  Macro Weave Inspection &bull; 600TC
                </span>
                <p className="text-sm font-serif italic">
                  &ldquo;Every thread is spun from single-ply long-staple yarn, retaining its natural breathability and suppleness.&rdquo;
                </p>
              </div>
            </div>

            {/* Overlapping Atelier Accent Card */}
            <div
              className={`absolute -bottom-6 -right-6 hidden sm:block p-6 border shadow-2xl max-w-xs ${
                isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]'
              }`}
            >
              <span className="text-2xl font-serif font-normal" style={{ color: gold }}>
                100%
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider mt-1">
                GOTS &amp; OEKO-TEX Standard 100
              </p>
              <p className={`text-[11px] font-light leading-snug mt-1 ${textSecondary}`}>
                Free from harmful chemicals, petroleum softeners, or heavy metals.
              </p>
            </div>
          </div>

          {/* Right Column: Craftsmanship Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span className="text-[11px] uppercase font-mono tracking-[0.28em] font-medium" style={{ color: gold }}>
                  Artisanal Integrity &bull; European Loom Masters
                </span>
              </div>
              <h2
                className="text-4xl sm:text-5xl font-normal tracking-tight"
                style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
              >
                The Art of the Master Loom
              </h2>
              <p className={`text-base sm:text-lg font-light leading-relaxed ${textSecondary}`}>
                A relentless commitment to fiber purity, mechanical tension balance, and generational tailoring. We do not take shortcuts.
              </p>
            </div>

            {/* 4 Pillars List */}
            <div className="space-y-6 pt-2">
              {craftPillars.map((p, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span
                    className="w-7 h-7 rounded-none border border-inherit flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-1"
                    style={{ color: gold, borderColor: `${gold}50`, backgroundColor: `${gold}10` }}
                  >
                    0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-medium tracking-tight">
                      {p.title}
                    </h3>
                    <p className={`text-xs sm:text-sm font-light leading-relaxed ${textSecondary}`}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setActivePage('canvas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-bold px-8 py-3.5 border transition-all hover:bg-[#C9A227] hover:text-black cursor-pointer shadow-sm"
                style={{ borderColor: gold }}
              >
                <span>Read The Atelier Chronicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
