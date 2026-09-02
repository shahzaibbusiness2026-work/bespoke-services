'use client';

import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, BookOpen, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalArticle {
  id: string;
  tag: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  fullContent: string[];
  image: string;
}

const ARTICLES: JournalArticle[] = [
  {
    id: 'article-1',
    tag: 'Material Provenance',
    readTime: '4 min read',
    date: 'August 2026',
    title: 'Why Maritime Flax Breathes Differently: The Science of Normandy Retting',
    excerpt:
      'Along the coastal cliffs of Upper Normandy, a unique microclimate of ocean humidity, limestone soil, and mild maritime sunshine produces flax fibers of extraordinary length and elasticity.',
    fullContent: [
      'Along the coastal cliffs of Upper Normandy, a rare agricultural microclimate exists. Ocean winds roll inland off the English Channel, carrying fine saline moisture across the limestone plains.',
      'Unlike warm inland valleys where flax desiccates quickly, Normandy flax stalks grow with tight, uniform cellular walls. When harvested, the plants are pulled rather than cut, preserving the entire root-to-tip filament.',
      'The stalks undergo "dew-retting" directly on the earth for forty days. Natural soil microorganisms digest the cementing pectins that bind the fibers, requiring zero caustic acids or petroleum catalysts. The resulting yarn is naturally hollow, regulating body heat during summer solstices and insulating during winter midnights.',
    ],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'article-2',
    tag: 'Architectural Interiors',
    readTime: '6 min read',
    date: 'July 2026',
    title: 'Architectural Drapery: How Weighted Linens Transform Acoustic Space',
    excerpt:
      'In minimalist concrete and glass architecture, sound reverberates harshly. Heavyweight Belgian flax curtains act as acoustic dampers, turning glass walls into tranquil sanctuaries.',
    fullContent: [
      'Modern residential architecture celebrates transparency: expansive floor-to-ceiling glass, polished micro-cement, and soaring ceilings. However, these reflective planes create harsh acoustic reflections that increase subconscious cognitive fatigue.',
      'By weaving 280 GSM pure Belgian flax and lining each panel with unbleached organic cotton flannel, drapery transitions from mere decoration to architectural sound dampening.',
      'Our master tailors sew lead-weighted discs into each lower hem. This continuous vertical tension prevents flaring, ensuring the linen falls in perfect, sculptural folds that swallow ambient reverberation and gently soften bright southern sunlight.',
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'article-3',
    tag: 'Sleep Sanctuary',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'The Ritual of Sleep: Dressing the Bed for Restorative Deep States',
    excerpt:
      'How the tactile layering of single-ply Egyptian cotton sateen, unbleached linen duvets, and brushed baby alpaca harmonizes core body temperature.',
    fullContent: [
      'Sleep is not a passive surrender; it is a physiological sanctuary. Human core temperature must drop 1 to 2 degrees Fahrenheit to initiate restorative non-REM and slow-wave sleep cycles.',
      'Synthetic poly-blends trap heat and moisture against the dermis, triggering micro-arousals throughout the night. In contrast, layering 480TC Egyptian sateen directly against the skin provides initial silky cooling, while an unwashed French linen duvet cover continuously transpires vapor.',
      'To finish the sanctuary, a hand-fringed baby alpaca throw provides calibrated warmth at the foot of the bed without crushing the feet under heavy weight.',
    ],
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
  },
];

export const EditorialJournalSection: React.FC = () => {
  const { isDarkMode } = useShop();
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  const gold = '#C9A227';
  const sectionBg = isDarkMode ? 'bg-[#0B0D0C] text-[#F5F1E8]' : 'bg-[#FAF8F5] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  return (
    <section className={`py-28 sm:py-36 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${sectionBg} overflow-hidden`}>
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header with In-View Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-[0.28em] font-medium" style={{ color: gold }}>
                Editorial Essays &bull; Cultural Dispatches
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-normal tracking-tight"
              style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
            >
              The Atelier Journal
            </h2>
            <p className={`text-base font-light leading-relaxed ${textSecondary}`}>
              Essays on materiality, restful residential architecture, and the philosophy of generational craft.
            </p>
          </div>
        </motion.div>

        {/* 3 Editorial Articles Grid with Staggered Cascades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => setSelectedArticle(art)}
              className={`border group cursor-pointer flex flex-col justify-between overflow-hidden transition-colors duration-500 hover:border-[#C9A227] ${cardBg}`}
            >
              {/* Photo */}
              <div className="aspect-[16/10] relative overflow-hidden bg-black/40 border-b border-inherit">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 will-change-transform"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 text-[9.5px] uppercase font-mono tracking-wider bg-black/80 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                    {art.tag}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[10.5px] font-mono opacity-60">
                    <span>{art.date}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-normal tracking-tight leading-snug group-hover:text-[#C9A227] transition-colors"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    {art.title}
                  </h3>

                  <p className={`text-xs sm:text-sm font-light leading-relaxed line-clamp-3 ${textSecondary}`}>
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="group-hover:underline flex items-center gap-1" style={{ color: gold }}>
                    <span>Read Essay</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Editorial Reading Modal with Smooth Scale Animation */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-3xl border p-8 sm:p-12 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto my-auto ${
                isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 border border-inherit hover:opacity-60 cursor-pointer transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-widest text-[#C9A227] border border-[#C9A227]/30">
                    {selectedArticle.tag}
                  </span>
                  <span className="text-xs font-mono opacity-60">
                    {selectedArticle.date} &bull; {selectedArticle.readTime}
                  </span>
                </div>

                <h2
                  className="text-3xl sm:text-4xl font-normal leading-tight"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {selectedArticle.title}
                </h2>
              </div>

              <div className="aspect-[21/9] border border-inherit overflow-hidden">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                {selectedArticle.fullContent.map((paragraph, i) => (
                  <p key={i} className="first-letter:text-3xl first-letter:font-serif first-letter:mr-1">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-6 border-t border-inherit flex items-center justify-between text-xs opacity-70">
                <span className="font-mono">BOSKI LIMITED &bull; ATELIER JOURNAL</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="uppercase tracking-wider font-semibold hover:underline cursor-pointer"
                >
                  Close Essay &times;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
