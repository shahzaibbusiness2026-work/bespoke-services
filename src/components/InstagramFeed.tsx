'use client';

import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FALLBACK_IMAGE, PRODUCTS } from '../data/products';
import { ASSETS } from '@/src/constants/assets';
import { motion } from 'motion/react';

const UGC_POSTS = [
  {
    id: 'ugc-1',
    user: '@eleanor_interiors',
    image: ASSETS.social.loomDetail,
    productId: 'prod-1',
    caption: 'Morning sunlight on the Signature Sateen Core Sheet Set in Warm Ivory.',
  },
  {
    id: 'ugc-2',
    user: '@cotswolds_sanctuary',
    image: ASSETS.social.linenSheets,
    productId: 'prod-2',
    caption: 'Stonewashed French Normandy flax duvet cover. Lived-in luxury.',
  },
  {
    id: 'ugc-3',
    user: '@nordic_linen',
    image: ASSETS.social.fabricSwatch,
    productId: 'prod-4',
    caption: 'Honeycomb waffle weave bedspread layered for cozy autumn mornings.',
  },
  {
    id: 'ugc-4',
    user: '@belgian_drapery',
    image: ASSETS.social.morningLight,
    productId: 'prod-5',
    caption: 'Weighted Belgian linen curtains filtering natural afternoon light.',
  },
  {
    id: 'ugc-5',
    user: '@camille_bedding',
    image: ASSETS.social.minimalBedroom,
    productId: 'prod-7',
    caption: 'Mulberry silk pillowcases in Champagne Ivory for restorative sleep.',
  },
  {
    id: 'ugc-6',
    user: '@savoy_residence',
    image: ASSETS.social.curatedInterior,
    productId: 'prod-towel-1',
    caption: '700 GSM Aegean long-staple bath sheets. Quiet hotel spa rituals.',
  },
];

export const InstagramFeed: React.FC = () => {
  const { setSelectedProductForQuickView, isDarkMode } = useShop();

  const handlePostClick = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProductForQuickView(prod);
    }
  };

  return (
    <section id="ugc-community-section" className={`py-20 border-t transition-colors ${
      isDarkMode ? 'bg-[#111312] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-2 text-label-caps uppercase tracking-[0.2em] font-semibold ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'
          }`}>
            <Instagram className={`w-4 h-4 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#1a1c1b]'}`} />
            <span>Curated Living &amp; Sanctuaries</span>
          </div>
          <h2
            className={`text-[32px] sm:text-[42px] leading-tight font-normal ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Styled in Thoughtful Sanctuaries
          </h2>
          <p className={`text-body-sm font-light leading-relaxed ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'
          }`}>
            Tag <strong className={`font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>@BoskiLimited</strong> or <strong className={`font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>#BoskiLimited</strong> on Instagram to be featured in our seasonal bedroom galleries.
          </p>
        </div>

        {/* Grid of UGC Posts with 0px Sharp Corners and Smooth Scale */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {UGC_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handlePostClick(post.productId)}
              className={`group relative rounded-none overflow-hidden aspect-square cursor-pointer border card-hover-lift hover:border-[#C9A227] transition-colors ${
                isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-[#efeeec] border-[#c4c7c7]/60'
              }`}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-between items-center text-label-caps uppercase tracking-wider font-medium">
                  <span>{post.user}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <p className="text-[12px] font-light leading-snug line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
