'use client';

import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FALLBACK_IMAGE, PRODUCTS } from '../data/products';

const UGC_POSTS = [
  {
    id: 'ugc-1',
    user: '@eleanor_interiors',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-1',
    caption: 'Morning sunlight on the Signature Sateen Core Sheet Set in Warm Ivory.',
  },
  {
    id: 'ugc-2',
    user: '@cotswolds_sanctuary',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-2',
    caption: 'Stonewashed French Normandy flax duvet cover. Lived-in luxury.',
  },
  {
    id: 'ugc-3',
    user: '@nordic_linen',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-4',
    caption: 'Honeycomb waffle weave bedspread layered for cozy autumn mornings.',
  },
  {
    id: 'ugc-4',
    user: '@belgian_drapery',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-5',
    caption: 'Weighted Belgian linen curtains filtering natural afternoon light.',
  },
  {
    id: 'ugc-5',
    user: '@camille_bedding',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-7',
    caption: 'Mulberry silk pillowcases in Champagne Ivory for restorative sleep.',
  },
  {
    id: 'ugc-6',
    user: '@savoy_residence',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-towel-1',
    caption: '700 GSM Aegean long-staple bath sheets. Quiet hotel spa rituals.',
  },
];

export const InstagramFeed: React.FC = () => {
  const { setSelectedProductForQuickView } = useShop();

  const handlePostClick = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProductForQuickView(prod);
    }
  };

  return (
    <section id="ugc-community-section" className="py-20 bg-[#faf9f7] border-t border-[#c4c7c7]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-label-caps uppercase tracking-[0.2em] text-[#505252] font-semibold">
            <Instagram className="w-4 h-4 text-[#1a1c1b]" />
            <span>Curated Living &amp; Sanctuaries</span>
          </div>
          <h2
            className="text-[32px] sm:text-[42px] leading-tight text-[#000000] font-normal"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Styled in Thoughtful Sanctuaries
          </h2>
          <p className="text-body-sm text-[#444748] font-light leading-relaxed">
            Tag <strong className="text-[#000000] font-medium">@BoskiLimited</strong> or <strong className="text-[#000000] font-medium">#BoskiLimited</strong> on Instagram to be featured in our seasonal bedroom galleries.
          </p>
        </div>

        {/* Grid of UGC Posts with 0px Sharp Corners and Smooth Scale */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {UGC_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.productId)}
              className="group relative rounded-none overflow-hidden aspect-square cursor-pointer bg-[#efeeec] border border-[#c4c7c7]/60 card-hover-lift"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
