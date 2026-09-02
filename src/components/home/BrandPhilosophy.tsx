'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const BrandPhilosophy: React.FC = () => {
  const { isDarkMode } = useShop();

  const gold = '#C9A227';
  const sectionBg = isDarkMode ? 'bg-[#101312] text-[#F5F1E8]' : 'bg-[#FAF8F3] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  const pillars = [
    {
      num: '01',
      title: 'Maritime Provenance',
      subtitle: 'Pure Normandy Flax & Giza Cotton',
      description:
        'Cultivated in coastal microclimates where maritime fog and ocean winds yield the world’s longest, most durable cellulosic fibers.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Shuttle Loom Heritage',
      subtitle: 'Generational European Mills',
      description:
        'Slow-woven on antique shuttle looms that preserve fiber elasticity, finished with hand-pleated headers and weighted architectural hems.',
      icon: Feather,
    },
    {
      num: '03',
      title: 'Zero Caustic Finishing',
      subtitle: 'Organic Mountain Water Washed',
      description:
        'Pre-softened with volcanic mineral water and plant enzymes. Never treated with synthetic formaldehyde, chlorine, or caustic acids.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className={`py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 ${sectionBg} border-inherit overflow-hidden`}>
      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24">
        {/* Editorial Narrative Block with In-View Animation */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span className="text-[11px] uppercase font-mono tracking-[0.28em] font-semibold" style={{ color: gold }}>
              Atelier Philosophy &bull; Quiet Luxury
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-tight"
            style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
          >
            &ldquo;True luxury does not shout. It lives in the tactile honesty of unhurried natural fibers.&rdquo;
          </h2>

          <p className={`text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto ${textSecondary}`}>
            At BOSKI LIMITED, we reject the disposable cadence of modern commerce. We curate architectural textiles designed to age with graceful dignity, growing softer and more luminous across decades of living.
          </p>
        </motion.div>

        {/* 3 Pillars Grid with Staggered Kinetic Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                className={`p-8 sm:p-10 border flex flex-col justify-between group transition-colors duration-300 hover:border-[#C9A227] ${cardBg}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-inherit">
                    <span className="font-mono text-xs tracking-widest text-[#C9A227]">
                      {pillar.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#C9A227] transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-normal tracking-tight mb-1"
                      style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-mono opacity-70 mb-3" style={{ color: gold }}>
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className={`text-xs sm:text-sm font-light leading-relaxed ${textSecondary}`}>
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-inherit">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60 group-hover:opacity-100 group-hover:text-[#C9A227] transition-all flex items-center gap-1">
                    <span>Atelier Standard</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
